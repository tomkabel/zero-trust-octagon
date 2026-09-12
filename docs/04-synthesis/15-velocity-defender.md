---
title: "15. The Velocity Defender"
description: "A 12-month implementation pathway to harden a high-velocity startup against supply chain injection without adding CI/CD friction — layered attestation, SPIFFE/SPIRE, and selective quarantine."
outline: deep
cover: /images/covers/04-synthesis/15-velocity-defender.webp
coverAlt: "Illustration: a light-streak runner passing tightening gates at full speed, threats bouncing off"
---

# 15. The Velocity Defender: Hardening Archetype C in 12 Months

> **Learning Objectives**
> - Harden a high-velocity, GitOps-driven startup against supply chain injection without adding deployment friction
> - Add layered attestation (image signing + runtime eBPF anomaly detection) that preserves CI/CD speed
> - Deploy cryptographic workload identity (SPIFFE/SPIRE) to bound machine authority
> - Implement selective quarantine — kill pods on confirmed runtime anomalies while preserving Degrade for ambiguous cases

**Prerequisites:** [§4: The Morphological Matrix](../02-methodology/04-the-morphological-matrix.md), [§10: Archetype C — Full Attack Trace](../03-archetypes/10-archetype-c-startup.md), [§13: Self-Assessment](./13-self-assessment.md)

---

**Starting state:** D1: Software CA | D2: Static JIT | D3: Gateway | D4: TOFU | D5: Degrade | D6: GitOps | D7: Implicit | D8: Fused | D9: Small Rotation

**Octagon violations:** 4 of 8 (+ partial on 3, 8). **Budget:** $500K-$1M. **Constraint:** Deployment velocity — nothing can slow the pipeline.

This chapter is not about adding security at the cost of speed. It is about adding security *without subtracting speed*. Every upgrade is measured against a single metric: does it add more than 60 seconds to the CI/CD pipeline or require application code changes?

---

## Coming From a Maturity Model

If you have completed a CISA Zero Trust Maturity Model (ZTMM) assessment, the table below maps your ZTMM pillar scores to the morphological matrix configuration, helping you translate a familiar framework into the implementation pathway below.

| ZTMM Pillar | Likely Level (Archetype C) | Morphological Mapping | Your Configuration |
|-------------|---------------------------|-----------------------|-------------------|
| **Identity** | Initial/Advanced | D1 (Trust Anchor): Software CA | D1: __ |
| **Devices** | Initial | D4 (Attestation): TOFU | D4: __ |
| **Networks** | Initial | D3 (Enforcement): Gateway | D3: __ |
| **Apps** | Advanced | D3 (Enforcement): Gateway | D3: __ |
| **Data** | Traditional | D5 (Response): Degrade | D5: __ |

The implementation pathway below addresses the integration gaps your ZTMM assessment does not measure — specifically, the seams between Applications (Advanced, meaning API gateways and ingress controllers enforce policy) and Networks (Initial, meaning pods can talk to each other without mediation). That seam — an advanced application layer with no internal traffic security — is exactly the lateral movement path a supply chain attacker exploits after injection. Your ZTMM assessment gives App: Advanced and Net: Initial. This pathway tells you how to close the gap between them.

---

## Quarter 1: Supply Chain Hardening

**Total cost:** $150K-$250K (tools + engineering time). **Axioms addressed:** Axiom 4, 6, 7 (partial), 3 (partial).

### D4: TOFU → Layered (CI/CD + Runtime)

The single highest-impact upgrade for Archetype C. It breaks the chain from "dependency injected" to "code trusted in production forever."

**Layer 1 — CI/CD Signing (Cosign/Sigstore):**

Add container image signing to the existing CI/CD pipeline. After the image is built and tests pass, Cosign signs the image with a key managed by the pipeline. The signature attests: "GitHub Actions built this image from commit SHA `abc123`." The signature is stored in the OCI registry alongside the image.

**Pipeline impact:** ~30 seconds added to CI/CD. Acceptable.

