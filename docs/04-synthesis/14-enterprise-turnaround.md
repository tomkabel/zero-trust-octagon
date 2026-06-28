---
title: "14. The Enterprise Turnaround"
description: "Execute the 24-month phased implementation pathway for transitioning a Fortune 500 deployment from Archetype B toward Archetype A using Octagon axioms"
outline: deep
---

# 14. The Enterprise Turnaround: Archetype B → A in 24 Months

> **Learning Objectives**
> - Execute the 24-month phased implementation pathway for transitioning a Fortune 500 deployment toward the Octagon
> - Resolve the D4/D5 dependency deadlock — why attestation and violation response must be upgraded together
> - Apply gate checks to detect when the primary path breaks and pivot to a fallback
> - Budget the transformation with realistic cost estimates

**Prerequisites:** [§4: The Morphological Matrix](../02-methodology/04-the-morphological-matrix.md), [§9: Archetype B — Full Attack Trace](../03-archetypes/09-archetype-b-fortune-500.md), [§13: Self-Assessment](./13-self-assessment.md)

---

**Starting state:** D1: Software CA | D2: ABAC | D3: Network | D4: Single | D5: Hard Deny | D6: Push | D7: Implicit | D8: Siloed | D9: 24/7 SOC

**Octagon violations:** 6 of 8. **Budget:** $5M+ annually. **Constraint:** Organizational inertia, not money.

This chapter is not about spending more. You are already spending. It is about spending on the right dimensions, in the right order, with the right dependencies acknowledged.

---

## The Dependency Deadlock: Why D4 and D5 Must Move Together

The highest-leverage first upgrades for Archetype B are D4 (Attestation) and D5 (Violation Response). They cannot be upgraded sequentially.

- **If you upgrade D4 first** (Single → Behavioral attestation): You will detect more anomalies. More anomalies mean more Hard Deny lockouts. More lockouts mean more business outages. The business will demand the controls be disabled. Regression.
- **If you upgrade D5 first** (Hard Deny → Trickle-Truth or Micro-Friction): You will be seamlessly deceiving or friction-challenging users flagged by single-source attestation's low-signal, high-noise output. Innocent users will be served fake data. The CISO will be explaining to the CEO why the VP of Sales received synthetic customer records.

**Resolution:** Fund D4 and D5 as a single initiative — "Detection Modernization." The same budget cycle. The same project team. The same deployment timeline. Phase them so that D5 upgrades deploy *before* D4 begins generating more detections.

---

## Coming From a Maturity Model

If you have completed a CISA Zero Trust Maturity Model (ZTMM) assessment, the table below maps your ZTMM pillar scores to the morphological matrix configuration in this project. This helps you translate a familiar framework into the implementation pathway below.

*Estimated ZTMM levels assume this is your actual self-assessment result. If your ZTMM assessment returned different pillar levels, the matrix column labeled "Your Configuration" is what you should enter into your implementation plan.*

| ZTMM Pillar | Likely Level (Archetype B) | Morphological Mapping | Your Configuration |
|-------------|---------------------------|-----------------------|-------------------|
| **Identity** | Advanced | D1 (Trust Anchor): Software CA, D2 (Identity Model): ABAC | D1: __, D2: __ |
| **Devices** | Advanced | D4 (Attestation): Single | D4: __ |
| **Networks** | Initial/Advanced | D3 (Enforcement): Network firewall | D3: __ |
| **Apps** | Initial/Advanced | D3 (Enforcement): Network  | D3: __ |
| **Data** | Initial | D5 (Response): Hard Deny | D5: __ |

The implementation pathway below addresses the integration gaps your ZTMM assessment does not measure — specifically, the seams between high-rated pillars (Identity: Advanced, Devices: Advanced) and low-rated pillars (Data: Initial, Networks: Initial) that create the lateral movement surface. A CISA ZTMM assessment rates each pillar independently and then averages them. The average masks the seam. This pathway does not average — it measures interactions.

---

## The DoD's COA 1: The Military Equivalent

The Department of Defense (DoD) is executing a department-wide zero-trust implementation under its Zero Trust Strategy and Roadmap, targeting full Zero Trust Architecture (ZTA) framework implementation by FY 2027. The DoD's approach is Course of Action (COA) 1: "Enterprise-wide ZTA implementation across all components."

