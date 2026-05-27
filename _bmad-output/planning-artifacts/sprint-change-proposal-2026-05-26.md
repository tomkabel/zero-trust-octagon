---
date: 2026-05-26
status: approved
trigger: ZTMM cross-analysis + markdown reference library cross-reference analysis
scope: Moderate — PRD amendments, Architecture amendments, 2 new stories, 15 modified story ACs, 18 chapter modifications
replaces: "sprint-change-proposal-2026-05-26.md (original ZTMM-only version)"
inputDocuments:
  - "_bmad-output/planning-artifacts/ztmm-cross-analysis-2026-05-26.md"
  - "_bmad-output/cross-reference-analysis-2026-05-26.md"
  - "_bmad-output/planning-artifacts/prds/prd-zero-trust-2026-05-24/prd.md"
  - "_bmad-output/planning-artifacts/architecture.md"
  - "_bmad-output/planning-artifacts/epics.md"
---

# Sprint Change Proposal: ZTMM + Reference Library Integration

## 1. Issue Summary

Two analyses were produced on 2026-05-26 after planning artifacts were finalized on 2026-05-24:

**Analysis 1 — ZTMM Cross-Analysis** (`ztmm-cross-analysis-2026-05-26.md`): The project references the CISA ZTMM 122 times but never surfaces a structured mapping. Gaps: missing crosswalk, Devices blind spot, Data lifecycle gap, Network resilience unaddressed, confidence/reality gap mechanism underutilized, no governance dimension, missed "Accessible Applications" connection.

**Analysis 2 — Cross-Reference Analysis** (`cross-reference-analysis-2026-05-26.md`): The `./markdown` directory contains 11 authoritative documents (SP 800-207, SP 800-207A, FIPS 203-205, CSWP.29/CSF 2.0, DoD ZT Ref Arch v2.0, DoD Execution Roadmap v1.1, NSA ZIG Primer, EO 14028, DTM-25-003). The project underutilizes all but SP 800-207 and the CISA ZTMM. 29 gaps identified across four priorities: Critical Credibility (missing EO 14028, SP 800-207A, FIPS 203-205), Architectural Depth (NIST Trust Algorithm, deployment variations, multi-location federation, PQC operational impact), Implementation Validation (DoD COA 1, NSA phases, DTM-25-003), and Sprint Change Integration (CSF SCRM, SBOM).

All recommendations are additive or softening modifications — zero removals. The reference documents universally validate the project's core thesis.

## 2. Impact Analysis

### Epic Impact

| Epic | Severity | Changes |
|------|----------|---------|
| Epic 1 (Foundation) | Significant | EO 14028, SP 800-207A, DoD citations in Ch00/Ch01; NIST Trust Algorithm in Ch02; ZTMM naming + Devices subsection + DoD 7-pillar + CSF Profiles in Ch04; NIST deployment variations + SP 800-207A + DoD data-centric in Ch05; multi-location federation + DoD orchestration + PQC signatures in Ch06; Data Lifecycle + Governance + CSF Govern + DoD PfMO + NSA Target/Advanced + hybrid COA + capability table in Ch07 |
| Epic 2 (Attack Traces) | Low | CSF SCRM + EO 14028 SBOM citations in Ch10 |
| Epic 3 (Action) | Significant | ZTMM maturity table + NSA phase mapping in Ch13; Maturity Model + COA 1 sidebar in Ch14; Maturity Model subsections in Ch15/Ch16; Major PQC section rewrite in Ch18 (FIPS 203-205, ML-KEM, signature sizes, cross-family, migration timeline) |
| Epic 4 (Appendices) | Significant | New Story 4.6 (ZTMM Crosswalk appendix); FIPS citations in Appendix A; Complementary Frameworks note in Appendix B; 9+ new glossary terms in Appendix C; Extended global consistency checks in Story 4.5 |

No epic becomes obsolete. No resequencing required.

### Artifact Conflicts