**Layer 2 — Admission Control:**

Add a Kubernetes admission controller (Kyverno or OPA Gatekeeper) that verifies the Cosign signature before admitting the pod. Unsigned images — including images pulled by an attacker who gained cluster access — are rejected.

**Pipeline impact:** ~200ms per pod admission. Negligible.

**Layer 3 — Runtime Anomaly Detection (eBPF):**

Deploy Falco or Tetragon as a DaemonSet on every node. These eBPF-based agents watch syscalls, file access, and network connections from every pod in real-time. They do not require application code changes — they observe from the kernel level.

Define rules for the top 10 most critical services: "the billing pod should not make outbound connections to unknown external IPs," "the auth service should not spawn shells."

**Pipeline impact:** None. eBPF agents run on nodes, not in the CI/CD pipeline.

**Axioms addressed:** Axiom 4 (runtime verification — the code is re-verified continuously, not just at deploy time), Axiom 7 (partial — CI/CD signature + runtime hash verification create an attested provenance chain).

### D5: Degrade → Degrade + Selective Quarantine

Maintain Degrade Gracefully as the default response for production services — preserve uptime for paying customers. Add an override: for the top 10% most critical services (those handling PII, payments, credentials), a confirmed runtime anomaly — not an ambiguous behavioral deviation, but a clear rule violation like "billing pod executing a reverse shell" — triggers immediate pod kill and replacement.

**Axioms addressed:** Axiom 6 (anomalous pods are isolated before they can spread). The selective nature preserves the Degrade philosophy while closing the worst-case exfiltration window.

### D3: Gateway → Gateway + Pod-Level Policy (Monitoring Mode)

Deploy Kubernetes NetworkPolicy or Cilium network policy in audit-only mode. Log all pod-to-pod traffic that *would* be denied by a restrictive policy. Do not enforce yet.

The organization's high deployment velocity means the pod communication graph changes daily. Enforcing static network policy would break deployments. Monitoring mode builds the traffic graph without breaking anything.

**Axioms addressed:** Axiom 3 (partial — awareness of mediation gaps, not yet enforcement).

---

## Quarter 2-3: Identity & Authority

**Total cost:** $200K-$350K (SPIRE deployment, engineering). **Axioms addressed:** Axiom 5, 7.

### D2: Static JIT → JIT + SPIFFE (Cryptographic Workload Identity)

Deploy SPIRE — the SPIFFE reference implementation — as the workload identity layer. SPIRE replaces the Kubernetes ServiceAccount JWT model:

1. The SPIRE agent runs on each node.
2. When a workload requests an identity, SPIRE attests the workload — it verifies the container image hash, the Kubernetes pod attributes, and (optionally) the node's TPM attestation.
3. SPIRE issues a short-lived x.509 certificate containing the verified SPIFFE ID.
4. The workload uses this certificate for mTLS and application-level authentication — not a self-declared JWT.

**Pipeline impact:** None on CI/CD. SPIRE operates at runtime, not build time. Workload startup adds ~2 seconds for identity issuance.

**Axioms addressed:** Axiom 5 (workload authority is now bounded by cryptographically verified identity — no more "the ServiceAccount said so"), Axiom 7 (cryptographic provenance for workload identity: the certificate proves what the workload *is*, not what it *claims to be*).

### D5 Extension: Trickle-Truth for User Sessions

Enable Trickle-Truth for authenticated-but-suspicious user sessions hitting the API gateway. This requires a lightweight garden environment — a set of API endpoints that mirror the real application but return synthetic data. Focus on the 5 most critical data types (user records, financial transactions, etc.).

This is a partial Trickle-Truth — user sessions only, not machine-to-machine traffic. Full Trickle-Truth for workloads requires the event-stream backbone, which is Year 2 territory.

**Axioms addressed:** Axiom 6 (breach of user credentials does not leak real data).

---

## Quarter 4: Observability Independence

**Total cost:** $100K-$200K. **Axioms addressed:** Axiom 2, 7.

