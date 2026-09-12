---
cover: /images/covers/engineering/caep-ssf-grpc-audit-trail.webp
coverAlt: "Illustration: sealed event pipelines from client towers flowing into an auditor vault with a looping clock"
---

# CAEP/SSF gRPC Implementation & eIDAS Audit Trail

> **Purpose:** Go-based Envoy ExtAuthz gRPC service for CAEP/SSF continuous access evaluation, OID4VC/EUDI Wallet schema mappings, and NIS2/EU AI Act compliant cryptographically chained audit trail.

**Version:** 1.0.0 | **Last Updated:** 2026-06-28
**Dependencies:** `redis-challenge-pipeline-docker.md` (Redis key patterns), `webauthn-server-validation-backend.md` (JWT claims structure)

---

---

## 1. gRPC & API Gateway Implementation for CAEP/SSF

To move past point-in-time authentication, the API Gateway (e.g., Envoy) serves as the Policy Enforcement Point (PEP), checking token validity against a high-speed Redis cluster, while an Asynchronous SSF Receiver updates token states in real-time.

```text
 [Threat Signal] ---> [SSF Receiver Hub] ---> [Redis Cluster] <--- [Envoy Auth gRPC API]
   (EDR / IdP)        (Invalidates session)    (Blacklist state)     (Intercepts inbound RPC)
```

### Envoy External Authorization (ExtAuthz) gRPC Service

This Go implementation intercepts gRPC calls, parses the short-lived access token, checks the global Redis state for SSF revocations, and extracts metadata.

```go
package main

import (
    "context"
    "errors"
    "net"
    "strings"
    "time"

    corev3 "github.com/envoyproxy/go-control-plane/envoy/config/core/v3"
    authv3 "github.com/envoyproxy/go-control-plane/envoy/service/auth/v3"
    typev3 "github.com/envoyproxy/go-control-plane/envoy/type/v3"
    "github.com/golang-jwt/jwt/v5"
    "github.com/redis/go-redis/v9"
    "google.golang.org/genproto/googleapis/rpc/status"
    "google.golang.org/grpc"
    "google.golang.org/grpc/codes"
)

type AuthServer struct {
    rdb         *redis.Client
    tokenKeyFunc jwt.Keyfunc
}

type CustomClaims struct {
    TenantID string `json:"tid"`
    DeviceID string `json:"did"`
    jwt.RegisteredClaims
}

func (s *AuthServer) Check(ctx context.Context, req *authv3.CheckRequest) (*authv3.CheckResponse, error) {
    // 1. Extract Bearer Token from HTTP/gRPC metadata
    headers := req.GetAttributes().GetRequest().GetHttp().GetHeaders()
    authHeader := headers["authorization"]
    if authHeader == "" {
        return unauthenticatedResponse("Missing authorization token"), nil
    }

    tokenStr := strings.TrimPrefix(authHeader, "Bearer ")

    // 2. Parse and validate JWT signature + standard claims before trusting payload data
    var claims CustomClaims
    parsedToken, err := jwt.ParseWithClaims(
        tokenStr,
        &claims,
        s.tokenKeyFunc,
        jwt.WithValidMethods([]string{"RS256", "ES256"}),
        jwt.WithIssuer("https://enterprise.eu"),
        jwt.WithAudience("https://enterprise.eu"),
        jwt.WithLeeway(30*time.Second),
    )
    if err != nil || !parsedToken.Valid {
        return unauthenticatedResponse("Invalid token"), nil
    }
    if claims.ID == "" || claims.Subject == "" || claims.DeviceID == "" || claims.TenantID == "" {
        return unauthenticatedResponse("Token missing required claims"), nil
    }

    // 3. CAEP/SSF Check: Query Redis for session/device invalidation status
    // Keys are pushed to Redis by the SSF Receiver asynchronously
    isRevoked, err := s.rdb.Exists(ctx,
        "revoked:session:"+claims.ID,
        "revoked:device:"+claims.DeviceID,
    ).Result()
    if err != nil || isRevoked > 0 {
        return &authv3.CheckResponse{
            Status: &status.Status{Code: int32(codes.PermissionDenied)},
            HttpResponse: &authv3.CheckResponse_DeniedResponse{
                DeniedResponse: &authv3.DeniedHttpResponse{
                    Status: &typev3.HttpStatus{Code: typev3.StatusCode_Forbidden},
                    Body:   "Access denied: Session or device revoked by security continuous evaluation",
                },
            },
        }, nil
    }

    // 4. Inject validated claims downstream into internal microservices
    return &authv3.CheckResponse{
        Status: &status.Status{Code: int32(codes.OK)},
        HttpResponse: &authv3.CheckResponse_OkResponse{
            OkResponse: &authv3.OkHttpResponse{
                Headers: []*corev3.HeaderValueOption{
                    {Header: &corev3.HeaderValue{Key: "x-user-id", Value: claims.Subject}},
                    {Header: &corev3.HeaderValue{Key: "x-tenant-id", Value: claims.TenantID}},
                    {Header: &corev3.HeaderValue{Key: "x-device-id", Value: claims.DeviceID}},
                },
            },
        },
    }, nil
}

func unauthenticatedResponse(msg string) *authv3.CheckResponse {
    return &authv3.CheckResponse{
        Status: &status.Status{Code: int32(codes.Unauthenticated)},
        HttpResponse: &authv3.CheckResponse_DeniedResponse{
            DeniedResponse: &authv3.DeniedHttpResponse{
                Status: &typev3.HttpStatus{Code: typev3.StatusCode_Unauthorized},
                Body:   msg,
            },
        },
    }
}
```

