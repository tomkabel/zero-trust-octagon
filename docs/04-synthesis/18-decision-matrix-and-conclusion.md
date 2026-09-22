---
title: "18. The Decision Matrix in Practice + Conclusion"
description: "The cross-archetype decision matrix mapping pain to first move, peer-review evolution from Octagon through Tridecagon, PQC migration timeline, and the three futures of zero-trust architecture."
outline: deep
cover: /images/covers/04-synthesis/18-decision-matrix-and-conclusion.webp
coverAlt: "Illustration: one illuminated path through a dark decision lattice toward a distant spire"
---

# 18. The Decision Matrix in Practice + Conclusion

> **Learning Objectives**
> - Apply the cross-archetype decision matrix to identify the correct first move from any starting condition
> - Use the Octagon as a continuous audit tool beyond the initial transformation
> - Understand the forward-looking trajectory: quantum, AI, and hardware evolution

**Prerequisites:** [§14: Enterprise Turnaround](./14-enterprise-turnaround.md), [§15: Velocity Defender](./15-velocity-defender.md), [§16: Scaling Pat](./16-scaling-pat.md), [§17: The Aspirant's Gate](./17-the-aspirants-gate.md)

---

## The Cross-Archetype Decision Matrix

This matrix is the book's central practical instrument. Presented with a pain point and a threat profile, it tells you which dimension to address first and which chapter to read for the detailed path.

| If your primary pain is... | Your primary threat is... | Start with dimension... | Because... |
|---------------------------|--------------------------|------------------------|------------|
| "We keep getting phished" | Credential theft + MFA fatigue | D4 (Attestation) — hardware keys or behavioral | Axiom 4: Continuous re-verification breaks the session-theft chain |
| "Our lockouts cause outages" | Business damage from defensive response | D5 (Violation Response) — upgrade away from Hard Deny | Axiom 6: The system must survive its own defense mechanisms |
| "Our DevOps team is the SOC" | Alert fatigue + slow response | D9 (Human Continuity) — automated fallback | Axiom 6: Remove the human single point of failure |
| "We don't know what SaaS we use" | Shadow IT + SaaS session hijack | D3 (Enforcement) — expand mediation to SaaS layer | Axiom 3: No unmediated path to any resource |
| "We trust our SIEM implicitly" | Log tampering + blind spots | D7 (Observability) — dual pipeline or Merkle attestation | Axiom 2 + 7: Independent verification + provenance |
| "Developers deploy whatever they want" | CI/CD supply chain injection | D4 (Layered attestation) + D6 (GitOps policy sync) | Axiom 4: Continuous attestation from code to runtime |
| "We want the Holy Grail but can't afford it" | ALL | D8 (Fused org) + D9 (automation) — invest in people and process first | Axiom 6: Byzantine resilience starts with organizational resilience |

The matrix is read by identifying your top two pain points and their corresponding threat profiles. If they point to the same dimension, start there. If they point to different dimensions, use the leverage point hierarchy (Chapter 7) — D5 has priority over D4, D4 over D8, and so on.

---

## The Octagon as a Continuous Audit

The eight-question architecture audit from Chapter 3 is not a one-time exercise. Run it annually — or when any of the following events occur:

1. **A new vendor or platform is added to the stack.** Every new identity provider, observability platform, or enforcement point changes the architecture's dimension values. Re-run the audit.
2. **An organizational restructuring occurs.** D8 (Organizational Posture) is the cheapest dimension to change and the most impactful. A reorganization changes it. Re-run the audit.
3. **Post-incident, regardless of outcome.** If the architecture detected and stopped an attack, audit to confirm that the defense did not violate Axiom 6 (did the defensive response cascade?). If the architecture failed to detect an attack, audit to identify which dimension value caused the gap.
4. **Annually, by default.** The Octagon is constant but the organization is not. New threats, new technologies, and new business pressures shift the configuration. The annual audit detects drift before it becomes a vulnerability.

---

## Peer-Review Evolution: Octagon → Hendecagon → Tridecagon

The eight Octagon axioms (Axioms 1-8) were extended through adversarial peer review into a refined set. The numbering and names are fixed in [§2: The Octagon](../01-foundations/02-the-octagon.md#beyond-the-octagon-hendecagon-and-tridecagon); this section documents what each extension adds, what gap it closes, and what remains to be formalized.

### Axiom 9: Functional Preservation

**What it adds:** The system must continue to perform its operational function while under active attack, without degrading to denial-first responses.

**The gap it closes:** The Hard Deny-to-outage cascade (Chapter 9). An architecture that preserves confidentiality by destroying availability has handed the attacker a denial-of-service victory. Axiom 9 makes that trade an architectural violation, not an operations incident.

### Axiom 10: Sovereign Quorum

**What it adds:** No single organization may unilaterally declare an entity trusted. Cross-boundary trust verdicts require attestation from a quorum of independent verifiers.

**The gap it closes:** A single compromised — or compelled — authority contaminating the trust fabric. *Independent* must be read as **jurisdictionally decorrelated**: verifiers under one legal regime are correlated components, and one court order reaches all of them at once. See the compellability predicate in [§7 Pattern 9](../02-methodology/07-meta-patterns.md#pattern-9-jurisdictional-exposure-the-compellability-predicate).

### Axiom 11: Temporal Epistemic Integrity

**What it adds:** Provenance proofs have a shelf life determined by the cryptographic algorithms that secure them.

**The gap it closes:** Axiom 7 treats a valid signature as timeless. Axiom 11 makes algorithmic obsolescence a provenance failure with a known date.

### Axiom 12: Algorithmic Impermanence

**What it adds:** Algorithm migration is a continuous operation, not a flag-day transition. NIST's PQC timeline (RSA/ECC deprecation by 2030, disallowance by 2035) places this inside the design lifetime.

### Axiom 13: Architectural Polymorphism

**What it adds:** Topology, routing, and response behavior must be non-static against adversaries operating at machine speed. A predictable architecture is one an AI-speed adversary models faster than a human defends.

### Candidate invariants not promoted to axioms

Review also surfaced five properties that earlier drafts numbered as axioms. Each is a theorem of Axioms 1–8 rather than an irreducible invariant, so they are kept as named corollary-level requirements:

| Candidate | Derives from | Requirement |
|---|---|---|
| **Layer-Provenance Integrity** | Axiom 2, Axiom 7 | Every architectural claim traces to a concrete policy, enforcement point, and verification event. "We do microsegmentation" without an enforcement chain is unfalsifiable. |
| **Cryptographic Non-Repudiation** | Axiom 6 (Cor. 6.1), Axiom 7 | Every enforcement decision is signed by the deciding entity. Absence of legitimate decisions in the signed log proves the PEP was offline or under attacker control. |
| **Cross-Pillar Coupling Bound** | Axiom 3, Axiom 5 | No pillar upgrade may increase another pillar's attack surface. This is the mechanism behind the confidence/reality gap (57% believe Advanced, 69% breached). |
| **Structural Integrity** | Axiom 7 (Cor. 7.2) | The D1–D9 configuration vector is stable under change. A new vendor that creates a Single Source attestation path is a regression regardless of the vendor's isolated quality. |
| **Temporal Integrity** | Axiom 4 | Drift not automatically corrected is detected within one operational cycle. A policy expiring into default-allow is an architectural violation. |

> **Note:** Axioms 9–13 are stated as invariants but are not yet formalized with corollaries. Their implications are visible in the adversarial stress-tests of Appendix A; their enforcement mechanisms are the frontier of this work. Future editions should complete their formalization.

---

## Beyond This Book: The Octagon in 2035

The eight axioms will not change. How they are implemented will.

### Post-Quantum Cryptography

Axiom 7 (Epistemic Integrity) depends entirely on cryptographic signatures and hardware attestation. A cryptographically relevant quantum computer (CRQC) — expected in the 2028-2032 timeframe — would break the ECDSA and RSA signatures that secure virtually every current TPM, IDP token, and certificate chain.

This is not a future problem. It is a design constraint for architectures being built today, because the migration to post-quantum cryptography (PQC) will take 5-10 years. The National Institute of Standards and Technology (NIST) has standardized three primary PQC algorithms:

| NIST Standard | Algorithm | Purpose | Replaces |
|--------------|-----------|---------|----------|
| FIPS 203 | ML-KEM (Module-Lattice Key Encapsulation Mechanism) | Key establishment | ECDH, RSA key exchange |
| FIPS 204 | ML-DSA (Module-Lattice Digital Signature Algorithm) | General-purpose signatures | ECDSA, RSA signatures |
| FIPS 205 | SLH-DSA (Stateless Hash-Based Digital Signature Algorithm) | Conservative signatures | ECDSA (fallback) |

#### Key Establishment (FIPS 203 — ML-KEM)

Every encrypted channel in the zero-trust architecture must transition to ML-KEM for key establishment:

- **PDP → PEP policy sync channels:** The policy decision point distributes real-time policy updates to enforcement points over channels whose session keys must be PQC-secure. ML-KEM-768 recommended for general use.
- **PEP → PEP data channels:** Cross-enforcement-point communication (e.g., between service mesh sidecars) requires PQC key agreement to prevent harvest-now-decrypt-later attacks on inter-PEP traffic.
- **Attestation report transport:** Hardware attestation reports (TPM quotes, confidential computing evidence) are transported over encrypted channels. The channel keys must be PQC-grade because the attestation report itself may be archived and later decrypted.
- **Event stream encryption:** The observability pipeline (D6 Event-Streamed or Dual Pipeline configuration) carries signed events whose transport encryption must be PQC-grade.

| Use Case | Recommended ML-KEM Parameter Set | Rationale |
|----------|--------------------------------|-----------|
| PDP → PEP policy sync | ML-KEM-768 | General-purpose — balances performance with 128-bit security equivalence |
| PEP → PEP data plane | ML-KEM-768 | Same keying domain as PDP sync, single parameter set simplifies operations |
| Attestation evidence transport | ML-KEM-1024 | High-security environments (Archetype A) — 256-bit security equivalence for long-lived attestation archives |
| Event stream encryption | ML-KEM-768 | Bulk encryption — computational overhead matters at 10K+ events/sec |

#### Signature Size Operational Impact

PQC signatures are substantially larger than their classical counterparts, with direct operational consequences:

| Component | ECDSA P-256 (64 bytes) | ML-DSA-65 (3,465 bytes) | SLH-DSA-SHAKE-256s (9,152 bytes) | Impact |
|-----------|------------------------|--------------------------|-----------------------------------|--------|
| Event stream (10K events/sec) | 640 KB/s | ~35 MB/s | ~92 MB/s | 50× bandwidth increase for ML-DSA; 140× for SLH-DSA |
| Attestation report (single) | 1 KB | ~5 KB | ~10 KB | 5-10× request size increase |
| SPIFFE/SPIRE certificate bundle | ~1 KB | ~5 KB | ~10 KB | 5-10× bundle size for mTLS handshake |
| CI/CD pipeline artifact signature | ~1 KB | ~5 KB | ~10 KB | 5-10× storage and transfer per artifact |
| TPM identity key | ~2 KB | ~7 KB | ~15 KB | 3-7× TPM secure storage usage |

> **Practical consequence:** An architecture emitting 10,000 events per second with ML-DSA signatures will consume approximately 35 MB/s in signature bandwidth alone — up from 640 KB/s with ECDSA. This does not break the architecture, but it does require designing the event pipeline with PQC signature sizes in mind: larger event buffers, higher-throughput transport channels, and signature compression where feasible (e.g., aggregating batched attestations before signing).

#### Cross-Family Diversity

The standard PQC recommendation — dual-stack conventional + lattice-based PQC — carries a subtle risk: single-family vulnerability. Both ML-KEM and ML-DSA are lattice-based. A cryptanalytic breakthrough that weakens lattice problems would compromise both the key establishment and signature algorithms simultaneously.

The conservative recommendation is cross-family dual-stack:

- **Archetype A (high-security environments):** ML-KEM-1024 for key establishment + SLH-DSA-SHAKE-256s for signatures. SLH-DSA is hash-based, not lattice-based, providing independent cryptographic family diversity.
- **General use (Archetypes B, C, D):** ML-KEM-768 + ML-DSA-65 for production traffic. Reserve SLH-DSA as a fallback for critical-path signing only — root CA, silicon attestation anchors, and cross-organizational trust anchors where a single-family risk is unacceptable.

This stratification reflects the operational cost: SLH-DSA signatures are 2-3× larger than ML-DSA signatures (9,152 bytes vs 3,465 bytes for comparable security levels), making SLH-DSA expensive for high-volume signing but essential for high-assurance roots.

#### PQC Migration Timeline

The PQC transition timeline intersects each archetype's implementation pathway at different points:

| Milestone | Date | Impact on Archetype A | Impact on Archetype B | Impact on Archetype C | Impact on Archetype D |
|-----------|------|----------------------|----------------------|----------------------|----------------------|
| NIST FIPS 203/204/205 published | 2024 | Begin dual-stack design | Monitor vendor support | Monitor CI/CD toolchain updates | Monitor hardware key compatibility |
| NSA CNSA 2.0 deadline for National Security Systems | 2025 | PQC required for all new acquisitions | N/A (non-NSS) | N/A | N/A |
| PQC support in mainstream CAs and IDPs | 2026-2027 | Certificate chains begin transition | Plan IDP PQC certificate rotation | Evaluate SPIFFE/SPIRE PQC support | Begin SaaS PQC readiness audit |
| **DoD full ZTA implementation deadline** | **2027** | Architecture must be operational; PQC migration runs in parallel | Operational architecture target; add PQC to year 2 roadmap | Operational architecture target | N/A (solo operator) |
| NIST expected deprecation of RSA and ECC | 2030 | PQC-only for all new deployments | Begin PQC transition | Complete PQC transition for signing paths | Hardware key replacement cycle |
| NIST expected disallowance of RSA and ECC | 2035 | Full PQC-only operations | Full PQC-only operations | Full PQC-only operations | Full PQC-only operations |

Key architectural insight: The DoD's 2027 ZTA deployment deadline arrives before the 2030 RSA/ECC deprecation, which in turn arrives before any credible CRQC date. This means every archetype completes its zero-trust implementation on conventional cryptography and then undergoes a PQC migration *on top of an already-functioning ZTA architecture*. The two transitions are sequential, not simultaneous. Design accordingly: use abstracted cryptographic interfaces that allow algorithm swaps without re-architecting enforcement points.

#### What Must Change

- **TPM firmware** must support PQC algorithms — ML-DSA (FIPS 204) and SLH-DSA (FIPS 205) — for attestation signatures.
- **SPIFFE/SPIRE** must support PQC for workload identity certificates.
- **Event-stream signing (D6)** must use PQC to protect policy updates.
- **The migration strategy:** dual-stack cryptography — conventional and PQC in parallel — with conventional used for validation until PQC is proven. For key establishment, transition to ML-KEM as the primary mechanism immediately for all new encrypted channel deployments.

#### What Does Not Change

The Octagon. Axiom 7 still requires cryptographic provenance. The algorithms change. The axiom does not. Executive Order 14028 (Improving the Nation's Cybersecurity) and DoD Zero Trust Strategy both reinforce this direction — cryptographic modernization is a prerequisite for any long-lived security architecture.

### AI-Generated Attack Chains

The adversary in Chapter 11 used an AI-generated spear-phishing email. The next generation will use AI to generate entire attack chains: reconnaissance, credential harvesting, lateral movement paths, and exfiltration routes — all designed and executed by LLM agents operating faster than human defenders can respond.

AI-generated attacks disproportionately threaten two axiom dimensions:

1. **Behavioral attestation (D4):** AI can model a legitimate user's behavior patterns — typing cadence, navigation sequences, access timing — and reproduce them with high fidelity. Behavioral signals that are not anchored to hardware attestation become unreliable.
2. **Epistemic Integrity (Axiom 7):** AI can generate convincing deepfake telemetry — device posture reports, system health metrics, user activity logs — that would fool a human analyst. The only defense is cryptographic provenance that the AI cannot forge because it does not control the hardware root of trust.

**The mitigation is the same:** Hardware-anchored cryptographic provenance. AI can fake software signals. It cannot fake a TPM-signed attestation report from hardware it does not control.

### The Hardware Attestation Commoditization

Over the next 5-7 years, hardware attestation capabilities — TPM 2.0, confidential computing enclaves, measured boot, firmware transparency — will become standard on all server-class CPUs, not just hyperscaler SKUs. AMD SEV, Intel TDX, and ARM CCA will converge on a common interface for attesting workload integrity. The cost floor for D1 (Trust Anchor) will drop from "foundry relationship + custom silicon" to "standard server procurement."

When hardware attestation is a commodity, the Octagon's hardest dimension — D1/D4 co-upgrade — becomes accessible to every archetype, not just A. The limiting factor becomes not technology availability but organizational willingness to accept the brittleness that hardware attestation introduces — the 10% self-quarantine rate, the attestation triage burden, the cryptographic ceremonies for hardware onboarding. These operational costs are independent of hardware cost. The architecture gets cheaper to build. It does not get cheaper to operate.

### The SaaS Enforcement Common Interface

The SaaS Blind Spot — the gap between what the IAP protects and what the SaaS layer exposes — will close over the next decade through regulatory pressure. An open standard where any identity-aware proxy can query any SaaS platform for a policy decision before a user's request is honored. The SaaS platform becomes a PEP like any other, reachable through a standard API, auditable through a standard log format.

When this exists, the SaaS Coverage Map becomes an automated inventory rather than a manual survey. The SaaS Blind Spot closes structurally. Trickle-Truth becomes applicable to SaaS platforms — the garden environment can serve synthetic data through the same protocol. This is a regulatory and standards trajectory, not a technology one. The technology exists. The business incentives for SaaS vendors to support it do not — yet.

### The Three Futures of the Octagon

**Future 1 — Universal Baseline (optimistic):** Hardware attestation becomes commodity. SaaS mediation becomes standard. The Octagon becomes the regulatory baseline for critical infrastructure. Every bank, hospital, utility, and defense contractor must demonstrate Octagon satisfaction annually. The architecture validation checklist (Appendix B) becomes the SOC 2 of the 2030s. This future aligns with the intent of Executive Order 14028 (*Improving the Nation's Cybersecurity*, May 2021), which mandates zero-trust architecture adoption across federal agencies and establishes the Software Bill of Materials (SBOM) as a procurement requirement, and with NIST SP 800-207, which defines zero-trust architecture as the reference standard for federal systems.

**Future 2 — High-Side Standard (realistic):** Hardware attestation and bilateral enforcement remain operationally expensive even as hardware costs drop. The Octagon becomes the standard for high-security environments — financial transaction backbones, health data exchanges, defense networks, critical infrastructure control planes — while the broader enterprise continues at the B/C maturity level. This future reflects the DoD's pragmatic FY2027 ZTA implementation target and NSA's Zero Trust Implementation Guide, both of which acknowledge that full ZTA implementation — including PQC modernization under FIPS 203, 204, and 205 — is a 5-10 year transition that not all organizations can resource equally.

**Future 3 — Theoretical Pole (pessimistic):** The complexity and brittleness of full Octagon satisfaction prove too high for widespread adoption. The axioms remain a theoretical ideal against which real architectures are measured and found wanting. The value of the Octagon becomes its diagnostic function — identifying which axioms an architecture violates, and what those violations cost. Under this future, organizations prioritize the subset of axioms that address their most acute threats (typically Axioms 2, 4, and 6 for breach containment) while deferring full-spectrum satisfaction to the next architectural generation. This pragmatic convergence mirrors the DoD's own approach of targeting "minimum viable security" per COA before attempting enterprise-wide deployment, as documented in the DoD Zero Trust Reference Architecture (Version 2.0).

---

## The Invariant Across Futures

Three claims hold regardless of which future materializes:

1. **Axiom 7 (Epistemic Integrity) is the asymptote.** As hardware attestation costs drop and cryptographic provenance becomes ubiquitous, the distance between current architectures and Axiom 7 shrinks faster than for any other axiom.

2. **Axiom 6 (Byzantine Fault Tolerance) is the differentiator.** The gap between organizations that survive their own defense mechanisms and organizations that are harmed by them is not a technology gap — it is an organizational culture gap. BFT is satisfied by architectures that design for failure, not architectures that buy tools.

3. **Axiom 8 (Bilateral Symmetry) is the frontier.** Mutual enforcement requires protocol standards that cross organizational boundaries — between companies, between cloud providers, between SaaS vendors and their customers. The technical capability exists. The regulatory frameworks for requiring it do not. This is the long pole in the Octagon's adoption timeline.

---

## Final Words

Zero-trust architecture is not a product you buy, a framework you follow, or a certification you earn. It is a set of invariants that you design, test, and evolve.

The Octagon defines the invariants. The morphological matrix structures the design space. The attack traces validate understanding. The decision trees chart the path.

Eight axioms. Nine dimensions. Four archetypes. One compass.

Build toward the Octagon. The rest is implementation detail.

---

## Key Takeaways

1. **The cross-archetype decision matrix maps pain to first move. It is the book's most practical output — identify your pain, read the corresponding row, act.**
2. **Run the Octagon audit annually or on any structural change — new platform, new org structure, or post-incident. Drift accumulates silently; the audit catches it.**
3. **The quantum and AI future does not change the axioms. It changes the implementation: algorithms, key sizes, and attestation chains. Build dual-stack crypto today. Anchor behavioral signals to hardware roots.**
4. **The hardest dimension to upgrade — D8 (Organizational Posture) — is also the highest-ROI. A fused, blameless, presumptively-wrong culture costs nothing and produces outsized architectural resilience.**

---

## Cross-References

**Builds On:** [§14: Enterprise Turnaround](./14-enterprise-turnaround.md), [§15: Velocity Defender](./15-velocity-defender.md), [§16: Scaling Pat](./16-scaling-pat.md), [§17: The Aspirant's Gate](./17-the-aspirants-gate.md)
**Related:** [Appendix A: Quantum + AI Adversary Stress-Tests](../appendix/appendix-a-quantum-ai-threats.md)
