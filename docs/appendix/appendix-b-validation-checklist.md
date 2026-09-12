---
cover: /images/covers/appendix/appendix-b-validation-checklist.webp
coverAlt: "Illustration: an inspection bench with an octagonal stamp, blank checklist and three marking pens"
---

# Appendix B: Architecture Validation Checklist

> **Prerequisites:** [§3: The Octagon as Validation Instrument](../01-foundations/03-octagon-as-instrument.md)

---

**Instructions:** Present these questions to the architecture owner or CISO. Score each axiom as Green (satisfied), Yellow (partially satisfied), or Red (violated). The goal is not a numeric score — it is identifying which axioms need attention. This checklist is designed for annual re-use as a health assessment and for post-incident application as a gap-identification tool.

## Question 1 — No Intrinsic Trust (Axiom 1)

Does any entity receive trust by virtue of its position, ownership, or history?

| Green 🟢 | Yellow 🟡 | Red 🔴 |
|---------|----------|--------|
| Every access decision is independent. Network position, history, and identity age are not trust factors. | Some legacy systems grant trust by subnet or VPN membership. Critical paths use per-request authorization. | Internal network is a trust zone. Service accounts have standing access. VPN users are "inside." |

---

## Question 2 — Verifiable Policy (Axiom 2)

Can a neutral third party replay your access policy with a stored input set and reproduce the same verdict?

| Green 🟢 | Yellow 🟡 | Red 🔴 |
|---------|----------|--------|
| Policy is in version control, is a deterministic state machine, and can be replayed by an independent evaluator. | Policy rules are documented and auditable, but the evaluation engine is a vendor black box. | Policy is configured through a vendor UI with no exportable, replayable form. |

---

## Question 3 — Unbypassable Mediation (Axiom 3)

Is there any path to a resource that does not invoke the evaluation function?

| Green 🟢 | Yellow 🟡 | Red 🔴 |
|---------|----------|--------|
| Every interaction — including emergency admin access, physical console, and SaaS-to-SaaS — is mediated by the evaluation function. | Self-hosted resources are mediated. Some SaaS or legacy systems have independent access paths. Emergency break-glass is audited. | Once past the network perimeter, internal traffic is unmediated. SaaS platforms authenticate independently. Admins have unmediated console access. |

---

## Question 4 — Continuous Verification (Axiom 4)

What is the maximum time between verification and access? Is it risk-calibrated?

| Green 🟢 | Yellow 🟡 | Red 🔴 |
|---------|----------|--------|
| Re-verification is continuous or at a cadence shorter than the compromise-to-exploitation window. | Re-verification occurs periodically (minutes). Faster than session lifetimes but not risk-calibrated. | Verification occurs once at authentication or deployment. Session tokens are trusted for their entire TTL. |

---

## Question 5 — Deterministic Bounded Authority (Axiom 5)

Can you calculate the exact maximum set of state transitions a compromised credential could authorize?

| Green 🟢 | Yellow 🟡 | Red 🔴 |
|---------|----------|--------|
| Every credential has an explicitly calculable authority vector. "Admin" roles do not exist. | Critical paths use JIT access with explicit scoping. Legacy role-based access for non-critical systems. | Role-based access with broad scopes. Credential compromise = "they can do anything the real user can." |

---

## Question 6 — Byzantine Fault Tolerance (Axiom 6)

Does compromise of a single component cascade to the rest of the system?

| Green 🟢 | Yellow 🟡 | Red 🔴 |
|---------|----------|--------|
| Compromise of one component is contained. Defense responses are non-cascading. Independent observers detect divergences. | Some defenses cascade (lockouts affect legitimate users). Independent verification exists for critical paths. | Hard Deny locks out legitimate users. Log tampering goes undetected. Defense mechanisms cause cascading failure. |

---

## Question 7 — Epistemic Integrity (Axiom 7)

Do state inputs to your policy engine carry cryptographic proof of provenance?

| Green 🟢 | Yellow 🟡 | Red 🔴 |
|---------|----------|--------|
| Every state input carries a hardware-rooted or cryptographically verified provenance chain. Self-reported state is used only for denial. | Some critical signals carry provenance. Others (behavioral, logs) are trusted implicitly. | All state inputs are trusted at face value. IDP token is the only attestation. Log integrity is assumed. |

---

## Question 8 — Bilateral Symmetry (Axiom 8)

Does the client verify the resource's state before sending data?

| Green 🟢 | Yellow 🟡 | Red 🔴 |
|---------|----------|--------|
| Every data sender verifies the receiver before transmitting. mTLS is universal. Application-layer identity verified bidirectionally. | mTLS on critical paths. Client verification exists for high-sensitivity flows but not all. | Data senders trust the infrastructure to route correctly. Server authenticates to client; client does not authenticate server beyond transport. |

---

## Score Summary

| Axiom | Score 🟢🟡🔴 | Notes |
|-------|:-------:|-------|
| 1. No Intrinsic Trust | | |
| 2. Verifiable Policy | | |
| 3. Unbypassable Mediation | | |
| 4. Continuous Verification | | |
| 5. Bounded Authority | | |
| 6. Byzantine Fault Tolerance | | |
| 7. Epistemic Integrity | | |
| 8. Bilateral Symmetry | | |

**Red axioms are architectural violations. Address them in priority order: start with the lowest-cost fix (typically D8 or D9) or the highest-leverage fix (D5 or D4), per the decision matrix in Chapter 18.**

---

## Cross-References

**Builds On:** [§3: The Octagon as Validation Instrument](../01-foundations/03-octagon-as-instrument.md) — the eight diagnostic questions and scoring rubrics.

**Related:** [§2: The Octagon](../01-foundations/02-the-octagon.md) — eight axioms with invariant definitions. [§7: Meta-Patterns](../02-methodology/07-meta-patterns.md) — leverage point hierarchy (D5 > D4 > D8 > D2 > D7). [§18: Decision Matrix in Practice](../04-synthesis/18-decision-matrix-and-conclusion.md) — pain-threat pairs mapped to chapters.

**Next:** [Appendix C: Glossary Population and Consistency](./appendix-c-glossary.md) — complete glossary of all domain terms.

---

## Complementary Frameworks

This checklist validates architectural integrity against the Octagon. For organizational maturity assessment, use CISA ZTMM v2.0 (see [Appendix E](./appendix-e-cisa-ztmm-crosswalk.md) for crosswalk). For governance assessment, use NIST CSF 2.0 Govern function (see [§7: Meta-Patterns](../02-methodology/07-meta-patterns.md)). For implementation planning, cross-reference NSA ZIG Primer (see [§13: Self-Assessment Diagnostic](../04-synthesis/13-self-assessment.md)).
