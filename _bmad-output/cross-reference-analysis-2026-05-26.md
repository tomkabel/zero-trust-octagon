# Cross-Reference Analysis: Markdown Reference Library → The Octagon Project

**Date:** 2026-05-26  
**Scope:** 11 markdown reference documents assessed for integration potential against 23 project chapters + planning artifacts  
**Status:** Complete analysis with prioritized recommendations

---

## Part I — Reference Library Summary

The `./markdown` directory contains 11 authoritative documents spanning the zero-trust ecosystem. They fall into five functional categories:

| Category | Documents | Role |
|----------|-----------|------|
| **Foundational ZTA Theory** | NIST SP 800-207, SP 800-207A | Define what zero-trust architecture *is* |
| **Governance Framework** | NIST CSWP.29 (CSF 2.0) | Define how cybersecurity is *managed* |
| **Post-Quantum Cryptography** | FIPS 203, 204, 205 | Define the cryptographic *future* |
| **Implementation & Operations** | DoD ZT Ref Arch v2.0, DoD Execution Roadmap v1.1, NSA ZIG Primer | Define how ZT gets *built and deployed* |
| **Policy & Governance Mandate** | EO 14028, DoD DTM-25-003 | Define *why* ZT is mandatory |

The project currently references NIST SP 800-207 and the CISA ZTMM heavily (the latter is a PDF in `./pdfs`, not an analyzed markdown file). All other documents are either unreferenced or referenced only in passing through the research documents buried in `_bmad-output/planning-artifacts/research/`.

---

## Part II — Per-Document Gap Analysis

### 2.1 NIST SP 800-207 — Zero Trust Architecture (August 2020)

**Current project engagement:** High. Cited in Ch01, Ch02, Ch04, Appendix C. It's the conceptual foundation.

**Gaps identified:**

**Gap 1: The Trust Algorithm is never decomposed.** SP 800-207 §3.3 defines the Trust Algorithm as the core decision function — a formal evaluation that takes subject identity data, subject attributes, enterprise policy, external threat intelligence, and resource sensitivity as inputs, producing an access verdict. The project's Ch02 defines Axiom 2 (Verifiable Policy) in similar terms but never names or analyzes the NIST Trust Algorithm. This is a missed credibility opportunity — the project could position the Octagon's policy model as a formalization of what SP 800-207 describes abstractly.

**Recommendation:** Add a subsection to Ch04 ("The Trust Algorithm Formalized") that shows how Axiom 2 + D6 + D7 together implement the NIST Trust Algorithm as a deterministic, replayable state machine. This bridges the academic/formal (SP 800-207) and the practical (morphological matrix).

**Gap 2: Deployment variations not mapped.** SP 800-207 §2.2 defines four deployment variations: device-agent/gateway, enclave gateway, resource portal, and application sandbox. The project's D3 (Enforcement Layer) has 6 values that overlap but aren't explicitly mapped. The project invents its own taxonomy (Network, Service Mesh, Gateway, Data, Silicon, Bilateral) without showing how it relates to the NIST taxonomy.

**Recommendation:** Add a comparison table to Ch05 (Dimensions 1-4) mapping NIST deployment variations to D3 values. For each NIST variation, show which D3 values satisfy it and which would need augmentation.

**Gap 3: Migration planning unacknowledged.** SP 800-207 §5 provides a detailed migration approach (architectural requirements, deployment-level requirements, phased transition). The project's Part IV provides its own migration approach (decision trees per archetype) without ever referencing or contrasting with the NIST approach. This makes the project appear disconnected from the canonical migration guidance.

**Recommendation:** Add a sidebar to Chapter 13 or 14 titled "How This Relates to NIST's Migration Approach" that acknowledges SP 800-207 §5, identifies where the NIST approach is general and the project provides specificity (archetype-specific paths, cost floors, gate checks), and positions the project as the "how" to SP 800-207's "what."

---

### 2.2 NIST SP 800-207A — ZTA for Cloud-Native Multi-Location Environments (September 2023)

**Current project engagement:** Zero. This document is never cited despite the project's explicit cloud-native audience.

**Why this matters critically:** The project's Preface states readers need "working knowledge of cloud-native infrastructure (containers, orchestration, service mesh)." SP 800-207A is literally the NIST document written for exactly this audience — ZTA access control for cloud-native applications in multi-location environments. Not citing it is a significant credibility gap.

**Gaps identified:**

**Gap 4: Multi-location federation unaddressed.** SP 800-207A addresses the architectural challenges of running PDP/PEP across multiple clouds, regions, and data centers — CAP theorem constraints, policy synchronization latency, partition tolerance, and trust federation. The project's D6 (Policy Distribution) discusses Event-Streamed global propagation but never addresses what happens when the event stream itself is partitioned across geographic regions.

**Recommendation:** Add a subsection to Ch05 or Ch06 ("Multi-Location Federation") that acknowledges the SP 800-207A model, explains how the morphological matrix's D6 (Event-Streamed) combined with D7 (Air-Gapped Observability) addresses multi-location challenges, and honestly identifies where the project's model has limitations (e.g., the assumption of a unified event stream backbone may not hold in air-gapped or disconnected environments).

