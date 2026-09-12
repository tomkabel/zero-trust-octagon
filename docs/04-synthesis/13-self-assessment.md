---
title: "Self-Assessment: Mapping Your Organization to an Archetype"
description: "Twelve diagnostic questions to identify your zero-trust archetype and route to the correct implementation pathway."
outline: deep
cover: /images/covers/04-synthesis/13-self-assessment.webp
coverAlt: "Illustration: a diagnostic console with twelve ticks, a sweeping needle and three diverging paths"
---

# 13. Self-Assessment: Mapping Your Organization to an Archetype
> **Learning Objectives**
> - Answer twelve diagnostic questions to identify which archetype (B, C, or D) your organization most closely matches
> - Calibrate your primary threat model and budget bracket
> - Receive a clear archetype diagnosis with the appropriate implementation chapter
> - Understand the limitations and edge cases of archetype mapping

**Prerequisites:** [Chapter 2: The Octagon](../01-foundations/02-the-octagon.md), [Chapter 4: The Morphological Matrix](../02-methodology/04-the-morphological-matrix.md)

---

## Why This Assessment Matters: The Confidence/Reality Gap

Before you answer the twelve questions, understand the data:

- 57% of organizations believe they have reached "Advanced" zero-trust maturity (RSA ID IQ Report 2026, 2,120 respondents).
- 69% of all respondents experienced an identity-related breach in the last three years, and 70% of those described the breach as severe.
- 91% have not reached optimal CISA-defined zero-trust maturity for identity — the most mature pillar (separate CISA assessment, not the RSA survey).
- 88% of all respondents experienced an identity-related breach at some point, a 27-percentage-point increase in breach prevalence from 2025. The RSA report does not publish the conditional breach rate for the Advanced self-assessment group specifically, but the magnitude of the overlap between the 57% and the 69% makes statistical independence implausible.

This is the confidence/reality gap. Organizations overestimate their zero-trust maturity by a structurally significant margin, and the penalty for that overestimation is breach. The organizations with the highest self-assessed confidence — those most certain they are "doing zero trust" — are the ones most likely to be breached through the seams between their tools. The mechanism is worth understanding: the tools that measure maturity also generate a sense of progress, and that sense of progress masks the gaps between pillars. If you are reading this and thinking "but my organization is different," that impulse is the mechanism.

This phenomenon is not a statistical anomaly. It is a structural feature of zero-trust assessment: the tools that measure maturity also generate a sense of progress, and that sense of progress masks the gaps between pillars. An organization with phishing-resistant MFA (Identity at Advanced) and comprehensive endpoint detection (Devices at Advanced) but no microsegmentation (Networks at Initial) and inconsistent data classification (Data at Traditional) is vulnerable to exactly the lateral movement that zero-trust is designed to prevent. But their self-assessment focuses on the pillars where they've invested — and the average across pillars obscures the attack surface in the weakest ones.

This gap is not a measurement error — it is an incentivized outcome. The entities that measure maturity (vendors, consultants, frameworks) are the same entities that benefit from reporting it as high. Vendors sell tools and produce adoption reports. Consultants sell maturity assessments that benchmark against frameworks — and frameworks are political documents negotiated by committees whose participants each have a stake in the framework making their product or approach look sufficient. The assessment ecosystem is structurally rewarded for reporting progress, not precision. A framework that required integration verification — "does your MFA attestation chain survive a compromised identity provider?" — would declare most participants insufficient, so frameworks settle for adoption-level questions ("do you have phishing-resistant MFA?"). The entity that could credibly report "the tools you bought aren't connected and you're breachable through the seams" has no commercial incentive to do so.

Do not be the 57%. Answer what is deployed today. The assessment should err toward the harder path, not the easier one.

---

## How to Use This Assessment

The twelve questions below diagnose your organization's current zero-trust configuration. Answer each question with the option that best describes your reality — not your aspiration, not your roadmap, not what you told the board. What is actually deployed and operational today.

Choose one answer per question. If you are between answers, err toward the less mature option — the assessment should err toward the harder path, not the easier one.

After completing all twelve, tally your results. The archetype with the most matches is your diagnosis. If you have a tie, read the tiebreaker guidance at the end.

---

## The Twelve Diagnostic Questions

### Q1: Trust Anchor

What is the root of your attestation chain? When a workload or device joins your environment, what proves it is genuine?

- **A.** Certificates issued by a software CA (Active Directory, Okta, Kubernetes CA). No hardware attestation.
- **B.** Same as A.
- **C.** Same as A — cloud IAM, Kubernetes service accounts, CI/CD pipeline as the trust gate.
- **D.** Same as A — Google Workspace or Okta is the center of the universe.

*If you have hardware TPM attestation in production, mark A (Aspirant).*

---

### Q2: Identity Model