If the DoD, with its $10B+ budget and statutory authority, is still struggling with the same architectural transition you are attempting — migrating from perimeter-based defense to microsegmented, attestation-based zero-trust — that is not discouraging. It is validating. The problem is hard. The DoD is not doing it faster because it is easy. It is doing it because the alternative — continued breach of an unsegmented, implicitly trusted network — is more expensive.

**What the DoD's timeline validates for your 24-month plan:**

- The DoD's FY 2027 target means they budget approximately 3 years for full implementation from roadmap publication. Your 24-month pathway is aggressive but credible given your smaller attack surface.
- The DoD invests in multiple concurrent workstreams (identity, devices, networks, data) because sequential implementation takes too long. Your pathway does the same — D4/D5 together in Q1-2, D6 bubble upgrade in parallel, D1 health audit in Q4 alongside D7 pilot.
- The DoD's primary reported challenge is not technology — it is organizational alignment across components. Your D8 (Siloed Org) is the same constraint at a smaller scale.

---

## NSA Phase Comparison

The National Security Agency's Zero Trust Implementation Guide defines five maturity phases. The table below maps each NSA phase to your enterprise implementation timeline, showing how the government's sequencing aligns with your 24-month pathway.

| NSA ZIG Phase | NSA Focus | Enterprise Timeline | Equivalent Activity |
|---------------|-----------|-------------------|-------------------|
| **Discovery** | Asset inventory, traffic baselining | [§13: Self-Assessment](./13-self-assessment.md) | Diagnostic questions, archetype identification |
| **Phase One:** Identity, Devices, Apps | Phishing-resistant MFA, device compliance, app access | **Months 1-8 (Q1-Q3)** | D4+D5 detection modernization, D1 PKI audit, D8 fusion pilot |
| **Phase Two:** Network, Data | Microsegmentation, data classification, encryption | **Months 8-16 (Q3-Y2Q1)** | D3 service mesh (monitoring → enforcement), D7 dual pipeline |
| **Phase Three:** Advanced | Automation, orchestration, cross-pillar integration | **Months 16-20 (Y2Q1-Q2)** | D4 Triple attestation, D6 Event-Streamed |
| **Phase Four:** Advanced (Deferred) | Remaining complex use cases | **Months 20-24 (Y2Q3-Q4)** | D5 Trickle-Truth, D1 hardware roots, full Axiom satisfaction |

---

## Quarter 1-2: Detection Modernization

## Quarter 1-2: Detection Modernization

**Total cost:** $1.5M - $2.5M (engineering + tools + tuning). **Axioms addressed:** Axiom 4, 6, 7 (partial), 2 (partial).

### D4: Single → Behavioral Attestation

**What you do:** Add a behavioral baselining layer to the existing SIEM. Feed identity telemetry — login patterns, resource access sequences, geolocation and temporal patterns, application interaction baselines — into an anomaly detection engine running alongside the existing alert pipeline.

**What you do NOT do:** Buy new hardware. Deploy new agents. Rip out the IDP. The behavioral layer leverages telemetry already flowing to the SIEM. It is an addition, not a replacement.

**Operational target:** The behavioral layer runs in parallel with existing single-source attestation for Q1. In Q2, begin elevating behavioral anomalies to the same priority tier as hard policy violations. The behavioral signal becomes a second attestation source — if the IDP says "valid" but behavior says "anomalous," the system escalates rather than blindly allowing.

**Axioms addressed:** Axiom 4 (now there is a second verification signal active during the session, not just at authentication), Axiom 7 (partial — behavioral provenance is stronger than IDP-only but not yet cryptographically attested).

### D5: Hard Deny → Micro-Friction

**What you do:** Replace automatic account lockout and connection termination on anomaly detection with Micro-Friction:

- Instead of locking the account, inject a step-up authentication challenge.
- Instead of blocking the IP, degrade the session's capabilities — revoke administrative privileges, limit data export, throttle bandwidth.
- Retain Hard Deny only for *confirmed malicious* behavior: an attacker actively exfiltrating, a known-bad IP with multiple failed authentications, a detected exploitation attempt. Not for anomalies.

**Operational target:** Within two months, the number of Hard Deny events drops by 80%. The remaining 20% are the high-confidence malicious detections that justify full lockdown. The 80% that were false positives or ambiguous are handled by friction — enough to disrupt an attacker without disabling a legitimate user.