**Gap 5: Cloud-native PEP patterns not validated.** SP 800-207A provides formal architecture for using service mesh sidecars and API gateways as PEPs — exactly the patterns the project's D3 values describe. The project could cite SP 800-207A as formal NIST validation of its architectural recommendations, strengthening credibility with federal readers.

**Recommendation:** Add SP 800-207A citations to the D3 discussion in Ch05 wherever service mesh or API gateway enforcement is discussed. Add SP 800-207A to the reference list in Ch01.

**Gap 6: Distributed PDP design not addressed.** SP 800-207A discusses distributing the PDP itself across locations — the decision engine runs in multiple regions. The project's model assumes a unified or logically centralized PDP with distributed enforcement. For large-scale multi-region deployments, this is a practical concern the project should acknowledge.

**Recommendation:** Add a note to D6 (Policy Distribution) in Ch06 acknowledging that PDP distribution is an architectural choice orthogonal to policy distribution, and that SP 800-207A provides guidance for federated PDP deployments.

---

### 2.3 NIST FIPS 203, 204, 205 — Post-Quantum Cryptography Standards (August 2024)

**Current project engagement:** Low. Chapter 18 mentions PQC with references to "Dilithium" and "SPHINCS+" but uses pre-standard nomenclature, lacks algorithmic specificity, and doesn't address operational implications.

**Gaps identified:**

**Gap 7: Algorithm nomenclature is outdated.** The project references "Dilithium" and "SPHINCS+" — the submission names from the NIST PQC competition. The FIPS standards use ML-DSA (FIPS 204) and SLH-DSA (FIPS 205). Federal and regulated-industry readers will expect the standard nomenclature. Using pre-standard names signals the analysis was done before the standards were published.

**Recommendation:** Update all PQC references in Ch18 and Appendix C to use FIPS-standard nomenclature: ML-KEM (FIPS 203), ML-DSA (FIPS 204), SLH-DSA (FIPS 205). Add full FIPS citations.

**Gap 8: Key-encapsulation is never addressed.** The project discusses "event-stream signing" and "certificate chains" but never addresses how symmetric session keys are established. FIPS 203 (ML-KEM) is the standard mechanism for post-quantum key establishment. If the key exchange is quantum-vulnerable, Axiom 7's cryptographic provenance chain collapses at the transport layer — even with PQC signatures, the session key could be recovered by a CRQC.

**Recommendation:** Add a subsection to the Ch18 PQC section: "Key Establishment (FIPS 203 — ML-KEM)" explaining that every encrypted channel in a zero-trust architecture (PDP→PEP policy sync, PEP→PEP data channel, attestation report transport, event stream) must transition to ML-KEM for key establishment. Note that ML-KEM-768 is the recommended security level for general use and ML-KEM-1024 for high-security environments (Archetype A).

**Gap 9: Signature size operational impact not addressed.** ML-DSA signatures are 2,427 bytes (ML-DSA-44), 3,465 bytes (ML-DSA-65), or 4,627 bytes (ML-DSA-87). ECDSA P-256 signatures are 64 bytes. This ~50× size increase has measurable operational consequences for the project's architecture:

- Event-streamed policy backbone: every policy update carries signatures. At 10,000 events/second, ECDSA adds 640 KB/s; ML-DSA adds 24-46 MB/s.
- Attestation report enveloping: every bilateral request includes a hardware-signed attestation snapshot. The size increase affects request latency and bandwidth.
- SPIFFE/SPIRE certificate bundles: workload identity certificates increase from ~1 KB to ~5 KB each.

**Recommendation:** Add an "Operational Impact of PQC" table to Ch18 quantifying bandwidth, latency, and storage implications for each architectural component (event stream, attestation reports, workload certificates, PDP policy store). This demonstrates practical awareness beyond theoretical PQC awareness.

**Gap 10: Cross-family diversity not recommended.** The project's "dual-stack" recommendation (conventional + PQC in parallel) is correct but incomplete. Dual-stack within a single PQC family (all lattice-based: ML-KEM + ML-DSA) still has single-family risk — a mathematical breakthrough in lattice problems compromises everything. Cross-family diversity (lattice-based KEM + hash-based signatures: ML-KEM + SLH-DSA) provides defense-in-depth.

**Recommendation:** Update the dual-stack recommendation to specify cross-family diversity. For high-security environments (Archetype A): ML-KEM-1024 + SLH-DSA-SHAKE-256s for signatures. For general use: ML-KEM-768 + ML-DSA-65 with SLH-DSA as a fallback for critical path signing (root CA, silicon attestation anchors).

**Gap 11: Migration timeline not linked to implementation phases.** The project's implementation chapters give specific timeframes (24-month, 12-month, 6-month). PQC migration has its own timeline: FIPS 203-205 were published August 2024; CNSA 2.0 mandates PQC by 2030 for National Security Systems; commercial adoption will follow. An organization on the 24-month Fortune 500 path (completing ~2028) will be mid-PQC-migration. The implementation chapters should acknowledge this.