How are identities granted and maintained? Focus on the *majority* of your identities, not a pilot program.

- **A.** Probationary identity with behavioral baselining, or zero standing privileges with hardware-backed attestation.
- **B.** Attribute-based access control (ABAC) — role, time, location, clearance level are evaluated for each request.
- **C.** Short-lived JWTs or temporary cloud credentials minted at deploy time. Standard OIDC/SAML.
- **D.** Standard OIDC/SAML sessions with 12-24 hour TTLs. Google Workspace or Okta manages everything.

---

### Q3: Enforcement Layer

Where is policy actually enforced? If you have multiple layers, select the *outermost* layer — where does enforcement begin?

- **A.** Enforcement is at every layer: network, service mesh, application gateway, data (cryptographic), and bilateral (client-side).
- **B.** Network firewalls, VPN concentrators, and network access control lists. Policy enforcement stops at the perimeter.
- **C.** API gateways, ingress controllers, and application-level middleware. The application mediates its own traffic.
- **D.** An identity-aware proxy (Cloudflare Access, Tailscale) sits in front of self-hosted applications.

---

### Q4: Attestation Modality

How do you verify that a user, device, or workload is trustworthy at the moment of access?

- **A.** Heterogeneous triple attestation: multiple independent observers (eBPF, hypervisor, hardware counters) cross-validate.
- **B.** The IDP's token validity is the only verification. If the token is cryptographically correct, the entity is trusted.
- **C.** The CI/CD pipeline is the only attestation. If code passed tests and deployed, it is trusted at runtime.
- **D.** The IDP's authentication, plus a basic device posture check (MDM enrollment, OS version).

---

### Q5: Violation Response

What happens automatically when the system detects an anomaly?

- **A.** The session is seamlessly migrated to a live synthetic environment. The attacker receives convincing but fake data. No denial, no lockout, no alert visible to the attacker.
- **B.** Hard Deny: the account is locked, the connection is terminated, the IP is blocked. Automated and immediate.
- **C.** Degrade Gracefully: rate limiting, circuit breakers, and throttling. The system protects availability; it does not hard-block.
- **D.** No automated response. A webhook fires to Slack or PagerDuty. A human (or the only human) decides.

---

### Q6: Policy Distribution

How do policy changes reach enforcement points?

- **A.** Event-streamed (Kafka, NATS) — policy state changes propagate globally in sub-10ms. PEPs maintain local WASM-cached state.
- **B.** Push from a central control plane to distributed enforcement points. Policy syncs every 5-30 minutes.
- **C.** Declarative GitOps — policy is stored in version control. ArgoCD or similar syncs to the cluster.
- **D.** Clicking "Save" in the SaaS vendor's admin dashboard. The vendor handles distribution.

---

### Q7: Observability Trust

Can you independently verify what your monitoring dashboards tell you?

- **A.** Yes. Air-gapped truth pipeline with cryptographic attestation. Independent observers produce independently verifiable telemetry.
- **B.** No. The SIEM (Splunk, Elastic) is trusted as the single source of truth. If the agent stops reporting, we investigate — but we don't independently verify the data the agent *does* report.
- **C.** No. Datadog, Honeycomb, or Grafana dashboards are trusted implicitly. We don't have a second pipeline.
- **D.** No. We trust the SaaS vendor's logs (Okta, Cloudflare, Google Workspace). We have no independent verification.

---

### Q8: Organizational Posture

How do your security, IT, and engineering teams operate?

- **A.** Presumptively Wrong: we treat all architectural decisions as temporary and suspect. Blameless autopsies. Skeptic CISO rotations. Architecture evolves through falsification.
- **B.** Siloed: Identity, Network, and Security Operations are separate teams with formal handoff points.
- **C.** Fused: "You build it, you run it, you secure it." No dedicated SOC; the engineering team handles incidents.
- **D.** Fused: one person is the CISO, the network admin, the IT support, and the incident responder.

---

### Q9: Human Continuity

What happens when your primary responder is unavailable?

- **A.** Fully automated. No human in the loop for standard detection-response. Human handles ambiguous escalations only.
- **B.** 24/7 SOC with shift coverage and fallback. Response capability is always available.
- **C.** On-call rotation of 2-3 engineers. Reasonable coverage. If multiple people are simultaneously unavailable, there is a gap.
- **D.** Single point of failure. One person. If they are asleep, on a flight, or burnt out, the response chain is broken.

---

### Q10: Budget Bracket

What is your annual security operations budget (tools + staff, excluding compliance audits)?

- **A.** $10M+
- **B.** $2M - $10M
- **C.** $200K - $2M
- **D.** Under $50K

---

### Q11: Primary Threat Concern

What keeps you up at night?

