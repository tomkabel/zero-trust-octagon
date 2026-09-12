---
title: Engineering
cover: /images/covers/engineering/index.webp
coverAlt: "Illustration: a workbench where a blueprint cable runs into a glowing server rack"
meta: "16 specs"
---

# Engineering Specs Index

Companion implementation contracts for the Zero-Trust Octagon architecture. These specs define the "how" — complementing the theory chapters (`01-foundations/` through `04-synthesis/`) that define the "why."

## Implementation Order

Specs must be read and implemented in dependency order. Each spec declares its prerequisites in a `**Dependencies:**` block.

```
Phase 1: Core Infrastructure
  redis-challenge-pipeline-docker.md      ── defines ZtaRedisPipelineManager
  siem-logging-pipeline.md                ── defines ztaLogger, fluent-bit.conf

Phase 2: Authentication Primitives
  webauthn-client-enterprise-handler.md   ── defines WebAuthnClientHandler
  webauthn-server-validation-backend.md   ── defines EnterpriseWebAuthnServerValidator

Phase 3: Enrollment & Identity
  enrollment-onboarding-flows.md          ── depends on Phase 1 + Phase 2
  identity-fabric-architecture-2026.md    ── architecture reference (no code deps)
  zero-trust-identity-blueprint.md        ── executive overview (no code deps)

Phase 4: NFC & Relay Defense
  nfc-relay-threat-defense.md             ── depends on Phase 1 + Phase 2
  anti-relay-cryptographic-channel-binding.md ── depends on nfc-relay-threat-defense.md

Phase 5: Deployment & Multi-Region
  kubernetes-deployment-manifests.md      ── depends on Phase 1
  multi-region-redis-replication.md       ── defines CrossRegionZtaDataPipeline
  terraform-chaos-engineering-validation.md ── depends on multi-region-redis-replication.md

Phase 6: Observability & Response
  caep-ssf-grpc-audit-trail.md           ── Go service, depends on Phase 1 + Phase 2
  soar-incident-containment-playbook.md   ── depends on Phase 1, Phase 2, siem-logging-pipeline.md

Phase 7: Audit & Compliance
  auditor-topology-schematics.md          ── reference material (no deps)
  compliance-audit-appendices.md          ── template material (no deps)
```

## Module Dependency Map

Shared code modules are defined in the specs listed as their canonical source. All other specs import from these canonical definitions.

| Module | Canonical Source | Imported By |
|--------|-----------------|-------------|
| `ZtaRedisPipelineManager` | `redis-challenge-pipeline-docker.md` | enrollment, SOAR, SIEM, multi-region, terraform-chaos |
| `ztaLogger` / `logSecurityEvent` | `siem-logging-pipeline.md` | enrollment, SOAR, nfc-relay, anti-relay |
| `EnterpriseWebAuthnServerValidator` | `webauthn-server-validation-backend.md` | enrollment, redis-pipeline |
| `WebAuthnClientHandler` | `webauthn-client-enterprise-handler.md` | enrollment, anti-relay |
| `CrossRegionZtaDataPipeline` | `multi-region-redis-replication.md` | terraform-chaos |
| `ZtaAutomatedResponsePlaybook` | `soar-incident-containment-playbook.md` | standalone |
| `ZtaEnrollmentOrchestrator` | `enrollment-onboarding-flows.md` | standalone |
| `AntiRelayEnrollmentEngine` | `nfc-relay-threat-defense.md` | standalone |
| `SoTAAntiRelayValidator` | `anti-relay-cryptographic-channel-binding.md` | standalone |
| `AuthServer` (Go) | `caep-ssf-grpc-audit-trail.md` | standalone |

## Polyglot Rationale

The codebase spans TypeScript and Go intentionally:

- **TypeScript (Node.js)** — Application-layer services: WebAuthn handlers, enrollment flows, SOAR playbook, Redis pipeline manager. Chosen for rapid iteration, ecosystem compatibility with `@simplewebauthn/server`, and Express/Fastify HTTP handling.
- **Go** — Performance-critical gRPC External Authorization service (`caep-ssf-grpc-audit-trail.md`). Chosen for Envoy ExtAuthz compatibility (native gRPC, sub-millisecond Redis checks), minimal GC pressure, and the `envoyproxy/go-control-plane` SDK.

