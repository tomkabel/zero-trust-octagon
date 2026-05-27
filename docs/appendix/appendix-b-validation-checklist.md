# Appendix B: Architecture Validation Checklist

**Instructions:** Present these questions to the architecture owner or CISO. Score each axiom as Green (satisfied), Yellow (partially satisfied), or Red (violated). The goal is not a numeric score — it is identifying which axioms need attention.

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

## Cross-Reference

- **Full audit guidance:** [Chapter 3: The Octagon as Validation Instrument](../01-foundations/03-octagon-as-instrument.md)
- **Leverage hierarchy:** [Chapter 7: Meta-Patterns](../02-methodology/07-meta-patterns.md)
- **Decision matrix:** [Chapter 18: Decision Matrix in Practice](../04-synthesis/18-decision-matrix-and-conclusion.md)