- **A.** Nation-state / APT. Sophisticated, well-resourced adversaries with long time horizons.
- **B.** Credential theft and lateral movement. An attacker steals valid credentials and moves freely inside the perimeter.
- **C.** Supply chain injection. A compromised dependency or CI/CD pipeline poisons production workloads.
- **D.** MFA fatigue, phishing, and SaaS session hijack. An attacker gets into Google Workspace or Okta and reads everything.

---

### Q12: Deployment Velocity

How frequently do you deploy to production?

- **A.** Continuous — multiple times per hour, with canary and progressive rollout.
- **B.** Weekly or bi-weekly release cycles. Scheduled maintenance windows.
- **C.** Multiple times per day. CI/CD is the heartbeat. Deploy velocity is a core engineering value.
- **D.** Infrequent — SaaS tools are the platform. "Deployments" are configuration changes in dashboards.

---

## Scoring

For each question, record your answer choice (A, B, C, or D). The table below maps every question to its archetype scoring — each A answer scores toward Archetype A, each B toward Archetype B, and so on.

| Question | Dimension | Your Answer | Archetype Scoring |
|----------|-----------|-------------|-------------------|
| **Q1** — Trust Anchor | D4 Attestation | __ | A → Archetype A, B → B, C → C, D → D |
| **Q2** — Identity Model | D1 Identity | __ | A → A, B → B, C → C, D → D |
| **Q3** — Enforcement Layer | D3 Enforcement | __ | A → A, B → B, C → C, D → D |
| **Q4** — Attestation Modality | D4 Attestation | __ | A → A, B → B, C → C, D → D |
| **Q5** — Violation Response | D5 Response | __ | A → A, B → B, C → C, D → D |
| **Q6** — Policy Distribution | D6 Policy | __ | A → A, B → B, C → C, D → D |
| **Q7** — Observability Trust | D7 Observability | __ | A → A, B → B, C → C, D → D |
| **Q8** — Organizational Posture | D8 Org Posture | __ | A → A, B → B, C → C, D → D |
| **Q9** — Human Continuity | D9 Continuity | __ | A → A, B → B, C → C, D → D |
| **Q10** — Budget Bracket | Budget | __ | A → A, B → B, C → C, D → D |
| **Q11** — Primary Threat | Threat | __ | A → A, B → B, C → C, D → D |
| **Q12** — Deployment Velocity | Velocity | __ | A → A, B → B, C → C, D → D |

After filling in all twelve, tally each letter:

- **Mostly A:** You are Archetype A — The Holy Grail. You have satisfied most or all Octagon axioms. You are operating at the high-maturity cluster. Jump to [Chapter 14: The Enterprise Turnaround](./14-enterprise-turnaround.md) for target-state acknowledgment and the forward-looking synthesis in Chapter 18.
- **Mostly B:** You are **Archetype B — Fortune 500 Illusion of Control**. Your primary threat is credential theft and lateral movement. Jump to [Chapter 14: The Enterprise Turnaround](./14-enterprise-turnaround.md).
- **Mostly C:** You are **Archetype C — Move Fast, Fix It In Prod**. Your primary threat is supply chain injection. Jump to [Chapter 15: The Velocity Defender](./15-velocity-defender.md).
- **Mostly D:** You are **Archetype D — SaaS-Glued Lean Defense**. Your primary threat is MFA fatigue and SaaS session hijack. Jump to [Chapter 16: Scaling Pat](./16-scaling-pat.md).

---

## Tiebreakers

**If you have a B/C tie** (common for mid-size tech companies with some enterprise tooling): You are Archetype C if your answer to Q12 (Deployment Velocity) was C (multiple times per day). You are Archetype B if Q12 was B (weekly cycles). Velocity is the decisive dimension — it determines whether you can adopt startup-style hardening or need enterprise-style restructuring.

**If you have a C/D tie** (common for seed-stage startups that use both Kubernetes and SaaS): You are Archetype D if your answer to Q10 (Budget) was D (under $50K). The solo-operator budget bracket overrides the tooling profile. You are Archetype C if your budget is C ($200K+) and you have at least 2-3 engineers in rotation.

