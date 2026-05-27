# Appendix C: Glossary of Terms

## A

**Architecture validation checklist** — An eight-question diagnostic instrument derived from the Octagon axioms. Each question maps to one axiom and includes green/yellow/red scoring criteria.

**Attestation** — The process by which an entity provides verifiable evidence of its trustworthiness. Attestation may be cryptographic (TPM measurements, SPIFFE identity certificates) or behavioral (pattern-matching against expected baselines).

**Axiom** — An irreducible statement accepted as true without proof, from which other statements are derived. The Octagon comprises eight axioms that define zero-trust architecture.

## B

**Behavioral attestation** — Trust verification based on pattern-matching: typing cadence, navigation sequences, access timing, resource access patterns. Weaker than cryptographic attestation but useful as a second independent signal.

**Bilateral Symmetry** — Axiom 8 of the Octagon. Verification is bidirectional: the resource must prove its state to the requester, and the requester must prove its state to the resource. Unilateral enforcement is not zero-trust.

**Bimodal MTTR** — A mean-time-to-respond distribution with two peaks (e.g., 3 minutes or 25+ minutes) rather than a single central tendency. Characteristic of solo-operator architectures where responder availability determines response time.

**Byzantine Fault Tolerance (BFT)** — Axiom 6 of the Octagon. The architecture maintains structural and epistemic integrity even when individual components act maliciously. A compromised PEP cannot alter policy, forge audit logs, or force illicit verdicts.

## C

**Capability surface** — The topography formed by interaction of morphological dimensions. Different combinations optimize for different threat models. The maturity vector is a surface, not a line.

**CBOM (Cryptographic Bill of Materials)** — Expected golden measurements for every hardware and software component in a node's boot chain, used for silicon attestation verification.

**Confidential containers** — Containers whose memory and CPU state are encrypted and isolated at the hardware level (Azure SEV-SNP, AWS Nitro Enclaves, GCP confidential VMs). Even the hypervisor cannot read the workload's data.

**Continuous Verification** — Axiom 4 of the Octagon. Verdicts expire. Re-verification occurs at a cadence determined by risk, not by session convenience.

**Covariance cluster** — A set of morphological dimension values that tend to co-occur because each value enables the others in the cluster and constrains values from the opposite cluster.

**Cryptographic Workload Identity** — Machine identity model where the workload's identity (typically a SPIFFE ID) is issued based on cryptographic proof of the workload's code and configuration hash, not a self-declared service account name.

## D

**Data diode** — A unidirectional network gateway that allows telemetry to flow from the production network into an observability pipeline but physically prevents any data from flowing back. Used to air-gap the truth pipeline.

**D9 (Human Continuity)** — The ninth morphological dimension. How the human response layer is staffed. Values: Single Point of Failure, Small Rotation, 24/7 SOC, Fully Automated.

**Decision gate** — A quantitative threshold in an implementation decision tree that signals whether the primary path is working or requires a pivot.

**Degrade Gracefully** — Violation response strategy. Instead of denying access, degrade service quality: throttle bandwidth, reduce response priority, serve stale but safe data.

**Detect-respond gap** — The interval between detection and effective response during which the attacker can still inflict damage. The true operational metric for zero-trust effectiveness, superseding MTTD alone.

**Deterministic Bounded Authority** — Axiom 5 of the Octagon. Every grant of access confers a mathematically bounded vector of permitted state transitions. Authority cannot expand without a new, independent authorization decision.

## E

**Envy trap** — A pattern where one archetype covets properties of another that are structurally incompatible with its own configuration. B envies C's velocity; C envies A's prevention; A envies C's MTTD.

**Epistemic Integrity** — Axiom 7 of the Octagon. State inputs to the evaluation function must carry cryptographic proof of provenance. Unattested data is treated as hostile input and may be used only to deny access.

**Event-stream regress** — The infinite regress problem: the event stream distributing policy changes must itself be secured by zero-trust. Resolved by hardware-attested producers, signed events, and independent observation of the stream itself.

**Event-Streamed (Pub/Sub) policy** — D6 value. Policy state changes are published to an event-streaming backbone (Kafka, NATS). PEPs subscribe and maintain locally cached in-memory policy state. Enables sub-10ms global policy propagation.

## G

**Garden environment** — The live, adaptive, LLM-powered synthetic data environment used in Trickle-Truth. It mirrors the structure and behavior of the real application but serves entirely fictional data.

**Garbage pollution rate (R)** — The ratio of fake data served to the attacker versus real data that would have been served. At R=1.0, the substitution is seamless. At R>1.0, the system overproduces synthetic data to waste attacker resources.

## H

**Hard Deny** — Violation response strategy. Request denied, connection terminated, account locked, node isolated. Violates Axiom 6 because the defensive response cascades into business damage.

**Heterogeneous Triple** — The strongest practical attestation modality. Three independent observation types (kernel eBPF, hypervisor, hardware performance counters) produce independently signed observations, reconciled by Byzantine consensus.

