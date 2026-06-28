# Zero-Trust Octagon — Project Context

**Project:** zero-trust | **Type:** Dual-stream (wikibook + engineering reference implementation)
**Stack:** VitePress (documentation), TypeScript (application layer), Go (gRPC ExtAuthz), Docker, Kubernetes, Terraform

## Architecture: Two-Stream Product

### Stream 1: Zero-Trust Octagon Wikibook
- **Artifact type:** Static markdown documentation (VitePress wiki)
- **Directory:** `docs/` (numbered sections: `01-foundations/` through `04-synthesis/`, `appendix/`)
- **23 files:** 18 chapters + 5 appendices + section landing pages
- **Purpose:** Vendor-neutral textbook defining zero-trust through 8 irreducible axioms (Octagon), 9-dimension morphological matrix, 4 archetypal attack traces, and implementation pathways
- **PRD:** `_bmad-output/planning-artifacts/prds/prd-zero-trust-2026-05-24/prd.md` (FR-1 through FR-24)
- **Architecture:** `_bmad-output/planning-artifacts/architecture.md` (6-layer dependency graph, 6 fidelity gates, 17 design decisions)

### Stream 2: Engineering Reference Implementation
- **Artifact type:** Production-ready code services (TypeScript + Go)
- **Directory:** `docs/engineering/` (17 spec files, 7 implementation phases)
- **10 shared code modules** defined in `docs/engineering/index.md`:
  - `ZtaRedisPipelineManager` (TS) — Redis challenge pipeline
  - `ztaLogger` (TS) — Structured SIEM logging
  - `EnterpriseWebAuthnServerValidator` (TS) — FIDO2 attestation/assertion
  - `WebAuthnClientHandler` (TS) — WebAuthn Enterprise Attestation
  - `ZtaEnrollmentOrchestrator` (TS) — eIDAS 2.0 onboarding
  - `CrossRegionZtaDataPipeline` (TS) — Multi-region Redis CRDT
  - `ZtaAutomatedResponsePlaybook` (TS) — 3-tier SOAR containment
  - `AntiRelayEnrollmentEngine` (TS) — NFC relay defense
  - `SoTAAntiRelayValidator` (TS) — Cryptographic channel binding
  - `AuthServer` (Go) — gRPC Envoy ExtAuthz with CAEP/SSF
- **Architecture spine:** `docs/engineering/identity-fabric-architecture-2026.md` (3-layer Identity Fabric, CAT, OID4VC, EU AI Act)
- **PRD FRs:** FR-25 through FR-34

## Polyglot Boundary
- **TypeScript** owns application layer: WebAuthn handlers, enrollment flows, SOAR, Redis pipeline
- **Go** owns Envoy ExtAuthz control plane: gRPC auth service
- **Communication:** Redis (shared state) + gRPC (Envoy → Go AuthServer)
- **Error convention:** `Security Violation:` for security events, `Infrastructure Fault:` for ops failures
- **Go convention:** `status.Error(codes.PermissionDenied, "message")` for gRPC responses

## Key Paths

| Purpose | Path |
|---------|------|
| Engineering specs | `docs/engineering/` |
| Engineering index (dependency map) | `docs/engineering/index.md` |
| Identity Fabric architecture | `docs/engineering/identity-fabric-architecture-2026.md` |
| Wikibook content | `docs/01-foundations/`, `docs/02-methodology/`, etc. |
| VitePress config | `.vitepress/config.ts` |
| VitePress theme | `.vitepress/theme/custom.css` (terminal dark theme) |
| GitHub Actions deploy | `.github/workflows/deploy.yml` |
| PRD | `_bmad-output/planning-artifacts/prds/prd-zero-trust-2026-05-24/` |
| Architecture | `_bmad-output/planning-artifacts/architecture.md` |
| Epics | `_bmad-output/planning-artifacts/epics.md` |
| Sprint status | `_bmad-output/implementation-artifacts/sprint-status.yaml` |
| Implementation stories | `_bmad-output/implementation-artifacts/` |
| Sprint change proposals | `_bmad-output/planning-artifacts/sprint-change-proposal-*.md` |

## Sprint Status (2026-06-28)

11 epics, 46 stories total:
- Epics 0-2: **Done** (18 stories — wikibook infrastructure + Octagon axioms + attack traces)
- Epic 3: **In Progress** (1 ready-for-dev, 6 backlog — wikibook action plan chapters)
- Epic 4: **Backlog** (6 stories — wikibook appendices + global consistency)
- Epics 5-11: **Backlog** (15 stories — engineering reference implementation, all phases)

## Commands
- `npm run docs:dev` — Start VitePress dev server
- `npm run docs:build` — Production build
- `npm run docs:preview` — Preview production build
- `npm run test:redis` — Redis pipeline tests (when implemented)
- `go test ./...` — Go auth server tests (when implemented)

## BMad Configuration
- `communication_language: English`
- `document_output_language: English`
- `user_skill_level: intermediate`
- `planning_artifacts: _bmad-output/planning-artifacts`
- `implementation_artifacts: _bmad-output/implementation-artifacts`
- `project_knowledge: docs`