**Recommendation:** Add a "PQC Migration Overlay" table to Ch18 showing how PQC milestones intersect with implementation phases. For each archetype's timeline, identify which cryptographic transitions should happen in parallel.

---

### 2.4 NIST CSWP.29 — Cybersecurity Framework (CSF) 2.0 (February 2024)

**Current project engagement:** None. The project doesn't mention the CSF at all.

**Gaps identified:**

**Gap 12: The Govern function validates the governance gap.** CSF 2.0's major innovation is the new "Govern" function — a recognition that cybersecurity governance (organizational context, risk management strategy, roles, policies, oversight) is a foundational capability, not an afterthought. The approved sprint change proposal identifies a governance gap in the project. CSF 2.0 provides the authoritative framework for closing it.

**Recommendation:** In the Ch07 governance subsection (planned in sprint change), cite CSF 2.0 Govern as the framework that elevated governance to a first-class cybersecurity function. Map CSF Govern subcategories to D8 values:

| CSF Govern Subcategory | Octagon D8 Value |
|------------------------|------------------|
| GV.OC (Organizational Context) | Siloed → Fused transition |
| GV.RM (Risk Management Strategy) | Economic-Contract |
| GV.RR (Roles, Responsibilities, Authorities) | Presumptively Wrong + Dojo |
| GV.PO (Policies, Processes, Procedures) | Axiom 2 enforcement across D8 |

**Gap 13: Profiles and Tiers validate the morphological approach.** CSF 2.0's concept of "Profiles" (tailoring the framework to specific organizational contexts) and "Tiers" (Partial, Risk Informed, Repeatable, Adaptive) structurally mirror the project's rejection of one-size-fits-all maturity paths. This provides formal framework validation.

**Recommendation:** Add a sidebar to Ch04 ("CSF Profiles and Morphological Dimensions") that shows how the CSF's Profile concept is the governance-level equivalent of the project's dimensional self-assessment, and how CSF Tiers map approximately to the Low-Maturity → High-Maturity cluster progression.

**Gap 14: Supply chain risk management (SCRM) emphasis validates Archetype C.** CSF 2.0 elevates supply chain risk as a major concern. The project's Archetype C (supply chain injection) and its treatment of software supply chain in the CI/CD attack trace are validated by this — CSF 2.0 should be cited as the regulatory framework that makes supply chain a first-class zero-trust concern.

**Recommendation:** Add a CSF 2.0 SCRM citation to Ch10 (Archetype C attack trace) establishing that supply chain injection is not a niche concern but a framework-identified primary risk.

---

### 2.5 DoD Zero Trust Reference Architecture v2.0 (July 2022)

**Current project engagement:** Minimal. Referenced indirectly through the technical research document but never cited in the project chapters themselves.

**Gaps identified:**

**Gap 15: DoD 7-pillar model provides completeness validation.** The DoD uses 7 pillars (User, Device, Network/Environment, Application & Workload, Data, Visibility & Analytics, Automation & Orchestration) compared to CISA's 5. The project's 9 dimensions are orthogonal to both, but mapping the DoD pillars to project dimensions would demonstrate that the morphological matrix captures everything both major federal frameworks cover.

**Recommendation:** Add a sidebar to Ch04 ("DoD Zero Trust Pillar Mapping") showing how each DoD pillar maps to project dimensions:

| DoD Pillar | Primary Octagon Dimension(s) | Relevant Axioms |
|------------|------------------------------|-----------------|
| User | D2 (Identity Model) | 1, 4, 5 |
| Device | D1 (Trust Anchor), D4 (Attestation) | 7, 4 |
| Network/Environment | D3 (Enforcement), D6 (Policy Distribution) | 3, 8 |
| Application & Workload | D4 (Attestation), D3 (Enforcement) | 4, 5, 8 |
| Data | D3 (Data-level enforcement) | 3, 7 |
| Visibility & Analytics | D7 (Observability Trust) | 7 |
| Automation & Orchestration | D5 (Violation Response), D6 (Policy Distribution) | 4, 5, 6 |

**Gap 16: Centralized orchestration validates Event-Streamed policy.** The DoD architecture explicitly calls for centralized policy orchestration with distributed enforcement — exactly the PDP/PEP model the project describes. The DoD's "centralized orchestration" requirement is the architectural driver for the project's D6=Event-Streamed value. Citing this demonstrates that the project's most demanding architectural pattern (event-streamed policy) is not an academic exercise — the DoD requires it.

**Recommendation:** Add DoD centralized orchestration citation to the D6 discussion in Ch06, and to the Trickle-Truth dependency analysis (D5↔D6) in Ch07.

**Gap 17: VPN-less implementation validates the perimeter thesis.** The DoD architecture explicitly calls for moving away from VPN-based access in favor of identity- and device-aware access. This is the federal validation of the project's thesis that the perimeter is dead (Ch01) and that Archetype D's IAP-based approach is directionally correct.

