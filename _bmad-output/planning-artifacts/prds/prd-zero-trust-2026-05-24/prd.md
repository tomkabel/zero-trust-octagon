---
title: "Zero-Trust Reference Architecture Textbook"
status: final
created: 2026-05-24
updated: 2026-05-24
---

# PRD: Zero-Trust Reference Architecture Textbook
*Working title confirmed — "Zero-Trust Architecture: The Octagon and Beyond."*

## 0. Document Purpose

This PRD captures the completed product: a definitive, textbook-grade reference architecture for building zero-trust deployments in cloud-native environments. It serves as the single source of truth for architects, security engineers, SREs, and technical leaders who need a coherent, vendor-neutral framework grounded in mathematical invariants rather than product checklists. The PRD builds on an extensive brainstorming session (2026-05-22 — 2026-05-24), domain research on quantum/AI cybersecurity threats, and technical research validating 2025-2026 zero-trust architectures against the textbook's claims.

## 1. Vision

Zero-trust is the most overused and least understood phrase in modern cybersecurity. Every vendor has a "zero-trust solution." Every framework has a "zero-trust pillar." Every CISO claims their organization is "moving toward zero-trust." And yet, when you strip away the marketing, the compliance checklists, and the Visio diagrams, what actually remains? What does a real zero-trust architecture look like? Not a product suite. Not a maturity model. An *architecture* — a coherent, defensible, end-to-end design that you could build, test, and verify.

This textbook answers that question. It defines zero-trust not as a product or framework but as a set of eight irreducible axioms — the Octagon — that any architecture either satisfies or violates. It provides a nine-dimensional morphological matrix that maps the configuration space of real deployments. It traces four realistic attack scenarios against four distinct archetypal organizations, exposing exactly where and why each configuration fails. And it provides implementation pathways for each archetype, with gate checks, cost estimates, and failure pivots.

The textbook is vendor-neutral. It names real technologies only in footnotes as points of reference. The Octagon will still be true when today's hardware is obsolete and today's vendors have been acquired. Zero-trust is not something you buy. It is something you build.

## 2. Target User

### 2.1 Primary Personas

- **The Architect**: Designing a security model for a cloud-native deployment (containers, orchestration, service mesh). Needs a vocabulary and framework that survives vendor pitches.
- **The SRE**: Making that model survive production. Needs operational guidance, failure modes, and gate checks.
- **The Security Engineer**: Evaluating whether a current detection stack actually satisfies zero-trust principles. Needs falsifiable criteria.
- **The Technical Leader**: Trying to understand why a multi-million-dollar vendor suite still gets breached. Needs the confidence/reality gap diagnosis.

### 2.2 Jobs To Be Done

- Assess any architecture against eight axiomatic invariants in under an hour
- Map organizational posture to one of four archetypes and receive a specific implementation pathway
- Understand the nine morphological dimensions and their covariance — why upgrading one dimension without shifting the cluster produces diminishing returns
- Close the confidence/reality gap: 57% of organizations believe they are "Advanced" in zero-trust maturity; 69% were breached in the last three years
- Prepare for post-quantum cryptography migration on the same timeline as zero-trust deployment
- Defend against AI-speed adversaries operating below human response thresholds

### 2.3 Non-Users (v1)

- Executives seeking a compliance checklist — the textbook is diagnostic, not auditable
- Product vendors seeking a "zero-trust" label to apply — the Octagon is a bar, not a certification
- Complete beginners without cloud-native infrastructure knowledge

### 2.4 Key User Journeys

- **UJ-1. Architect self-assesses and receives a routed implementation pathway.**
  - **Persona + context:** An architect under pressure to "do zero trust" needs to separate signal from vendor noise.
  - **Entry state:** Has working cloud-native knowledge but not NIST SP 800-207 memorized. Arrives at the textbook.
  - **Path:** Reads Chapter 1 (why perimeter is dead) → Chapter 2 (what the Octagon is) → jumps to Chapter 13 (self-assessment, 12 questions) → receives archetype diagnosis → reads the corresponding implementation chapter (14, 15, or 16).
  - **Climax:** Identifies the specific dimension to upgrade first and the rationale.
  - **Resolution:** Has a 6-24 month implementation pathway with gate checks, cost estimates, and failure pivots.

