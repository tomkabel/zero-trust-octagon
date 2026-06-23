# 7. Meta-Patterns: Covariance, Leverage, and the Capability Surface

> **Learning Objectives**
> - Explain why morphological dimensions form self-reinforcing covariance clusters rather than independent choices
> - Identify the leverage point hierarchy — which dimensions produce outsized impact when upgraded
> - Apply the ZTA litmus test: "When your policy engine fails, who pays?"
> - Recognize envy traps — properties of one archetype that are structurally incompatible with another

**Prerequisites:** [Chapter 4 (The Morphological Matrix)](./04-the-morphological-matrix.md), [Chapter 5 (Dimensions: Trust to Attestation)](./05-dimensions-trust-to-attestation.md), [Chapter 6 (Dimensions: Response to Human)](./06-dimensions-response-to-human.md)

---

The nine dimensions are individually useful for mapping a deployment. But the most valuable architectural insights emerge from how the dimensions *interact*. This chapter synthesizes the crossing patterns discovered by tracing four full attack scenarios against distinct combinations of values.

---

## Pattern 1: The Covariance Clusters

If you survey real-world zero-trust deployments, you do not find random combinations of dimension values. Certain values consistently co-occur, forming two dominant clusters:

**Low-Maturity Cluster:**
> Software CA (D1) → Single Source (D4) → Push (D6) → Hard Deny (D5) → Implicit Trust (D7) → Siloed (D8)

**High-Maturity Cluster:**
> Silicon (Root of Trust) (D1) → Heterogeneous Triple (D4) → Event-Streamed (Pub/Sub) (D6) → Trickle-Truth (D5) → Merkle-Attested Telemetry (D7) → Presumptively Wrong (D8)

The clustering is not coincidental. Each value in a cluster *enables* the others in that cluster and *constrains* the values from the opposite cluster. Consider:

- If D4 = Single Source, upgrading D5 to Trickle-Truth is dangerous — you would be seamlessly deceiving legitimate users flagged by the single-source's low-signal, high-noise output. Trickle-Truth requires the signal quality of Heterogeneous Triple or Behavioral attestation.
- If D6 = Push (30-second to 5-minute sync), upgrading D5 to Trickle-Truth is futile — the `transition:trickle-truth` event would arrive long after the attacker's next request, creating a detectable inconsistency. Trickle-Truth requires Event-Streamed (Pub/Sub) distribution.
- If D7 = Implicit Trust, upgrading D1 to Silicon is wasted — the system trusts the SIEM's claim that the silicon attestation passed, rather than independently verifying it.

**Practical consequence:** A single-dimension upgrade produces diminishing returns until a critical mass of the cluster shifts. The implementation decision trees in Part IV are structured around moving clusters of dimensions together, not upgrading one at a time.

The reason single-dimension upgrades produce diminishing returns follows directly from the covariance structure: each value in the high-maturity cluster depends on a value in the low-maturity cluster having been upgraded first. Upgrading D7 to Air-Gapped Pipeline while D4 is still Single Source means you are air-gapping low-fidelity data — the independent verification is correct, but the data being verified is single-sourced and compromisable. Upgrading D1 to Silicon while D7 is still Implicit Trust means the SIEM's claim that the silicon attestation passed is itself unverified — the root of trust is real but the dashboard reporting it is not. The mechanism is layer coupling: higher-dimension upgrades amplify the value of lower-dimension upgrades, but they cannot substitute for them.

> **NSA ZIG Validation:** The NSA's Zero Trust Implementation Guidance (ZIG) separates Target and Advanced levels with a distinct implementation phase boundary between them. This validates the project's finding that the low-maturity and high-maturity clusters are qualitatively different states, separated by a phased transition, not a smooth gradient. The NSA did not define a continuous spectrum; they defined two clusters separated by a phase boundary — the same structure the covariance analysis produces independently.

> **DoD Hybrid COA:** The DoD's hybrid COA approach (COA 1 + COA 2 combined) works because of scale resources ($10B+) that can absorb the inefficiency of non-covariant dimension upgrades. Organizations with smaller budgets face steeper covariance penalties and should follow the clustered upgrade paths in Part IV. This is not a refutation of covariance — it is a demonstration that scale can brute-force past architectural constraints that smaller organizations cannot. The DoD's approach is valid for the DoD. It is not a template for organizations with 1/1000th the budget.

---

## Pattern 2: The Leverage Point Hierarchy

Not all dimension upgrades produce equal impact. The hierarchy, derived from attack trace analysis:

| Rank | Dimension | Leverage |
|------|-----------|----------|
| **#1** | D5 (Violation Response) | Determines what a "successful defense" looks like. Trickle-Truth inverts the attacker's economic model. Hard Deny costs the business more than the attack. |
| **#2** | D4 (Attestation Modality) | Single-source attestation is the root of the "stolen token = total breach" path. Adding a second independent signal (behavioral or hardware) breaks the session-theft chain across all archetypes. |
| **#3** | D8 (Organizational Posture) | Conway's Law: architecture mirrors org structure. A siloed organization cannot operate a fused architecture. This costs zero dollars and produces outsized MTTD/MTTR improvements. |
| **#4** | D2 (Identity Model) | The human vs. machine bifurcation is the most common category error. Applying human patterns to machines or machine patterns to humans creates structural vulnerabilities. |
| **#5** | D7 (Observability Trust) | The defender's view of reality. In the three non-Holy-Grail archetypes, the observability pipeline is implicitly trusted and represents either a blind spot, an attacker feedback loop, or both. |

**D1 (Trust Anchor) is not in the top five** — not because it is unimportant, but because upgrading it before upgrading D4 (Attestation) and D7 (Observability) is wasted investment. A hardware root of trust whose attestations are verified by an implicitly trusted SIEM is not meaningfully more secure than a software root.

---

## Pattern 3: The Detect-Respond Gap

The operational metric that matters is not Mean Time To Detect (MTTD). It is the gap between detection and effective response — the interval during which *detection has occurred but the attacker can still inflict damage*.

| Archetype | MTTD | Detect-Respond Gap | Attacker Damage During Gap |
|-----------|------|--------------------|----------------------------|
| A (Holy Grail) | Instant | Zero | None — Trickle-Truth grafts at detection |
| B (Fortune 500) | None until tripwire | 15+ minutes before detection + Hard Deny cascade | Data exfiltrated + business outage from lockout |
| C (Startup) | ~3 minutes | 8 minutes | Data exfiltrated during Degrade window |
| D (Lean Defense) | Variable | 0-25+ minutes (bimodal) | Google Drive data exfiltrated before IAP hit |

**B has the worst gap** not because detection is slow but because response causes new damage. The Hard Deny that stops the attacker also stops the business. The detect-respond gap in B *extends past the attack* — the lockout cascade may take hours to fully resolve.

**D has the most deceptive gap.** When Pat is available, the response is near-instant. When Pat is unavailable, the gap stretches to 25+ minutes. The *average* MTTD looks good. The *distribution* is bimodal and dangerous.

**The gap metric unifies D5 and D7.** A fast detection (D7) paired with a slow or damaging response (D5) is worse than a slow detection paired with a non-damaging response. Detection speed is irrelevant if the response creates a second incident.

---

## Pattern 4: The Envy Traps

Each archetype envies properties of the others that are structurally incompatible with its own configuration:

- **B envies C's velocity.** The enterprise cannot deploy code 50 times a day without restructuring its org (D8: Siloed → Fused) and toolchain (D6: Push → GitOps). The velocity is a property of the *cluster*, not a bolt-on.
- **C envies A's prevention.** The startup cannot add hardware-attested runtime verification without slowing CI/CD by minutes — which would be rejected by the engineering culture that values shipping speed. Prevention has a velocity cost.
- **A envies C's human-driven detection.** A's triple-attested, air-gapped observability pipeline may not detect a novel supply chain attack as fast as a fused human team watching Datadog. But A's prevention is so strong (Trickle-Truth) that MTTD barely matters — the attacker cannot exfiltrate real data regardless.
- **D envies B's staffing.** The solo operator cannot hire a 24/7 SOC. But D's fused org (D8) and automated response (D5) achieve better security outcomes than B on 1% of the budget, because the single human can act in seconds rather than escalating through three tiers.

**Each archetype's strengths are the cause of its weaknesses.** The enterprise's budget enables comprehensive tooling that creates organizational silos. The startup's velocity creates supply chain blind spots. The solo operator's agility creates a single point of failure. The aspirant's sophistication creates deployment friction.

---

## Pattern 5: The ZTA Litmus Test

A single question separates viable zero-trust architectures from performative ones:

> **"When your policy engine fails — when it denies a legitimate request or allows a malicious one — who pays: the attacker or the business?"**

