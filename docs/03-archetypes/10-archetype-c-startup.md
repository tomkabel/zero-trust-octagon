# 10. Archetype C: Move Fast, Fix It In Prod

> **Learning Objectives**
> - Trace a CI/CD supply chain injection attack against a high-velocity startup deployment
> - Identify why velocity-optimized architectures are uniquely vulnerable to supply chain compromise
> - Explain the Degrade Gracefully trade-off: uptime preservation vs. exfiltration window
> - Recognize that GitOps and fused teams provide excellent MTTD/MTTR but cannot prevent attacks that bypass pre-runtime verification

**Prerequisites:** [Chapter 4: The Morphological Matrix](../02-methodology/04-the-morphological-matrix.md), [Chapter 5: Dimensions 1-4](../02-methodology/05-dimensions-trust-to-attestation.md), [Chapter 6: Dimensions 5-9](../02-methodology/06-dimensions-response-to-human.md)

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

## The Supply Chain Attack Landscape

The typosquatted dependency attack traced above is not a hypothetical. It is the most common and fastest-growing attack vector against cloud-native organizations.

**The dependency tree problem:** A typical Node.js or Python microservice pulls in 200-500 transitive dependencies — packages it never explicitly declared but that its declared dependencies depend on, and their dependencies depend on, forming a tree where the developer can only realistically audit the first 2-3 levels. A malicious package at depth 4 of the dependency tree is functionally invisible to human review. The developer runs `npm install` or `pip install` and trusts the output. That trust is the TOFU vulnerability.

**Attack sophistication gradients:** The attacker who typosquats a package name and hopes it gets installed is at the lowest tier of sophistication. At the mid-tier, attackers compromise legitimate maintainer accounts on package registries and push malicious updates to packages that already have thousands of legitimate dependents — a technique that is virtually undetectable because the package name, maintainer history, and version history all appear legitimate. At the top tier — nation-state supply chain operations — the attacker compromises the build infrastructure itself (the CI/CD runner, the artifact registry, the signing key) and injects malicious code at the point of artifact creation, after all tests have passed and all signatures have been applied. The SolarWinds incident demonstrated this pattern at scale: the attacker compromised the build system, and every customer who downloaded the signed, attested update received the backdoor.

**The defense must be layered:** No single mechanism stops all three tiers. Typosquatting is partially addressed by package registry monitoring and namespace verification. Maintainer account compromise requires behavioral anomaly detection — "this package, which has published updates quarterly for 3 years, just published three updates in one day" — plus cryptographic provenance for the maintainer's identity. Build infrastructure compromise requires the most aggressive defense: reproducible builds (the same inputs always produce the same output, verifiable independently) plus hardware-attested build environments where the CI/CD runner's integrity is continuously verified by a TPM.

Archetype C's starting state — TOFU attestation — addresses none of these tiers. The hardening path adds layered defense at each tier without breaking velocity.

### 2025-2026: The Supply Chain Breach Cascade — Four Incidents at Unprecedented Scale

The attack traced above is structurally identical to four major incidents that occurred between August 2025 and May 2026. These are not hypotheticals — they are documented breaches analyzed by Google/Mandiant, Microsoft, CSA, and Lyrie Research. Together they validate Archetype C's primary threat profile and the velocity-supply chain asymmetry.

**Incident 1: s1ngularity → UNC6426 AWS Takeover (August 2025)**
The s1ngularity npm package was compromised in a supply chain attack, seeding a malicious post-install script into downstream CI/CD pipelines. Google/Mandiant tracked a threat actor (UNC6426) who exploited this compromise to achieve full AWS administrator access at a victim organization in under 72 hours. The attack chain: compromised Nx build tool → GitHub Actions OIDC trust abuse → CloudFormation IAM escalation → AWS admin. The OIDC trust policy flaw was confirmed across more than 275 AWS accounts — a class of misconfiguration that is routinely deprioritized during initial CI/CD setup. No zero-day exploits were used. The attacker combined three independently documented but rarely chained risks into a complete cloud takeover.

Source: CSA Research Note, "UNC6426: nx Supply Chain to AWS Admin via OIDC" (March 2026).

