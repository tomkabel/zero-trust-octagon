# Appendix A: Quantum + AI Adversary Stress-Tests

> **Prerequisites:** [§2: The Octagon](../01-foundations/02-the-octagon.md), [§7: Meta-Patterns](../02-methodology/07-meta-patterns.md), [§12: Cross-Trace Synthesis](../03-archetypes/12-cross-trace-synthesis.md)

---

This appendix stress-tests each Octagon axiom against two future threat models that do not exist at scale today but will define the next decade of zero-trust architecture. The goal is not to predict the future — it is to identify which architectural decisions made today will survive the transition and which will need fundamental re-engineering.

---

## Threat Model 1: Quantum Adversary

**Assumptions:** The adversary has access to a cryptographically relevant quantum computer (CRQC) — approximately 4,000+ logical qubits with error correction, capable of running Shor's algorithm against 256-bit elliptic curve keys and halving the effective security of RSA-2048.

**Timeline:** Most estimates place CRQC availability in the 2028-2035 window for nation-state actors. The conservative side of this range (2028-2030) means that infrastructure being procured and deployed today will still be in service when the threat materializes.

#### Regulatory PQC Timeline (NIST IR 8547, NSM-10, CNSA 2.0)

The migration to post-quantum cryptography is not speculative — it is mandated by an escalating set of federal requirements with fixed deadlines:

| Regulatory Action | Date | Requirement |
|------------------|------|-------------|
| NIST FIPS 203/204/205 PQC Standards | August 2024 | ML-KEM (key encapsulation), ML-DSA (digital signatures), SLH-DSA (hash-based signatures) standardized |
| NSM-10 Strategic Posture | May 2022 | Federal systems must migrate to quantum-resistant cryptography; bulk of work before 2035 |
| OMB M-23-02 Cryptographic Inventory | Annual from 2023 | Agencies must submit prioritized cryptographic inventories of systems using quantum-vulnerable cryptography |
| CNSA 2.0 Phase 1: Software/firmware signing | 2025 | All software and firmware signing must transition to CNSA 2.0-approved algorithms |
| First CAVP PQC Certifications | January 2026 | CIQ NSS and SafeLogic modules received CAVP certification covering ML-KEM and ML-DSA — *but these are NOT FIPS 140-3 validated* |
| FIPS 140-2 → FIPS 140-3 Transition Complete | September 21, 2026 | All newly procured or renewed cryptographic modules must carry FIPS 140-3 compliant validation |
| CNSA 2.0 Phase 2: Web browsers/servers, cloud services | 2026 | All web browsers, servers, and cloud services must use CNSA 2.0-approved algorithms by default |
| DoD ZTA Target-Level Deadline | September 2027 | All DoD information systems must achieve Target-level ZTA — **before PQC migration is complete** |
| NIST IR 8547: RSA/ECC Deprecated | After 2030 | All new systems must use post-quantum cryptography; RSA and ECC deprecated for new deployments |
| NIST IR 8547: RSA/ECC Disallowed | After 2035 | No quantum-vulnerable public-key algorithms permitted in any federal system |
| CNSA 2.0 Phase 3: Networking technologies | 2030 | All networking technologies (VPNs, routers, etc.) must use CNSA 2.0-approved algorithms |
| CNSA 2.0 Phase 4: Niche equipment, legacy OT | 2033 | Final phase — niche equipment with long refresh cycles must complete migration |

**The ZTA-PQC Dependency Problem (September 2027 vs. 2030-2035):**

The DoD ZTA Target-Level deadline (September 2027) requires all DoD information systems to achieve Target-level zero trust architecture. But the PQC migration deadline is 2030-2035 — three to eight years later. This is a coordination gap between regulatory schedules set by different working groups, not a flaw in zero trust architecture. But do not mistake a coordination gap for a paperwork problem. It means that the cryptographic foundation of every system achieving ZTA compliance in 2027 — TPM attestation chains, SPIFFE SVID signatures, mTLS cipher suites, policy-hash verification — will need to be *replaced*, not upgraded, within 3–8 years. The cost of that replacement is not budgeted in current ZTA procurement cycles.

The coordination gap produces four structural risks beyond the cryptographic migration itself:

1. **Compliance deadlock:** A system that achieves ZTA Target-Level in 2027 must simultaneously maintain cryptographic compliance under FIPS 140-3 (which mandates NIST-validated modules with classical algorithms) while preparing for PQC migration (which requires modules that do not yet exist in validated form). The system is caught between two compliance regimes that pull in opposite directions: FIPS 140-3 requires classical validation *now*, and NIST IR 8547 will require PQC validation *later*. There is no transition standard for dual-validated modules.

2. **International divergence:** NIST's PQC timeline applies to U.S. federal systems. EU (EUCC), UK (NCSC), and other national cryptographic authorities publish independent PQC roadmaps on independent schedules. A zero-trust architecture spanning jurisdictions must reconcile multiple PQC migration timelines that may differ by 2-5 years. Systems deployed globally in 2027 may need to support three different cryptographic profiles simultaneously: U.S. classical (current), U.S. PQC (future), and EU/UK PQC (different algorithms, different transition dates).

3. **TPM hardware limits:** Current TPM 2.0 firmware has limited NVRAM for PQC key storage (ML-DSA private keys are 2.5-4.8 KB vs. 32 bytes for ECDSA P-256) and limited computational throughput for lattice-based signatures. A TPM procured in 2026 must either support PQC algorithms in firmware or be replaced before 2035. Most TPMs in the current hardware fleet do not support ML-DSA attestation quotes, and firmware update availability is vendor-dependent with no universal commitment. This is the hard constraint on the ZTA-PQC timeline: the hardware root of trust that ZTA depends on cannot be migrated to PQC through software alone.

4. **Dual-stack operational cost:** Running conventional and PQC cryptography in parallel for 5-7 years means every TLS handshake exchanges 4-10x larger certificates, every SPIFFE SVID carries a dual signature chain, every attestation quote includes two signatures. The bandwidth, CPU, and latency overhead compounds across every hop in the service mesh — an mTLS call traversing 5 services now carries 5 rounds of dual cryptographic overhead. The performance impact is measurable in milliseconds per call, and the aggregate infrastructure cost (additional CPU, memory, network throughput) is not budgeted in current ZTA procurement cycles.

The practical consequence is unchanged:

1. Systems achieve ZTA compliance in 2027 using classical cryptography (ECDSA certificates, ECDHE key exchange, RSA policy signatures) [DR-§3.1].
2. Those same systems then require complete cryptographic rework when PQC mandates take effect between 2030 and 2035 [DR-§3.1].
3. This includes TPM attestation chains (currently ECDSA P-256), SPIFFE SVID signatures, mTLS cipher suites, policy-hash verification — every cryptographic primitive that ZTA depends on.
4. PQC algorithms use 4-10x larger key and signature sizes than their classical equivalents, impacting performance, network bandwidth, and certificate chain management [DR-§3.2].

**As of May 2026, NO FIPS 140-3 validated PQC module exists.** [DR-§3.2] NIST's own projection (summer/fall 2025, presented at the PKI Consortium PQC Conference in Austin) was not met. The first validated module has no fixed closing date. Organizations that defer PQC planning until the first validated module appears will compress an already-constrained migration timeline — cryptographic migration cycles average 7-10 years across enterprise environments, and organizations starting PQC work in 2026 are already targeting completion at the boundary of the disallowance window with no schedule slack.

**The action window for PQC migration in zero-trust is 2026-2030.** Infrastructure procured in 2026 will be receiving firmware updates until 2030-2032. The migration must be planned and funded before the hardware procurement cycle locks in non-PQC silicon. Dual-stack cryptography — conventional and PQC in parallel — is the correct strategy, with an expected 5-7 years of overlap before conventional algorithms can be fully deprecated.

Sources: [DR-§3.1] NIST IR 8547 regulatory PQC timeline; [DR-§3.2] FIPS 140-3 validation gap and PQC market dynamics; [TR-§3.1.4] Mexico government breach and AI adversary landscape analysis; [DR-§2.3] Speed asymmetry and 27-second breakout data; [DR-§4] PQC-ZTA-AI synchronization research.

**What breaks:** Virtually every asymmetric cryptographic primitive used in current zero-trust deployments.