**Recommendation:** Add DoD VPN-less citation to Ch01 (§"The Perimeter Is Dead") as federal authority validating the architectural direction.

**Gap 18: Data-centric security aligns with Axiom 3 (Data enforcement).** The DoD architecture emphasizes data-centric security (tagging, labeling, DRM, encryption) as the primary focus — "protect the data, not the network." The project's Axiom 3 value "Data (Cryptographic)" — where data carries its own policy envelope — is the implementation of this principle. The DoD provides the doctrinal validation.

**Recommendation:** Add DoD data-centric security citation to the Axiom 3 discussion in Ch02 and the D3=Data discussion in Ch05.

---

### 2.6 DoD Zero Trust Execution Roadmap v1.1 (November 2024)

**Current project engagement:** None.

**Gaps identified:**

**Gap 19: COA 1 "Uplifting Legacy" parallels Archetype B.** The DoD's primary course of action (COA 1) is uplifting legacy systems to meet ZT requirements — essentially the military version of the project's Archetype B (Fortune 500) problem. The DoD is spending billions on exactly the transformation the project's Ch14 (Enterprise Turnaround) addresses.

**Recommendation:** Add a sidebar to Ch14 ("The DoD's COA 1: The Military Equivalent") that establishes the connection: "If the DoD, with its $10B+ budget, is struggling with the same architectural transition you're attempting, that's not discouraging — it's validating. The problem is hard. Here's the architectural approach."

**Gap 20: FY 2027 target aligns with 24-month path.** The DoD targets full ZT framework implementation by FY 2027. The project's 24-month Fortune 500 path maps directly to this timeline. A Fortune 500 starting their transformation today completes in approximately mid-2028 — one year after the DoD target, which is reasonable for a commercial organization without the DoD's authority and resources.

**Recommendation:** Add FY 2027 timeline reference to Ch14's timeline discussion and to the decision matrix in Ch18. This shows the project's timeline is grounded in DoD's own assessment of what's achievable.

**Gap 21: Hybrid COA approach partially challenges covariance thesis.** The DoD's roadmap explicitly embraces hybrid approaches (COA 1 + COA 2 combined). The project's Ch04 and Ch07 argue that "mix and match produces diminishing returns" due to dimensional covariance. The DoD's approach seems to contradict this — but the DoD has massive resources to compensate for the inefficiency.

**Recommendation:** Add a nuanced discussion to Ch07 acknowledging this: "The DoD's hybrid COA approach works because of scale resources ($10B+) that can absorb the inefficiency of non-covariant dimension upgrades. Organizations with smaller budgets face steeper covariance penalties and should follow the clustered upgrade paths in Part IV."

---

### 2.7 DoD DTM-25-003 — Implementing the DoD Zero Trust Strategy (July 2025)

**Current project engagement:** None.

**Gaps identified:**

**Gap 22: ZT PfMO validates governance as security control.** DTM-25-003 establishes the Zero Trust Portfolio Management Office (ZT PfMO) and the position of Chief ZT Officer — formal governance structures for ZT execution. The project's thesis that D8 (Organizational Posture) is a security control that costs zero dollars and produces outsized impact is validated by the world's largest bureaucracy creating exactly this governance structure.

**Recommendation:** Add DTM-25-003 citation to the D8 discussion in Ch04 and the governance subsection in Ch07. Quote: "The DoD determined that ZT execution required a dedicated Portfolio Management Office and Chief ZT Officer — governance structures specifically created because the existing organizational model couldn't execute ZT. This validates D8 as a first-class architectural dimension."

**Gap 23: Funding prioritization mechanism validates economic model.** DTM-25-003 grants the ZT PfMO authority over resource and funding prioritization for ZT efforts. This validates the project's "Economic-Contract" value for D8 — the idea that security investment should be prioritized by architectural need, not departmental budget politics.

**Recommendation:** Add this citation to the D8=Economic-Contract discussion in Ch04/D8 deep-dive.

---

### 2.8 NSA Zero Trust Implementation Guideline Primer (January 2026)

**Current project engagement:** None.

**Gaps identified:**

**Gap 24: 5-phase model parallels project's phased implementation.** The NSA organizes ZT implementation into 5 phases: Discovery, Phase One (Target-Level for Identity/Devices/Apps), Phase Two (Target-Level for Network/Data), Phase Three-Four (Advanced). The project's 24/12/6-month pathways follow a similar phased logic but organized by archetype rather than by pillar.

**Recommendation:** Add a sidebar to Chapter 13 or 14 ("NSA's Phased Model: How It Compares") showing how NSA phases map to the project's implementation timelines:

| NSA Phase | Scope | Project Archetype Pathway |
|-----------|-------|--------------------------|
| Discovery | Inventory, gap analysis | Ch13 Self-Assessment |
| Phase One | Target-Level: Identity, Devices, Apps | Months 1-8 (Enterprise) / Months 1-4 (Startup) |
| Phase Two | Target-Level: Network, Data | Months 8-16 / Months 4-8 |
| Phase Three-Four | Advanced-Level | Months 16-24 / Months 8-12 |