**Incident 2: LiteLLM PyPI Compromise (March 2026)**
Two malicious versions (1.82.7, 1.82.8) of the LiteLLM Python package — a unified gateway to 100+ LLM providers with ~95-97 million monthly downloads — were published to PyPI. The compromise cascaded from a prior attack on the Trivy security scanner: Trivy's CI/CD was compromised, the PYPI_PUBLISH token was stolen from the GitHub Actions runner, and LiteLLM's own CI/CD ran the malicious Trivy, propagating the credential theft. The payload deployed three stages: a credential harvester targeting 50+ categories of secrets (cloud credentials, SSH keys, Kubernetes secrets), a Kubernetes lateral movement toolkit (privileged pods with host filesystem mounts, systemd persistence), and a persistent backdoor for remote code execution. Organizations running LiteLLM during the 2-3 hour window had all connected LLM provider API keys exfiltrated.

Source: CSA Research Note, "TeamPCP: Cascading Supply Chain Attack on AI/ML Tooling" (March 2026); Trend Micro, "Inside the LiteLLM Supply Chain Compromise" (March 2026).

**Incident 3: Axios / Sapphire Sleet (March 2026)**
A North Korean intelligence operation (Sapphire Sleet / UNC1069) hijacked the npm account of the primary maintainer of axios — the JavaScript HTTP client installed by over 100 million developers weekly. For exactly 174 minutes, anyone running `npm install axios` received a fully functional, cross-platform Remote Access Trojan with anti-forensic self-deletion. The RAT beaconed to ~135+ C2 endpoints. Among the compromised developer machines were those with privileged Vercel access. Two weeks later, Vercel confirmed unauthorized access occurred; data from the breach was listed on BreachForums at $2M. The human-in-the-loop SOC was irrelevant — by the time a threat analyst was paged, triaged the alert, confirmed it wasn't a false positive, escalated, and drafted a response, the RAT had already exfiltrated, established persistence, and deleted itself. The 174-minute poison window is shorter than the MTTR of every non-A architecture *for this class of attack*: the initial compromise does not produce an internal alert, so detection depends on ecosystem notification, which arrives after the damage is done. The best-case 3-minute MTTR that Pat can achieve when at-desk and alerted applies only to detections that produce an internal signal — and supply chain compromises produce none at the point of ingestion.

This incident is distinct in its mechanism — account takeover rather than CI/CD compromise — but identical in its TOFU consequence: the package was trusted because npm's registry functions as a TOFU trust anchor. The maintainer's account was the key to that anchor. The attack did not bypass attestation; it occupied the identity that attestation was supposed to protect.

Source: Lyrie Research, "The 174-Minute Poison Window: How North Korean Hackers Compromised 100 Million Weekly npm Downloads" (April 2026).

**Incident 4: TanStack / TeamPCP (May 2026)**
A sophisticated breach of the TanStack GitHub repository and npm publishing pipeline resulted in 84 malicious versions across 42 @tanstack npm packages. The attack was attributed to TeamPCP — the same group behind the LiteLLM compromise. The malicious payload (`router_init.js`) harvested credentials from AWS IMDS/Secrets Manager, GCP metadata, Kubernetes service-account tokens, Vault tokens, `.npmrc`, GitHub tokens, and SSH private keys — deliberately skipping tokens named `github_token` to avoid triggering secret scanning. The attack cascaded to 160+ secondary npm and PyPI packages by harvesting credentials and self-replicating through compromised developer and CI environments. Confirmed secondary victims included Mistral AI and UiPath.

Seven days later, TeamPCP exploited credentials harvested during this campaign to compromise the Nx Console VS Code extension, publishing a malicious version that was live for 11-18 minutes and exfiltrated approximately 3,800 internal GitHub repositories before detection.

Source: Rescana, "TanStack npm Supply Chain Attack: Detailed Analysis of the May 2026 GitHub Actions Breach" (May 2026); Rescana, "GitHub Internal Repositories Breached via Compromised Nx Console VS Code Extension" (May 2026).

**Four incidents, one structural pattern.** Three of the four (s1ngularity, LiteLLM, TanStack) exploited a TOFU trust assumption at the CI/CD boundary and cascaded through credential chaining — the CI/CD runner's tokens were the keys to the kingdom. The Axios incident exploited the same TOFU trust assumption at a different boundary — the registry maintainer account as trust anchor — with credential chaining at the ecosystem level (npm publish token → developer machines → Vercel access). All four operated faster than human responders could act. These four were selected not for uniqueness but for documentation quality — they are the best-analyzed examples of a class of supply chain attacks that includes dozens of smaller, less-documented incidents. The pattern repeats because the architecture repeats.

