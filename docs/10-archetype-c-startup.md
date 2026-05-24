# 10. Archetype C: Move Fast, Fix It In Prod

> **Learning Objectives**
> - Trace a CI/CD supply chain injection attack against a high-velocity startup deployment
> - Identify why velocity-optimized architectures are uniquely vulnerable to supply chain compromise
> - Explain the Degrade Gracefully trade-off: uptime preservation vs. exfiltration window
> - Recognize that GitOps and fused teams provide excellent MTTD/MTTR but cannot prevent attacks that bypass pre-runtime verification

**Prerequisites:** [Chapter 4: The Morphological Matrix](./04-the-morphological-matrix.md), [Chapter 5: Dimensions 1-4](./05-dimensions-trust-to-attestation.md), [Chapter 6: Dimensions 5-9](./06-dimensions-response-to-human.md)

---

Archetype C is the Series B/Series C tech company. Incredible deployment velocity, modern tooling, a brilliant engineering team — and a security architecture that optimizes for speed above all else. This is the architecture that ships fifty times a day and discovers security incidents by watching Datadog.

**Configuration:**
- D1: Software CA (PKI-based) — AWS IAM, Kubernetes CA, HashiCorp Vault
- D2: Static JIT — short-lived JWTs and temporary cloud credentials
- D3: Application / Gateway — API gateways, NGINX ingress, GraphQL federation
- D4: Trust on First Use (TOFU) — if code passes CI/CD, it is trusted at runtime forever
- D5: Degrade Gracefully — rate limiting, circuit breakers, never block a paying customer
- D6: GitOps / Declarative Sync — ArgoCD, Terraform, everything in version control
- D7: Implicit Trust — Datadog/Honeycomb dashboards are the absolute truth
- D8: Fused (Shared Blast Radius) — no dedicated SOC; "you build it, you run it, you secure it"
- D9: Small On-Call Rotation — 2-3 people in rotation, reasonable coverage

---

## The Attack: Typosquatted Dependency

### T-0h: The Poisoned Package

A fast-moving developer needs a utility library for a new microservice. They search the public NPM registry and find a package with a name one character different from a well-known library — a classic typosquatting attack. The package has reasonable-looking documentation, a plausible version history, and even a few hundred downloads. The developer installs it.

The package contains a malicious post-install script. It does not activate immediately — it lies dormant, passing all CI/CD checks, waiting for deployment to production.

---

### T+15m: CI/CD Approves

The developer opens a PR. GitHub Actions runs the test suite. All tests pass — the malicious code is designed to be inert during testing. The PR is merged.

ArgoCD (D6: GitOps) detects the state change and deploys the new containers to the production Kubernetes cluster. Because D4 = Trust on First Use, the cluster performs no runtime attestation of the container image. The fact that GitHub Actions built it is the only verification. The malicious code is now running in production.

**Axiom violation:** Axiom 4 (Continuous Verification). Verification occurred once — in CI/CD. There is no runtime re-verification. Axiom 7 (Epistemic Integrity). The container's provenance is the CI/CD log, which the malicious package did not trigger.

---

### T+30m: Identity Minting

The compromised pod boots and requests an identity from the Kubernetes control plane. The Software CA (D1) issues a valid ServiceAccount JWT with a 1-hour TTL (D2: Static JIT). The malicious package now has the exact same IAM permissions as the legitimate microservice it replaced.

Because D2 does not distinguish between machine identity patterns — there is no SPIFFE/SPIRE workload attestation, no code hash verification — the pod claims to be "billing-service" and the cluster believes it.

**Axiom violation:** Axiom 5 (Deterministic Bounded Authority). The microservice receives the full ServiceAccount permissions — whatever the legitimate billing service could do, the malicious code can do.

---

### T+35m: Attack Execution

The malicious code activates. It begins scraping the internal User Database, sending a burst of thousands of API calls. The API Gateway (D3: Application/Gateway) checks the JWT on each request. The token is cryptographically valid. The TTL has not expired. The gateway passes every request to the database.

**Axiom violation:** Axiom 3 (Unbypassable Mediation) — partial. The API gateway mediates application-layer traffic, but once the request is allowed, there is no further pod-to-pod mediation. The malicious pod could also attempt lateral movement to other services that share the same cluster network.

---

### T+38m: Detection — The Circuit Breaker Trips

The sudden burst of traffic triggers a circuit breaker at the API Gateway. Because D5 = Degrade Gracefully — the startup optimizes for uptime, never blocking a paying customer — the system does not kill the pod. It applies a strict rate limit. The malicious code can still exfiltrate data, just at a reduced rate.

The logs of this activity flow into Datadog (D7: Implicit Trust). The dashboard shows a massive spike in API traffic followed by a rate-limiting plateau. The metrics are perfectly graphed — Datadog is faithfully reporting what the compromised system tells it.

