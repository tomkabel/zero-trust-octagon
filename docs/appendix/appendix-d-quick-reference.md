# Appendix D: Dimensions + Axioms Quick-Reference Card

## The Eight Axioms (The Octagon)

| # | Axiom | Core Statement |
|---|-------|---------------|
| 1 | No Intrinsic Trust | Trust is a transient verdict, never a property. |
| 2 | Verifiable Policy | Policy is a deterministic, replayable state machine. |
| 3 | Unbypassable Mediation | All paths to resources invoke the evaluation function. |
| 4 | Continuous Verification | Verdicts expire. Time is a vector of risk. |
| 5 | Deterministic Bounded Authority | Blast radius is an explicitly bounded vector of permitted state transitions. |
| 6 | Byzantine Fault Tolerance | Compromise of a component does not cascade. |
| 7 | Epistemic Integrity | State inputs require cryptographic provenance. |
| 8 | Bilateral Symmetry | Verification is always mutual. |

---

## The Nine Morphological Dimensions

| Dim | Name | Key Question | Key Values |
|-----|------|-------------|------------|
| D1 | Trust Anchor | Where does trust ultimately root? | Software CA → Behavioral → Hybrid → Silicon → Distributed |
| D2 | Identity Model | How is identity granted? | Static JIT → ABAC → Probationary → Trust Decay → ZSP |
| D3 | Enforcement Layer | Where is policy enforced? | Network → Mesh → Gateway → Data → Silicon → Bilateral |
| D4 | Attestation Modality | How is trustworthiness verified? | TOFU → Single → Behavioral → Cascading → Continuous → Heterogeneous |
| D5 | Violation Response | What happens when trust breaks? | Hard Deny → Degrade → Micro-Friction → Auto-Escalate → Honeypot → Trickle-Truth |
| D6 | Policy Distribution | How does policy reach PEPs? | Push → JIT Pull → GitOps → Embedded → Bilateral → Event-Streamed |
| D7 | Observability Trust | Is monitoring itself trusted? | Implicit → Sequence → Dual → Merkle → Heterogeneous Consensus |
| D8 | Organizational Posture | How does the human org operate? | Siloed → Fused → Economic-Contract → Presumptively Wrong → Dojo |
| D9 | Human Continuity | What if the responder is unavailable? | Single SPOF → Small Rotation → 24/7 SOC → Fully Automated |

---

## Axiom-Dimension Mapping

| Axiom | Primary Dimension | Required Cluster |
|-------|------------------|-----------------|
| 1. No Intrinsic Trust | D2 (Identity) | Any — identity model is orthogonal to other dimensions |
| 2. Verifiable Policy | D6 (Distribution) | GitOps, Event-Streamed, or Bilateral |
| 3. Unbypassable Mediation | D3 (Enforcement) | At least one mediation layer past the perimeter |
| 4. Continuous Verification | D4 (Attestation) | Behavioral, Continuous, or Heterogeneous |
| 5. Bounded Authority | D2 (Identity) | ZSP or SPIFFE/SPIRE for machines |
| 6. Byzantine Fault Tolerance | D5 (Response) | Trickle-Truth or Micro-Friction |
| 7. Epistemic Integrity | D1 (Trust Anchor) | Silicon or Hybrid |
| 8. Bilateral Symmetry | D3 (Enforcement) | Service Mesh, Data, or Bilateral |

---

## Archetype Reference

| Archetype | Typical Diameter | Primary Threat | Cost Profile | Octagon Score |
|-----------|-----------------|----------------|-------------|:---:|
| A. Holy Grail | Critical infrastructure, high-security | Silicon supply chain | Extremely high | 8/8 |
| B. Fortune 500 | Enterprises with vendor suites | Stolen token, lateral movement | $2-10M/year | 2/6 |
| C. Cloud Startup | High-velocity engineering orgs | CI/CD supply chain injection | $500K-1M | 3.5/8 |
| D. Lean Defense | Solo operator (30-100 person) | MFA fatigue, SaaS hijack | $10/user/month | 3/8 |

---

## Decision Matrix: Which Dimension First?

| Pain | Threat | Start with | Because |
|------|--------|------------|---------|
| "Phishing" | Credential theft | D4 — hardware keys | Breaks session-theft chain |
| "Lockouts cause outages" | Defensive damage | D5 — away from Hard Deny | System must survive its own defense |
| "DevOps is the SOC" | Alert fatigue | D9 — automated fallback | Remove human SPOF |
| "We don't know our SaaS" | Shadow IT | D3 — expand mediation | No unmediated paths |
| "SIEM is absolute truth" | Log tampering | D7 — dual pipeline | Independent verification |
| "Devs deploy anything" | Supply chain | D4 layered + D6 GitOps | Continuous attestation |
| "Can't afford Holy Grail" | Everything | D8 fused + D9 automation | People first, then tech |

---

## Architecture Audit (Abbreviated)

1. ✏️ Does any entity get trust by position or history? (Axiom 1)
2. ✏️ Can policy be independently replayed? (Axiom 2)
3. ✏️ Any path to resources bypassing mediation? (Axiom 3)
4. ✏️ Max time between verification and access? (Axiom 4)
5. ✏️ Can credential blast radius be calculated? (Axiom 5)
6. ✏️ Does component compromise cascade? (Axiom 6)
7. ✏️ Do state inputs carry cryptographic provenance? (Axiom 7)
8. ✏️ Does client verify resource before sending data? (Axiom 8)

---

*This reference card is designed to be printed double-sided and kept at the desk of every architect, engineer, and CISO.*

*Full textbook: [Zero-Trust Reference Architecture] — available in the `docs/` directory.*