| Cryptosystem | Applications in ZTA | CRQC Impact |
|--------------|--------------------|-------------|
| ECDSA (P-256, P-384) | Certificate signing, TPM attestation, JWT signing, SPIFFE certificates | Completely broken — forgery of arbitrary signatures |
| ECDH (X25519) | TLS key exchange, mTLS session establishment | Completely broken — shared secret recovery from public key |
| RSA (2048, 4096) | Certificate authorities, code signing keys, legacy attestation | Effectively halved key strength — 2048-bit RSA reduced to equivalent of 512-bit |
| HMAC / SHA-256 (symmetric) | Log integrity, Merkle trees, event stream authentication | Unaffected — Grover's algorithm provides quadratic speedup, mitigated by doubling key size |

**The result:** A CRQC can forge TPM attestation quotes, mint valid SPIFFE certificates for arbitrary workloads, sign fake policy bundles that enforcement points will accept, and impersonate any mutually TLS-authenticated peer. This is not a partial compromise. It is a total collapse of cryptographic provenance across every layer that depends on asymmetric signatures.

---

## Threat Model 2: AI Adversary

**Assumptions:** The adversary operates a domain-fine-tuned LLM agent system that can generate novel attack chains, synthesize convincing deepfake telemetry, model and reproduce legitimate user behavior, and adapt tactics faster than human defenders can respond.

**Timeline:** Near-current (GPT-5 class or equivalent). This is not speculative — the capability to generate convincing phishing emails, deepfake voice, and basic attack tooling already exists.

**What is threatened:** Attestation and detection mechanisms that rely on software-level signals.

| Defensive Layer | AI Threat | Severity |
|-----------------|-----------|----------|
| Behavioral attestation | LLM models legitimate user's typing cadence, navigation patterns, access timing, and reproduces them with high fidelity | High — behavioral signals without hardware anchoring become unreliable |
| Deepfake telemetry | AI generates convincing device posture reports, system health metrics, OS-level health assertions | High — the PDP evaluates policy on fabricated input |
| Circumvention of dynamic deception | Attacker LLM probes garden environment boundaries systematically and detects inconsistencies faster than static honeypot detection | Moderate — high-quality Trickle-Truth resists but adds generation cost |
| Social engineering | Hyper-personalized, context-aware spear-phishing at scale against every employee simultaneously | Moderate — defense is hardware-backed keys, not user awareness training |

**Critical distinction:** A CRQC breaks *mathematical trust*. An AI adversary breaks *behavioral trust*. The two are orthogonal — an AI adversary cannot forge a TPM-signed attestation report, and a quantum adversary cannot generate a convincing human conversation. The defense against each requires a different architectural upgrade.

#### Real-World AI Adversary: The Mexico Government Breach (Dec 2025 – Feb 2026)

The Mexico government breach is the canonical demonstration of AI-speed autonomous attacks at scale [TR-§3.1.4]. A single operator using Anthropic Claude and OpenAI GPT in parallel — one model handling exploitation, the other processing harvested data and feeding instructions back — executed over 5,000 AI-driven commands across 9 government agencies. Claude autonomously identified SCADA interfaces as high-value targets without explicit direction, discovering attack surface that defenders themselves did not know existed.

The breach validates two core Octagon claims:

1. **Axiom 7 (Epistemic Integrity) is the most universally violated axiom.** The attacker's knowledge of the target system exceeded the defender's knowledge of their own system. This is the asymmetry the textbook warns about: when Epistemic Integrity is violated, the defender cannot protect what they do not know exists [TR-§3.1.4].

2. **D4 (Behavioral Attestation) is the primary AI target.** The attacker LLM did not need to forge hardware signatures — it needed to behave convincingly. The SCADA interfaces were identified through semantic analysis of configuration files, not through cryptographic compromise. An AI adversary targets the behavioral layer because it is the cheapest entry point [TR-§3.1.4].

#### Emerging Threat: Prompt Injection Against AI-Augmented Security Tools

As security operations centers deploy AI-augmented tools for detection triage and alert correlation, a new attack surface emerges: prompt injection against the security tools themselves [DR-§2.3]. Ten verified indirect prompt injection payloads have been deployed on public websites targeting AI-powered security agents with goals including financial fraud, API key theft, and induced denial-of-service on detection pipelines [TR-§3.1.4]. An adversary who compromises the security tool's reasoning chain can induce false negatives on their own attacks — the machine-speed equivalent of blinding the watchtower.

#### Speed Asymmetry: The 27-Second Problem