**Gap 25: 152 ZT Activities provide detailed breakdown.** The NSA organizes 152 discrete ZT Activities from the DoD Strategy. The project's dimension values are an abstraction layer above this — each dimension value subsumes multiple NSA activities. Acknowledging this relationship positions the project as the architectural synthesis, not as a replacement for detailed implementation guidance.

**Recommendation:** Add a note to Ch04 or the implementation chapters: "The NSA's 152 ZT Activities provide the detailed task-level breakdown for each dimension value in the morphological matrix. This book provides the architectural synthesis. The NSA provides the implementation checklist. Use both."

**Gap 26: Target vs Advanced validates covariance clusters.** The NSA distinguishes Target-Level (42 capabilities, 91 activities) from Advanced-Level. This maps directly to the project's Low-Maturity vs High-Maturity clusters: NSA "Target" ≈ improved Low-Maturity cluster; NSA "Advanced" ≈ High-Maturity cluster. The NSA's decision to split them validates the project's insight that there's a qualitative leap between the two, not a smooth gradient.

**Recommendation:** Add this to the Ch07 covariance cluster discussion: "The NSA's decision to separate Target and Advanced levels, with a distinct implementation phase boundary, validates the project's finding that the low-maturity and high-maturity clusters are qualitatively different states, separated by a phased transition, not a smooth gradient."

---

### 2.9 Executive Order 14028 — Improving the Nation's Cybersecurity (May 2021)

**Current project engagement:** Implicit only. The project discusses the ZT ecosystem but never cites the Executive Order that created it.

**Gaps identified:**

**Gap 27: EO 14028 is the policy genesis of everything the project addresses.** Section 3 of EO 14028 explicitly mandates Zero Trust Architecture adoption for federal agencies. Every subsequent document — SP 800-207, ZTMM, DoD ZT Ref Arch, NSA ZIG — traces its mandate to this Executive Order. The project addresses an ecosystem created by EO 14028 without ever naming the document that created it.

**Recommendation:** Add EO 14028 citation to the Preface: "This book exists because Executive Order 14028 (May 2021) mandated Zero Trust Architecture adoption across the U.S. Federal Government. That mandate created the regulatory and standards ecosystem this book navigates." Add to Ch01 as a footnote.

**Gap 28: SBOM and supply chain provisions validate Archetype C.** EO 14028 §4 mandates software supply chain security, including SBOM requirements. The project's Archetype C (supply chain injection) and CI/CD attestation patterns are the architectural implementation of what the EO requires at the procurement level.

**Recommendation:** Add EO 14028 §4 citation to Ch10 (Archetype C attack trace) and the Ch04 attestation discussion.

**Gap 29: Cloud migration mandate validates cloud-native focus.** EO 14028 §3(c) mandates accelerating movement to secure cloud services. This is the policy driver for the project's cloud-native focus — the project isn't arbitrarily choosing cloud-native; it's addressing the architecture the federal government is required to adopt.

**Recommendation:** Add EO 14028 §3(c) citation to Ch01's discussion of why cloud-native matters.

---

## Part III — What Should Be Added (Prioritized)

### Priority 1 — Critical Credibility Gaps

These additions address the absence of documents that the project's target audience (federal, defense, regulated industry) will expect to see cited:

| # | Addition | Target File(s) | Documents Used |
|---|----------|---------------|----------------|
| A1 | EO 14028 as policy genesis | `00-preface.md`, `01-the-case-for-zero-trust.md` | DCPD-202100401 |
| A2 | NIST SP 800-207A for cloud-native audience | `01-the-case-for-zero-trust.md`, `05-dimensions-D1-D3.md` | SP 800-207A |
| A3 | DoD 7-pillar mapping sidebar | `04-the-morphological-matrix.md` | DoD-ZTArch |
| A4 | FIPS 203/204/205 full PQC section expansion | `18-decision-matrix-and-conclusion.md` | FIPS 203, 204, 205 |
| A5 | CSF 2.0 Govern mapping (sprint change extension) | `07-meta-patterns.md` | CSWP.29 |

### Priority 2 — Architectural Depth Additions

These additions strengthen the project's architectural rigor by linking its framework to formal models in the reference documents:

| # | Addition | Target File(s) | Documents Used |
|---|----------|---------------|----------------|
| A6 | NIST Trust Algorithm formalization | `02-the-octagon.md` or `04-the-morphological-matrix.md` | SP 800-207 |
| A7 | NIST deployment variations → D3 mapping | `05-dimensions-D1-D3.md` | SP 800-207 |
| A8 | Multi-location federation (CAP theorem, partition tolerance) | `06-dimensions-D4-D9.md` | SP 800-207A |
| A9 | PQC signature size operational impact table | `18-decision-matrix-and-conclusion.md` | FIPS 204, 205 |
| A10 | PQC migration timeline overlay | `18-decision-matrix-and-conclusion.md` | FIPS 203, 204, 205 |

