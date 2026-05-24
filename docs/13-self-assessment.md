# 13. Self-Assessment: Mapping Your Organization to an Archetype

> **Learning Objectives**
> - Answer twelve diagnostic questions to identify which archetype (B, C, or D) your organization most closely matches
> - Calibrate your primary threat model and budget bracket
> - Receive a clear archetype diagnosis with the appropriate implementation chapter
> - Understand the limitations and edge cases of archetype mapping

**Prerequisites:** [Chapters 8-11: Full Attack Traces](./08-archetype-a-holy-grail.md), [Chapter 12: Cross-Trace Synthesis](./12-cross-trace-synthesis.md)

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

Tally your answers. Count each letter:

- **Mostly A:** You are Archetype A — The Holy Grail. You have satisfied most or all Octagon axioms. Jump to [Chapter 18: Decision Matrix and Conclusion](./18-decision-matrix-and-conclusion.md) for forward-looking synthesis.
- **Mostly B:** You are **Archetype B — Fortune 500 Illusion of Control**. Your primary threat is credential theft and lateral movement. Jump to [Chapter 14: The Enterprise Turnaround](./14-enterprise-turnaround.md).
- **Mostly C:** You are **Archetype C — Move Fast, Fix It In Prod**. Your primary threat is supply chain injection. Jump to [Chapter 15: The Velocity Defender](./15-velocity-defender.md).
- **Mostly D:** You are **Archetype D — SaaS-Glued Lean Defense**. Your primary threat is MFA fatigue and SaaS session hijack. Jump to [Chapter 16: Scaling Pat](./16-scaling-pat.md).

---

## Tiebreakers

**If you have a B/C tie** (common for mid-size tech companies with some enterprise tooling): You are Archetype C if your answer to Q12 (Deployment Velocity) was C (multiple times per day). You are Archetype B if Q12 was B (weekly cycles). Velocity is the decisive dimension — it determines whether you can adopt startup-style hardening or need enterprise-style restructuring.

**If you have a C/D tie** (common for seed-stage startups that use both Kubernetes and SaaS): You are Archetype D if your answer to Q10 (Budget) was D (under $50K). The solo-operator budget bracket overrides the tooling profile. You are Archetype C if your budget is C ($200K+) and you have at least 2-3 engineers in rotation.

**If you have an A scattered among your answers** (e.g., one or two A's mixed in with B's or C's): You are not Archetype A. Archetype A is the configuration where *all* dimensions have reached the high-maturity cluster. Isolated high-maturity values in a low-maturity cluster produce the diminishing returns described in Chapter 7.

---

## After Diagnosis

Your archetype is not your destiny. It is your starting point. The implementation chapters (14-17) are designed to move you from your current archetype toward increasing Octagon satisfaction. The paths are practical, costed, and include gate checks to detect when the primary route breaks.

The goal is not to become Archetype A tomorrow. The goal is to satisfy one more Octagon axiom this quarter than last quarter. The Octagon is the compass. The decision tree is the map.

---

## Key Takeaways

1. **Answer the twelve questions based on what is deployed today, not what is on your roadmap. Self-assessment that flatters is worse than useless — it routes you to the wrong decision tree.**
2. **Archetype A is not a possible diagnosis from this assessment unless you have hardware-attested provenance, bilateral enforcement, and Trickle-Truth in production. Scattered A answers among B/C/D answers do not make you an Aspirant.**
3. **Tiebreakers prioritize deployment velocity (B vs. C) and budget (C vs. D) because those are the dimensions that most constrain viable upgrade paths.**

---

## Cross-References

- **If diagnosed B:** [Chapter 14: The Enterprise Turnaround](./14-enterprise-turnaround.md)
- **If diagnosed C:** [Chapter 15: The Velocity Defender](./15-velocity-defender.md)
- **If diagnosed D:** [Chapter 16: Scaling Pat](./16-scaling-pat.md)
- **If diagnosed A:** [Chapter 18: Decision Matrix and Conclusion](./18-decision-matrix-and-conclusion.md)
- **Builds on:** [Chapters 8-11: Full Attack Traces](./08-archetype-a-holy-grail.md), [Chapter 12: Cross-Trace Synthesis](./12-cross-trace-synthesis.md)