The defining operational challenge of AI-speed adversaries is the breakout time: CrowdStrike data shows an average eCrime breakout time of 29 minutes, with the fastest observed breakout at 27 seconds [DR-§2.3]. Human-in-the-loop security operations — designed around defense-in-minutes or defense-in-hours — cannot match this pace. The 27-second breakout time means a sophisticated AI-driven attack can complete lateral movement before a human analyst has opened the alert. This speed asymmetry forces architectural decisions: D9 (Human Continuity) must be augmented with automated initial response, and D7 (Observability Trust) must operate at machine speed [DR-§2.3].

---

## Stress-Test Results: Each Axiom Under Both Threats

### Axiom 1: No Intrinsic Trust

| Quantum | AI |
|---------|-----|
| ✅ Resists. The axiom is logical — "trust is a transient verdict" — not cryptographic. A CRQC does not change whether trust can be intrinsic. The question is whether the verdict is *correct*. | ✅ Resists. The conceptual model is unaffected by the adversary's generation capability. |

**Verdict: Stable.** No change required.

---

### Axiom 2: Explicit, Verifiable Policy

| Quantum | AI |
|---------|-----|
| ⚠️ Vulnerable if policy signing keys use ECDSA or RSA. If a CRQC can forge policy update signatures, an attacker can deploy malicious policies that appear authentic. **Mitigation:** Migrate to post-quantum signatures (ML-DSA, SLH-DSA) for policy signing. | ✅ Resists. Policy is deterministic — given the same input, the same output. An attacker LLM cannot change the evaluation function. |

**Verdict: Quantum-vulnerable.** Migration path: transition policy signing keys to ML-DSA or SLH-DSA during the PQC migration window.

---

### Axiom 3: Unbypassable Mediation

| Quantum | AI |
|---------|-----|
| ✅ Resists. Bypass requires a physical or logical path that does not invoke the evaluation function. A CRQC cannot create new mediation-bypassing paths. | ✅ Resists. No out-of-band paths exist regardless of the adversary's generation capability. |

**Verdict: Stable.**

---

### Axiom 4: Continuous Verification

| Quantum | AI |
|---------|-----|
| ✅ Resists. The re-verification cadence is a risk-driven parameter, not a cryptographic one. A CRQC does not slow or accelerate the cadence. | ⚠️ Vulnerable for *behavioral* re-verification signals. AI-generated deepfake telemetry could fool behavioral attestation — typing cadence, voice authentication, navigation sequences could all be plausibly reconstructed by an LLM trained on the user's historical data. **Mitigation:** Behavioral signals must be anchored to hardware-signed provenance. The TPM attests to the input device's firmware state, not just the user's behavioral pattern. |

**Verdict: AI-vulnerable for behavioral re-verification.** Behavioral signals without hardware anchoring become unreliable. Hardware-anchored behavioral signals (the TPM signs "this input came from a trusted keyboard") resist AI fabrication.

---

### Axiom 5: Deterministic Bounded Authority

| Quantum | AI |
|---------|-----|
| ✅ Resists. The authority vector is a mathematical set — "these 12 operations on these 3 resources." A CRQC cannot expand a bounded vector. | ✅ Resists. An LLM cannot expand a bounded authority set. |

**Verdict: Stable.**

---

### Axiom 6: Byzantine Fault Tolerance

| Quantum | AI |
|---------|-----|
| ✅ Resists. The fault tolerance model — N-of-M independent observers — holds regardless of the adversary's compute capability. | ⚠️ Vulnerable if components are homogeneous. An AI adversary could coordinate a distributed attack across N components simultaneously by exploiting the same zero-day or the same configuration weakness in each. **Mitigation:** Heterogeneous component stacks — different operating systems, different kernel versions, different vendor hardware — ensure that one AI-generated tool cannot compromise all observers simultaneously. |

**Verdict: AI-vulnerable for homogeneous components.** Diversity of observation (Heterogeneous Triple in D4) is the architectural defense against AI-coordinated multi-component attacks.

---

### Axiom 7: Epistemic Integrity