CSA's Zero Trust guidance on these incidents applies directly: "Limiting the scope and blast radius of CI/CD credentials — so that a CI runner's credentials cannot publish to PyPI, access LLM APIs, and modify Docker Hub repositories simultaneously — would have broken the cascading kill chain at multiple stages."

This is the textbook's Axiom 5 (Deterministic Bounded Authority) applied to the supply chain: the CI/CD runner must have an authority vector scoped to its specific purpose, with hardware-attested provenance, and its authority must expire automatically. The hardening path in Chapter 15 addresses this through SPIFFE/SPIRE cryptographic workload identity for pipeline runners.

**Important distinction — identity vs. integrity:** SPIFFE/SPIRE establishes *who* the CI/CD runner is (a verifiable workload identity bound to an attested execution environment). It does not establish *what* the runner is running (the pipeline code, the build toolchain, the post-install scripts). A CI/CD runner with SPIFFE identity can still execute a malicious build script that was injected via supply chain compromise — the identity is cryptographically verified but the pipeline payload is not. TOFU asymmetry is reduced but not eliminated: the CI/CD runner's identity is no longer TOFU (it is SPIFFE-attested), but the pipeline's code integrity remains TOFU (the code was trusted when it was committed, with no runtime re-verification). Closing the TOFU gap fully requires hardware-attested pipeline execution plus reproducible builds — the runner's TPM attests to the hash of the build environment, and an independent verifier confirms the produced artifact matches the source. SPIFFE/SPIRE addresses the identity dimension of the TOFU problem; it does not address the integrity dimension.

---

## The CI/CD Integrity Problem

The CI/CD pipeline is simultaneously the most powerful piece of infrastructure in the organization — it can deploy code to production with no human approval — and the least secured. This asymmetry is a structural consequence of velocity optimization.

**What CI/CD typically has, but should not:** Access to every production secret (database passwords, API keys, signing certificates). The ability to modify infrastructure (Terraform state, Kubernetes manifests, IAM policies). Network access to production environments. The ability to bypass code review (automated merges on green builds). The ability to modify its own configuration. In many organizations, compromising the CI/CD pipeline is equivalent to compromising the entire infrastructure — and the pipeline is secured by a GitHub Personal Access Token stored in a `.env` file.

**What CI/CD should have, but typically does not:** A bounded authority vector (Axiom 5) — "this pipeline runner can deploy to staging but not production," "this pipeline can build container images but not modify IAM policies." Hardware-attested execution — the runner's TPM attests to its integrity before the pipeline is trusted to deploy. Independent verification of pipeline output — another system, running in a different trust domain, verifies that the artifact produced by the pipeline matches what the source code declares, before admitting it to production.

**The fix within Archetype C's velocity constraints:** The SPIRE deployment (Chapter 15, Q2-3) provides cryptographic workload identity for the pipeline runner itself. The runner is no longer "a process with a PAT" — it is "a workload with a verified SPIFFE identity that is authorized to deploy to staging but not to production, and its authority expires in 15 minutes." The CI/CD pipeline becomes a machine identity subject to the same attestation requirements as any other workload. This closes the asymmetry without adding human approval gates that would slow deploys.

---

## Key Takeaways

1. **Trust on First Use (TOFU) is the fundamental vulnerability of velocity-optimized architectures. Code that passes CI/CD is trusted at runtime forever — making the CI/CD pipeline the single point of architectural failure.**
2. **Archetype C has the best MTTD/MTTR of any non-Holy-Grail archetype because fused teams + GitOps enable human recognition and instant rollback. But MTTD/MTTR cannot prevent the initial injection.**
3. **Degrade Gracefully preserves uptime at the cost of an exfiltration window. When the primary threat is data theft (not service disruption), this is the wrong optimization.**
4. **GitOps is a double-edged sword — it enables instant remediation but also instant deployment of malicious code. The fix is runtime attestation (D4), not slower deployments.**

---

## Cross-References

- **Next:** [Chapter 11: Archetype D — SaaS-Glued Lean Defense](./11-archetype-d-lean-defense.md)
- **Builds on:** [Chapter 5: Dimensions 1-4](../02-methodology/05-dimensions-trust-to-attestation.md), [Chapter 6: Dimensions 5-9](../02-methodology/06-dimensions-response-to-human.md)
- **Related:** [Chapter 7: Meta-Patterns](../02-methodology/07-meta-patterns.md)
- **Related:** [Chapter 15: The Velocity Defender (C Hardening Path)](../04-synthesis/15-velocity-defender.md)