**Axiom violation:** Axiom 6 (Byzantine Fault Tolerance). The Degrade response contains the attack but does not stop it. The attacker continues to exfiltrate during the degradation window. Axiom 7 (Epistemic Integrity). The observability pipeline trusts the application's self-reported metrics. No independent verification exists.

---

### T+40m: The Swarm

A PagerDuty alert fires: "High API Latency / Rate Limit Hit — billing-service." Because D8 = Fused, there is no handoff between teams. The on-call backend engineer, the SRE, and the engineering manager all jump into the same Slack huddle.

They pull up the Datadog dashboard. Within three minutes of the alert, a developer says: "Wait. Why is the new billing pod querying the user-profile database 10,000 times a second? It should be querying the ledger."

This is the fused team's superpower: they recognize anomalous behavior instantly because they built the system. No escalation tier. No ticket routing. Human intuition in real-time.

---

### T+43m: Eradication

Because D6 = GitOps, the remediation is instantaneous. The developer types `git revert` on the PR that introduced the compromised dependency. They push. ArgoCD detects the state change and immediately terminates the compromised pods, rolling back to the known-good state from 25 minutes ago.

No one logs into a firewall to block an IP. No one manually kills pods. The entire rollback is a single commit.

---

## Post-Mortem: What Was Lost

| Metric | Value |
|--------|-------|
| MTTD | ~8 minutes (from attack activation to circuit breaker + human swarm) |
| MTTR | ~3 minutes (from human recognition to git revert) |
| Attacker exfiltration window | ~8 minutes (Degrade Gracefully permitted continued, rate-limited exfiltration) |
| Data exfiltrated | Partial — 8 minutes at degraded rate |
| Business impact | Low — brief rate-limiting blip, no customer-facing outage |
| Root cause | TOFU attestation — no runtime verification of deployed code |

---

## Root Cause Analysis

The attack succeeded because four axioms were violated, and the startup's greatest strength — velocity — was also its greatest vulnerability:

| Step | What Failed | Root Axiom Violation | Structural Fix |
|------|------------|---------------------|----------------|
| Dependency injection | No CI/CD supply chain verification beyond unit tests | Axiom 4 (Continuous Verification) | D4: Add container image signing (Cosign/Sigstore) + runtime eBPF anomaly detection |
| Identity assumption | Pod gets full ServiceAccount permissions | Axiom 5 (Bounded Authority) | D2: Deploy SPIFFE/SPIRE for cryptographic workload identity |
| Lateral capability | No pod-to-pod policy | Axiom 3 (Mediation) | D3: Add Kubernetes NetworkPolicy in audit mode, then enforce |
| Exfiltration window | Degrade permits continued access | Axiom 6 (BFT) | D5: Add Selective Quarantine — kill pods on confirmed runtime anomaly |
| Observability trust | Self-reported metrics only | Axiom 7 (Epistemic Integrity) | D7: Merkle-attest observability agent output |

---

## The Velocity Paradox

Archetype C's properties form a closed loop:

- **Velocity** enables 50 deploys per day and incredible business agility.
- **Velocity** demands TOFU attestation (any CI/CD friction would slow deploys).
- **TOFU** enables supply chain injection.
- **Fused teams + GitOps** provide world-class MTTD/MTTR for *detected* attacks but cannot *prevent* the injection.
- **Degrade Gracefully** preserves customer uptime but creates an 8-minute exfiltration window.

**The loop:** The same architecture that detects and remedies faster than any other archetype is also the most vulnerable to the specific attack vector that bypasses its only verification gate.

The hardening path (Chapter 15) breaks this loop by adding runtime attestation without adding deployment friction — container image signing adds ~30 seconds to CI/CD, and eBPF anomaly detection runs as a DaemonSet with zero application code changes.

---

## Key Takeaways

1. **Trust on First Use (TOFU) is the fundamental vulnerability of velocity-optimized architectures. Code that passes CI/CD is trusted at runtime forever — making the CI/CD pipeline the single point of architectural failure.**
2. **Archetype C has the best MTTD/MTTR of any non-Holy-Grail archetype because fused teams + GitOps enable human recognition and instant rollback. But MTTD/MTTR cannot prevent the initial injection.**
3. **Degrade Gracefully preserves uptime at the cost of an exfiltration window. When the primary threat is data theft (not service disruption), this is the wrong optimization.**
4. **GitOps is a double-edged sword — it enables instant remediation but also instant deployment of malicious code. The fix is runtime attestation (D4), not slower deployments.**

---

## Cross-References

- **Next:** [Chapter 11: Archetype D — SaaS-Glued Lean Defense](./11-archetype-d-lean-defense.md)
- **Builds on:** [Chapter 5: Dimensions 1-4](./05-dimensions-trust-to-attestation.md), [Chapter 6: Dimensions 5-9](./06-dimensions-response-to-human.md)
- **Related:** [Chapter 7: Meta-Patterns](./07-meta-patterns.md)
- **Related:** [Chapter 15: The Velocity Defender (C Hardening Path)](./15-velocity-defender.md)