| Artifact | Section | Conflict | Resolution |
|----------|---------|----------|------------|
| PRD | §5, NFR-2 | States "does not map to CISA ZTMM" but new appendix creates exactly such a mapping; no mention of EO 14028, SP 800-207A, or DoD documents | Soften: "The Octagon provides structured mappings to CISA ZTMM v2.0 (Appendix E) and references the full federal ZT standards ecosystem — NIST SP 800-207/207A, DoD ZT Ref Arch, FIPS 203-205, CSF 2.0, NSA ZIG — demonstrating orthogonal complementarity rather than replacement" |
| PRD | §4.7 | Missing Appendix E (FR for crosswalk); no FR for PQC expansion scope | Add FR-23 (ZTMM Crosswalk); add FR-24 (Reference Library Integration) |
| PRD | §4.8, FR-22 | No requirement for ZTMM cross-refs or reference library citations in chapters | Extend FR-22 |
| Architecture | NFR section | Same "no compliance mapping" language as PRD | Mirror PRD softening |
| Architecture | Layer 5 (Appendices) | Missing `appendix-e-cisa-ztmm-crosswalk.md` | Add to layer structure |
| Epics | Stories 1.1-4.5 | 15 stories need extended ACs | Add ACs per Section 4 below |
| Epics | Epic 4 | Missing Story 4.6 | Add Story 4.6 (ZTMM Crosswalk) |
| UX Design | N/A | Textbook project, no UI | No impact |

### Chapter-Level Impact (18 Chapters + Appendix E)

| File | Story | Change Type | Source Analysis |
|------|-------|-------------|-----------------|
| `00-preface.md` | 1.1 | Addition | EO 14028 as policy genesis (Cross-Ref Gap 27) |
| `01-the-case-for-zero-trust.md` | 1.1 | Modification + Addition × 3 | Soften compliance (ZTMM M1) + "Why Not ZTMM?" section (ZTMM A5) + EO 14028 §3(c) cloud mandate (Gap 29) + SP 800-207A cloud-native audience (Gap 4) + DoD VPN-less thesis validation (Gap 17) |
| `02-the-octagon.md` | 1.2 | Addition | NIST Trust Algorithm formalization (Gap 1) |
| `04-the-morphological-matrix.md` | 1.4 | Modification + Addition × 4 | ZTMM explicit naming (ZTMM M2) + "Where Devices Fit" (ZTMM A3) + DoD 7-pillar mapping sidebar (Gap 15) + CSF Profiles/Tiers sidebar (Gap 13) + NIST Trust Algorithm reference (Gap 1) |
| `05-dimensions-trust-to-attestation.md` | 1.5 | Addition × 3 | NIST deployment variations → D3 mapping table (Gap 2) + SP 800-207A cloud-native PEP patterns (Gap 5) + DoD data-centric security → Axiom 3 validation (Gap 18) |
| `06-dimensions-response-to-human.md` | 1.6 | Addition × 4 | Multi-location federation notes (Gap 4, 6) + DoD centralized orchestration → Event-Streamed validation (Gap 16) + PQC signature size operational impact on event stream (Gap 9) + DoD data-centric model (Gap 18) |
| `07-meta-patterns.md` | 1.6 | Addition × 8 | Data Lifecycle subsection (ZTMM A2) + Governance subsection (ZTMM A6) + CSF 2.0 Govern mapping (Gap 12) + DoD ZT PfMO / DTM-25-003 citation (Gap 22-23) + NSA Target/Advanced → covariance cluster validation (Gap 26) + Nuanced hybrid COA discussion (Gap 21) + Cross-cutting capability mapping table (Visibility→A7/D7/D4, Auto/Orch→A4+A5+D5/D6, Governance→A2+D8) |
| `10-archetype-c-startup.md` | 2.3 | Addition × 2 | CSF 2.0 SCRM citation (Gap 14) + EO 14028 §4 SBOM citation (Gap 28) |
| `13-self-assessment.md` | 3.1 | Addition × 2 | ZTMM maturity mapping table (ZTMM M3) + NSA phase mapping sidebar (Gap 24) |
| `14-enterprise-turnaround.md` | 3.2 | Addition × 3 | "Coming From a Maturity Model" subsection (ZTMM A4) + DoD COA 1 / FY 2027 sidebar (Gap 19-20) + NSA phase comparison (Gap 24) |
| `15-velocity-defender.md` | 3.3 | Addition | "Coming From a Maturity Model" subsection (ZTMM A4) |
| `16-scaling-pat.md` | 3.4 | Addition | "Coming From a Maturity Model" subsection (ZTMM A4) |
| `18-decision-matrix-and-conclusion.md` | 3.6 | Major Addition × 6 | FIPS 203/204/205 standard nomenclature (Gap 7) + ML-KEM key establishment (Gap 8) + PQC signature size operational impact table (Gap 9) + Cross-family PQC diversity (Gap 10) + PQC migration timeline overlay (Gap 11) + FIPS/EO/DoD citations in "Three Futures" (Gap 21, 27) |
| `appendix-a-quantum-ai-threats.md` | 4.1 | Addition | FIPS-standard nomenclature and citations (Gap 7) |
| `appendix-b-validation-checklist.md` | 4.2 | Addition | "Complementary Frameworks" note referencing ZTMM, CSF 2.0, DoD assessment |
| `appendix-c-glossary.md` | 4.3 | Addition × 9 | New entries: EO 14028, FIPS 203, FIPS 204, FIPS 205, ML-KEM, ML-DSA, SLH-DSA, SP 800-207A, CSF Govern, DoD ZT PfMO, ICAM, SBOM |
| `appendix-e-cisa-ztmm-crosswalk.md` | **New 4.6** | Creation | 5-column mapping table + bidirectional explanation (~2-3 pages) |