| Archetype | Who Pays? | Why |
|-----------|-----------|-----|
| A (Holy Grail) | Attacker | False positives cause the attacker to receive Trickle-Truth fake data, wasting their resources. |
| B (Fortune 500) | Business | Hard Deny locks out legitimate users. Business outage costs exceed breach costs. |
| C (Startup) | Both | Degrade slows the business marginally; attacker exfiltrates data during the window. |
| D (Lean Defense) | Variable | If Pat is available, attacker is stopped. If Pat is unavailable, attacker operates freely. |

**An architecture that makes the business pay for its own defense mechanisms is not zero-trust — it is zero-resilience.** The litmus test does not ask "does your architecture stop attacks?" It asks "what happens when your architecture makes a mistake?"

Every architecture will make mistakes. False positives are inevitable. The question is whether the architecture survives its own errors.

---

## Pattern 6: The Cost Floors

Each dimension has a minimum investment threshold below which meaningful progress is physically impossible:

| Dimension | Maturity Threshold | Approximate Floor |
|-----------|--------------------|--------------------|
| D1 (Trust Anchor) | Hardware roots require silicon foundry relationships or TPM-equipped hardware | $50-200/node (hardware) |
| D4 (Attestation) | Heterogeneous triple requires three independent observation teams/technologies | $200K+/year (engineering) |
| D5 (Violation Response) | Trickle-Truth requires garden environment, LLM pipeline, event-stream infrastructure | $500K+/year (infrastructure + ML) |
| D7 (Observability) | Air-gapped pipeline requires dedicated hardware, data diodes, independent infrastructure | $300K+/year |
| D8 (Org Posture) | Fused org = culture change | **$0** |

**D8 is the only dimension with a zero-dollar floor.** The solo operator with D8 = Fused achieves better security outcomes than the enterprise with D8 = Siloed despite spending 1/100th the budget. Organizational structure is a security control.

D8's zero-cost floor does not mean organizational transformation is free — culture change is the hardest kind of change. It means D8 requires no hardware procurement, no vendor contracts, no software licenses. The barrier is political, not financial. The DoD's DTM-25-003 policy memorandum established a dedicated Zero Trust Portfolio Management Office (ZT PfMO) and Chief Zero Trust Officer position — governance structures specifically created because the existing organizational model could not execute zero-trust. This validates D8 as an architectural dimension, not a management footnote: the world's largest defense organization concluded that organizational structure is a prerequisite for zero-trust execution, not an afterthought to it.

The ZT PfMO's funding prioritization authority further validates the D8 = Economic-Contract model. The PfMO does not request funding from individual service branches — it holds and allocates the zero-trust budget centrally, making funding decisions based on architectural priorities rather than organizational politics. This is exactly the economic-contract posture: security investment sized by architecture requirements, not by which team has the loudest voice in the budget cycle. When the DoD centralizes zero-trust funding under a single office, it is operationalizing the principle that D8 determines whether money spent on D1-D7 produces security or theater.

---

## Pattern 7: The Capability Surface

The dimensions do not form a linear upgrade path. They form a **capability surface** — a topography where different combinations optimize for different threats.

- **The "detection-optimized" peak:** Archetype C (Startup). Excellent MTTD/MTTR via fused teams and GitOps. Weak prevention.
- **The "prevention-optimized" peak:** Archetype A (Holy Grail). Zero data loss through Trickle-Truth. No business impact. Massive engineering investment.
- **The "cost-optimized" peak:** Archetype D (Lean Defense). Best security-per-dollar in the matrix. Bounded by solo-operator scalability.
- **The "compliance-optimized" valley:** Archetype B (Fortune 500). Excellent audit artifacts. Structurally fragile under real attack.

**A textbook that presents dimensions as independent choices is misleading.** The covariance clusters and capability surface are the actual intellectual content. The architecture is the shape of the surface, not a point on a checklist.

---

## Pattern 8: The Axiom-to-Dimension Mapping

The eight Octagon axioms do not exist in isolation from the nine morphological dimensions. Each axiom governs specific dimensions — constraining which dimension values satisfy the invariant and which violate it. This table is the connective tissue between Part I (theory) and Part II (architecture). Read it left-to-right to see which dimensions an axiom constrains. Read it right-to-left to see which axioms a dimension upgrade satisfies.

