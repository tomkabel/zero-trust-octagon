---
cover: /images/covers/appendix/appendix-c-glossary.webp
coverAlt: "Illustration: a shelf of geometric crystal specimens arranged like a lexicon"
---

# Appendix C: Glossary of Terms

> **Prerequisites:** All chapters and appendices

---

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

<a id="cae-continuous-access-evaluation"></a>
**CAE (Continuous Access Evaluation)** — A mechanism that enables real-time session state updates. When context changes (device health degrades, risk spikes, session revoked), CAE propagates the change to enforcement points without waiting for token expiry. _See also: [runtime signal](#runtime-signal), [sender-constrained token](#sender-constrained-token)._

<a id="caep-continuous-access-evaluation-protocol"></a>
**CAEP (Continuous Access Evaluation Protocol)** — An IETF draft standard that defines a shared protocol for continuous access evaluation across identity providers, device management platforms, and enforcement points. As of 2026, still in draft phase and not widely deployed in production. _See also: [SSF](#ssf-shared-signals-framework)._

**Capability surface** — The topography formed by interaction of morphological dimensions. Different combinations optimize for different threat models. The maturity vector is a surface, not a line.

**CBOM (Cryptographic Bill of Materials)** — Expected golden measurements for every hardware and software component in a node's boot chain, used for silicon attestation verification.

**Confidential containers** — Containers whose memory and CPU state are encrypted and isolated at the hardware level (Azure SEV-SNP, AWS Nitro Enclaves, GCP confidential VMs). Even the hypervisor cannot read the workload's data.

**Continuous Verification** — Axiom 4 of the Octagon. Verdicts expire. Re-verification occurs at a cadence determined by risk, not by session convenience.

**Covariance cluster** — A set of morphological dimension values that tend to co-occur because each value enables the others in the cluster and constrains values from the opposite cluster.

**Cryptographic Workload Identity** — Machine identity model where the workload's identity (typically a SPIFFE ID) is issued based on cryptographic proof of the workload's code and configuration hash, not a self-declared service account name.

## D

**Data diode** — A unidirectional network gateway that allows telemetry to flow from the production network into an observability pipeline but physically prevents any data from flowing back. Used to air-gap the truth pipeline.

**DPoP (Demonstration of Proof-of-Possession)** — An OAuth extension that cryptographically binds an access token to the client that requested it. The client proves possession of a private key with each request, preventing token replay by an attacker who captures the token. _See also: [sender-constrained token](#sender-constrained-token)._

**D9 (Human Continuity)** — The ninth morphological dimension. How the human response layer is staffed. Values: Single Point of Failure, Small Rotation, 24/7 SOC, Fully Automated.

**Decision gate** — A quantitative threshold in an implementation decision tree that signals whether the primary path is working or requires a pivot.

**Degrade Gracefully** — Violation response strategy. Instead of denying access, degrade service quality: throttle bandwidth, reduce response priority, serve stale but safe data.

**Delegable proof** — A proof token that carries a flag authorizing the presenter to delegate a scoped-down version of its permissions to a sub-agent or downstream service. Delegation creates a linked chain of proof IDs for audit traceability. _See also: [proof token](#proof-object-proof-token)._

**Detect-respond gap** — The interval between detection and effective response during which the attacker can still inflict damage. The true operational metric for zero-trust effectiveness, superseding MTTD alone.

**Deterministic Bounded Authority** — Axiom 5 of the Octagon. Every grant of access confers a mathematically bounded vector of permitted state transitions. Authority cannot expand without a new, independent authorization decision.

<a id="dod-zt-pfmo"></a>
**DoD ZT PfMO (Zero Trust Portfolio Management Office)** — The Department of Defense program office responsible for zero-trust strategy, target-level deadlines (September 2027), and enterprise implementation guidance. Produces the DoD Zero Trust Reference Architecture and the ZT Execution Roadmap (DTM-25-003). _See also: [NIST SP 800-207A](#nist-sp-800-207a)._

## E

**Envy trap** — A pattern where one archetype covets properties of another that are structurally incompatible with its own configuration. B envies C's velocity; C envies A's prevention; A envies C's MTTD.

<a id="eo-14028"></a>
**EO 14028 (Executive Order 14028)** — The May 2021 Executive Order on Improving the Nation's Cybersecurity, mandating federal agencies adopt zero-trust architecture per NIST guidance. Established the Federal Zero Trust Strategy (OMB M-22-09) and supply chain security requirements under §4. _See also: [NIST SP 800-207A](#nist-sp-800-207a), [DoD ZT PfMO](#dod-zt-pfmo)._

**Epistemic Integrity** — Axiom 7 of the Octagon. State inputs to the evaluation function must carry cryptographic proof of provenance. Unattested data is treated as hostile input and may be used only to deny access.

**Event-stream regress** — The infinite regress problem: the event stream distributing policy changes must itself be secured by zero-trust. Resolved by hardware-attested producers, signed events, and independent observation of the stream itself.

**Event-Streamed (Pub/Sub) policy** — D6 value. Policy state changes are published to an event-streaming backbone (Kafka, NATS). PEPs subscribe and maintain locally cached in-memory policy state. Enables sub-10ms global policy propagation.

## F

<a id="fips-203-ml-kem"></a>
**FIPS 203 (ML-KEM)** — The NIST Federal Information Processing Standard for Module-Lattice-Based Key-Encapsulation Mechanism, published August 2024. Standardizes ML-KEM as the post-quantum key-encapsulation algorithm for federal systems. _See also: [ML-KEM](#ml-kem), [FIPS 204](#fips-204-ml-dsa), [FIPS 205](#fips-205-slh-dsa)._

<a id="fips-204-ml-dsa"></a>
**FIPS 204 (ML-DSA)** — The NIST Federal Information Processing Standard for Module-Lattice-Based Digital Signature Algorithm, published August 2024. Standardizes ML-DSA as the primary post-quantum signature algorithm for federal systems. _See also: [ML-DSA](#ml-dsa), [FIPS 203](#fips-203-ml-kem), [FIPS 205](#fips-205-slh-dsa)._

<a id="fips-205-slh-dsa"></a>
**FIPS 205 (SLH-DSA)** — The NIST Federal Information Processing Standard for Stateless Hash-Based Digital Signature Algorithm, published August 2024. Standardizes SLH-DSA as the secondary post-quantum signature algorithm, providing algorithm diversity independent of lattice-based assumptions. _See also: [SLH-DSA](#slh-dsa), [FIPS 204](#fips-204-ml-dsa)._

## G

**Garden environment** — The live, adaptive, LLM-powered synthetic data environment used in Trickle-Truth. It mirrors the structure and behavior of the real application but serves entirely fictional data.

**Garbage pollution rate (R)** — The ratio of fake data served to the attacker versus real data that would have been served. At R=1.0, the substitution is seamless. At R>1.0, the system overproduces synthetic data to waste attacker resources.

## H

<a id="hard-deny"></a>
**Hard Deny** — Violation response strategy. Request denied, connection terminated, account locked, node isolated. Violates Axiom 6 because the defensive response cascades into business damage.

**Heterogeneous Triple** — The strongest practical attestation modality. Three independent observation types (kernel eBPF, hypervisor, hardware performance counters) produce independently signed observations, reconciled by Byzantine consensus.

**Human Continuity (D9)** — The ninth morphological dimension, discovered during analysis of Archetype D. Addresses how the human response layer is staffed and what happens when the primary responder is unavailable.

## I

**Identity-Aware Proxy (IAP)** — A reverse proxy that authenticates and authorizes every request before forwarding to a self-hosted resource. The primary enforcement tool for Archetype D.

<a id="icam"></a>
**ICAM (Identity, Credential, and Access Management)** — The DoD framework for managing digital identities, credentials, and access policies across the enterprise. Zero-trust architectures extend ICAM from human identities to workload identities, device identities, and inter-service authentication.

**Identity rot** — Accumulated permissions from role changes, temporary access grants, and project migrations over time. The Skeptic CISO finds this through exception audits.

**Implicit Trust** — D7 value. The observability pipeline is trusted as a single source of truth without independent verification. Violates Axiom 2 and Axiom 7.

## L

**Leverage point hierarchy** — The ranking of morphological dimensions by the impact of upgrading them. D5 (Violation Response) is highest leverage, followed by D4, D8, D2, and D7.

**Low-maturity cluster** — The set of dimension values that reinforce each other downward: Software PKI → Single Attestation → Push → Hard Deny → Implicit Observability → Siloed Org.

## M

**Merkle-attested telemetry** — An observability trust model where telemetry is hashed into Merkle Trees in memory, and the root hash is signed by a hardware enclave at intervals. Tampering any individual observation breaks the cryptographic chain.

**MFA Fatigue (Prompt Bombing)** — A social engineering attack where the attacker sends repeated MFA push notifications until the target accepts one out of annoyance, fatigue, or confusion.

**Micro-Friction** — Violation response strategy. The system injects subtle friction at specific anomalous interaction points: step-up auth, performance degradation, or forced re-authentication for sensitive actions. Not a lockdown — just enough friction to disrupt attackers.

<a id="ml-dsa"></a>
**ML-DSA (Module-Lattice-Based Digital Signature Algorithm)** — The primary post-quantum digital signature algorithm standardized in FIPS 204. Based on the CRYSTALS-Dilithium submission to the NIST PQC competition. Produces signature sizes of 2.5-4.8 KB compared to 64 bytes for Ed25519. _See also: [FIPS 204](#fips-204-ml-dsa), [SLH-DSA](#slh-dsa)._

<a id="ml-kem"></a>
**ML-KEM (Module-Lattice-Based Key-Encapsulation Mechanism)** — The primary post-quantum key-encapsulation algorithm standardized in FIPS 203. Based on the CRYSTALS-Kyber submission to the NIST PQC competition. Used for PQC key exchange in TLS 1.3 as a hybrid with X25519. _See also: [FIPS 203](#fips-203-ml-kem)._

**Morphological matrix** — The nine-dimensional configuration space for zero-trust architecture. Each dimension has 5-7 values, and each deployment maps to exactly one value per dimension.

## N

**No Intrinsic Trust** — Axiom 1 of the Octagon. Trust is a transient verdict, never a property of identity, position, or history.

<a id="nist-csf-2-0-govern"></a>
**NIST CSF 2.0 Govern** — The Governance function in NIST Cybersecurity Framework 2.0, released February 2024. Elevates governance to a first-class function (GV) alongside the five existing functions, establishing organizational context, risk management strategy, and supply chain risk management (GV.SC) as foundational capabilities.

<a id="nist-sp-800-207a"></a>
**NIST SP 800-207A (Zero Trust Architecture)** — The NIST Special Publication (SP 800-207, August 2020) defining the core logical components of zero-trust architecture. Establishes the Policy Decision Point (PDP), Policy Enforcement Point (PEP), Policy Administrator (PA), and Policy Information Point (PIP) as canonical architectural abstractions. _See also: [DoD ZT PfMO](#dod-zt-pfmo), [EO 14028](#eo-14028)._

## O

**Octagon** — The set of eight irreducible axioms that define zero-trust architecture. Named for the eight-sided shape formed by the axioms.

## P

**Pat Problem** — The structural vulnerability of solo-operator architectures: all security capabilities depend on one human whose unavailability produces a catastrophic tail in response time distribution.

**Probationary Identity** — D2 value. Identity is not granted fully at authentication. The entity operates in a limited, monitored state until its behavior matches the expected archetype baseline, at which point full identity is released.

<a id="proof-before-action"></a>
**Proof before action** — An architectural pattern where per-operation authorization is verified before each sensitive action. Extends proof-before-connect to operation-level granularity. Maps to D3 (Enforcement) and D5 (Violation Response) at high maturity. _See also: [proof before connect](#proof-before-connect), [proof token](#proof-object-proof-token)._

<a id="proof-before-connect"></a>
**Proof before connect** — An architectural pattern where authorization must be demonstrated before network connectivity is established. Replaces VPN-style network reachability with service-specific token-based authorization. _See also: [proof before action](#proof-before-action), [proof token](#proof-object-proof-token)._

<a id="proof-issuer"></a>
**Proof issuer** — The authorization server that evaluates identity, device health, risk level, and scope appropriateness, then issues a scoped, short-lived proof token. The proof issuer is the central decision point in the three-layer model. _See also: [proof token](#proof-object-proof-token)._

<a id="proof-object-proof-token"></a>
**Proof object (proof token)** — A verifiable, scoped, short-lived assertion that a subject was authenticated by a specific issuer and granted a specific permission for a specific audience for a specific time window. Carries issuer, audience, scope, and expiry claims. Must be cryptographically verifiable. _See also: [sender-constrained token](#sender-constrained-token), [proof issuer](#proof-issuer)._

## R

<a id="runtime-signal"></a>
**Runtime signal** — A continuous stream of security-relevant events — device health changes, risk score updates, anomaly detections, session revocations — that inform ongoing access decisions. Runtime signals are the third layer of the identity-proof-runtime model. _See also: [CAE](#cae-continuous-access-evaluation), [SSF](#ssf-shared-signals-framework)._

## S

**SaaS Blind Spot** — The gap between what an identity-aware proxy protects (self-hosted resources) and what the SaaS layer exposes (Google Drive, Slack, Notion, etc.) using the same identity token. A zero-trust architecture must account for both.

**SaaS Coverage Map** — An inventory of every SaaS platform that trusts the organization's identity provider, including the data it holds and the audit logging available.

<a id="sbom"></a>
**SBOM (Software Bill of Materials)** — A machine-readable inventory of all components, libraries, and dependencies that comprise a software artifact. Required under EO 14028 §4 for federal software procurement. In zero-trust, SBOMs enable cryptographic workload identity by providing the expected code composition against which attestation measurements are verified.

**Self-quarantine rate** — The percentage of nodes that are automatically isolated due to attestation mismatches from benign causes (cosmic ray bit-flips, thermal degradation, firmware update drift). In high-maturity architectures, a 10% rate is considered normal.

**Sender-constrained token** — A token cryptographically bound to its intended presenter, preventing token replay by an attacker who captures the token. Implemented via DPoP (OAuth extension) or mTLS (binding the token to the client certificate). _See also: [DPoP](#dpop-demonstration-of-proof-of-possession), [proof token](#proof-object-proof-token)._

**Session graft** — The atomic transition of an attacker's session from real data to the garden environment. The authentication token, cookies, and headers remain valid but now authenticate to the synthetic environment.

**Silicon Root of Trust** — D1 value. Trust anchored in cryptographic keys embedded in CPU hardware, burned at the foundry. The foundation for Epistemic Integrity (Axiom 7).

<a id="slh-dsa"></a>
**SLH-DSA (Stateless Hash-Based Digital Signature Algorithm)** — The secondary post-quantum digital signature algorithm standardized in FIPS 205. Based on the SPHINCS+ submission to the NIST PQC competition. Provides algorithm diversity independent of lattice-based assumptions, at the cost of larger signatures (~17-30 KB). _See also: [FIPS 205](#fips-205-slh-dsa), [ML-DSA](#ml-dsa)._

**Software CA (PKI-based)** — D1 value. Trust anchored in a certificate authority hierarchy. Flexible but software-compromiseable.

<a id="spiffe"></a>
**SPIFFE (Secure Production Identity Framework for Everyone)** — An open standard for workload identity that issues cryptographically verifiable identity documents to services without requiring API keys or shared secrets. Integrates with the SPIRE implementation to automate identity issuance and rotation.

<a id="split-brain-authorization"></a>
**Split-brain (authorization)** — A condition where two independent authorization paths produce conflicting verdicts for the same request. Occurs when runtime signals bypass the proof layer and talk directly to enforcement points, creating dual enforcement paths. Must be resolved by routing all authorization signals through a single decision point. _See also: [proof issuer](#proof-issuer), [runtime signal](#runtime-signal)._

<a id="ssf-shared-signals-framework"></a>
**SSF (Shared Signals Framework)** — An OpenID Foundation standard for broadcasting security events between identity providers, device management platforms, and enforcement points using a common event format. Enables cross-platform runtime signal propagation. As of 2026, limited production adoption. _See also: [CAEP](#caep-continuous-access-evaluation-protocol), [runtime signal](#runtime-signal)._

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

<a id="zero-standing-privileges-zsp"></a>
**Zero Standing Privileges (ZSP)** — D2 value. No persistent accounts. All access is JIT-minted, time-bounded, and scope-bounded. Credentials self-destruct on expiry.

**ZTA Litmus Test** — "When your policy engine fails, who pays — the attacker or the business?"

---

## Cross-References

**Builds On:** All prior chapters (01-18) and appendices.

**Related:** [§2: The Octagon](../01-foundations/02-the-octagon.md) — eight axioms with invariant definitions. [§4: The Morphological Matrix](../02-methodology/04-the-morphological-matrix.md) — nine dimensions and their value ranges. [§13: Self-Assessment Diagnostic](../04-synthesis/13-self-assessment.md) — archetype routing and diagnostic questions.

**Next:** [Appendix D: Quick-Reference Card](./appendix-d-quick-reference.md) — one-page summary of all axioms, dimensions, and archetypes.
