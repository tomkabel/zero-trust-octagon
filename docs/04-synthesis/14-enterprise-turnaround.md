# 14. The Enterprise Turnaround: Archetype B → A in 24 Months

> **Learning Objectives**
> - Execute the 24-month phased implementation pathway for transitioning a Fortune 500 deployment toward the Octagon
> - Resolve the D4/D5 dependency deadlock — why attestation and violation response must be upgraded together
> - Apply gate checks to detect when the primary path breaks and pivot to a fallback
> - Budget the transformation with realistic cost estimates

**Prerequisites:** [Chapter 9: Archetype B — Full Attack Trace](../03-archetypes/09-archetype-b-fortune-500.md), [Chapter 12: Cross-Trace Synthesis](../03-archetypes/12-cross-trace-synthesis.md), [Chapter 13: Self-Assessment](./13-self-assessment.md)

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

**Gate 1 (End of Q2):** Measure the behavioral attestation false-positive rate. If >80% of behavioral anomalies were false positives (legitimate users flagged), spend Q3 tuning the baselines. **If tuning fails:** The existing telemetry quality is insufficient for behavioral analysis. Pivot: skip behavioral. Go directly to hardware-backed attestation (pilot: 100 hardware security keys + identity provider hardware attestation integration). Budget increase: $200K.

**Gate 2 (End of Q4):** Measure the service mesh enforcement impact. If >5% of legitimate traffic was denied during monitoring-mode analysis, the mesh policies are too aggressive. Continue monitoring mode for another quarter. **If denied traffic remains >5%:** The application architecture is too dynamic for static policy. Pivot: use adaptive policy (behavioral learning of traffic patterns) rather than manually written rules.

**Gate 3 (End of Q8):** After dual pipeline deployment, compare primary vs. secondary. If divergences are detected in >1% of observations, the primary pipeline has systematic integrity issues. Investigate before proceeding to Year 2.

---

## Key Takeaways

1. **Upgrade D4 (Attestation) and D5 (Violation Response) together. Upgrading either in isolation produces a worse outcome than upgrading neither.**
2. **Deploy the service mesh in monitoring mode first. The siloed organization does not know its own traffic graph. Discovering it prevents enforcement from breaking production.**
3. **The PKI health audit in Q4 is mandatory groundwork for Year 2's hardware trust anchor migration. Skip it, and the migration will stall on unknown certificates and missing keys.**
4. **The total cost is $9.5M-$15M over 24 months — roughly 1.5x the current annual security budget for a 2x improvement in Octagon satisfaction.**

---

## Cross-References

- **Next:** [Chapter 17: The Aspirant's Gate — When the Path Breaks](./17-the-aspirants-gate.md)
- **Builds on:** [Chapter 9: Archetype B — Full Attack Trace](../03-archetypes/09-archetype-b-fortune-500.md)
- **Related:** [Chapter 13: Self-Assessment](./13-self-assessment.md)
- **Related:** [Chapter 18: Decision Matrix and Conclusion](./18-decision-matrix-and-conclusion.md)
