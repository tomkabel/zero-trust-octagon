# Blind Hunter — Adversarial Code Review

**Role:** You are a cynical, adversarial reviewer. No project context. No spec. Only the diff below. Assume the worst — find every vulnerability, logic error, bad assumption, and unclear change.

**Instructions:** Review this diff adversarially. Output findings as a Markdown list. Each finding: one-line title, severity (Critical/High/Medium/Low), the file it's in, and evidence from the diff. Be brutal — missing edge cases, security implications, architectural mistakes, unclear intent, anything that could break or mislead.

## Diff Output

```
diff --git a/.commandcode/taste/taste.md b/.commandcode/taste/taste.md
index 988e502..e41d87e 100644
--- a/.commandcode/taste/taste.md
+++ b/.commandcode/taste/taste.md
@@ -4,3 +4,6 @@
 
 # brainstorming
 See [brainstorming/taste.md](brainstorming/taste.md)
+
+# architecture
+See [architecture/taste.md](architecture/taste.md)
diff --git a/docs/06-dimensions-response-to-human.md b/docs/06-dimensions-response-to-human.md
index 65d58f5..11fee0a 100644
--- a/docs/06-dimensions-response-to-human.md
+++ b/docs/06-dimensions-response-to-human.md
@@ -69,7 +69,7 @@ The grafting protocol:
 4. The session's authentication token, cookies, and headers remain valid — but they are valid *in the garden*. The user's browser state, local storage, and navigation history are unaffected.
 5. From the attacker's perspective, the application continues to function normally. Every button works. Every page renders. Every API returns data.
 
-The graft is atomic — there is no period during which the attacker sees a mix of real and fake data that could reveal the deception.
+The graft is atomic for serial request sequences — no interleaved real and fake responses. For in-flight or concurrent requests (an attacker paginating through a large result set, or multiple AJAX calls), the enforcement point buffers in-flight requests that arrived before the graft event and completes them against the real data plane. All subsequent requests route to the garden. This produces a clean transition at the request boundary — the attacker may receive one final real response before the garden takes over, but never a partial or interleaved response.
 
 **2. Garden Environment (Live Synthetic Data Plane)**
 
@@ -81,7 +81,7 @@ The garden is not a static honeypot. It is a live, adaptive, LLM-powered synthet
 - When the attacker requests a resource, the garden's data fabricator generates a response that matches the expected schema, data types, field lengths, and relational integrity of the real data.
 - The fabricator uses a domain-fine-tuned LLM to produce *convincingly realistic but entirely fictional* content: plausible names, addresses, financial figures, medical records, source code, configuration values — whatever the application domain requires.
 - Generated data maintains internal consistency across requests. If the attacker requests "customer #482" twice, they receive the same synthetic customer both times, with consistent transaction history, consistent contact information, and consistent relational references.
-- The data carries subtle **watermark markers** — non-obvious patterns or specific values seeded into the generation — that allow the defender to identify exfiltrated garden data later, even if the attacker attempts to obscure its origin.
+- The data carries subtle **watermark markers** — non-obvious patterns or specific values seeded into the generation — that allow the defender to identify exfiltrated garden data later, even if the attacker attempts to obscure its origin. LLM-generated data carries additional detectable artifacts beyond intentional watermarks: statistical distribution patterns, repetition structures, and coherence failures in long sequences that differ from production data. An APT attacker running distributional analysis on exfiltrated data may detect these artifacts. Garden data generation quality must be validated against production data distributions before deployment, and the garden must periodically regenerate to incorporate improvements in LLM generation fidelity.
 
 **Freshness and evolution:**
 
@@ -114,6 +114,40 @@ If the attacker's requests arrive with 50ms gaps, the `transition:trickle-truth`
 
 **Failure mode:** If the event does not propagate before the next request, the enforcement point serves real data. The attacker receives one real response in a sequence of fake ones — a detectable inconsistency. The event stream must provide at-least-once delivery with bounded latency. Missed events are a breach of the deception.
 
+**5. De-Grafting / Session Termination**
+
+Trickle-Truth is not indefinite. The deception has a finite window — the attacker will eventually pause, exfiltrate enough data to attempt monetization, or notice inconsistencies. The de-grafting protocol defines the transition from deception to termination:
+
+1. **Intelligence satiation:** The system tracks the attacker's TTP inventory. When the rate of new TTP discovery drops below a threshold (the attacker is repeating known techniques), the intelligence yield has peaked.
+2. **Garden decommission:** The enforcement point stops routing to the garden. The session is terminated — not by locking the account (which would confirm detection) but by returning a generic "service unavailable" error that mimics a production outage.
+3. **Attestation hygiene:** All compromised session tokens, cookies, and credentials are revoked. The attacker's known C2 infrastructure is added to blocklists. Any watermarked garden data that was exfiltrated is registered in threat intelligence feeds for future detection.
+4. **Post-deception analysis:** The full session recording — every request, every response, every TTP extracted — is packaged for the defender's threat intelligence pipeline. The attacker receives no indication that they were in a garden.
+
+#### Prior Art Foundations
+
+Trickle-Truth is not without precedent. It synthesizes several well-established security research fields into a unified operational framework. The following prior art informs and grounds the specification:
+
+**Honeypots and Honeynets (1990s–present):** The foundational concept of decoy environments dates to early honeypot research (Spitzner, *Honeypots: Tracking Hackers*, Addison-Wesley, 2002, Ch. 2). Production honeypot deployments — decoy servers, databases, and services designed to attract and monitor attackers — established the principle that deception yields intelligence. Trickle-Truth extends honeypots from *static decoys* (fixed environment, predictable data) to *adaptive synthetic data planes* (LLM-generated, session-consistent, evolving data) and from *separate infrastructure* (dedicated decoy servers) to *graft-in-place* (the enforcement point intercepts the attacker's request stream and rewrites responses, transparently replacing the real data plane with the synthetic one without moving the attacker to new infrastructure).
+
+**Canary Tokens and Honey Tokens (Thinkst Canary, 2015–present):** Embedded credentials, files, and records that alert on access represent the narrowest and most operationally proven form of deception. A canary AWS key dropped into a production server generates an alert the moment an attacker attempts to use it. Trickle-Truth generalizes this from *single alert* (access to a canary token triggers a PagerDuty notification) to *continuous, proportional, multi-dimensional response* (an entire synthetic environment, not a single decoy credential).
+
+**Moving Target Defense (MTD, 2010–present):** DARPA and academic research into dynamically shifting attack surfaces — rotating IP addresses, re-randomizing memory layouts, mutating network topologies — established the principle that attacker cost increases with environmental unpredictability. Trickle-Truth applies MTD to the *data layer* rather than the *infrastructure layer*: the content the attacker receives shifts and evolves rather than the network paths they traverse.
+
+**DARPA Active Cyber Defense Programs (2012–2020):** DARPA's Plan X (2012-2017) and Cyber Grand Challenge (2014-2016) explored autonomous cyber defense, including automated vulnerability discovery, patching, and deception at machine speed. Plan X specifically explored programmatic deception and dynamic defense orchestration, the structural ancestors of event-stream-driven policy transitions. The Cyber Grand Challenge's fully autonomous CTF format proved that machine-speed defense is possible; Trickle-Truth applies this principle to a production deception framework.
+
+**Cyber Deception Theory (Academic, 2015–present):** Pawlick et al., "Game Theory for Cyber Deception" (2020) and related literature model the attacker-defender interaction as a signaling game where the defender's optimal strategy involves mixing real and deceptive signals. Trickle-Truth operationalizes this theory with a specific architectural instantiation: the pollution rate $R$ is the game-theoretic mixing parameter, the garden environment is the signaling channel, and the event-stream graft is the mechanism for transitioning between strategies without the attacker detecting the state change.
+
+**Epistemic Binding Key — Prior Art:**
+The Epistemic Binding Key (EBK) — a cryptographic key that binds specific attestations to specific temporal states, serving as "truth insurance" — has the following foundations:
+
+- **Certificate Transparency (RFC 6962, 2013):** Public, verifiable, append-only logs of issued certificates. CT established that a tamper-evident log structure (Merkle tree) plus independent monitors can detect CA misbehavior that the CA itself has no incentive to report. EBK applies the same principle to telemetry attestation: a Merkle-attested log of system state claims, independently verifiable by any observer.
+
+- **Merkle Trees and Verifiable Data Structures (1980s–present):** Git's content-addressed object store, Bitcoin's transaction Merkle trees, and Certificate Transparency's log proofs all demonstrate that a Merkle root can serve as a compact, cryptographically binding commitment to a large, dynamic dataset. EBK uses Merkle trees to bind attestation claims to temporal states — the root hash at time $t$ is the binding proof of what was claimed at $t$.
+
+- **Transparency Logs in Software Supply Chains (Sigstore/Rekor, 2021–present):** Sigstore's Rekor transparency log records signed container image attestations in an append-only, publicly verifiable log. This is the closest operational analogue to EBK: a cryptographic proof that a specific artifact was attested at a specific time, independently verifiable, with no dependency on the attester's continued honesty.
+
+The EBK concept extends these foundations from *object provenance* (this container image was signed at time $t$) to *telemetry provenance* (this system state claim was attested at time $t$ by an observer whose identity is cryptographically bound to the hardware that produced the observation).
+
 ---
 
 #### Trickle-Truth vs. Attacker Types
@@ -214,6 +248,76 @@ D9 forces the architecture to account for human availability as a design paramet
 
 **Upgrade path:** Automated response for clear-cut cases (session revocation on obvious device posture failure) reduces Pat's alert load and eliminates the human dependency for high-confidence detections. For ambiguous cases, a small rotation (hire a second person) moves D9 from "single" to "small rotation."
 
+### D9 Sub-Dimensions: Measurable Operational Metrics
+
+D9 (Human Continuity) is the dimension most universally overlooked. To make it actionable for practitioners, it decomposes into four measurable sub-dimensions that together define the architecture's dependence on human availability:
+
+**D9a: Response Automation Coverage ($A_{D9}$)**
+
+The fraction of detection events that receive an automated response without human intervention.
+
+$$A_{D9} = \frac{\text{detections with automated response}}{\text{total detections}}$$
+
+- **Mostly Manual ($A_{D9} < 0.2$):** Fewer than 20% of detections trigger any automated action. Nearly everything requires a human.
+- **Partially Automated ($0.2 \leq A_{D9} < 0.6$):** Automated handling for high-confidence, low-ambiguity events. Human required for the rest.
+- **Highly Automated ($0.6 \leq A_{D9} < 0.95$):** Most detections handled automatically. Humans handle ambiguous escalations only.
+- **Fully Automated ($A_{D9} \geq 0.95$):** No human in the loop for standard detection-response. Only novel attack patterns require human analysis.
+
+**Operational significance:** Every additional 0.1 of $A_{D9}$ reduces the alert load on the humans in rotation by a proportional amount. At $A_{D9} = 0.2$ and a rotation of 1, Pat is the bottleneck. At $A_{D9} = 0.6$ and a rotation of 2, each person handles a sustainable load.
+
+**D9b: Response Depth ($D_{D9}$)**
+
+The number of independent responders available during any given hour.
+
+$$D_{D9} = |\{\text{responders available during time window}\}|$$
+
+- **Single ($D_{D9} = 1$):** One person. MTTR is bimodal as described above.
+- **Small Rotation ($D_{D9} = 2$):** Two people. If one is unavailable, the other covers. MTTR variance decreases.
+- **Shifted ($D_{D9} \geq 3$):** Three or more people in rotation with formal shift coverage. 24/7 availability guaranteed.
+- **Redundant Shifted ($D_{D9} \geq 5$):** Multiple independent responders available simultaneously. No single point of failure even during shift transitions.
+
+**D9c: Response Time Variance ($\sigma_{MTTR}$)**
+
+The standard deviation of mean time to respond across all incidents.
+
+$$\sigma_{MTTR} = \sqrt{\frac{1}{n}\sum_{i=1}^{n}(MTTR_i - \overline{MTTR})^2}$$
+
+- **Single ($\sigma_{MTTR}$ high):** MTTR ranges from 3 minutes (Pat at desk) to 25+ minutes (Pat unavailable). Average MTTR is meaningless — it obscures the structural risk.
+- **Small Rotation ($\sigma_{MTTR}$ moderate):** Variance narrows with redundancy but still spikes during shift transitions.
+- **Enterprise SOC ($\sigma_{MTTR}$ low):** Consistent response time regardless of time of day or personnel availability.
+- **Fully Automated ($\sigma_{MTTR}$ near-zero):** Response time is bounded by the automation pipeline, not human availability.
+
+**D9d: On-Call Rotation Burnout Risk ($B_{D9}$)**
+
+A qualitative metric measuring the sustainability of the current response staffing model.
+
+The four variables that determine burnout severity are: alert volume (events per day requiring human attention), rotation size (number of people sharing the load), automation coverage ($A_{D9}$), and alert quality (signal-to-noise ratio). Burnout occurs when the product of alert volume and false-positive rate exceeds the rotation size's sustainable attention budget, compounded by low automation.
+
+- **Unsustainable ($B_{D9}$ critical):** One person receiving >10 alerts per day with no automation. Burnout is not a risk — it is a guarantee.
+- **Fragile ($B_{D9}$ high):** Small rotation with moderate automation but high false-positive rate. Alert fatigue degrades response quality over time.
+- **Stable ($B_{D9}$ moderate):** Rotation sized to the alert volume. Automation handles routine events. False positives managed through policy tuning.
+- **Sustainable ($B_{D9}$ low):** Automation handles the majority of events. Humans handle only ambiguous cases. False positives tracked as a system quality metric.
+
+**Diagnostic for Practitioners:**
+
+To assess your D9 posture, ask:
+
+1. What is your $A_{D9}$? Run a 30-day trace of all detections. Count how many received automated response vs. human response.
+2. What is your $D_{D9}$ during 2-6 AM in your primary time zone? The worst-case availability matters more than the average.
+3. What is your $\sigma_{MTTR}$ over the last 12 months? If the standard deviation exceeds 2x the mean, you have a human continuity problem.
+4. What is your $B_{D9}$? Ask your primary responder: "How many times in the last month did you receive an alert and think 'I cannot handle another one' before opening it?" This question works reliably only in confidential, anonymous, or post-mortem contexts. For public self-assessment, substitute: "What is the ratio of alerts handled to alerts acknowledged?" An unacknowledged alert is a burnout signal regardless of what the responder says aloud.
+
+**The D9 upgrade path in practice:**
+
+| Starting State | $A_{D9}$ | $D_{D9}$ | Action | Cost |
+|---------------|----------|----------|--------|------|
+| Solo Operator (Pat) | <0.2 | 1 | Add automated response for top 3 alert types (session revocation, device posture failure, MFA anomaly) | $0-3K (cloud function + policy tuning) |
+| Small Team | 0.2-0.4 | 2 | Expand automation to include medium-confidence events. Add a third responder. | $0 (automation) + salary (third person) |
+| Growth Phase | 0.4-0.6 | 3 | Tune false positive rate. Implement shift coverage for night hours. | $0 (tuning) + shift differential |
+| Enterprise | 0.6-0.95 | 5+ | Full automation for all categories except novel attack patterns. Redundant coverage. | Continuous operational cost |
+
+*The $0–3K figure is the cost of the first automation step, not the cost of architectural hardening. Automation without attestation, without bounded authority, without policy distribution — automation without the other eight dimensions — produces a faster path to failure, not a hardened architecture.*
+
 ---
 
 ## Key Takeaways
@@ -250,3 +352,5 @@ D9 forces the architecture to account for human availability as a design paramet
 - **Builds on:** [Chapter 4: The Morphological Matrix](./04-the-morphological-matrix.md), [Chapter 5: Dimensions 1-4](./05-dimensions-trust-to-attestation.md)
 - **Related:** [Chapter 8: Archetype A — The Holy Grail (Full Attack Trace)](./08-archetype-a-holy-grail.md)
 - **Related:** [Appendix D: Quick-Reference Card](./appendix-d-quick-reference.md)
+il.md)
+- **Related:** [Appendix D: Quick-Reference Card](./appendix-d-quick-reference.md)
diff --git a/docs/10-archetype-c-startup.md b/docs/10-archetype-c-startup.md
index be7bf23..1d970d7 100644
--- a/docs/10-archetype-c-startup.md
+++ b/docs/10-archetype-c-startup.md
@@ -146,6 +146,40 @@ The typosquatted dependency attack traced above is not a hypothetical. It is the
 
 Archetype C's starting state — TOFU attestation — addresses none of these tiers. The hardening path adds layered defense at each tier without breaking velocity.
 
+### 2025-2026: The Supply Chain Breach Cascade — Four Incidents at Unprecedented Scale
+
+The attack traced above is structurally identical to four major incidents that occurred between August 2025 and May 2026. These are not hypotheticals — they are documented breaches analyzed by Google/Mandiant, Microsoft, CSA, and Lyrie Research. Together they validate Archetype C's primary threat profile and the velocity-supply chain asymmetry.
+
+**Incident 1: s1ngularity → UNC6426 AWS Takeover (August 2025)**
+The s1ngularity npm package was compromised in a supply chain attack, seeding a malicious post-install script into downstream CI/CD pipelines. Google/Mandiant tracked a threat actor (UNC6426) who exploited this compromise to achieve full AWS administrator access at a victim organization in under 72 hours. The attack chain: compromised Nx build tool → GitHub Actions OIDC trust abuse → CloudFormation IAM escalation → AWS admin. The OIDC trust policy flaw was confirmed across more than 275 AWS accounts — a class of misconfiguration that is routinely deprioritized during initial CI/CD setup. No zero-day exploits were used. The attacker combined three independently documented but rarely chained risks into a complete cloud takeover.
+
+Source: CSA Research Note, "UNC6426: nx Supply Chain to AWS Admin via OIDC" (March 2026).
+
+**Incident 2: LiteLLM PyPI Compromise (March 2026)**
+Two malicious versions (1.82.7, 1.82.8) of the LiteLLM Python package — a unified gateway to 100+ LLM providers with ~95-97 million monthly downloads — were published to PyPI. The compromise cascaded from a prior attack on the Trivy security scanner: Trivy's CI/CD was compromised, the PYPI_PUBLISH token was stolen from the GitHub Actions runner, and LiteLLM's own CI/CD ran the malicious Trivy, propagating the credential theft. The payload deployed three stages: a credential harvester targeting 50+ categories of secrets (cloud credentials, SSH keys, Kubernetes secrets), a Kubernetes lateral movement toolkit (privileged pods with host filesystem mounts, systemd persistence), and a persistent backdoor for remote code execution. Organizations running LiteLLM during the 2-3 hour window had all connected LLM provider API keys exfiltrated.
+
+Source: CSA Research Note, "TeamPCP: Cascading Supply Chain Attack on AI/ML Tooling" (March 2026); Trend Micro, "Inside the LiteLLM Supply Chain Compromise" (March 2026).
+
+**Incident 3: Axios / Sapphire Sleet (March 2026)**
+A North Korean intelligence operation (Sapphire Sleet / UNC1069) hijacked the npm account of the primary maintainer of axios — the JavaScript HTTP client installed by over 100 million developers weekly. For exactly 174 minutes, anyone running `npm install axios` received a fully functional, cross-platform Remote Access Trojan with anti-forensic self-deletion. The RAT beaconed to ~135+ C2 endpoints. Among the compromised developer machines were those with privileged Vercel access. Two weeks later, Vercel confirmed unauthorized access occurred; data from the breach was listed on BreachForums at $2M. The human-in-the-loop SOC was irrelevant — by the time a threat analyst was paged, triaged the alert, confirmed it wasn't a false positive, escalated, and drafted a response, the RAT had already exfiltrated, established persistence, and deleted itself. The 174-minute poison window is shorter than the MTTR of every non-A architecture *for this class of attack*: the initial compromise does not produce an internal alert, so detection depends on ecosystem notification, which arrives after the damage is done. The best-case 3-minute MTTR that Pat can achieve when at-desk and alerted applies only to detections that produce an internal signal — and supply chain compromises produce none at the point of ingestion.
+
+This incident is distinct in its mechanism — account takeover rather than CI/CD compromise — but identical in its TOFU consequence: the package was trusted because npm's registry functions as a TOFU trust anchor. The maintainer's account was the key to that anchor. The attack did not bypass attestation; it occupied the identity that attestation was supposed to protect.
+
+Source: Lyrie Research, "The 174-Minute Poison Window: How North Korean Hackers Compromised 100 Million Weekly npm Downloads" (April 2026).
+
+**Incident 4: TanStack / TeamPCP (May 2026)**
+A sophisticated breach of the TanStack GitHub repository and npm publishing pipeline resulted in 84 malicious versions across 42 @tanstack npm packages. The attack was attributed to TeamPCP — the same group behind the LiteLLM compromise. The malicious payload (`router_init.js`) harvested credentials from AWS IMDS/Secrets Manager, GCP metadata, Kubernetes service-account tokens, Vault tokens, `.npmrc`, GitHub tokens, and SSH private keys — deliberately skipping tokens named `github_token` to avoid triggering secret scanning. The attack cascaded to 160+ secondary npm and PyPI packages by harvesting credentials and self-replicating through compromised developer and CI environments. Confirmed secondary victims included Mistral AI and UiPath.
+
+Seven days later, TeamPCP exploited credentials harvested during this campaign to compromise the Nx Console VS Code extension, publishing a malicious version that was live for 11-18 minutes and exfiltrated approximately 3,800 internal GitHub repositories before detection.
+
+Source: Rescana, "TanStack npm Supply Chain Attack: Detailed Analysis of the May 2026 GitHub Actions Breach" (May 2026); Rescana, "GitHub Internal Repositories Breached via Compromised Nx Console VS Code Extension" (May 2026).
+
+**Four incidents, one structural pattern.** Three of the four (s1ngularity, LiteLLM, TanStack) exploited a TOFU trust assumption at the CI/CD boundary and cascaded through credential chaining — the CI/CD runner's tokens were the keys to the kingdom. The Axios incident exploited the same TOFU trust assumption at a different boundary — the registry maintainer account as trust anchor — with credential chaining at the ecosystem level (npm publish token → developer machines → Vercel access). All four operated faster than human responders could act. These four were selected not for uniqueness but for documentation quality — they are the best-analyzed examples of a class of supply chain attacks that includes dozens of smaller, less-documented incidents. The pattern repeats because the architecture repeats.
+
+CSA's Zero Trust guidance on these incidents applies directly: "Limiting the scope and blast radius of CI/CD credentials — so that a CI runner's credentials cannot publish to PyPI, access LLM APIs, and modify Docker Hub repositories simultaneously — would have broken the cascading kill chain at multiple stages."
+
+This is the textbook's Axiom 5 (Deterministic Bounded Authority) applied to the supply chain: the CI/CD runner must have an authority vector scoped to its specific purpose, with hardware-attested provenance, and its authority must expire automatically. The hardening path in Chapter 15 addresses this through SPIFFE/SPIRE cryptographic workload identity for pipeline runners.
+
 ---
 
 ## The CI/CD Integrity Problem
diff --git a/docs/13-self-assessment.md b/docs/13-self-assessment.md
index f1f455d..e0eb490 100644
--- a/docs/13-self-assessment.md
+++ b/docs/13-self-assessment.md
@@ -10,6 +10,25 @@
 
 ---
 
+## Why This Assessment Matters: The Confidence/Reality Gap
+
+Before you answer the twelve questions, understand the data:
+
+- 57% of organizations believe they have reached "Advanced" zero-trust maturity (RSA ID IQ Report 2026, 2,120 respondents).
+- 69% of all respondents experienced an identity-related breach in the last three years, and 70% of those described the breach as severe.
+- 91% have not reached optimal CISA-defined zero-trust maturity for identity — the most mature pillar (separate CISA assessment, not the RSA survey).
+- 88% of all respondents experienced an identity-related breach at some point, a 27-percentage-point increase in breach prevalence from 2025. The RSA report does not publish the conditional breach rate for the Advanced self-assessment group specifically, but the magnitude of the overlap between the 57% and the 69% makes statistical independence implausible.
+
+This is the confidence/reality gap. Organizations overestimate their zero-trust maturity by a structurally significant margin, and the penalty for that overestimation is breach. The organizations with the highest self-assessed confidence — those most certain they are "doing zero trust" — are the ones most likely to be breached through the seams between their tools. The mechanism is worth understanding: the tools that measure maturity also generate a sense of progress, and that sense of progress masks the gaps between pillars. If you are reading this and thinking "but my organization is different," that impulse is the mechanism.
+
+This phenomenon is not a statistical anomaly. It is a structural feature of zero-trust assessment: the tools that measure maturity also generate a sense of progress, and that sense of progress masks the gaps between pillars. An organization with phishing-resistant MFA (Identity at Advanced) and comprehensive endpoint detection (Devices at Advanced) but no microsegmentation (Networks at Initial) and inconsistent data classification (Data at Traditional) is vulnerable to exactly the lateral movement that zero-trust is designed to prevent. But their self-assessment focuses on the pillars where they've invested — and the average across pillars obscures the attack surface in the weakest ones.
+
+This gap is not a measurement error — it is an incentivized outcome. The entities that measure maturity (vendors, consultants, frameworks) are the same entities that benefit from reporting it as high. Vendors sell tools and produce adoption reports. Consultants sell maturity assessments that benchmark against frameworks — and frameworks are political documents negotiated by committees whose participants each have a stake in the framework making their product or approach look sufficient. The assessment ecosystem is structurally rewarded for reporting progress, not precision. A framework that required integration verification — "does your MFA attestation chain survive a compromised identity provider?" — would declare most participants insufficient, so frameworks settle for adoption-level questions ("do you have phishing-resistant MFA?"). The entity that could credibly report "the tools you bought aren't connected and you're breachable through the seams" has no commercial incentive to do so.
+
+Do not be the 57%. Answer what is deployed today. The assessment should err toward the harder path, not the easier one.
+
+---
+
 ## How to Use This Assessment
 
 The twelve questions below diagnose your organization's current zero-trust configuration. Answer each question with the option that best describes your reality — not your aspiration, not your roadmap, not what you told the board. What is actually deployed and operational today.
@@ -190,6 +209,7 @@ The goal is not to become Archetype A tomorrow. The goal is to satisfy one more
 1. **Answer the twelve questions based on what is deployed today, not what is on your roadmap. Self-assessment that flatters is worse than useless — it routes you to the wrong decision tree.**
 2. **Archetype A is not a possible diagnosis from this assessment unless you have hardware-attested provenance, bilateral enforcement, and Trickle-Truth in production. Scattered A answers among B/C/D answers do not make you an Aspirant.**
 3. **Tiebreakers prioritize deployment velocity (B vs. C) and budget (C vs. D) because those are the dimensions that most constrain viable upgrade paths.**
+4. **The confidence/reality gap is the structural risk that this assessment is designed to counter.** Organizations overestimate their maturity by a wide margin — 57% believe they are Advanced, 69% are breached — and the pillars where they are weakest (Networks at Initial, Data at Traditional) are the ones they are least aware of. This assessment measures all pillars equally and routes you to the implementation chapter for your weakest dimension, not your strongest.
 
 ---
 
diff --git a/docs/appendix-a-quantum-ai-threats.md b/docs/appendix-a-quantum-ai-threats.md
index eaef18e..fa943a2 100644
--- a/docs/appendix-a-quantum-ai-threats.md
+++ b/docs/appendix-a-quantum-ai-threats.md
@@ -14,6 +14,42 @@ This appendix stress-tests each Octagon axiom against two future threat models t
 
 **Timeline:** Most estimates place CRQC availability in the 2028-2035 window for nation-state actors. The conservative side of this range (2028-2030) means that infrastructure being procured and deployed today will still be in service when the threat materializes.
 
+#### Regulatory PQC Timeline (NIST IR 8547, NSM-10, CNSA 2.0)
+
+The migration to post-quantum cryptography is not speculative — it is mandated by an escalating set of federal requirements with fixed deadlines:
+
+| Regulatory Action | Date | Requirement |
+|------------------|------|-------------|
+| NIST FIPS 203/204/205 PQC Standards | August 2024 | ML-KEM (key encapsulation), ML-DSA (digital signatures), SLH-DSA (hash-based signatures) standardized |
+| NSM-10 Strategic Posture | May 2022 | Federal systems must migrate to quantum-resistant cryptography; bulk of work before 2035 |
+| OMB M-23-02 Cryptographic Inventory | Annual from 2023 | Agencies must submit prioritized cryptographic inventories of systems using quantum-vulnerable cryptography |
+| CNSA 2.0 Phase 1: Software/firmware signing | 2025 | All software and firmware signing must transition to CNSA 2.0-approved algorithms |
+| First CAVP PQC Certifications | January 2026 | CIQ NSS and SafeLogic modules received CAVP certification covering ML-KEM and ML-DSA — *but these are NOT FIPS 140-3 validated* |
+| FIPS 140-2 → FIPS 140-3 Transition Complete | September 21, 2026 | All newly procured or renewed cryptographic modules must carry FIPS 140-3 compliant validation |
+| CNSA 2.0 Phase 2: Web browsers/servers, cloud services | 2026 | All web browsers, servers, and cloud services must use CNSA 2.0-approved algorithms by default |
+| DoD ZTA Target-Level Deadline | September 2027 | All DoD information systems must achieve Target-level ZTA — **before PQC migration is complete** |
+| NIST IR 8547: RSA/ECC Deprecated | After 2030 | All new systems must use post-quantum cryptography; RSA and ECC deprecated for new deployments |
+| NIST IR 8547: RSA/ECC Disallowed | After 2035 | No quantum-vulnerable public-key algorithms permitted in any federal system |
+| CNSA 2.0 Phase 3: Networking technologies | 2030 | All networking technologies (VPNs, routers, etc.) must use CNSA 2.0-approved algorithms |
+| CNSA 2.0 Phase 4: Niche equipment, legacy OT | 2033 | Final phase — niche equipment with long refresh cycles must complete migration |
+
+**The ZTA-PQC Dependency Problem (September 2027 vs. 2030-2035):**
+
+The DoD ZTA Target-Level deadline (September 2027) requires all DoD information systems to achieve Target-level zero trust architecture. But the PQC migration deadline is 2030-2035 — three to eight years later. This is a coordination gap between regulatory schedules set by different working groups, not a flaw in zero trust architecture. But do not mistake a coordination gap for a paperwork problem. It means that the cryptographic foundation of every system achieving ZTA compliance in 2027 — TPM attestation chains, SPIFFE SVID signatures, mTLS cipher suites, policy-hash verification — will need to be *replaced*, not upgraded, within 3–8 years. The cost of that replacement is not budgeted in current ZTA procurement cycles. The practical consequence is unchanged:
+
+1. Systems achieve ZTA compliance in 2027 using classical cryptography (ECDSA certificates, ECDHE key exchange, RSA policy signatures).
+2. Those same systems then require complete cryptographic rework when PQC mandates take effect between 2030 and 2035.
+3. This includes TPM attestation chains (currently ECDSA P-256), SPIFFE SVID signatures, mTLS cipher suites, policy-hash verification — every cryptographic primitive that ZTA depends on.
+4. PQC algorithms use 4-10x larger key and signature sizes than their classical equivalents, impacting performance, network bandwidth, and certificate chain management.
+
+**As of May 2026, NO FIPS 140-3 validated PQC module exists.** NIST's own projection (summer/fall 2025, presented at the PKI Consortium PQC Conference in Austin) was not met. The first validated module has no fixed closing date. Organizations that defer PQC planning until the first validated module appears will compress an already-constrained migration timeline — cryptographic migration cycles average 7-10 years across enterprise environments, and organizations starting PQC work in 2026 are already targeting completion at the boundary of the disallowance window with no schedule slack.
+
+- *The PKI Consortium conference projection is corroborated by pqcinformation.com's April 2026 tracking of the FIPS 140-3 validation gap.*
+
+**The action window for PQC migration in zero-trust is 2026-2030.** Infrastructure procured in 2026 will be receiving firmware updates until 2030-2032. The migration must be planned and funded before the hardware procurement cycle locks in non-PQC silicon. Dual-stack cryptography — conventional and PQC in parallel — is the correct strategy, with an expected 5-7 years of overlap before conventional algorithms can be fully deprecated.
+
+Sources: [NIST IR 8547 (Initial Public Draft, November 2024)](https://nvlpubs.nist.gov/nistpubs/ir/2024/NIST.IR.8547.ipd.pdf), [Federal PQC Migration Deadlines (April 2026)](https://www.pqcinformation.com/federal-pqc-migration-deadlines-what-agencies-actually-face-in-2026-and-beyond/), [FIPS 140-3 Validation Gap (April 2026)](https://www.pqcinformation.com/fips-140-3-validation-gap-why-no-pqc-algorithm-has-a-validated-module-yet/), [MDPI: Synchronizing PQC, ZTA, and AI Security (February 2026)](https://www.mdpi.com/2079-8954/14/3/233), [DoD DTM 25-003: Zero Trust Strategy (July 2025)](https://www.esd.whs.mil/Portals/54/Documents/DD/issuances/dtm/DTM%2025-003.PDF)
+
 **What breaks:** Virtually every asymmetric cryptographic primitive used in current zero-trust deployments.
 
 | Cryptosystem | Applications in ZTA | CRQC Impact |