**Human Continuity (D9)** — The ninth morphological dimension, discovered during analysis of Archetype D. Addresses how the human response layer is staffed and what happens when the primary responder is unavailable.

## I

**Identity-Aware Proxy (IAP)** — A reverse proxy that authenticates and authorizes every request before forwarding to a self-hosted resource. The primary enforcement tool for Archetype D.

**Identity rot** — Accumulated permissions from role changes, temporary access grants, and project migrations over time. The Skeptic CISO finds this through exception audits.

**Implicit Trust** — D7 value. The observability pipeline is trusted as a single source of truth without independent verification. Violates Axiom 2 and Axiom 7.

## L

**Leverage point hierarchy** — The ranking of morphological dimensions by the impact of upgrading them. D5 (Violation Response) is highest leverage, followed by D4, D8, D2, and D7.

**Low-maturity cluster** — The set of dimension values that reinforce each other downward: Software PKI → Single Attestation → Push → Hard Deny → Implicit Observability → Siloed Org.

## M

**Merkle-attested telemetry** — An observability trust model where telemetry is hashed into Merkle Trees in memory, and the root hash is signed by a hardware enclave at intervals. Tampering any individual observation breaks the cryptographic chain.

**MFA Fatigue (Prompt Bombing)** — A social engineering attack where the attacker sends repeated MFA push notifications until the target accepts one out of annoyance, fatigue, or confusion.

**Micro-Friction** — Violation response strategy. The system injects subtle friction at specific anomalous interaction points: step-up auth, performance degradation, or forced re-authentication for sensitive actions. Not a lockdown — just enough friction to disrupt attackers.

**Morphological matrix** — The nine-dimensional configuration space for zero-trust architecture. Each dimension has 5-7 values, and each deployment maps to exactly one value per dimension.

## N

**No Intrinsic Trust** — Axiom 1 of the Octagon. Trust is a transient verdict, never a property of identity, position, or history.

## O

**Octagon** — The set of eight irreducible axioms that define zero-trust architecture. Named for the eight-sided shape formed by the axioms.

## P

**Pat Problem** — The structural vulnerability of solo-operator architectures: all security capabilities depend on one human whose unavailability produces a catastrophic tail in response time distribution.

**Probationary Identity** — D2 value. Identity is not granted fully at authentication. The entity operates in a limited, monitored state until its behavior matches the expected archetype baseline, at which point full identity is released.

## S

**SaaS Blind Spot** — The gap between what an identity-aware proxy protects (self-hosted resources) and what the SaaS layer exposes (Google Drive, Slack, Notion, etc.) using the same identity token. A zero-trust architecture must account for both.

**SaaS Coverage Map** — An inventory of every SaaS platform that trusts the organization's identity provider, including the data it holds and the audit logging available.

**Self-quarantine rate** — The percentage of nodes that are automatically isolated due to attestation mismatches from benign causes (cosmic ray bit-flips, thermal degradation, firmware update drift). In high-maturity architectures, a 10% rate is considered normal.

**Session graft** — The atomic transition of an attacker's session from real data to the garden environment. The authentication token, cookies, and headers remain valid but now authenticate to the synthetic environment.

**Silicon Root of Trust** — D1 value. Trust anchored in cryptographic keys embedded in CPU hardware, burned at the foundry. The foundation for Epistemic Integrity (Axiom 7).

**Software CA (PKI-based)** — D1 value. Trust anchored in a certificate authority hierarchy. Flexible but software-compromiseable.

**Static JIT** — D2 value. Identity minted Just-In-Time with an explicit TTL. Standard OIDC/JWT flows. Trusted until expiry.

## T

**Thin Perimeter fallacy** — The mistaken belief that an identity-aware proxy at the network edge constitutes sufficient enforcement. Flawed because SaaS platforms bypass the proxy entirely.

**Trickle-Truth** — D5 violation response. The attacker is seamlessly migrated to a synthetic environment serving convincing but fake data. The only response achieving zero data loss, zero business impact, and positive intelligence simultaneously.

**Trust Decay** — D2 value. The trust score begins degrading from the moment of authentication. Continuous, invisible re-verification is required to maintain access.

**Truth Pipeline** — The air-gapped, cryptographically verified observability infrastructure that provides mathematically certain telemetry. Receives data via unidirectional data diode from heterogeneous observers.

## U

**Unbypassable Mediation** — Axiom 3 of the Octagon. There is no physical or logical path to any resource that does not invoke the evaluation function.

## V

**Verifiable Policy** — Axiom 2 of the Octagon. Policy is a deterministic state machine: same inputs always produce the same verdict, provable to a neutral third party.

**Violation Response** — D5. The most leverageable dimension in the morphological matrix. Determines what a "successful defense" produces: loss, outage, or intelligence.

## Z

**Zero Standing Privileges (ZSP)** — D2 value. No persistent accounts. All access is JIT-minted, time-bounded, and scope-bounded. Credentials self-destruct on expiry.

**ZTA Litmus Test** — "When your policy engine fails, who pays — the attacker or the business?"