**Axioms addressed:** Axiom 6 (component compromise of a credential no longer cascades to business-wide outage).

### D8: Siloed → Initial Fusion (Pilot)

**What you do:** Create a single, shared incident response channel — a Slack channel or Teams room — with representatives from Security Operations, Identity, and one DevOps team. Deploy a single shared dashboard showing the behavioral anomaly feed. Run a two-week pilot: any alert in the behavioral feed is triaged jointly by all three teams in the shared channel.

**What happens:** The initial pilot is chaotic. Teams that have never directly communicated in real-time discover they have been operating on incompatible assumptions for years. This chaos is the point. The seams between teams are the attack surface. The pilot makes the seams visible.

**Axioms addressed:** Axiom 6 (reduce the organizational Byzantine fragility — no single team's misinterpretation can block incident response).

### Bubble Upgrade: D6 — Policy Versioning

In parallel, add policy versioning and hash headers to all existing policies. The Push mechanism continues to operate, but every policy now carries a cryptographic hash. Enforcement points verify the hash before applying policy. Version drift — one enforcement point running Policy v1.1 while another runs v1.2 — is detected and alerted, not silently tolerated.

**Axioms addressed:** Axiom 2 (policy becomes verifiable — drift is detectable and auditable).

---

## Quarter 3-4: Enforcement Modernization

**Total cost:** $2M - $3.5M (service mesh deployment, engineering, training). **Axioms addressed:** Axiom 3, 8 (partial).

### D3: Network → Service Mesh

**What you do:** Deploy a service mesh (Istio or Linkerd) to the critical-path services — the ones that handle sensitive data, financial transactions, or PII. Enforce pod-to-pod policy: service A cannot reach service B unless explicitly allowed.

**Deployment strategy:** Start in *monitoring mode* — policies are logged, not enforced. Run for one quarter. Analyze the logs. Identify every legitimate communication path. Write explicit allow policies for each. Then, and only then, switch to enforcement mode.

**Why monitoring mode first:** The siloed organization does not know its own traffic patterns. The network team knows firewall rules. The application team knows API dependencies. Neither knows the full pod-to-pod communication graph. Monitoring mode discovers it.

**Axioms addressed:** Axiom 3 (mediation extends to pod-to-pod traffic — no more lateral movement inside the perimeter), Axiom 8 (partial — the mesh enables mutual TLS, which is the minimum form of bilateral verification).

### D1: PKI Health Audit

**What you do:** Inventory every certificate in the organization. Document lifetimes, CA rotation schedules, key storage locations. Identify certificates that will expire in the next 12 months. Identify keys stored in plaintext or accessible to broad groups.

**Why now:** You cannot transition to hybrid or silicon trust anchors without understanding your current PKI topology. The PKI health audit is groundwork for Year 2's D1 upgrade.

**Axioms addressed:** Axiom 7 (preparation — you cannot migrate to hardware roots without knowing what your software roots look like).

---

## Quarter 5-8: Observability & Continuity

**Total cost:** $2M - $3M (second pipeline, engineering, training). **Axioms addressed:** Axiom 2, 6, 7.

### D7: Implicit → Dual Pipeline

**What you do:** Deploy a second, independent telemetry pipeline alongside the existing SIEM. This pipeline:

- Runs on separate infrastructure (different cloud account, different network).
- Collects the same telemetry (logs, metrics, traces) from independent agents or network taps.
- Is write-only — data flows in, nothing can reach back from the pipeline to production.
- Is compared offline against the primary SIEM output on a weekly cadence. Divergences are investigated.

**What you do NOT do:** Build an air-gapped Truth Pipeline with data diodes. That is Year 2 territory. The dual pipeline adds an independent verification path at a fraction of the cost.

**Axioms addressed:** Axiom 2 (independent verification of telemetry), Axiom 6 (the attacker cannot blind both pipelines simultaneously), Axiom 7 (partial provenance — two independent assertions are stronger than one).

### D9: Build an On-Call Rotation

The organization already has a 24/7 SOC. D9 is not about staffing — it is about *which alerts* the SOC responds to. Move the behavioral anomaly feed into the SOC's queue. Train the SOC to triage behavioral anomalies as security events, not as "weird metrics." The SOC that previously responded to SIEM alerts now responds to behavioral signals.

---

## Year 2: Ascent to A

**Total cost:** $4M - $6M. **Axioms addressed:** All remaining.

**D4: Behavioral → Heterogeneous Triple**

Add eBPF kernel observers and hypervisor-level monitors to the critical-path workloads. The behavioral baseline is joined by hardware and kernel observation streams. The three streams feed a Byzantine consensus engine. Full Axiom 7 credibility.

**D1: Software CA → Hybrid Hierarchical**

Introduce hardware roots of trust for the top 20% most critical workloads. TPM attestation for platform integrity. SPIFFE/SPIRE for cryptographic workload identity. The PKI health audit from Q4 pays off — you know exactly what to migrate.

**D5: Micro-Friction → Trickle-Truth**

With D6 now Event-Streamed (see below), the policy distribution latency supports Trickle-Truth. Deploy the garden environment, LLM synthetic data pipeline, and session grafting protocol. The architecture achieves Axiom 6 and inverts the attacker cost model.

**D6: Push → Event-Streamed**

Deploy Kafka or NATS as the policy distribution backbone. PEPs subscribe and maintain local WASM-cached state. Global policy state changes propagate in sub-10ms.

---

## End State (24 Months)

- **Octagon:** 8/8 axioms satisfied.
- **Total cost:** $9.5M - $15M over 24 months.
- **Staff impact:** Reorganized, not downsized. Siloed teams become fused. On-call rotations expand.
- **Architectural change:** From a brittle castle that collapses on detection to a fault-tolerant system where detection produces intelligence, not outage.

---

## Gate Checks

**Gate 1 (End of Q2):** *Condition:* Behavioral attestation false-positive rate must be ≤80%. False positives from legitimate users mean tuning saves the path.

→ **if FAIL (tuning cannot reduce FP rate below 80%):** Pivot to hardware-backed attestation. Pilot: 100 hardware security keys + identity provider hardware attestation integration. Budget increase: $200K. Rationale: existing telemetry quality is insufficient for behavioral analysis. Hardware-backed attestation bypasses the need for high-quality behavioral signals.

→ **Other Failure:** Return to [§13: Self-Assessment](./13-self-assessment.md) and re-route.

**Gate 2 (End of Q4):** *Condition:* Service mesh enforcement must deny ≤5% of legitimate traffic. If monitoring-mode analysis shows more than 5% of legitimate traffic was denied, the mesh policies are too aggressive — continue monitoring mode for another quarter.

→ **if FAIL (denied traffic remains >5% after continued monitoring):** Pivot to adaptive policy. Use behavioral learning of traffic patterns rather than manually written static rules. Rationale: application architecture is too dynamic for static policy. Adaptive policy learns traffic norms organically.

→ **Other Failure:** Return to [§13: Self-Assessment](./13-self-assessment.md) and re-route.

**Gate 3 (End of Q8):** *Condition:* Dual pipeline divergence must be ≤1% of observations. Higher divergence means the primary pipeline has systematic integrity issues.

→ **if FAIL (divergences remain above 1% after investigation):** Do not proceed to Year 2. The primary pipeline must be rebuilt or replaced before further investment. Pivot: replace primary SIEM ingestion path, re-baseline telemetry collection.

→ **Other Failure:** Return to [§13: Self-Assessment](./13-self-assessment.md) and re-route.

---

## Key Takeaways

1. **Upgrade D4 (Attestation) and D5 (Violation Response) together. Upgrading either in isolation produces a worse outcome than upgrading neither.**
2. **Deploy the service mesh in monitoring mode first. The siloed organization does not know its own traffic graph. Discovering it prevents enforcement from breaking production.**
3. **The PKI health audit in Q4 is mandatory groundwork for Year 2's hardware trust anchor migration. Skip it, and the migration will stall on unknown certificates and missing keys.**
4. **The total cost is $9.5M-$15M over 24 months — roughly 1.5x the current annual security budget for a 2x improvement in Octagon satisfaction.**

---

## Cross-References

**Next:** [§15: The Velocity Defender](./15-velocity-defender.md)
**Builds On:** [§4: The Morphological Matrix](../02-methodology/04-the-morphological-matrix.md), [§9: Archetype B — Full Attack Trace](../03-archetypes/09-archetype-b-fortune-500.md), [§13: Self-Assessment](./13-self-assessment.md)