### Priority 3 — Implementation Validation Additions

These additions validate the project's implementation guidance against real-world DoD/NSA programs:

| # | Addition | Target File(s) | Documents Used |
|---|----------|---------------|----------------|
| A11 | COA 1 / FY 2027 → Ch14 enterprise path | `14-enterprise-turnaround.md` | DoD_ZeroTTrust-ExecutionRoadmap-v1.1 |
| A12 | NSA 5-phase model → implementation timeline mapping | `13-self-assessment.md` or `14-enterprise-turnaround.md` | NSA_ZERO_TRUST_IMPLEMENTATION_GUIDELINE_PRIMER |
| A13 | DoD centralized orchestration → Event-Streamed policy validation | `06-dimensions-D4-D9.md`, `07-meta-patterns.md` | DoD-ZTArch |
| A14 | DTM-25-003 ZT PfMO → D8 governance validation | `04-the-morphological-matrix.md`, `07-meta-patterns.md` | DoD_DTM-25-003 |
| A15 | VPN-less implementation → perimeter thesis validation | `01-the-case-for-zero-trust.md` | DoD-ZTArch |
| A16 | Data-centric security → Axiom 3 validation | `02-the-octagon.md`, `05-dimensions-D1-D3.md` | DoD-ZTArch |

### Priority 4 — Integration with Sprint Change Proposal

These additions extend or strengthen the already-approved sprint change proposal:

| # | Addition | Target File(s) | Documents Used |
|---|----------|---------------|----------------|
| A17 | CSF 2.0 SCRM → Archetype C validation | `10-archetype-c-startup.md` | CSWP.29 |
| A18 | EO 14028 SBOM → Archetype C validation | `10-archetype-c-startup.md` | DCPD-202100401 |
| A19 | CSF Profiles/Tiers → morphological approach validation | `04-the-morphological-matrix.md` | CSWP.29 |
| A20 | DoD hybrid COA → nuanced covariance discussion | `07-meta-patterns.md` | DoD_ZeroTTrust-ExecutionRoadmap-v1.1 |
| A21 | NSA 152 activities → dimension abstraction acknowledgment | `04-the-morphological-matrix.md` or `14-enterprise-turnaround.md` | NSA_ZERO_TRUST_IMPLEMENTATION_GUIDELINE_PRIMER |

---

## Part IV — What Should Be Modified

### 4.1 Chapter-Level Modifications

| Chapter | Current State | Modification | Rationale |
|---------|---------------|-------------|-----------|
| **00-preface.md** | No policy citation | Add EO 14028 as the mandate that created the ecosystem the book addresses | A3 |
| **01-the-case-for-zero-trust.md** | References "NIST SP 800-207" and "CISA ZTMM" only | Add NIST SP 800-207A for cloud-native audience. Add EO 14028 §3(c) cloud mandate. Add DoD VPN-less citation. Soften compliance dismissal per sprint change (already planned). | Gaps 4, 17, 27, 29 |
| **02-the-octagon.md** | Refinement history table | Minor update: acknowledge SP 800-207 trust algorithm influence on Axiom 2/4 formulation | Gap 1 |
| **04-the-morphological-matrix.md** | Critique of maturity models is generic | Name CISA ZTMM explicitly (sprint change). Add DoD 7-pillar mapping sidebar. Add CSF Profiles/Tiers sidebar. | Gaps 13, 15, 19 |
| **05-dimensions-D1-D3.md** | D2, D3, D4 discussed without external references | Add NIST deployment variations → D3 mapping. Add SP 800-207A multi-location notes. Add ICAM concepts to D2. Add DoD data-centric model to D3=Data. | Gaps 2, 5, 18 |
| **06-dimensions-D4-D9.md** | D5, D6, D7, D8, D9 discussed | Add multi-location federation to D6. Add DoD centralized orchestration citation. Add PQC signature size impact to event stream discussion. | Gaps 4, 9, 16 |
| **07-meta-patterns.md** | Governance gap identified (sprint change) | Add CSF 2.0 Govern mapping. Add DoD ZT PfMO (DTM-25-003) citation. Add data lifecycle per sprint change, strengthened with DoD data-centric model. Add nuanced hybrid COA discussion. Add NSA Target/Advanced validation of covariance clusters. | Gaps 12, 21, 22, 26 |
| **10-archetype-c-startup.md** | Supply chain attack traced | Add CSF 2.0 SCRM and EO 14028 SBOM citations for regulatory validation | Gaps 14, 28 |
| **13-self-assessment.md** | Self-assessment diagnostic | Add ZTMM maturity mapping table (sprint change). Add NSA phase mapping sidebar. Add DoD assessment process as complement. | Gaps 20, 24 |
| **14-enterprise-turnaround.md** | 24-month enterprise path | Add "Coming From a Maturity Model" subsection (sprint change). Add COA 1/FY 2027 sidebar. Add NSA phase comparison. | Gaps 19, 20, 24 |
| **15-velocity-defender.md** | 12-month startup path | Add "Coming From a Maturity Model" subsection (sprint change) | Sprint change |
| **16-scaling-pat.md** | 6-month solo operator path | Add "Coming From a Maturity Model" subsection (sprint change) | Sprint change |
| **18-decision-matrix-and-conclusion.md** | Brief PQC mention, "Three Futures" | **Major expansion**: FIPS 203/204/205 with standard nomenclature, key establishment (ML-KEM), signature size operational impact, cross-family dual-stack, migration timeline overlay. Cite relevant FIPS, EO, DoD documents in futures. | Gaps 7, 8, 9, 10, 11 |
| **appendix-b-validation-checklist.md** | 8-question axiom audit | Add "Complementary Frameworks" note referencing ZTMM, CSF 2.0, DoD assessment | Enhancement |
| **appendix-c-glossary.md** | Comprehensive but pre-standard | Add entries: EO 14028, FIPS 203/204/205, ML-KEM, ML-DSA, SLH-DSA, SP 800-207A, CSF Govern, DoD ZT PfMO, ICAM, SBOM | Gaps across all documents |
| **appendix-d-quick-reference.md** | Already comprehensive | No modifications needed — already efficiently summarizes axioms, dimensions, archetypes, and decision matrix | — |