| Axiom | Primary Dimension(s) Governed | Rationale |
|-------|------------------------------|-----------|
| 1. No Intrinsic Trust | D2 (Identity Model), D5 (Violation Response) | Trust-as-transient-verdict requires identity models that do not confer standing access (D2: ZSP, Trust Decay) and violation responses that do not assume the entity's prior trust status (D5: Trickle-Truth over Hard Deny) |
| 2. Explicit, Verifiable Policy | D6 (Policy Distribution), D7 (Observability Trust), D8 (Organizational Posture) | Replayable, non-contradictory policy requires distribution mechanisms that preserve consistency (D6: GitOps, Event-Streamed), observability that can independently verify policy enforcement (D7), and an organization structured to accept external verification (D8) |
| 3. Unbypassable Mediation | D3 (Enforcement Layer), D6 (Policy Distribution) | Mediation must extend to every interaction (D3: Bilateral), and policy must reach every enforcement point (D6: Event-Streamed) without gaps that create unmediated paths |
| 4. Continuous Verification | D2 (Identity Model), D4 (Attestation Modality) | Risk-calibrated re-verification requires identity models that support continuous decay (D2: Trust Decay, Probationary Identity) and attestation modalities that produce measurements continuously (D4: Continuous / Real-Time), not once at deployment |
| 5. Deterministic Bounded Authority | D2 (Identity Model), D3 (Enforcement Layer) | Calculable blast radius requires identity models with explicit, bounded permission vectors (D2: ZSP, Capability-Based) and enforcement layers where the data itself carries its policy (D3: Data — Cryptographic) |
| 6. Byzantine Fault Tolerance | D4 (Attestation Modality), D5 (Violation Response), D7 (Observability Trust) | Surviving compromised components requires attestation from independent observers (D4: Heterogeneous Triple), responses that do not cascade into new faults (D5: Trickle-Truth over Hard Deny), and observability pipelines that survive compromise (D7: Dual Pipeline, Merkle-Attested Telemetry) |
| 7. Epistemic Integrity | D1 (Trust Anchor), D4 (Attestation Modality), D7 (Observability Trust) | Cryptographic provenance of state inputs requires hardware roots (D1: Silicon), multi-observer attestation (D4: Heterogeneous Triple), and tamper-evident telemetry (D7: Merkle-Attested Telemetry) — the most dimensionally expensive axiom |
| 8. Bilateral Symmetry | D3 (Enforcement Layer), D6 (Policy Distribution) | Mutual verification requires enforcement that operates bidirectionally (D3: Bilateral — Mutual Enforcement) and policy distribution that ensures both parties hold the same policy version (D6: Bilateral / Consensus) |

Every dimension (D1-D9) is referenced by at least one axiom. D9 (Human Continuity) is not directly governed by any single axiom — it is the operational precondition for Axiom 6 (BFT): a system whose human response layer is a single point of failure cannot maintain Byzantine Fault Tolerance regardless of how well the other dimensions are architected. D9 is the dimension that determines whether the architecture survives its operator's unavailability.

---

## ZTMM Framework Integration

The CISA Zero Trust Maturity Model v2.0 is the most widely adopted federal zero-trust framework. It defines five pillars and three cross-cutting capabilities across four maturity stages. The Octagon is orthogonal to the ZTMM — it asks different questions — but the frameworks share structural DNA. The following sections surface the mappings that the ZTMM cross-analysis identified, bridging the two frameworks so that practitioners operating within the federal ZT ecosystem can see how the Octagon's architectural invariants relate to the maturity model they are required to use.

### Data Lifecycle

The ZTMM Data pillar defines functions that the Octagon's axioms presuppose but do not explicitly address. Reframing these functions in Octagon terms reveals where architectural integrity depends on operational data governance:

- **Data Inventory Management** → Precondition for Axiom 3 (Unbypassable Mediation). You cannot mediate access to data whose existence, location, and classification are unknown. An organization with perfect enforcement (D3 = Bilateral) but no data inventory has unmediated access to data it has not catalogued — the mediation is bypassable not through technical failure but through organizational blindness.
- **Data Categorization** → Input to Axiom 5 (Deterministic Bounded Authority). Authority vectors must be calibrated to data sensitivity. A credential that grants access to "all data in bucket X" where bucket X contains both public documentation and PII violates Axiom 5 — the blast radius is unboundable because the data is uncategorized.
- **Data Availability** → Constraint on Axiom 6 (Byzantine Fault Tolerance). BFT must maintain availability under partition. A system that satisfies Axiom 6 during normal operations but loses access to critical data during a network partition has failed BFT at the data layer — the architecture survived, but the data it protects did not.

### Governance as a Cross-Dimensional Concern

