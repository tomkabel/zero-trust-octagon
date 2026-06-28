# Engineering Specs Index

Companion implementation contracts for the Zero-Trust Octagon architecture. These specs define the "how" — complementing the theory chapters (`01-foundations/` through `04-synthesis/`) that define the "why."

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