- **UJ-2. Security engineer audits an existing architecture using the Octagon.**
  - **Persona + context:** Engineer evaluating whether the current detection stack satisfies zero-trust principles beyond vendor claims.
  - **Entry state:** Organization claims "Advanced" zero-trust maturity; engineer is skeptical.
  - **Path:** Reads Chapter 3 (Octagon as validation instrument) → applies the 8-question audit → scores each axiom against green/yellow/red criteria → identifies violated axioms.
  - **Climax:** Discovers Axiom 7 (Epistemic Integrity) is violated because observability is implicitly trusted.
  - **Resolution:** Has a prioritized list of axiom violations, each mapped to the morphological dimensions needing upgrade.

- **UJ-3. Technical leader diagnoses why vendor suite keeps getting breached.**
  - **Persona + context:** CISO or VP Engineering whose $5M+ vendor suite was breached. Needs to understand why.
  - **Entry state:** Reads Chapter 9 (Archetype B attack trace) → recognizes their own deployment in the trace → reads Chapter 12 (cross-trace synthesis).
  - **Path:** Understands the D4/D5 dependency deadlock (mature detection + immature response = maximum business damage) → reads Chapter 14 (enterprise turnaround).
  - **Climax:** Realizes the vendor suite satisfies at most 2-3 Octagon axioms.
  - **Resolution:** Has a 24-month phased implementation plan that funds detection and response modernization together.

## 3. Glossary

- **Octagon** — The set of eight irreducible axioms defining zero-trust architecture. Any system satisfying all eight is zero-trust; any system failing one is not.
- **Morphological matrix** — The nine-dimensional configuration space for zero-trust deployments. Dimensions: D1 (Trust Anchor), D2 (Identity Model), D3 (Enforcement Layer), D4 (Attestation Modality), D5 (Violation Response), D6 (Policy Distribution), D7 (Observability Trust), D8 (Organizational Posture), D9 (Human Continuity).
- **Archetype** — One of four distinct deployment profiles (A: Holy Grail, B: Fortune 500, C: Startup, D: Solo Operator). Each has a full attack trace and an implementation pathway.
- **Trickle-Truth** — The D5 violation response where an attacker is seamlessly migrated to a synthetic environment serving convincing but fake data. Yields zero data loss, zero business impact, and positive intelligence.
- **Epistemic Binding Key (EBK)** — A cryptographic key binding specific telemetry attestations to specific temporal states, functioning as "truth insurance."
- **Covariance cluster** — A set of dimension values that tend to co-occur because each enables the others. Low-maturity cluster: Software PKI → Single Attestation → Push → Hard Deny → Implicit Observability → Siloed Org.
- **Detect-respond gap** — The interval between detection and effective response. The true operational metric for zero-trust effectiveness.
- **Confidence/reality gap** — The structural overestimation of zero-trust maturity (57% believe Advanced, 69% breached).
- **SaaS Blind Spot** — The gap between what an identity-aware proxy protects and what SaaS platforms expose using the same identity token.

## 4. Features

### 4.1 The Octagon: Eight Axioms of Zero-Trust

**Description:** The foundational theoretical framework. Eight irreducible axioms derived through first-principles analysis, each with corollaries and refinement history. The axioms were peer-reviewed and stress-tested against four deployment archetypes and quantum/AI adversary models. Two axioms (7 and 8) were missing from the initial formulation and added during peer review. Three axioms (3, 5, 6) were reformulated when original versions were identified as implementation patterns rather than invariants.

**Functional Requirements:**

#### FR-1: Axiom Declaration

The system presents eight axioms with precise definitions, each accompanied by 2-3 derived corollaries. Realizes UJ-1, UJ-2.

**Consequences (testable):**
- Each axiom is stated as an invariant, not an implementation recommendation
- Each axiom maps to 1-3 morphological dimensions in a documented mapping table
- A reader can determine whether any given architecture satisfies or violates each axiom

#### FR-2: Axiom Refinement History

The system documents the evolution from Octagon through Hendecagon (11 axioms) to Tridecagon (13 axioms), including why each refinement was made. Realizes UJ-2.

**Consequences (testable):**
- Original formulations of Axioms 3, 5, 6 are preserved with the issue that triggered reformulation
- Axioms 7, 8 are documented as peer-review additions with the gap they closed
- Axioms 10-13 (Hendecagon/Tridecagon) are acknowledged as forward-looking extensions in Chapter 18