The ZTMM's Governance cross-cutting capability matures from "ad hoc policies enforced via manual processes" (Traditional) to "fully automated enterprise-wide policies with continuous enforcement and dynamic updates" (Optimal). This progression maps directly to D8 (Organizational Posture) and Axiom 2 (Explicit, Verifiable Policy).

Governance is the operational face of Axiom 2. The axiom declares that policy must be explicit and independently verifiable. Governance is the organizational machinery that makes it so — the policy review cadences, the cross-team enforcement verification, the audit trail maintenance, the exception handling processes. An organization with Axiom 2 satisfied in its technical architecture but with ZTMM Governance at Traditional is an organization whose policy engine is correct and whose policy *process* is ad hoc — the architecture is zero-trust at the enforcement point but not at the organizational surface where policies are created, reviewed, and retired.

| ZTMM Governance Stage | D8 Value | Axiom 2 Status |
|----------------------|----------|----------------|
| Traditional (ad hoc policies, manual processes) | Siloed | Violated — policies are informal, unreplayable |
| Initial (basic policy framework, some automation) | Siloed → Fused transition | Partially satisfied — policies exist but verification is inconsistent |
| Advanced (organization-wide policies, mostly automated) | Fused | Satisfied — policies are declared, enforced, and auditable |
| Optimal (fully automated, continuously enforced, dynamically updated) | Presumptively Wrong + Economic-Contract | Satisfied with continuous improvement — policies evolve through falsification |

### Cross-Cutting Capability Mapping

The ZTMM's three cross-cutting capabilities have clean Octagon mappings that the project has not previously surfaced:

| ZTMM Cross-Cutting Capability | Octagon Axiom(s) | Project Dimension(s) |
|-------------------------------|------------------|---------------------|
| Visibility & Analytics | Axiom 7 (Epistemic Integrity) | D7 (Observability Trust) + D4 (Attestation Modality) |
| Automation & Orchestration | Axiom 4 (Continuous Verification), Axiom 5 (Deterministic Bounded Authority) | D5 (Violation Response) + D6 (Policy Distribution) |
| Governance | Axiom 2 (Explicit, Verifiable Policy) | D8 (Organizational Posture) |

This mapping is bidirectionally useful. When the ZTMM says "Visibility and Analytics at Optimal," the Octagon says Axiom 7 is satisfied — your telemetry carries cryptographic proof of provenance. When Axiom 7 is violated, you are at ZTMM Traditional/Initial for Visibility and Analytics — your telemetry is implicitly trusted, and an attacker who compromises the logging agent blinds the SOC. When the ZTMM says "Automation and Orchestration at Optimal," the Octagon says Axiom 4 and Axiom 5 are satisfied — re-verification is continuous and authority is deterministically bounded. When either axiom is violated, your automation is operating on unverified inputs or unbounded permissions.

### CSF 2.0 Govern Mapping

The NIST Cybersecurity Framework 2.0 defines a Govern function with subcategories that name the organizational dimensions D8's values measure:

| CSF 2.0 Subcategory | D8 Value Mapping | Relationship |
|---------------------|-----------------|--------------|
| GV.OC (Organizational Context) | Siloed → Fused transition | GV.OC requires understanding the organization's mission, stakeholder expectations, and legal/regulatory obligations — the organizational self-awareness that enables the move from Siloed to Fused |
| GV.RM (Risk Management Strategy) | Economic-Contract | GV.RM requires risk appetite and tolerance statements — the formal articulation of the economic-contract model where security investment is calibrated to quantified risk |
| GV.RR (Roles, Responsibilities, and Authorities) | Presumptively Wrong + Dojo-Trained | GV.RR requires accountability and authority to be established and communicated — the organizational foundation for Presumptively Wrong governance, where every decision is challengeable, and Dojo-Trained teams, where the authority to act is earned through live-fire competence |
| GV.PO (Policies, Processes, and Procedures) | Axiom 2 enforcement across D8 | GV.PO requires policies to be established, communicated, and enforced — the CSF's articulation of what Axiom 2 requires at the organizational level |

The CSF 2.0 Govern function provides the governance vocabulary that D8's organizational structure values operationalize. D8 tells you *what* the organization is. CSF Govern tells you *what processes* the organization needs, regardless of which D8 value it currently occupies.

### Policy Distribution: Federation and Centralized Orchestration