**If you have an A scattered among your answers** (e.g., one or two A's mixed in with B's or C's): You are not Archetype A. Archetype A is the configuration where *all* dimensions have reached the high-maturity cluster. Isolated high-maturity values in a low-maturity cluster produce the diminishing returns described in Chapter 7.

---

## ZTMM Maturity Mapping

The table below shows the likely CISA Zero Trust Maturity Model (ZTMM) pillar profile corresponding to each archetype diagnosis. Use this to cross-check your self-assessment against an existing ZTMM evaluation if your organization has completed one.

| Your Self-Assessment Result | Likely ZTMM Maturity Profile |
|----------------------------|------------------------------|
| **Mostly B answers** | **Identity:** Advanced, **Devices:** Advanced, **Networks:** Initial/Advanced, **Apps:** Initial/Advanced, **Data:** Initial |
| **Mostly C answers** | **Identity:** Initial/Advanced, **Devices:** Initial, **Networks:** Initial, **Apps:** Advanced, **Data:** Traditional |
| **Mostly D answers** | **Identity:** Advanced, **Devices:** Traditional, **Networks:** Traditional, **Apps:** Initial, **Data:** Traditional |

> **Pillar-Average Masking.** A single ZTMM assessment averages pillar scores into a single maturity level (Initial, Traditional, Advanced, or Optimal). An organization with three Advanced pillars and two Initial pillars receives "Advanced" — the same label as an organization with all five at Advanced. The difference is the attack surface in the Initial pillars, which the average obscures. The twelve-question assessment above is designed to surface these masked gaps by measuring every dimension independently. If your ZTMM assessment says "Advanced" but your self-assessment returned mostly B answers, the discrepancy is the gap — your Advanced pillars are real, but your Initial pillars are where the next breach will originate.

---

## NSA's Phased Model

The National Security Agency's Zero Trust Implementation (NSA ZIG) Guide defines five implementation phases. The table below maps each NSA phase to the corresponding project archetype pathway, showing how the NSA's government-focused sequencing relates to the private-sector archetype paths in this document.

| NSA ZIG Phase | NSA Focus | Project Archetype Equivalent | Timeline |
|---------------|-----------|------------------------------|----------|
| **Discovery** | Asset inventory, user mapping, traffic baselining | **Chapter 13 Self-Assessment** — diagnostic questions and archetype identification | Before implementation begins |
| **Phase One:** Identity, Devices, Apps | Phishing-resistant MFA, device compliance, application access controls | **Archetype D — Months 1-6 (Chapter 16):** Hardware keys, SaaS hardening, automated response. **Archetype B — Months 1-6 (Chapter 14):** SIEM modernization, attestation upgrade | First two quarters |
| **Phase Two:** Network, Data | Microsegmentation, data classification, encryption policy | **Archetype C — Months 1-6 (Chapter 15):** Image signing, admission control, eBPF. **Archetype B — Months 6-16 (Chapter 14):** Service mesh, enforcement modernization | Quarters 2-4 |
| **Phase Three:** Advanced | Automation, orchestration, cross-pillar integration | **Archetype A target state:** Integrated detection and response across all dimensions | Year 2+ |
| **Phase Four:** Advanced (Deferred) | Remaining automation for complex, high-cost use cases | **Archetype A + Appendix A stress tests:** Quantum and AI adversary preparation | Year 2+ |

> **NSA-to-Archetype Note.** The NSA ZIG phases assume a large enterprise with dedicated security teams — the closest fit is Archetype B (Fortune 500). If your organization is Archetype C (high-velocity startup) or Archetype D (solo operator), your phase sequence will be reordered: you will likely implement Phase One and Phase Two elements in parallel, and your Phase Three automation will arrive earlier relative to the NSA timeline because your deployment velocity is higher. Use the NSA model as a completeness checklist, not a sequencing mandate.

---

Your archetype is not your destiny. It is your starting point. The implementation chapters (14-17) are designed to move you from your current archetype toward increasing Octagon satisfaction. The paths are practical, costed, and include gate checks to detect when the primary route breaks.

The goal is not to become Archetype A tomorrow. The goal is to satisfy one more Octagon axiom this quarter than last quarter. The Octagon is the compass. The decision tree is the map.

---

## Key Takeaways

1. **Answer the twelve questions based on what is deployed today, not what is on your roadmap. Self-assessment that flatters is worse than useless — it routes you to the wrong decision tree.**
2. **Archetype A is not a possible diagnosis from this assessment unless you have hardware-attested provenance, bilateral enforcement, and Trickle-Truth in production. Scattered A answers among B/C/D answers do not make you an Aspirant.**
3. **Tiebreakers prioritize deployment velocity (B vs. C) and budget (C vs. D) because those are the dimensions that most constrain viable upgrade paths.**
4. **The confidence/reality gap is the structural risk that this assessment is designed to counter.** Organizations overestimate their maturity by a wide margin — 57% believe they are Advanced, 69% are breached — and the pillars where they are weakest (Networks at Initial, Data at Traditional) are the ones they are least aware of. This assessment measures all pillars equally and routes you to the implementation chapter for your weakest dimension, not your strongest.

---

## Cross-References

**Next:** [Chapter 14: The Enterprise Turnaround](./14-enterprise-turnaround.md)
**Builds on:** [Chapter 2: The Octagon](../01-foundations/02-the-octagon.md), [Chapter 4: The Morphological Matrix](../02-methodology/04-the-morphological-matrix.md)