---

## Part V — What Should Be Removed

**Nothing.** The reference documents uniformly validate the project's core thesis. The approved sprint change proposal confirmed: "No existing claim is contradicted." This analysis confirms the same at a deeper level — the reference documents provide formal validation, additional depth, and missing context, but nothing in the project needs removal.

Minor softening (not removal) is already planned in the sprint change:
- Ch01's blanket dismissal of compliance frameworks needs to acknowledge the ZTMM's role as a measurement instrument
- NFR-2 language needs to soften from "does not map to CISA ZTMM" to "provides structured mapping demonstrating orthogonal complementarity"

---

## Part VI — Implementation Priority and Sequencing

The additions and modifications should be integrated in this order, synchronized with the existing sprint change proposal:

### Phase 1: Foundation (integrates with existing Epic 1 — Foundation stories)

| Step | Action | Story |
|------|--------|-------|
| 1 | Add EO 14028 to Preface and Ch01 | Story 1.1 |
| 2 | Add SP 800-207A to Ch01 reference ecosystem | Story 1.1 |
| 3 | Add DoD VPN-less, cloud mandate citations to Ch01 | Story 1.1 |
| 4 | Add NIST Trust Algorithm subsection to Ch02 or Ch04 | Story 1.2 or 1.4 |
| 5 | Add NIST deployment variations → D3 table to Ch05 | Story 1.5 |
| 6 | Add DoD 7-pillar mapping sidebar to Ch04 | Story 1.4 |
| 7 | Add CSF Profiles/Tiers sidebar to Ch04 | Story 1.4 |
| 8 | Add multi-location federation notes to Ch06 | Story 1.5 or 1.6 |
| 9 | Add DoD centralized orchestration, data-centric security citations to Ch05/Ch06 | Story 1.5 |

### Phase 2: Meta-Patterns + Governance (integrates with sprint change Ch07 additions)

| Step | Action | Story |
|------|--------|-------|
| 10 | Add CSF 2.0 Govern mapping to governance subsection | Story 1.6 (sprint change) |
| 11 | Add DoD ZT PfMO (DTM-25-003) citation to D8 discussion | Story 1.6 (sprint change) |
| 12 | Add NSA Target/Advanced validation of covariance clusters | Story 1.6 |
| 13 | Add nuanced hybrid COA discussion | Story 1.6 |
| 14 | Add DoD data-centric model to data lifecycle subsection | Story 1.6 (sprint change) |

### Phase 3: Implementation Chapters + Assessment (integrates with sprint change Epic 3 additions)

| Step | Action | Story |
|------|--------|-------|
| 15 | Add ZTMM maturity table to Ch13 (sprint change) | Story 3.1 |
| 16 | Add NSA phase mapping to Ch13 or Ch14 | Story 3.1 or 3.2 |
| 17 | Add COA 1/FY 2027 sidebar to Ch14 | Story 3.2 |
| 18 | Add "Coming From a Maturity Model" to Ch14/15/16 (sprint change) | Stories 3.2, 3.3, 3.4 |
| 19 | Add CSF SCRM + EO 14028 SBOM citations to Ch10 | Story 2.3 |

### Phase 4: PQC + Futures (new work)

| Step | Action | Story |
|------|--------|-------|
| 20 | Full PQC section rewrite in Ch18 (FIPS 203/204/205, ML-KEM, signature sizes, cross-family, migration timeline) | Story 4.x (new or existing Ch18 story) |
| 21 | Cite relevant FIPS/EO/DoD docs in "Three Futures" section | Story 4.x |
| 22 | Update Appendix C Glossary with all new terms | Story 4.5 |
| 23 | Add "Complementary Frameworks" note to Appendix B | Story 4.5 |