## 3. Recommended Approach: Direct Adjustment

**All changes are additive or softening modifications.** No structural reorganization. No story removal. The project hasn't started implementation yet — zero rework cost. Two new files/stories (Appendix E / Story 4.6).

**Effort:** Medium. Most changes are single-section insertions into existing chapters. The PQC expansion in Ch18 is the most substantial addition (new subsections with operational impact tables). Appendix E is a from-scratch document (~2-3 pages).

**Risk:** Low. Both analyses strengthen the project's core thesis by showing how reference documents validate the architectural claims. Nothing is contradicted. The combined changes transform the project from "here's our framework" to "here's our framework, grounded in the full federal ZT standards ecosystem."

**Timeline impact:** Minimal. Changes fold into existing stories. No new epic needed.

## 4. Detailed Change Proposals

### PRD Changes

**Change PRD-1: NFR-2 (Non-Goals → §5)**

OLD:
> NFR-2: Not a compliance framework — does not map to SOC 2, ISO 27001, HIPAA, or PCI DSS controls. Defines an orthogonal analysis framework, not a replacement for NIST SP 800-207 or CISA ZTMM.

NEW:
> NFR-2: Not a compliance framework — does not map to SOC 2, ISO 27001, HIPAA, or PCI DSS controls. Defines an orthogonal analysis framework, not a replacement for NIST SP 800-207 or CISA ZTMM. Provides a structured mapping to CISA ZTMM v2.0 as an appendix (Appendix E) and references the full federal ZT standards ecosystem — NIST SP 800-207A (cloud-native ZTA), DoD ZT Ref Arch v2.0, NIST FIPS 203-205 (post-quantum cryptography), NIST CSF 2.0 (governance), NSA ZIG Primer, DoD DTM-25-003, and EO 14028 — demonstrating orthogonal complementarity with all major frameworks. The ZTMM measures organizational progress; the Octagon verifies architectural integrity. Both are necessary. Neither is sufficient alone.

Rationale: The cross-reference analysis identified 6 additional documents the project should cite. The NFR needs to reflect this broader reference ecosystem.

---

**Change PRD-2: New FR-23 (§4.7 Appendices)**

Add after FR-21:

> #### FR-23: CISA ZTMM v2.0 Crosswalk (Appendix E)
>
> The system provides a systematic mapping table between the CISA Zero Trust Maturity Model v2.0 and the Octagon framework. Realizes UJ-2, UJ-3.
>
> **Consequences (testable):**
> - Every ZTMM pillar (Identity, Devices, Networks, Applications & Workloads, Data) maps to at least one Octagon axiom and one morphological dimension
> - Every ZTMM function has Traditional, Initial, Advanced, and Optimal descriptors in the table
> - Cross-cutting capabilities (Visibility & Analytics, Automation & Orchestration, Governance) have explicit axiom-to-dimension mappings
> - The appendix includes bidirectional explanation: ZTMM→Octagon and Octagon→ZTMM
> - The appendix validates the project's "orthogonal, not competing" claim by demonstrating both frameworks are useful for different purposes

---

**Change PRD-3: New FR-24 (§4.7 Appendices)**

Add after FR-23:

> #### FR-24: Reference Library Integration
>
> The system integrates citations and architectural validation from the 11-document federal ZT standards reference library into its chapters, demonstrating the Octagon framework's grounding in federal standards and providing a bridge from compliance-oriented readers to the architectural framework.
>
> **Consequences (testable):**
> - EO 14028 (the policy genesis of the ZT ecosystem) is cited in Ch00 and Ch01
> - NIST SP 800-207A (cloud-native ZTA) is cited in Ch01 and Ch05
> - NIST FIPS 203/204/205 (post-quantum cryptography) are cited in Ch18 with standard nomenclature, operational impact analysis, and migration timeline
> - NIST CSF 2.0 Govern function is cited in Ch07 with a mapping to D8
> - DoD ZT Ref Arch v2.0 7-pillar model is presented as a sidebar mapping to Octagon dimensions in Ch04
> - DoD ZT Execution Roadmap COA 1 / FY 2027 is cited in Ch14
> - NSA ZIG 5-phase implementation model is cited in Ch13/Ch14
> - DoD DTM-25-003 (ZT PfMO) validates D8 as a security control in Ch04/Ch07