### Shared Signals Framework (SSF) Event JSON (RFC 9493 / CAEP)

When an endpoint protection agent (EDR) detects an anomaly, it publishes this standard payload to the SSF receiver endpoint to update the Redis blocklist shown above:

```json
{
  "iss": "https://enterprise.eu",
  "jti": "caep-8743-219847129",
  "iat": 1782618240,
  "aud": "https://enterprise.eu",
  "events": {
    "https://openid.net": {
      "subject": {
        "format": "iss_sub",
        "iss": "https://enterprise.eu",
        "sub": "usr_01J2X7"
      },
      "current_status": "non-compliant",
      "previous_status": "compliant",
      "device": {
        "format": "opaque",
        "id": "dev_mac_99214812"
      },
      "reason": "EDR detected active unmitigated malicious payload execution"
    }
  }
}
```

---

## 2. eIDAS 2.0 EUDI Wallet Credential Schema Mapping

The integration of the European Digital Identity Wallet (EUDI) relies on W3C Verifiable Credentials using the OpenID for Verifiable Presentations (OID4VP) framework over mobile-driving-license (mDL) ISO/IEC 18013-5 or W3C JSON-LD profiles.

### Selective Disclosure Mapping Architecture

To adhere strictly to GDPR Data Minimization, the Relying Party must request only precise claims instead of the full identity payload.

```json
{
  "id": "eudi_wallet_legal_verification_request",
  "input_descriptors": [
    {
      "id": "eu.europa.ec.eudiw.pid.1",
      "format": {
        "mso_mdoc": {
          "alg": ["ES256", "ES384"]
        }
      },
      "constraints": {
        "fields": [
          {
            "path": ["$.eu.europa.ec.eudiw.pid.1.family_name"],
            "intent_to_retain": true
          },
          {
            "path": ["$.eu.europa.ec.eudiw.pid.1.given_name"],
            "intent_to_retain": true
          },
          {
            "path": ["$.eu.europa.ec.eudiw.pid.1.age_over_18"],
            "intent_to_retain": false
          },
          {
            "path": ["$.eu.europa.ec.eudiw.pid.1.issuing_country"],
            "intent_to_retain": true
          }
        ]
      }
    }
  ]
}
```

### Token Schema Translation Pattern

Once the wallet presents the data, the identity fabric normalizes and injects it into standard OAuth2/OIDC claims formats used by internal enterprise resource servers.