The boundary is clear: Go owns the Envoy control plane path. TypeScript owns everything else. The two communicate exclusively through Redis (shared state) and gRPC (Envoy → Go AuthServer). No cross-language imports exist.

## Shared Error Handling Convention

All TypeScript modules follow a consistent error handling pattern:

```typescript
// Errors thrown from security-critical operations use descriptive messages
// prefixed with the violation category:
throw new Error('Security Violation: <specific reason>');

// Operational errors use:
throw new Error('Infrastructure Fault: <specific reason>');

// Validation failures return HTTP error responses directly (not thrown):
return res.status(4xx).json({ error: '<user-facing message>' });

// All catch blocks MUST log before re-throwing or responding:
} catch (err: any) {
  ztaLogger.error({ error: err.message, ...context }, '<operation> Failed');
  return res.status(500).json({ error: 'Internal system configuration failure.' });
}
```

- **Never swallow errors silently** — always log at minimum
- **Never expose stack traces** in API responses
- **Prefer `ztaLogger.error()` for security events**, `ztaLogger.warn()` for policy rejections
- **Go services** use `status.Error(codes.PermissionDenied, "message")` for gRPC responses

## Spec Format Convention

Every engineering spec follows this structure:

```
# Title
> **Purpose:** One-line summary of what this spec enables.

**Version:** X.Y.Z | **Last Updated:** YYYY-MM-DD
**Dependencies:** `spec-name.md`, `spec-name.md`

---

## 1. Section Title
...

## N. Section Title
...

---

## References
[1] URL
...
```

## Identity & Authentication

- **[zero-trust-identity-blueprint.md](./zero-trust-identity-blueprint.md)** — Executive-level phishing-resistant identity architecture blueprint
- **[identity-fabric-architecture-2026.md](./identity-fabric-architecture-2026.md)** — 2026/2027 Identity Fabric with Continuous Adaptive Trust (CAT)
- **[enrollment-onboarding-flows.md](./enrollment-onboarding-flows.md)** — eIDAS 2.0 High LoA credential onboarding flow design
- **[webauthn-client-enterprise-handler.md](./webauthn-client-enterprise-handler.md)** — WebAuthn client-side handler with Enterprise Attestation
- **[webauthn-server-validation-backend.md](./webauthn-server-validation-backend.md)** — WebAuthn server-side attestation and assertion validator

## NFC & Relay Defense

- **[nfc-relay-threat-defense.md](./nfc-relay-threat-defense.md)** — NFC relay threat model and anti-relay defense taxonomy
- **[anti-relay-cryptographic-channel-binding.md](./anti-relay-cryptographic-channel-binding.md)** — Cryptographic channel binding to neutralize NFCShare/NGate relay attacks

## Infrastructure & Deployment

- **[kubernetes-deployment-manifests.md](./kubernetes-deployment-manifests.md)** — Hardened K8s manifests for gRPC auth service and Redis challenge pipeline
- **[redis-challenge-pipeline-docker.md](./redis-challenge-pipeline-docker.md)** — Dockerized Redis pipeline for challenge management and replay prevention
- **[multi-region-redis-replication.md](./multi-region-redis-replication.md)** — Active-active multi-region Redis replication with CRDTs
- **[terraform-chaos-engineering-validation.md](./terraform-chaos-engineering-validation.md)** — IaC blueprints and chaos engineering validation

## Observability & Response

- **[siem-logging-pipeline.md](./siem-logging-pipeline.md)** — SIEM logging pipeline for ZTA token and challenge engine logs
- **[soar-incident-containment-playbook.md](./soar-incident-containment-playbook.md)** — Automated SOAR incident containment playbook with 3-tier strategy

## Compliance & Audit

- **[caep-ssf-grpc-audit-trail.md](./caep-ssf-grpc-audit-trail.md)** — CAEP/SSF gRPC implementation and eIDAS audit trail specification
- **[auditor-topology-schematics.md](./auditor-topology-schematics.md)** — Architecture topology schematics for NIS2/eIDAS/GDPR auditors
- **[compliance-audit-appendices.md](./compliance-audit-appendices.md)** — Appendice templates for regulatory assurance dossier submission