| Quantum | AI |
|---------|-----|
| ❌ **Critically vulnerable.** The entire attestation chain — TPM quotes, SPIFFE identity certificates, policy bundle signatures, code signing — depends on asymmetric cryptography that a CRQC will break. A forged TPM attestation quote + a valid-looking policy signature = a perfect but completely fabricated verdict. **Mitigation:** Transition the entire attestation chain to post-quantum cryptography. TPM firmware must support ML-DSA or SLH-DSA for attestation quotes. SPIFFE must support PQC certificate chains. | ⚠️ Vulnerable for self-reported attestation. An AI adversary can generate convincing but fabricated state claims — "I am a fully patched Windows 11 device" — that pass syntactic validation but have no hardware backing. **Mitigation:** Provenance must be hardware-rooted. Self-reported state is used for denial, never for authorization. The AI's fabricated claim is treated as hostile by default. |

**Verdict: Dual-vulnerable.** The quantum attack breaks cryptographic provenance. The AI attack breaks behavioral/semantic provenance. Only hardware-anchored, post-quantum-cryptographic attestation survives both threats.

---

### Axiom 8: Bilateral Symmetry

| Quantum | AI |
|---------|-----|
| ⚠️ Vulnerable. Mutual TLS (mTLS) is the standard bilateral verification mechanism, and mTLS key exchange (ECDHE) and authentication (ECDSA) are both broken by a CRQC. An attacker can impersonate either party in a TLS handshake. **Mitigation:** Migrate to post-quantum key exchange (ML-KEM) and post-quantum authentication (ML-DSA) in TLS 1.3. | ✅ Resists. Both parties must prove cryptographic state — an LLM cannot forge a private key signature. |

**Verdict: Quantum-vulnerable.** Migration path: enable PQC hybrid key exchange (ML-KEM + X25519) in mTLS handshakes during the transition window.

---

## Summary Stress-Test Matrix

| Axiom | Quantum | AI | Combined | Priority for PQC Migration |
|-------|:-------:|:--:|:--------:|:--------------------------:|
| 1. No Intrinsic Trust | ✅ | ✅ | ✅ | None |
| 2. Verifiable Policy | ⚠️ | ✅ | ⚠️ | High (policy signing keys) |
| 3. Unbypassable Mediation | ✅ | ✅ | ✅ | None |
| 4. Continuous Verification | ✅ | ⚠️ | ⚠️ | Medium (behavioral signals) |
| 5. Bounded Authority | ✅ | ✅ | ✅ | None |
| 6. Byzantine Fault Tolerance | ✅ | ⚠️ | ⚠️ | Medium (component diversity) |
| 7. Epistemic Integrity | ❌ | ⚠️ | ❌ | **Critical** (attestation chain) |
| 8. Bilateral Symmetry | ⚠️ | ✅ | ⚠️ | High (mTLS key exchange) |

**Axiom 7 (Epistemic Integrity) is the single most vulnerable axiom under combined quantum + AI threat.** It is already the most universally violated axiom in current architectures (Chapter 3). The quantum threat makes a bad situation critical: even organizations that have invested in hardware attestation must migrate their entire TPM key infrastructure to PQC or face attestation forgery.

---

## Migration Strategy: Dual-Stack Cryptography

The correct migration strategy for zero-trust cryptography is **dual-stack deployment** — conventional and post-quantum in parallel, with conventional used for verification and PQC prepared for cutover.

**For TPM attestation (D1):**
- Current: TPM quotes signed with ECDSA P-256
- Migration: TPM firmware updated to support ML-DSA in parallel with ECDSA
- Attestation verification: accept either signature. Log which algorithm was used.
- Cutover: once ML-DSA is verified at scale, deprecate ECDSA signature acceptance

**For mTLS (D8, D3):**
- Current: X25519 ECDH key exchange, ECDSA P-256 certificates
- Migration: Add ML-KEM as hybrid key exchange. Issue PQC hybrid certificate chains (ECDSA + ML-DSA).
- Verification: prefer PQC, accept conventional for legacy peers.
- Cutover: once all peers have PQC support, disable conventional key exchange.

**For policy signing (Axiom 2):**
- Current: ECDSA or Ed25519 signatures on policy bundles
- Migration: Sign policy bundles with both ECDSA and ML-DSA. Verification accepts either.
- Cutover: once all enforcement points have ML-DSA verification, drop ECDSA.

**For event stream authentication (D6):**
- Current: HMAC or ECDSA on event records
- Migration: Add ML-DSA as a parallel signature. Event consumers verify whichever signature their library supports.
- Cutover: once all consumers verify ML-DSA, drop conventional.