---

**Change PRD-4: FR-22 extension (§4.8 Navigation)**

Add to FR-22 consequences:

> - Every implementation chapter (14, 15, 16) includes a "Coming From a Maturity Model" subsection mapping the reader's likely ZTMM maturity profile to the chapter's morphological pathway
> - Chapters 1, 4, 5, 7, and 18 cite relevant federal reference documents per FR-24

---

### Architecture Changes

**Change ARCH-1: NFR language softening**

OLD:
> NFR-2: Not a compliance framework — does not map to SOC 2, ISO 27001, HIPAA, or PCI DSS controls. Defines an orthogonal analysis framework, not a replacement for NIST SP 800-207 or CISA ZTMM.

NEW:
> NFR-2: Not a compliance framework — does not map to SOC 2, ISO 27001, HIPAA, or PCI DSS controls. Defines an orthogonal analysis framework, not a replacement for NIST SP 800-207 or CISA ZTMM. Appendix E provides a structured crosswalk to CISA ZTMM v2.0. Chapters cite the full federal ZT standards ecosystem (NIST SP 800-207A, DoD ZT Ref Arch, NIST FIPS 203-205, NIST CSF 2.0, NSA ZIG, DoD DTM-25-003, EO 14028) as validation and context, demonstrating measurement instrument vs. verification instrument complementarity.

---

**Change ARCH-2: Layer 5 structure extension**

Add to Layer 5 files list:
```
├── appendix-e-cisa-ztmm-crosswalk.md    # Layer 5: Appendices
```

---

### Epics Changes

#### New Story: Epic 4, Story 4.6 — Appendix E: CISA ZTMM v2.0 Crosswalk

As a federal reader required to use the CISA ZTMM,
I want a systematic mapping from ZTMM pillars and functions to Octagon axioms and dimensions,
So that I can immediately translate my ZTMM maturity assessment into Octagon terms.

**Acceptance Criteria:**

**Given** the ZTMM cross-analysis at `_bmad-output/planning-artifacts/ztmm-cross-analysis-2026-05-26.md`
**When** the dev agent creates a new file `appendix-e-cisa-ztmm-crosswalk.md`
**Then** the appendix must contain a mapping table with columns: ZTMM Pillar, ZTMM Function, Traditional description, Initial description, Advanced description, Optimal description, Octagon Axiom(s), Matrix Dimension(s)
**And** every ZTMM pillar (Identity, Devices, Networks, Applications & Workloads, Data) must appear with all its functions
**And** three cross-cutting capabilities (Visibility & Analytics, Automation & Orchestration, Governance) must have explicit axiom-to-dimension mappings
**And** the appendix must include a "Reading the Crosswalk" section explaining bidirectional use: ZTMM→Octagon ("When the ZTMM says X, the Octagon says Axiom Y") and Octagon→ZTMM ("When Axiom Z is violated, you're at ZTMM Traditional/Initial for capability W")
**And** the appendix must explicitly state: "The ZTMM measures organizational progress. The Octagon verifies architectural integrity. Both are necessary. Neither is sufficient alone."
**And** the appendix must be ~2-3 pages when rendered
**And** the file must carry `**Prerequisites:** Chapter 2 (The Octagon), Chapter 4 (The Morphological Matrix), Chapter 7 (Meta-Patterns), Chapter 13 (Self-Assessment)`
**And** `**Cross-References**` must include `**Builds On:**` to Chapters 2, 4, 7, and 13

---

#### Modified Story ACs: Story 1.1 — Foundation (Chapters 00-01)

Append to existing ACs:

> **And** `00-preface.md` must cite EO 14028 as the policy genesis of the federal ZT ecosystem: "This book exists because Executive Order 14028 (May 2021) mandated Zero Trust Architecture adoption across the U.S. Federal Government. That mandate created the regulatory and standards ecosystem this book navigates."
> **And** `01-the-case-for-zero-trust.md` must include a softened compliance dismissal: after the existing critique of compliance frameworks, add a paragraph contextualizing the ZTMM specifically as a measurement instrument that the Octagon complements rather than replaces
> **And** `01-the-case-for-zero-trust.md` must include a new subsection "Why Not Just Use the ZTMM?" explaining: the ZTMM measures how far you've come; the Octagon tells you whether you've arrived; both are necessary
> **And** `01-the-case-for-zero-trust.md` must cite SP 800-207A as the NIST document specifically written for cloud-native ZTA audiences ("ZTA for Cloud-Native Multi-Location Environments")
> **And** `01-the-case-for-zero-trust.md` must cite EO 14028 §3(c) cloud migration mandate as the policy driver for cloud-native ZTA
> **And** `01-the-case-for-zero-trust.md` must cite the DoD ZT Ref Arch's VPN-less implementation requirement as federal validation that the perimeter model is dead
> **And** the "Accessible Applications" connection must be cited: the ZTMM's Optimal stage for accessible applications (making mission-critical apps available over open public networks) is the regulatory driver that creates the SaaS Blind Spot the project's Archetype D trace addresses

---

#### Modified Story ACs: Story 1.2 — The Octagon (Chapter 02)

Append to existing ACs:

> **And** `02-the-octagon.md` must include a subsection "The NIST Trust Algorithm Formalized" that shows how Axiom 2 (Verifiable Policy) combined with D6 (Policy Distribution) and D7 (Observability Trust) implements the NIST SP 800-207 Trust Algorithm as a deterministic, replayable state machine, bridging the academic/formal (SP 800-207) and the practical (morphological matrix)

---

#### Modified Story ACs: Story 1.4 — Matrix Foundation (Chapter 04)

Append to existing ACs:

> **And** `04-the-morphological-matrix.md` must name the CISA ZTMM explicitly where maturity models are critiqued, changing "Most zero-trust guidance presents a maturity model..." to "Most zero-trust guidance — including CISA's Zero Trust Maturity Model v2.0, the most widely adopted federal framework — presents a maturity model..."
> **And** `04-the-morphological-matrix.md` must include a new subsection "Where Devices Fit in the Matrix" explaining: the ZTMM Devices pillar functions (Policy Enforcement & Compliance Monitoring, Asset & Supply Chain Risk Management, Resource Access, Device Threat Protection) map across D1 (hardware trust anchor), D4 (device attestation), and D7 (endpoint telemetry trust); devices are a cross-dimensional concern, not a standalone dimension
> **And** `04-the-morphological-matrix.md` must include a sidebar "DoD Zero Trust Pillar Mapping" showing how each DoD 7-pillar (User, Device, Network/Environment, Application & Workload, Data, Visibility & Analytics, Automation & Orchestration) maps to primary Octagon dimensions and axioms
> **And** `04-the-morphological-matrix.md` must include a sidebar "CSF Profiles and Morphological Dimensions" showing how the NIST CSF 2.0 Profile concept is the governance-level equivalent of the project's dimensional self-assessment, and how CSF Tiers (Partial, Risk Informed, Repeatable, Adaptive) map approximately to the Low-Maturity → High-Maturity cluster progression

---

#### Modified Story ACs: Story 1.5 — Dimensions Deep Dive (Chapter 05)

Append to existing ACs:

> **And** `05-dimensions-trust-to-attestation.md` must include a comparison table mapping NIST SP 800-207 deployment variations (Device-Agent/Gateway, Enclave Gateway, Resource Portal, Application Sandbox) to D3 (Enforcement Layer) values (Network, Service Mesh, Gateway, Data, Silicon, Bilateral), showing for each NIST variation which D3 values satisfy it
> **And** `05-dimensions-trust-to-attestation.md` must add SP 800-207A citations wherever service mesh or API gateway enforcement is discussed as a D3 value, establishing the pattern as formally NIST-validated
> **And** `05-dimensions-trust-to-attestation.md` must add a DoD data-centric security citation to the D3=Data (Cryptographic) discussion, where data carries its own policy envelope, as the implementation of the DoD's "protect the data, not the network" principle

---

#### Modified Story ACs: Story 1.6 — Meta-Patterns (Chapter 07)

Append to existing ACs:

> **And** `07-meta-patterns.md` must include a "Data Lifecycle" subsection reframing ZTMM Data pillar functions in Octagon terms: Data Inventory Management → precondition for Axiom 3 (can't mediate access to unknown data), Data Categorization → input to Axiom 5 (authority vectors calibrated to data sensitivity), Data Availability → constraint on Axiom 6 (BFT must maintain availability under partition)
> **And** `07-meta-patterns.md` must include a "Governance as a Cross-Dimensional Concern" subsection mapping the ZTMM's Governance capability (Traditional: ad hoc policies/manual processes → Optimal: fully automated enterprise-wide policies with continuous enforcement) to D8 (Organizational Posture) and Axiom 2
> **And** `07-meta-patterns.md` must include the structured cross-cutting capability mapping table: Visibility & Analytics → Axiom 7 + D7/D4, Automation & Orchestration → Axiom 4 + Axiom 5 + D5/D6, Governance → Axiom 2 + D8, with bidirectional explanation text
> **And** `07-meta-patterns.md` must include a CSF 2.0 Govern subsection mapping Govern subcategories to D8 values: GV.OC (Organizational Context) → Siloed→Fused transition, GV.RM (Risk Management Strategy) → Economic-Contract, GV.RR (Roles/Responsibilities) → Presumptively Wrong + Dojo, GV.PO (Policies/Processes) → Axiom 2 enforcement across D8
> **And** `07-meta-patterns.md` must add a DTM-25-003 citation validating D8 as a first-class security control: "The DoD determined that ZT execution required a dedicated Portfolio Management Office and Chief ZT Officer — governance structures specifically created because the existing organizational model couldn't execute ZT. This validates D8 as an architectural dimension."
> **And** `07-meta-patterns.md` must add DTM-25-003 citation to the D8=Economic-Contract discussion, showing the DoD's ZT PfMO funding prioritization authority validates the model
> **And** `07-meta-patterns.md` must add a note about multi-location federation for D6 (Policy Distribution): when the event stream itself is partitioned across geographic regions, the PDP/PEP model must account for CAP theorem constraints — SP 800-207A provides guidance for federated PDP deployments
> **And** `07-meta-patterns.md` must add a DoD centralized orchestration citation to D6=Event-Streamed: the DoD's requirement for centralized policy orchestration with distributed enforcement is the architectural driver for Event-Streamed policy, validating it is not an academic exercise
> **And** `07-meta-patterns.md` must add the NSA Target/Advanced phase boundary as validation of covariance clusters: "The NSA's decision to separate Target and Advanced levels, with a distinct implementation phase boundary, validates the project's finding that the low-maturity and high-maturity clusters are qualitatively different states, separated by a phased transition, not a smooth gradient"
> **And** `07-meta-patterns.md` must include a nuanced discussion of the DoD's hybrid COA approach: "The DoD's hybrid COA approach (COA 1 + COA 2 combined) works because of scale resources ($10B+) that can absorb the inefficiency of non-covariant dimension upgrades. Organizations with smaller budgets face steeper covariance penalties and should follow the clustered upgrade paths in Part IV"
> **And** `07-meta-patterns.md` must include a note on PQC signature size impact: ML-DSA signatures (2,427-4,627 bytes vs. ECDSA's 64 bytes) have measurable operational consequences for event-stream bandwidth, attestation report size, and SPIFFE/SPIRE certificate bundles

---

#### Modified Story ACs: Story 2.3 — Archetype C Attack Trace (Chapter 10)

Append to existing ACs:

> **And** `10-archetype-c-startup.md` must cite NIST CSF 2.0's supply chain risk management (SCRM) emphasis as the regulatory framework that elevates supply chain injection to a first-class zero-trust concern
> **And** `10-archetype-c-startup.md` must cite EO 14028 §4 software supply chain security mandate (including SBOM requirements), establishing that the CI/CD attestation patterns in Archetype C are the architectural implementation of what the EO requires at the procurement level

---

#### Modified Story ACs: Story 3.1 — Self-Assessment (Chapter 13)

Append to existing ACs:

> **And** `13-self-assessment.md` must include a ZTMM maturity mapping table after the 12 diagnostic questions, formatted as:

| Your Self-Assessment Result | Likely ZTMM Maturity Profile |
|----------------------------|------------------------------|
| Mostly B answers | Identity: Advanced, Devices: Advanced, Networks: Initial/Advanced, Apps: Initial/Advanced, Data: Initial |
| Mostly C answers | Identity: Initial/Advanced, Devices: Initial, Networks: Initial, Apps: Advanced, Data: Traditional |
| Mostly D answers | Identity: Advanced, Devices: Traditional, Networks: Traditional, Apps: Initial, Data: Traditional |

> **And** the table must include a note explaining pillar-average masking as a contributor to the confidence/reality gap
> **And** `13-self-assessment.md` must include an "NSA's Phased Model" sidebar comparing NSA ZIG's 5 implementation phases (Discovery, Phase One/Identity-Devices-Apps, Phase Two/Network-Data, Phase Three-Four/Advanced) to the project's archetype pathways, with a timeline mapping table

---

#### Modified Story ACs: Story 3.2 — Enterprise Turnaround (Chapter 14)

Append to existing ACs:

> **And** `14-enterprise-turnaround.md` must include a "Coming From a Maturity Model" subsection: "If you've done a CISA ZTMM assessment: Your [Identity/Devices/Networks/Data] pillar is likely at [level]. This maps to the following morphological matrix configuration: [D1=X, D2=Y, ...]. The implementation pathway below addresses the integration gaps your ZTMM assessment doesn't measure — specifically, the seams between [high pillar] and [low pillar] that create the lateral movement surface."
> **And** `14-enterprise-turnaround.md` must include a sidebar "The DoD's COA 1: The Military Equivalent" establishing: "If the DoD, with its $10B+ budget, is struggling with the same architectural transition you're attempting, that's not discouraging — it's validating. The problem is hard. Here's the architectural approach."
> **And** `14-enterprise-turnaround.md` must reference the DoD's FY 2027 full ZT framework implementation target as validating the 24-month timeline
> **And** `14-enterprise-turnaround.md` must include an NSA phase comparison table: Discovery → Ch13 Self-Assessment, Phase One (Identity/Devices/Apps) → Months 1-8, Phase Two (Network/Data) → Months 8-16, Phase Three-Four (Advanced) → Months 16-24

---

#### Modified Story ACs: Story 3.3 — Velocity Defender (Chapter 15)

Append to existing ACs:

> **And** `15-velocity-defender.md` must include a "Coming From a Maturity Model" subsection with ZTMM-to-matrix mapping format (same structure as Chapter 14)

---

#### Modified Story ACs: Story 3.4 — Scaling Pat (Chapter 16)

Append to existing ACs:

> **And** `16-scaling-pat.md` must include a "Coming From a Maturity Model" subsection with ZTMM-to-matrix mapping format (same structure as Chapter 14)

---

#### Modified Story ACs: Story 3.6 — Decision Matrix and Conclusion (Chapter 18)

Append to existing ACs:

> **And** `18-decision-matrix-and-conclusion.md` must undergo a major PQC section expansion with:
> - **Standard nomenclature**: Replace "Dilithium" with ML-DSA (FIPS 204) and "SPHINCS+" with SLH-DSA (FIPS 205). Add full FIPS 203/204/205 citations
> - **Key establishment**: Add a subsection "Key Establishment (FIPS 203 — ML-KEM)" explaining that every encrypted channel (PDP→PEP policy sync, PEP→PEP data channel, attestation report transport, event stream) must transition to ML-KEM for key establishment. Note: ML-KEM-768 recommended for general use, ML-KEM-1024 for high-security environments (Archetype A)
> - **Signature size operational impact table**: Quantify bandwidth, latency, and storage implications per architectural component:

| Component | ECDSA P-256 (64 bytes) | ML-DSA-65 (3,465 bytes) | Impact |
|-----------|------------------------|--------------------------|--------|
| Event stream (10K events/sec) | 640 KB/s | ~35 MB/s | 50× bandwidth increase |
| Attestation report (single) | 1 KB | ~5 KB | 5× request size increase |
| SPIFFE/SPIRE certificate | ~1 KB | ~5 KB | 5× certificate bundle size |

> - **Cross-family diversity**: Update the dual-stack recommendation to specify: for Archetype A (high-security): ML-KEM-1024 + SLH-DSA-SHAKE-256s for signatures; for general use: ML-KEM-768 + ML-DSA-65 with SLH-DSA as a fallback for critical path signing (root CA, silicon attestation anchors). Explain that dual-stack within a single PQC family (all lattice-based) still has single-family risk
> - **PQC migration timeline overlay**: Add a table showing PQC milestones intersecting implementation phases per archetype. For each archetype's timeline, identify which cryptographic transitions should happen in parallel
> - **Three Futures section**: Cite relevant FIPS, EO 14028, and DoD documents when discussing cryptographic futures

---

#### Modified Story ACs: Story 4.1 — Appendix A (Quantum/AI Stress-Tests)

Append to existing ACs:

> **And** `appendix-a-quantum-ai-threats.md` must use FIPS-standard PQC nomenclature (ML-KEM, ML-DSA, SLH-DSA) and cite FIPS 203, 204, 205 where PQC algorithms are discussed

---

#### Modified Story ACs: Story 4.2 — Appendix B (Validation Checklist)

Append to existing ACs:

> **And** `appendix-b-validation-checklist.md` must include a "Complementary Frameworks" note at the end: "This checklist validates architectural integrity against the Octagon. For organizational maturity assessment, use CISA ZTMM v2.0 (see Appendix E for crosswalk). For governance assessment, use NIST CSF 2.0 Govern function (see §7.X). For implementation planning, cross-reference NSA ZIG Primer (see §13.X)."

---

#### Modified Story ACs: Story 4.3 — Appendix C (Glossary)

Append to existing ACs:

> **And** `appendix-c-glossary.md` must include new entries for: Executive Order 14028 (EO 14028), FIPS 203 (ML-KEM), FIPS 204 (ML-DSA), FIPS 205 (SLH-DSA), ML-KEM, ML-DSA, SLH-DSA, NIST SP 800-207A, NIST CSF 2.0 Govern, DoD ZT PfMO, ICAM, SBOM

---

#### Modified Story ACs: Story 4.5 — Global Consistency Validation

Append to existing ACs:

> **And** Appendix E entries must be validated against all chapter content — every ZTMM pillar/function referenced in Appendix E must have corresponding treatment in the referenced chapters
> **And** ZTMM cross-reference subsections must exist in Chapters 14, 15, and 16
> **And** the Chapter 13 ZTMM maturity mapping table must be cross-checked against actual ZTMM v2.0 function definitions for accuracy
> **And** NFR-2's amended language must be verified as consistent with Appendix E's content and the project's "orthogonal, not competing" claim
> **And** all PQC references across all chapters must use FIPS-standard nomenclature (ML-KEM, ML-DSA, SLH-DSA) — no legacy "Dilithium" or "SPHINCS+" references
> **And** every cited reference document (EO 14028, SP 800-207A, FIPS 203-205, CSWP.29/CSF 2.0, DoD ZT Ref Arch, DoD Execution Roadmap, NSA ZIG, DTM-25-003) must appear at least once in the document body where the citation context makes sense (not just in the glossary)
> **And** cross-reference links from all new sidebars and subsections must resolve correctly

---

**Change EPIC-1: stepsCompleted frontmatter**

Update `epics.md` to add Story 4.6 to the Epic 4 story list and increment total story count from 26 to 27.

## 5. Implementation Handoff

**Scope classification: Moderate** — Touches PRD (4 changes), Architecture (2 changes), Epics (1 new story, 15 modified story ACs), and 19 files (18 chapter modifications + 1 new appendix). All changes are additive or softening. No structural reorganization required. No implementation rework needed (implementation hasn't started).

### Handoff Recipients and Responsibilities

| Role | Responsibility | Artifacts |
|------|---------------|-----------|
| **`bmad-prd update`** | Amend PRD NFR-2, FR-22, add FR-23, FR-24 | PRD §4.7, §4.8, §5 |
| **`bmad-create-architecture update`** | Soften NFR language, add Appendix E to Layer 5 | Architecture NFR section, Layer 5 structure |
| **Direct edit** | Add Story 4.6 to Epics, modify 15 existing story ACs | `epics.md` |
| **`bmad-sprint-planning`** | Generate sprint plan with all changes incorporated | `sprint-status.yaml` |
| **`bmad-dev-story`** | Implement all chapter changes as part of existing story execution | 19 markdown files in `docs/` |

### Implementation Sequence

1. **PRD update** (`bmad-prd update`) — Foundation for all downstream changes
2. **Architecture update** (`bmad-create-architecture`) — Sync NFR language, register Appendix E
3. **Epics update** — Add Story 4.6, extend 15 existing ACs
4. **Sprint planning** (`bmad-sprint-planning`) — Generate sprint plan with all changes incorporated
5. **Story execution** (`bmad-dev-story`) — Implement stories in sequence

### Success Criteria

- A ZTMM-familiar federal reader can open Appendix E, find their pillar and function, and immediately see the corresponding Octagon axiom and dimension
- A reader familiar with the DoD ZT Ref Arch can find the 7-pillar mapping sidebar in Ch04 and understand how DoD pillars relate to Octagon dimensions
- Post-quantum cryptography is discussed using FIPS-standard nomenclature (ML-KEM, ML-DSA, SLH-DSA) with operational impact quantified across architectural components
- EO 14028 is cited as the policy genesis of the ZT ecosystem the book addresses
- Chapters 14-16 each include a "Coming From a Maturity Model" subsection that translates ZTMM assessment results into morphological matrix configurations
- NFR-2 no longer claims "does not map to CISA ZTMM" — it now claims orthogonal complementarity with a structured crosswalk and full federal ecosystem references