**Out of Scope:**
- Full operationalization of Axioms 10-13 (they are declared, not implemented)
- Cryptographic specifications for the Epistemic Binding Key

#### FR-3: Octagon as Validation Instrument

The system converts each axiom into an auditable question with green/yellow/red scoring criteria, enabling an 8-question architecture audit. Realizes UJ-2.

**Consequences (testable):**
- Each axiom produces one diagnostic question
- Each question has exactly three scoring thresholds
- The instrument detects the confidence/reality gap by measuring deployed capabilities vs. claimed maturity

### 4.2 The Morphological Matrix

**Description:** A nine-dimensional configuration space that maps every real zero-trust deployment. Each dimension has 4-7 concrete values. The dimensions are not independent — their covariance structure is the core architectural insight. The leverage point hierarchy ranks dimensions by upgrade impact.

**Functional Requirements:**

#### FR-4: Dimension Definition

The system defines nine dimensions (D1-D9) with ordered value sets. Realizes UJ-1.

**Consequences (testable):**
- Each dimension has 4-7 named, distinct values
- Values are ordered from lowest to highest maturity
- D9 (Human Continuity) is documented as a discovery during analysis of Archetype D

#### FR-5: Covariance Cluster Identification

The system identifies which dimension values naturally co-vary, forming low-maturity and high-maturity clusters. Realizes UJ-1.

**Consequences (testable):**
- Low-maturity cluster: Software PKI ↔ Single Attestation ↔ Push ↔ Hard Deny ↔ Implicit Observability ↔ Siloed Org
- High-maturity cluster: Silicon Anchor ↔ Triple Attestation ↔ Event-Streamed ↔ Trickle-Truth ↔ Air-Gapped Pipeline ↔ Presumptively Wrong
- The covariance insight explains why uncoordinated dimension upgrades produce diminishing returns

#### FR-6: Leverage Point Hierarchy

The system ranks dimensions by upgrade impact: D5 > D4 > D8 > D2 > D7. Realizes UJ-3.

**Consequences (testable):**
- D5 (Violation Response) is identified as the highest-leverage dimension
- The D4/D5 dependency deadlock is documented: they must be upgraded together
- The ranking is justified with cross-archetype trace evidence

### 4.3 Attack Traces — Four Archetypal Breaches

**Description:** Four realistic, end-to-end attack scenarios, one for each archetypal deployment. Each trace follows a complete incident timeline — from initial breach through detection, response, and post-mortem — exposing exactly where and why each morphological configuration fails.

**Functional Requirements:**

#### FR-7: Archetype B Attack Trace (Fortune 500)

The system narrates a full attack trace for a Fortune 500 deployment: credential theft via infostealer → lateral movement → data exfiltration. Realizes UJ-3.

**Consequences (testable):**
- Single Source attestation (token validity only) enables the attack
- Hard Deny response causes business damage equal to the attack
- Siloed teams cannot coordinate during incident
- Implicit observability means the attack is invisible until tripwire

#### FR-8: Archetype C Attack Trace (Startup)

The system narrates a full attack trace for a hyper-growth startup: CI/CD supply chain injection → deployment → data exfiltration. Realizes UJ-3.

**Consequences (testable):**
- Trust on First Use (TOFU) attestation means the injected dependency passes all checks
- Degrade Gracefully preserves uptime at the cost of confidentiality
- GitOps + fused teams produce excellent MTTD/MTTR but the degradation window permits exfiltration
- The 2025-2026 supply chain incidents (TanStack, Axios/Sapphire Sleet, UNC6426) validate the trace

#### FR-9: Archetype D Attack Trace (Solo Operator)

The system narrates a full attack trace for a solo operator: MFA fatigue → credential compromise → SaaS session hijack. Realizes UJ-3.

**Consequences (testable):**
- The IAP protects self-hosted resources but not SaaS platforms using the same identity token
- Single Source attestation produces low-signal, high-noise alerts
- The bus factor of 1 means MTTR is bimodal: 3 minutes or 25+ minutes
- Implicit trust in SaaS vendor logs means the attacker's SaaS access is invisible

#### FR-10: Archetype A Attack Trace (Holy Grail)

The system narrates the aspirational trace where the attacker encounters Trickle-Truth. Realizes UJ-1.

