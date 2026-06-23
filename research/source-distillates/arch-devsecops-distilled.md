---
type: bmad-distillate
sources:
  - "../../../../../books/sources/zt-downloads/16-Cybersecurity-Architect-Handbook-Nichols.md"
  - "../../../../../books/sources/zt-downloads/24-Software-Security-Developers-Saikali.md"
downstream_consumer: "Zero-Trust Octagon project — Epics 2-4, cross-cutting architecture"
created: "2026-06-23"
token_estimate: 1200
---
# Cybersecurity Architect's Handbook (Nichols — 2nd Ed 2026)
- Covers: ZT architecture, AI security, cloud-native, healthcare security, ICS/SCADA
- Unique framing: uses Sun Tzu's Art of War throughout for strategic positioning
- Includes scenario-based labs for ZT implementation
- ZT chapter methodology: assess current state → identify crown jewels → map data flows → design controls → implement → validate
- AI security: threat-model AI pipelines (data poisoning, model theft, adversarial examples, prompt injection). NIST AI RMF alignment
- Healthcare: HIPAA alignment, PHI data flows, clinical system segmentation. Medical device security (FDA pre-market guidance)
- ICS/SCADA: Purdue Model for OT segmentation. Unidirectional gateways. ISA/IEC 62443 standards
- Cloud-native: workload identity, service mesh, policy-as-code, K8s network policies

# Software Security for Developers (Saikali — 2026)
- Grounds security in real-world failure modes across cloud/K8s
- Core thesis: security = understanding how things actually work (TLS, OAuth2, OIDC, certificates)

## TLS Deep Dive
- TLS 1.3: 1-RTT handshake (vs 2-RTT for 1.2). 0-RTT for repeat connections (with anti-replay)
- Certificate validation: chain building, CRL/OCSP checking, hostname verification. Many libraries do this wrong
- mTLS: Both sides present certificates. Used in service mesh, API security. Zero-trust network communication
- Common failures: no cert validation (accept all), expired certs, wildcard misuse, self-signed without proper CA

## OAuth2 & OIDC
- OAuth2: Delegated authorization. Authorization code flow (with PKCE) = most secure. Implicit flow deprecated
- OIDC: Identity layer on OAuth2. ID Token (JWT) for identity. UserInfo endpoint for additional claims
- Tokens: Access Token (opaque or JWT, short-lived), Refresh Token (longer-lived, used to get new access tokens), ID Token (JWT, identity)
- PKCE: Code challenge + verifier. Prevents auth code interception. Required for public clients (SPAs, mobile apps)
- **Provider**: Token should carry: issuer, subject, audience, expiration, issued-at. Validate ALL claims

## Cryptography Applied
- **Symmetric in practice**: AES-256-GCM (authenticated encryption). NO: ECB mode, CBC with PKCS#5 padding, fixed IVs
- **Asymmetric in practice**: ECDSA P-256 or Ed25519 for signatures. X25519 for key agreement. RSA only for legacy compatibility
- **Hashing**: SHA-256 minimum. Use HMAC for keyed hashing. Bcrypt/Argon2 for password hashing
- **Keys**: Don't hardcode. Use secrets manager. Rotate regularly. Separate keys per environment (dev/staging/prod)

## Service Identity
- SPIFFE/SPIRE: Workload identity for cloud-native. SPIFFE ID format: spiffe://trust-domain/path. SPIRE: implementation, with agent+server architecture
- Workload attestation: Node attestation (TPM, AWS Instance Identity Doc) + Workload attestation (process UID, cgroup, container label)
- X.509 SVID (SPIFFE Verifiable Identity Document): Short-lived certs. Auto-rotated. No manual certificate management
- JWT SVID: For non-TLS contexts. Short-lived JWT with SPIFFE ID as subject
- Service mesh integration: Istio uses SPIRE for workload identity. Envoy receives SVIDs via SDS API

## Zero Trust Applied
- ZT = identity-based, not network-based. Every request authenticated + authorized regardless of source network
- Microsegmentation at application layer (not just network layer). OAuth2 scopes + service identity + TLS
- Policy as code: version-controlled authorization policies. CI/CD for policy changes. Audit trail for all policy modifications
- Real-world failure modes: overprivileged service accounts, hardcoded secrets in config maps, certificates never rotated, debug endpoints exposed in production