### D7: Implicit → Merkle-Attested Telemetry

Add Merkle tree hashing to the observability agent output. Each agent (Fluentd, OpenTelemetry collector) hashes its telemetry into a Merkle tree in memory. The root hash is signed at fixed intervals (e.g., every 5 seconds) using a key stored in the agent's local TPM or secure enclave.

A verifier — a lightweight service running in the cluster — periodically requests Merkle proofs for random telemetry samples. If the proof fails to verify, the telemetry has been tampered with.

**Pipeline impact:** None. Telemetry hashing happens in-memory on the observability path. CPU overhead: ~2-3%.

**Why not dual pipeline or air-gap:** Full dual pipeline or air-gapped observability requires dedicated infrastructure — separate cloud accounts, data diodes, independent agents. Merkle-attested telemetry provides cryptographic tamper evidence within the existing infrastructure at a fraction of the cost. For a startup, this is the pragmatic path to Axiom 7 for observability.

**Axioms addressed:** Axiom 2 (telemetry is now verifiable — tampering is cryptographically detectable), Axiom 7 (provenance of observability data is now attested).

---

## End State (12 Months)

- **Octagon:** 6 of 8 axioms satisfied (Axioms 6 and 8 remain partial — full BFT and bilateral symmetry require D3 enforcement + D6 Event-Streamed, which would slow deployments).
- **Total cost:** $450K-$800K.
- **Velocity impact:** +30s CI/CD. No application code changes.
- **Attack surface closed:** Supply chain injection no longer trusts CI/CD as the only gate. Runtime attestation provides a continuous second signal.

---

## Gate Checks

**Gate 1 (End of Q1):** *Condition:* eBPF anomaly detection false-positive rate must be ≤1 alert per day across the entire cluster. False positives from legitimate workload behavior mean rules are too aggressive or the team's rapid prototyping creates inherently anomalous traffic patterns.

→ **if FAIL (FPs remain >1/day after tuning):** Pivot to confidential containers. Skip runtime anomaly detection for all but the top 3 most static services. For the rest, rely on image signing + admission control (Layers 1 and 2) as the supply chain defense. The gap — runtime behavior of new code is not attested — is acknowledged debt.

→ **Other Failure:** Return to [§13: Self-Assessment](./13-self-assessment.md) and re-route.

**Gate 2 (End of Q3):** *Condition:* After SPIRE deployment, >95% of workloads must receive SPIFFE identities within 5 seconds of startup. If any workload class consistently fails SPIRE attestation, the SPIRE attestor configuration needs tuning.

→ **if FAIL (>5% of workloads cannot attest):** Do not proceed to Q4. Investigate attestation failures per workload class. Pivot: exclude problematic workload classes from SPIRE and continue Q4 observability upgrade on attested workloads only.

→ **Other Failure:** Return to [§13: Self-Assessment](./13-self-assessment.md) and re-route.

---

## Key Takeaways

1. **Supply chain hardening for startups means adding runtime attestation without adding CI/CD friction. Image signing (+30s), admission control (+200ms), and eBPF anomaly detection (+0s) achieve this.**
2. **SPIFFE/SPIRE is the single most impactful identity upgrade for machine workloads. It replaces self-declared service accounts with cryptographically verified workload identity.**
3. **Merkle-attested telemetry provides cryptographic tamper evidence within existing infrastructure — no dedicated hardware required. It is the fastest path to Axiom 7 for observability at startup scale.**
4. **Selective Quarantine preserves the Degrade Gracefully philosophy for 90% of services while closing the exfiltration window for the most critical 10%.**

---

## Cross-References

**Next:** [§16: Scaling Pat](./16-scaling-pat.md)
**Builds On:** [§4: The Morphological Matrix](../02-methodology/04-the-morphological-matrix.md), [§10: Archetype C — Full Attack Trace](../03-archetypes/10-archetype-c-startup.md), [§13: Self-Assessment](./13-self-assessment.md)