**Consequences (testable):**
- Triple attestation detects the anomaly before data moves
- Trickle-Truth seamlessly grafts the attacker's session to a synthetic environment
- Zero data exfiltration, zero business impact, positive intelligence yield
- The attack becomes a source of adversary TTP intelligence

#### FR-11: Cross-Trace Synthesis

The system extracts meta-patterns from all four traces, identifying the detect-respond gap, the visible middle fallacy, and supply chain as the unifying blind spot. Realizes UJ-3.

**Consequences (testable):**
- All four traces are cross-mapped in a comparison table (MTTD, MTTR, exfiltration, business impact, intel yield)
- The visible middle fallacy (attacker feedback loop from defensive responses) is explicitly documented
- The 2026 domain/technical research (quantum threats, AI adversaries, breach data) validates the traces

### 4.4 Implementation Pathways

**Description:** Four decision-tree chapters, one per archetype (B→A, C→A, D→A, plus the Aspirant's Gate for when the primary path breaks). Each pathway has phased timelines, gate checks, cost estimates, and failure pivots.

**Functional Requirements:**

#### FR-12: Archetype B Implementation (24-Month Enterprise Turnaround)

The system provides a phased pathway for Fortune 500 deployments. Realizes UJ-3.

**Consequences (testable):**
- Q1-2: Detection modernization (D4 + D5 upgraded together, $1.5-2.5M)
- Q3-4: Enforcement modernization (D3, $2-3.5M)
- Year 2: Observability and organization (D7, D8)
- Gate 1: If behavioral tuning fails, pivot to hardware-backed attestation
- All phases include explicit axiom-addressing statements

#### FR-13: Archetype C Implementation (12-Month Velocity Defender)

The system provides a phased pathway for high-velocity startups. Realizes UJ-3.

**Consequences (testable):**
- Q1: Supply chain hardening (image signing + admission control + eBPF, $150-250K)
- Q2-3: Identity and authority (SPIFFE/SPIRE, $200-350K)
- Q4: Selective quarantine + network policy enforcement
- Gate 1: If eBPF false positives never drop, pivot to confidential containers
- Every upgrade is measured against a single metric: does it add more than 60 seconds to CI/CD?

#### FR-14: Archetype D Implementation (6-Month Scaling Pat)

The system provides a phased pathway for solo operators. Realizes UJ-3.

**Consequences (testable):**
- Week 1-4: Eliminate the bus factor (hardware keys + automated fallback + SaaS audit logging, ~$2,500 + $500/month)
- Month 2-3: Automated response for clear cases
- Month 4-6: Browser-level SaaS enforcement
- Gate 3: If Pat's alert load hasn't dropped below 30 min/day, reduce SaaS footprint
- All recommendations cost less than a monthly SaaS subscription and are actionable within a week

#### FR-15: The Aspirant's Gate (Failure Pivot Chapter)

The system documents the three most common gate failure patterns and their correct pivots. Realizes UJ-1, UJ-3.

**Consequences (testable):**
- Common failure pattern: Skipping D4 before D5 (detected and documented across all archetypes)
- Gate Failure 1 (B): Behavioral tuning fails → pivot to hardware-backed attestation
- Gate Failure 2 (C): eBPF false positives persist → pivot to confidential containers
- Gate Failure 3 (D): Automation cannot keep up → reduce SaaS footprint

### 4.5 Self-Assessment Diagnostic

**Description:** A 12-question diagnostic instrument that maps an organization to its archetype. Twelve questions span all morphological dimensions with four answer choices each, mapping to archetypes A-D. Tiebreakers for B/C and C/D boundaries document velocity and budget as decisive dimensions.

**Functional Requirements:**

#### FR-16: Diagnostic Questions

The system presents 12 questions covering Trust Anchor (D1), Identity (D2), Enforcement (D3), Attestation (D4), Response (D5), Policy Distribution (D6), Observability (D7), Organization (D8), Human Continuity (D9), Budget, Primary Threat, and Deployment Velocity. Realizes UJ-1.

**Consequences (testable):**
- Each question has 4 ordered answer choices mapping to archetypes A-D
- Questions measure deployed capabilities, not aspirations
- Tiebreakers are explicitly documented
- The confidence/reality gap (57% vs 69%) is presented as rationale for accurate self-assessment

### 4.6 Decision Matrix

**Description:** A cross-archetype matrix that maps pain points and threat profiles to the first dimension to upgrade and the chapter to read for the detailed path.

**Functional Requirements:**

#### FR-17: Decision Matrix

The system presents a matrix with 7 rows (pain-threat pairs) and columns for starting dimension, rationale, and implementation chapter. Realizes UJ-1, UJ-3.

**Consequences (testable):**
- Each row identifies a primary pain point and primary threat
- Each row maps to a specific morphological dimension with a rationale
- Each row references the corresponding implementation chapter
- The matrix is the book's most practical output: identify your pain, read the corresponding row, act

### 4.7 Appendices

**Description:** Four appendices covering quantum/AI adversary stress-tests, a printable architecture validation checklist, a glossary of all domain terms, and a quick-reference dimensions + axioms card.

**Functional Requirements:**

#### FR-18: Quantum + AI Adversary Stress-Test (Appendix A)

The system stress-tests the Octagon against quantum computing threats (Harvest-Now-Decrypt-Later, PQC migration) and AI-generated attack chains (autonomous cloud exploitation, prompt injection, agentic adversaries). Realizes UJ-2.

**Consequences (testable):**
- PQC timeline: NIST deprecation of RSA/ECC by 2030, disallowance by 2035
- ZTA deployment deadline (DoD 2027) comes before PQC migration deadline
- AI-generated attacks target D4 (behavioral attestation) and Axiom 7 (epistemic integrity)
- The mitigation for both is hardware-anchored cryptographic provenance

#### FR-19: Architecture Validation Checklist (Appendix B)

The system provides a printable, 8-question checklist derived from the Octagon with green/yellow/red scoring per axiom. Realizes UJ-2.

**Consequences (testable):**
- Each axiom maps to one diagnostic question
- Scoring thresholds are explicit
- The checklist is designed for annual re-use and post-incident application

#### FR-20: Glossary (Appendix C)

The system defines all domain terms used throughout the textbook with cross-references. Realizes UJ-1.

**Consequences (testable):**
- Every domain term introduced in the textbook appears in the glossary
- Definitions are consistent with usage in FRs, axioms, and traces
- Cross-references link related terms

#### FR-21: Quick-Reference Card (Appendix D)

The system provides a single-page reference card with all eight axioms, nine dimensions, and four archetypes. Realizes UJ-1, UJ-2.

**Consequences (testable):**
- All axioms listed with one-line definitions
- All dimensions listed with value ranges
- All archetypes summarized with starting configuration and primary threat

### 4.8 Cross-Chapter Navigation

**Description:** Every chapter names its prerequisites explicitly. Cross-references use relative links. Appendices provide glossary and quick-reference support. The reader can follow linear progression or jump to self-assessment and receive a routed path.

**Functional Requirements:**

#### FR-22: Prerequisite and Cross-Reference System

The system declares explicit prerequisites in every chapter header and provides relative-link cross-references at every chapter end. Realizes UJ-1, UJ-2, UJ-3.

**Consequences (testable):**
- Every chapter header includes a "Prerequisites" section with chapter references
- Every chapter end includes a "Cross-References" section with Next, Builds On, and Related links
- A reader can navigate from self-assessment (Chapter 13) → archetype-specific implementation chapter without reading the entire book

## 5. Non-Goals (Explicit)

- **This is not a compliance framework.** It does not map to SOC 2, ISO 27001, HIPAA, or PCI DSS controls.
- **This is not a product.** It does not endorse any vendor or recommend any specific tool.
- **This is not a NIST replacement.** It references NIST SP 800-207 and CISA ZTMM but defines an orthogonal analysis framework.
- **This is not a deployment guide for any specific cloud provider.** Cloud-specific patterns are in footnotes only.
- **This is not an introductory text.** It assumes working knowledge of cloud-native infrastructure, TLS, JWTs, and PKI.
- **This is not a threat modeling guide for all possible adversaries.** It covers four archetypal attack scenarios validated against 2025-2026 data but does not enumerate every possible threat.
- **The Trickle-Truth Garden is not a product specification.** It is an architectural concept with technical depth; implementation-level crypto and protocol specs are out of scope.

## 6. MVP Scope

### 6.1 In Scope

- Eight axioms (Octagon) with corollaries and refinement history
- Nine-dimension morphological matrix with covariance analysis
- Four full archetypal attack traces
- Four implementation pathways (Chapters 14-17)
- Self-assessment diagnostic (Chapter 13)
- Decision matrix (Chapter 18)
- Four appendices (quantum/AI stress-test, validation checklist, glossary, quick-reference)
- Cross-chapter navigation with prerequisites and relative links
- 23 markdown files total (18 chapters + 4 appendices + 1 preface)

### 6.2 Out of Scope for MVP

- Formal cryptographic specification of the Epistemic Binding Key (deferred to potential follow-up technical paper)
- Production reference implementation of the Trickle-Truth Garden
- Interactive web version or searchable index
- PDF/eBook export formatting (the source is in markdown)
- Automated architecture scoring tool (the checklist is manual)
- Non-English translations
- Audiobook or video course adaptation
- Academic peer-review (the textbook was self-reviewed and validated against 2025-2026 research)

## 7. Success Metrics

**Primary**
- **SM-1**: A reader diagnosed as Archetype B, C, or D can complete the self-assessment, identify their primary threat, and receive a specific implementation pathway with phase gates and cost estimates. Validates FR-16, FR-12, FR-13, FR-14.
- **SM-2**: A security engineer can apply the 8-question Octagon audit to an existing architecture and identify which axioms are violated in under one hour. Validates FR-3, FR-19.

**Secondary**
- **SM-3**: Every architectural claim made in the textbook is independently verifiable against the 2025-2026 research reports (domain + technical). Validates FR-7, FR-8, FR-9, FR-10, FR-11.
- **SM-4**: The textbook's chapter dependency graph is acyclic — no later chapter depends on a concept introduced in a later chapter. Validates FR-22.
- **SM-5**: All domain terms used in FRs, axioms, and traces appear in the glossary with consistent definitions. Validates FR-20.

**Counter-metrics (do not optimize)**
- **SM-C1**: Page count — longer is not better. The textbook succeeds if it compresses complex architectural concepts into navigable chapters, not if it maximizes length. Counterbalances SM-1.
- **SM-C2**: Number of axioms — axiom count is not a success metric. The refinement from Octagon (8) to Tridecagon (13) was driven by adversarial stress-testing, not axiom accumulation. Counterbalances SM-2.

## 8. Open Questions

1. **Trickle-Truth Garden prior art** — The technical research identifies partial prior art (honeypots, canary tokens, MTD) but cannot confirm the full synthesis is novel. An academic literature search is recommended before publication.
2. **Axioms 10-13 formalization** — The Hendecagon/Tridecagon extensions (Functional Preservation, Sovereign Quorum, Algorithmic Impermanence, Architectural Polymorphism) are declared in Chapter 18 but not formalized with corollaries like the core Octagon. Full formalization may be a follow-up work.
3. **D9 measurement instrument** — Human Continuity is validated by inference from operational failure patterns but lacks a direct measurement instrument. Proposing specific metrics (bus factor score, automated response coverage, on-call rotation depth) would strengthen the dimension.
4. **Vendor Combat chapter placement** — The brainstorming session proposed a dedicated "Vendor Combat" chapter reframing vendor evaluation as verbal judo. This was folded into Chapter 18's decision matrix. Whether it warrants standalone treatment is unresolved.

## 9. Assumptions Index

- `[ASSUMPTION: The eight axioms are individually necessary and collectively sufficient for zero-trust. A system failing one axiom is not zero-trust.]` — from §4.1, FR-1
- `[ASSUMPTION: The morphological dimensions are orthogonal — no dimension subsumes another.]` — from §4.2, FR-4
- `[ASSUMPTION: The covariance cluster hypothesis (upgrading one dimension without shifting the cluster produces diminishing returns) holds across all deployment types.]` — from §4.2, FR-5
- `[ASSUMPTION: The leverage point hierarchy (D5 > D4 > D8 > D2 > D7) is invariant across archetypes.]` — from §4.2, FR-6
- `[ASSUMPTION: The four archetype attack traces represent the most common deployment profiles, not all possible profiles.]` — from §4.3, FR-7 through FR-10
- `[ASSUMPTION: The 2026 research data (RSA ID IQ Report, Microsoft IR, CSA SDP v3, NIST PQC timeline) validates the textbook's architectural claims.]` — from §4.3, FR-11
- `[ASSUMPTION: The Trickle-Truth Garden synthesis is a novel contribution; individual components (honeypots, canary tokens) have prior art but the full adaptive, garbage-pollution framework with real-time TTP classification is original.]` — from §4.1, Open Question 1