### Phase 5: Crosswalk (sprint change — new Appendix E)

| Step | Action | Story |
|------|--------|-------|
| 24 | Create Appendix E: CISA ZTMM v2.0 Crosswalk | Story 4.6 (sprint change) |
| 25 | Add FIPS 203/204/205 cross-references to Appendix E where PQC intersects with ZTMM Identity/Data functions | Story 4.6 |

---

## Part VII — Synthesis: What the Reference Documents Prove About the Project

The 11 reference documents collectively validate five of the project's core claims:

1. **"Zero-trust is an architecture, not a product"** — Validated by every document. SP 800-207 defines architecture, not products. The DoD ZT Ref Arch is an architecture blueprint. The NSA ZIG provides architectural implementation phases. No reference document describes a vendor product.

2. **"Compliance frameworks measure adoption, not integration"** — Validated by the contrast between the ZTMM (which the project's own analysis shows has a confidence/reality gap) and the CSF 2.0 Govern function (which acknowledges governance without solving the integration problem). The project's anti-maturity-model stance is correct but needs more nuance.

3. **"Dimensions are not independent — they form covariance clusters"** — Validated by the NSA's Target/Advanced phase split (acknowledging a qualitative leap, not a smooth gradient) and the DoD's centralized orchestration requirement (which couples policy distribution to enforcement). The DoD's hybrid COA approach partially challenges this for well-resourced organizations, requiring nuanced acknowledgment.

4. **"Epistemic integrity is the most universally violated axiom"** — Validated by FIPS 203-205 (cryptographic provenance requires algorithms that most deployed systems don't yet support) and SP 800-207A (multi-location environments make attestation provenance significantly harder). The PQC migration timeline shows that even organizations that want to satisfy Axiom 7 can't yet — the standards are too new.

5. **"Organizational posture (D8) is the highest-ROI architectural decision"** — Validated by DTM-25-003 (the DoD created a new governance structure specifically for ZT) and CSF 2.0 (which elevated governance to a first-class function). The zero-dollar cost claim is validated by the fact that organizational restructuring is a management decision, not a procurement decision.

---

## Part VIII — What the Analysis Reveals About Project Gaps Not Previously Identified

The sprint change proposal already identified gaps (Devices blind spot, Data lifecycle, Network resilience, Governance, ZTMM crosswalk). This analysis identifies additional gaps not in the sprint change:

| Gap | Source | Severity |
|-----|--------|----------|
| Missing SP 800-207A (cloud-native ZTA) | Gap 4-6 | **High** — project's stated audience is cloud-native; the NIST doc for cloud-native ZTA is uncited |
| Missing NIST Trust Algorithm | Gap 1 | **Medium** — formalizes what the project describes informally |
| Missing NIST deployment variations mapping | Gap 2 | **Medium** — creates unnecessary taxonomy disconnect |
| Missing FIPS 203 key establishment | Gap 8 | **High** — PQC discussion without key exchange is cryptographically incomplete |
| Missing PQC signature size operational impact | Gap 9 | **Medium** — practical concern for implementers |
| Missing cross-family PQC diversity recommendation | Gap 10 | **Medium** — defense-in-depth for cryptographic resilience |
| Missing EO 14028 citation | Gap 27 | **Medium** — policy genesis of entire ecosystem uncited |
| Missing DoD ZT Ref Arch mapping | Gap 15-18 | **Medium** — leaves federal audience without bridge to their primary reference |
| Missing NSA phase mapping | Gap 24-26 | **Low** — implementation validation, not mandatory for thesis |
| Missing DoD COA 1/FY 2027 citation | Gap 19-21 | **Low** — implementation validation |

---

## Part IX — Conclusion

The `./markdown` reference library contains significant architectural depth that the project's current 23 chapters underutilize. The gaps fall into three categories:

1. **Missing citations to documents the target audience expects** (EO 14028, SP 800-207A, DoD ZT Ref Arch) — these are credibility gaps, not content gaps. Fixing them requires namedropping and mapping, not new content.

2. **Missing architectural depth that the reference documents provide** (NIST Trust Algorithm, PQC key establishment, multi-location federation, deployment variations mapping) — these are content gaps that require new subsections.

3. **Missing validation that the reference documents offer** (DoD centralized orchestration → Event-Streamed policy, NSA Target/Advanced → covariance clusters, DTM-25-003 → D8 as security control) — these are "standing on shoulders" additions that strengthen the project's claims with external authority.

The approved sprint change proposal addresses the ZTMM crosswalk and governance gap. This analysis identifies additional work — primarily around SP 800-207A, FIPS 203-205, and DoD reference architecture integration — that should be folded into existing stories or added as new stories.

**The project's core thesis remains correct and is universally validated by the reference documents.** Nothing needs removal. The additions are all credibility-enhancing, depth-adding, or validation-providing. The cumulative effect transforms the project from "here's our framework" to "here's our framework, grounded in the full federal ZT standards ecosystem."
