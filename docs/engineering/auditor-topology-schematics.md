---
cover: /images/covers/engineering/auditor-topology-schematics.webp
coverAlt: "Illustration: a network topology like a city plan with auditor lenses at its intersections"
---

# Auditor Topology Schematics

> **Purpose:** Architecture topology schematics and compliance mapping matrices for presentation to DPOs, corporate auditors, and national competent authorities evaluating NIS2 Article 21, eIDAS 2.0 High LoA, and GDPR compliance.

**Version:** 1.0.0 | **Last Updated:** 2026-06-28
**Dependencies:** None (reference material — aggregates topology views from all other specs)

---

---

## 1. Global Zero-Trust Identity Fabric Topology

This diagram maps the end-to-end flow of cryptographic identity verification, token verification, and automated risk enforcement across regional enterprise boundaries.

```text
 [ USER EDGE REGION ]               [ EUROPEAN TRUST NETWORK ]          [ ENTERPRISE API EDGE SERVICE ]
+---------------------+            +---------------------------+       +-------------------------------+
| User Web Browser    |            | Official EUDI Wallet /    |       | Ingress Envoy Gateway Proxy   |
| (WebAuthn Native    |            | Smart-ID Infrastructure   |       | (Policy Enforcement Point)    |
|  Navigator API)     |            +-------------+-------------+       +---------------+---------------+
+----------+----------+                          |                                     |
           |                                     | (OID4VP Token Exchange)             | (gRPC ExtAuthz)
           |                                     v                                     v
           | (Secure Attestation Payload)  +-----+---------------------+       +-------+---------------+
           +-----------------------------> | ZTA Onboarding Engine     |       | gRPC Auth Engine (PEP)|
                                           | (Policy Decision Point)   |       +-------+---------------+
                                           +-------------+-------------+               |
                                                         |                             | (Active-Active Query)
                                                         v                             v
                                           +-------------------------------------------+---------------+
                                           |        Global Multi-Region Active-Active Redis Cluster    |
                                           |  - eu-central-1 (Frankfurt)  <===>  - eu-west-1 (Ireland) |
                                           +-------------------------------------------+---------------+
                                                                                       ^
                                                                                       | (Asynchronous SSF Kills)
                                                                       +---------------+---------------+
                                                                       | Automated SOAR Response Engine|
                                                                       | (Incident Remediation Loop)   |
                                                                       +-------------------------------+
```

## 2. Microsegmentation & Data Flow Blueprint

This schematic defines how data maps to regulatory mandates as it moves through the infrastructure.

```text
       [ Client Request ]
               |
               v
+------------------------------+
|   Envoy Ingress Gateway      | <--- Restricts inbound network paths (NIS2 Network Segregation)
+--------------+---------------+
               |
               | (gRPC Forward)
               v
+------------------------------+
|  gRPC Authz Service (PEP)    |
+--------------+---------------+
               |
               +---> [ Read Local Redis Cache ] ---> Evaluates CAEP/SSF Revocation keys (<1.5ms)
               |
               v (Authenticated & Cleared)
+------------------------------+
| Core Enterprise Microsegment |
+--------------+---------------+
               |
               | (Emits Event Telemetry)
               v
+------------------------------+
| Fluent Bit Log Daemon       | ---> Encapsulates and structures logs as compliant JSON
+--------------+---------------+
               |
               | (Signs Log Payload with ECC_NIST_P256 hardware ring)
               v
+------------------------------+
| Central SIEM Audit Storage   | <--- Provides tamper-proof records for auditing (NIS2 Art 21)
+------------------------------+
```

## 3. Compliance Mapping Matrix for Auditors

Use this matrix during corporate audits to map specific components of the technical architecture directly to European legal requirements.

| Regulatory Mandate | Specific Legal Provision | Architectural Component Implementation | Technical Evidence / Proof Element |
|---|---|---|---|
| eIDAS 2.0 | Level of Assurance (LoA) High | Cryptographic verification using the EUDI Wallet via the OID4VP presentation framework. | Decrypted JSON payload displaying `assurance_level: "high"` and signature verification against Member State trust lists. |
| NIS2 | Article 21 (MFA) | Passwordless multi-factor authentication enforced natively on device hardware enclaves using WebAuthn/FIDO2. | Client payload containing `userVerification: "required"` and enterprise attestation matching approved hardware configurations. |
| NIS2 | Article 21 (Incident Response) | Immediate session eviction using the Shared Signals Framework (SSF) and CAEP profiles. | Asynchronous eviction commands executed via `ZtaRedisPipelineManager.revokeSession()` within seconds of anomaly detection. |
| GDPR | Data Minimization | Processing biometric attributes locally in the device's hardware enclave; using selective disclosure via W3C verifiable credentials. | The identity database contains only public keys, counters, and anonymized identifiers (`sub`), with zero biometric data stored on the server. |
| EU AI Act | Article 12 (Traceability) | Generating unalterable logs for all automated risk engines and UEBA behavior analysis scoring. | Cryptographically signed, append-only SIEM logs generated by `ZtaAutomatedResponsePlaybook` capturing exact model telemetry inputs. |

## 4. Incident Response & Containment Control Matrix

When presenting this architecture to security auditors, use this timeline to demonstrate the performance and effectiveness of the automated response engine under simulated stress conditions.

```text
[ T=0ms: Anomaly Intercepted ] ──> EDR detects a compromise or a WebAuthn replay attempt.
                │
                ▼
[ T=+45ms: Log Processed ] ───────> Fluent Bit parses the anomaly event and routes it to the SIEM.
                │
                ▼
[ T=+120ms: SOAR Ingestion ] ─────> The SIEM triggers an alert webhook to the ZtaAutomatedResponsePlaybook.
                │
                ▼
[ T=+280ms: Active Eviction ] ────> The SOAR engine writes eviction records to the multi-region Redis cluster.
                │
                ▼
[ T=+300ms: Zero Trust Block ] ──> Envoy API Gateways globally block all subsequent requests for the compromised session.
                │
                ▼
[ T=+1.2s: Identity Locked ] ────> The administrative API suspends the user's Smart-ID profile to prevent self-recovery.
```

---

## Auditor Presentation Checklist

When walking compliance auditors through this architecture, be prepared to provide the following evidence:

1. **The Terraform Infrastructure Code**: Proves the use of isolated, multi-region container networks and hardware-backed log encryption (KMS).
2. **The FIDO2 AAGUID Whitelist**: Demonstrates strict management of approved corporate authenticators, satisfying supply-chain and asset-control requirements.
3. **The Chaos Testing Reports**: Demonstrates system resilience by proving that local authentication checks continue to operate properly even during an inter-region WAN outage.

---

## References

[1] https://eur-lex.europa.eu/eli/dir/2022/2555
[2] https://eur-lex.europa.eu/eli/reg/2024/1183
[3] https://gdpr.eu/
[4] https://digital-strategy.ec.europa.eu/en/policies/eidas-regulation