```json
{
  "iss": "https://enterprise.eu",
  "sub": "eudi|EU-EST-39102140124",
  "aud": "https://enterprise.eu",
  "exp": 1782618540,
  "identity_assurance": {
    "assurance_level": "high",
    "framework": "eidas2",
    "verification_method": "eudi_wallet",
    "attestation_authority": "Estonian Information System Authority (RIA)"
  },
  "verified_claims": {
    "claims": {
      "given_name": "Mari",
      "family_name": "Tamm",
      "age_over_18": true,
      "nationality": "EE"
    }
  }
}
```

---

## 3. NIS2 & EU AI Act Audit Trail Architecture

This architecture addresses two distinct legal demands: NIS2 Article 21 (tamper-proof event logs for incident reporting) and EU AI Act Article 12 (traceability and automated logging of high-risk AI/ML systems).

```text
 [Security Events] ---> [Log Processor] ---> [Asymmetric Signature Generation] ---> [Write-Once-Read-Many (WORM)]
                                                      |
                                             [Local TPM 2.0 / HSM]
```

### Log Architecture Strategy

1. **Cryptographic Chaining**: Every log record contains a hash of the preceding record, forming an immutable append-only ledger directly within the SIEM infrastructure.
2. **Hardware-Backed Signatures**: The log signing application utilizes a hardware security module (HSM) or cloud KMS with an asymmetric key to sign log batches hourly.
3. **Data Anonymization**: AI risk scoring input flags (e.g., behavioral telemetry) are stored stripped of non-essential PII to meet GDPR rules while retaining technical audit integrity.

### Production JSON Audit Schema (NIS2 + EU AI Act Compliant)

This production event entry maps data from an adaptive AI authentication risk challenge followed by a high-assurance FIDO2 resolution.

```json
{
  "timestamp": "2026-06-28T00:04:15.124Z",
  "event_id": "evt_9912A-FF31-409B",
  "sequence_number": 88124501,
  "previous_record_hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  "regulatory_context": {
    "governing_mandates": ["NIS2_ART_21", "EU_AI_ACT_ART_12"],
    "system_classification": "High-Risk AI Access Control Safeguard"
  },
  "actor": {
    "sub": "usr_01J2X7",
    "device_id": "dev_mac_99214812",
    "tenant_id": "ten_eu_core_01"
  },
  "ai_risk_engine_telemetry": {
    "model_version": "ueba-core-v4.2.1",
    "evaluation_mode": "deterministic-fallback-enabled",
    "inputs_processed": {
      "typing_cadence_variance": 0.41,
      "network_velocity_km_h": 1200.0,
      "request_path_anomaly_score": 0.89
    },
    "risk_classification_output": "HIGH_RISK_SUSPECTED_SESSION_HIJACK",
    "action_triggered": "STEP_UP_AUTHENTICATION_REQUIRED",
    "human_oversight_override_capability": {
      "kill_switch_active": false,
      "bypass_applied": false
    }
  },
  "mitigation_resolution": {
    "step_up_mechanism": "WebAuthn_FIDO2_User_Verification",
    "challenge_id": "chal_88419241920",
    "status": "SUCCESSFUL_CRYPTOGRAPHIC_VERIFICATION",
    "authenticator_data": {
      "aaguid": "adce0002-35bc-c60a-2b7b-40b2fed21711",
      "user_verification_indicator": 1,
      "signature_algorithm": "ES256"
    }
  },
  "integrity_seal": {
    "signing_key_arn": "arn:aws:kms:eu-central-1:YOUR_ACCOUNT_ID:key/nis2-log-signer-key",  <!-- PLACEHOLDER: Replace account ID -->
    "signature": "MEYCIQCc1R8g4h6...[Truncated Base64 Cryptographic Signature]..."
  }
}
```

---

## References

[1] https://openid.net/specs/openid-caep-specification-1_0.html
[2] https://www.envoyproxy.io/docs/envoy/latest/configuration/http/http_filters/ext_authz_filter
[3] https://github.com/envoyproxy/go-control-plane
[4] https://redis.io/docs/latest/develop/clients/go/
[5] https://eu-digital-identity-wallet.github.io/eudi-doc-architecture-and-reference-framework/latest/architecture-and-reference-framework-main/
[6] https://www.rfc-editor.org/rfc/rfc9493.html