**The dual-stack approach expects 5-7 years of overlap before the conventional algorithm is fully deprecated.** This means 5-7 years of increased cryptographic overhead — more CPU, more network bandwidth (larger PQC certificates and signatures), and more complexity in certificate chain management.

---

## AI-Specific Defenses

Against an AI adversary, the architectural defense is fundamentally different from the cryptographic defense against quantum.

**Behavioral anchoring:** AI can generate convincing behavioral patterns. But AI cannot forge hardware-attested measurements from a TPM it does not control. Architectural upgrade: in D4, behavioral attestation must be cross-referenced with hardware-attested signals. "The user's keystroke pattern matches their baseline" is a signal. "The keyboard's firmware hash is verified and signed by the silicon root" is a proof. Only the combination resists AI.

**Observability hardening:** AI can generate deepfake telemetry. But it cannot simultaneously generate convincing telemetry across multiple independent observation pipelines. Architectural upgrade: D7 must move from Implicit Trust to at minimum Dual Pipeline. The divergence between the two pipelines is the detection signal for AI-generated telemetry.

**Deception resilience:** AI can probe garden environments for inconsistencies. Architectural upgrade: the LLM powering the garden environment must operate at a comparable capability level to the adversary's LLM. The deception quality required to resist an AI attacker is higher than what is required to resist a human attacker. The garden environment must regenerate data with internal consistency, temporal evolution, and cross-request referential integrity.

---

## Timeline: When to Act

| Threat | When It Arrives | Actions Required Now |
|--------|----------------|---------------------|
| AI-generated behavioral deepfakes | Already here | Anchor behavioral signals to hardware attestation. Cross-reference identity with cryptographic provenance. |
| AI-generated attack chain orchestration | 1-2 years | Implement dual-pipeline observability (D7). Automate initial response (D9) to match AI reaction speed. |
| CRQC capable of 256-bit ECDHE | 5-8 years | Begin inventory of all asymmetric keys in the infrastructure. Plan dual-stack certificate hierarchy. |
| CRQC capable of TPM attestation forgery | 8-12 years | Advocate for PQC-supporting TPM firmware in procurement cycles today. Hardware deployed now will be in service when this threat arrives. |

**The action window for PQC migration in zero-trust is approximately 2026-2030.** Infrastructure procured in 2026 will be receiving firmware updates until 2030-2032. The migration must be planned and funded before the hardware procurement cycle locks in non-PQC silicon.

---

## Cross-References

**Builds On:** [§2: The Octagon](../01-foundations/02-the-octagon.md) — eight axioms with invariant definitions. [§7: Meta-Patterns](../02-methodology/07-meta-patterns.md) — covariance clusters and leverage point hierarchy. [§12: Cross-Trace Synthesis](../03-archetypes/12-cross-trace-synthesis.md) — meta-patterns across all four archetype traces.

**Related:** [§3: Octagon as Instrument](../01-foundations/03-octagon-as-instrument.md) — diagnostic question derivation from axioms. [§4: The Morphological Matrix](../02-methodology/04-the-morphological-matrix.md) — nine dimensions and their value ranges. [§13: Self-Assessment Diagnostic](../04-synthesis/13-self-assessment.md) — archetype routing and diagnostic questions.

**Next:** [Appendix B: Architecture Validation Checklist](./appendix-b-validation-checklist.md) — the 8-question checklist derived from the Octagon.

---

## Key Takeaways

1. **Axiom 7 (Epistemic Integrity) is critically vulnerable to both quantum and AI threats.** The quantum threat breaks the cryptographic provenance chain. The AI threat breaks behavioral/semantic provenance. Only hardware-anchored, post-quantum-cryptographic attestation survives both.
2. **Dual-stack cryptography — conventional and PQC in parallel — is the correct migration strategy.** Expect 5-7 years of overlap before conventional algorithms can be fully deprecated.
3. **AI defenses are architectural, not cryptographic: behavioral anchoring to hardware, dual-pipeline observability, and garden environment AI parity.** None of these require new hardware — they require rethinking how existing signals are combined.
4. **The PQC migration window is 2026-2030.** Hardware procured today must support PQC firmware updates, or the infrastructure will need to be replaced before its useful life ends.