When the event stream itself is partitioned across geographic regions, the PDP/PEP model must account for CAP theorem constraints. A policy update that propagates to PEPs in Region A but not Region B (due to a partition) creates a consistency violation — different enforcement points evaluate the same request against different policy versions. NIST SP 800-207A provides guidance for federated PDP deployments, including the requirement that partitioned PEPs default to the most restrictive cached policy version during partition. The DoD Zero Trust Reference Architecture formalizes this as centralized policy orchestration with distributed enforcement — the policy is authored and versioned centrally (satisfying Axiom 2's consistency requirement), while enforcement is distributed to every PEP (satisfying Axiom 3's unbypassable mediation requirement). The DoD's requirement for centralized policy orchestration with distributed enforcement is the architectural driver for Event-Streamed (Pub/Sub) policy: it is not an academic exercise but a response to the federal requirement that policy be both centralized (consistent) and distributed (survivable).

---

## Forward-Looking: Post-Quantum Cryptographic Impact

The transition to post-quantum cryptography has measurable operational consequences for the architectural patterns described in this chapter. ML-DSA (FIPS 204) signatures range from 2,427 to 4,627 bytes, compared to ECDSA's 64 bytes — a 35-75× size increase. This affects every dimension that depends on signed artifacts:

- **D4 (Attestation Modality):** Attestation reports carry cryptographic signatures. A Heterogeneous Triple attestation — with three independent observers each signing their observations — produces three signatures per measurement interval. At ML-DSA-87 sizes, a 5-second attestation cycle produces approximately 14KB of signature data alone, before the attestation payload. This has bandwidth implications for event-stream infrastructure.
- **D6 (Policy Distribution):** Event-Streamed policy depends on sub-millisecond propagation. Larger signatures on policy update messages increase serialization and deserialization latency.
- **D7 (Observability Trust):** Merkle-Attested Telemetry signs Merkle root hashes at fixed intervals. Larger signatures on root hashes increase the telemetry pipeline's bandwidth by 35-75× for the signature component.
- **SPIFFE/SPIRE:** Workload identity certificates (X.509-SVIDs) carrying PQC signatures increase certificate bundle sizes proportionally, affecting every mTLS handshake in the service mesh.

This is not a theoretical concern. NIST's PQC migration timeline (RSA/ECC deprecation by 2030, disallowance by 2035) places the transition within the architecture's design lifetime. The quantum stress-test in Appendix A explores these impacts in detail. For the purposes of this chapter, the key architectural insight is: the dimensions that depend on signed artifacts (D1 attestation chains, D4 attestation reports, D6 policy signatures, D7 telemetry signatures) are coupled to the cryptographic algorithms that produce those signatures. Algorithm migration is not a one-time event with a flag day — it is a continuous operation, and the architecture must treat it as such.

---

## Key Takeaways

1. **The nine dimensions are not independent. They form self-reinforcing covariance clusters. Single-dimension upgrades produce diminishing returns until critical mass shifts to the high-maturity cluster.**
2. **The leverage point hierarchy ranks D5 (Violation Response) as the highest-impact upgrade, followed by D4 (Attestation) and D8 (Organizational Posture).**
3. **The operational metric that matters is the detect-respond gap — the interval between detection and effective response during which the attacker can still inflict damage. MTTD alone is misleading.**
4. **The ZTA litmus test — "When your policy engine fails, who pays?" — separates zero-trust from zero-resilience. An architecture whose defense mechanisms harm the business more than the attacker is not zero-trust.**
5. **The axiom-to-dimension mapping table is bidirectional: left-to-right shows which dimensions an axiom constrains; right-to-left shows which axioms a dimension upgrade satisfies. Every dimension (D1-D9) is governed by at least one axiom.**
6. **The ZTMM and the Octagon measure different things — organizational maturity vs. architectural integrity — and the cross-cutting capability mapping shows they are complementary, not competing.**
7. **D8 (Organizational Posture) is the only dimension with a zero-dollar cost floor. The DoD's DTM-25-003 ZT PfMO validates D8 as a first-class architectural control.**
8. **Post-quantum cryptographic transition is an architectural concern, not a cryptographic one — signature size increases affect D4 attestation bandwidth, D6 policy propagation latency, and D7 telemetry pipeline capacity.**

---

## Cross-References

**Next:** [§8: Archetype A — The Holy Grail](../03-archetypes/08-archetype-a-holy-grail.md)
**Builds on:** [§4: The Morphological Matrix](./04-the-morphological-matrix.md), [§5: Dimensions: Trust to Attestation](./05-dimensions-trust-to-attestation.md), [§6: Dimensions: Response to Human](./06-dimensions-response-to-human.md)
**Related:** [§2: The Octagon](../01-foundations/02-the-octagon.md)
