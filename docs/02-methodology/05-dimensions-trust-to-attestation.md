# 5. Dimensions 1-4: Trust, Identity, Enforcement, Attestation

> **Learning Objectives**
> - Evaluate the trade-offs between software, behavioral, and silicon trust anchors
> - Distinguish human identity patterns from machine/workload identity patterns and explain why the bifurcation matters
> - Assess enforcement layers from network perimeter to bilateral mutual enforcement
> - Compare attestation modalities and explain why single-source attestation is the root cause of the "stolen token = total breach" pattern

**Prerequisites:** [Chapter 4: The Morphological Matrix](./04-the-morphological-matrix.md)

---

This chapter deep-dives the first four morphological dimensions: Trust Anchor (D1), Identity Model (D2), Enforcement Layer (D3), and Attestation Modality (D4). Together, these dimensions define *who can act, what they can act on, from where enforcement originates, and how their trustworthiness is verified*.

---

## D1: Trust Anchor — The Bedrock of Provenance

The trust anchor is the answer to the question: *"Why should any component of this system believe anything?"* Every attestation, every identity, every policy decision ultimately chains back to some root of trust. If that root is compromised, the entire architecture is a mathematical fiction.

### Software CA (PKI-based)

The most widely deployed trust anchor. Kubernetes has its cluster CA. Istio has its mesh CA. Your cloud provider's IAM is backed by PKI. The model is well-understood, heavily tooled, and interoperable.

**What it protects against:** Man-in-the-middle attacks on the network, basic identity spoofing.

**What it does not protect against:** Compromise of the CA itself, compromise of the signing keys, and — critically — *attestation forgery*. A software CA can sign certificates for workloads that pass no runtime integrity check. A developer with access to the CI/CD pipeline can mint identities at will.

**When it is the right choice:** When your primary adversary is an external network attacker without privileged access to the infrastructure. When you lack the budget, hardware, or organizational maturity for hardware roots.

### Behavioral (Emergent Trust)

No static root. Trust is a function of observed behavior over time. A workload or user that consistently behaves within expected parameters gradually accumulates trust. This model introduces probationary periods (Axiom 4 in practice) and works as a *complement* to cryptographically rooted attestation.

**Critical limitation:** Behavioral trust cannot serve as a sole anchor. An attacker who controls the component long enough to establish a behavioral baseline will be trusted by the very mechanism designed to detect them. Behavioral signals must be combined with cryptographic provenance (Axiom 7) — they may trigger denial but cannot independently authorize.

### Silicon Root of Trust

Trust is anchored in hardware: the TPM built into the CPU, the cryptographic fuses burned at the foundry, the measured boot chain that extends from firmware through kernel into runtime. Each layer of the software stack attests to the integrity of the layer above it, and the attestation report is signed by a key that never leaves the silicon.

**This is the minimum requirement for satisfying Axiom 7 (Epistemic Integrity).** Without hardware-attested provenance, the policy engine is evaluating state claims that could have been fabricated by compromised software.

> **📋 Technical Primer: TPM and Measured Boot**
>
> A Trusted Platform Module (TPM) is a dedicated cryptographic processor embedded in the motherboard or CPU package. It holds keys that cannot be extracted — even by the operating system. During measured boot, each stage of the boot process hashes the next stage and extends a Platform Configuration Register (PCR) inside the TPM. The resulting PCR values form a tamper-evident log of exactly what code executed during boot.
>
> A remote attestation service can challenge the TPM to produce a signed quote of its PCR values. If the values match the expected golden measurements, the boot chain is intact. If they differ — even by one bit — the node has been tampered with. This is how a zero-trust cluster refuses to admit a compromised node even when the node's operating system is lying about its state.

### Hybrid Hierarchical

The realistic path for most organizations. Hardware roots for platform attestation. Software CA for runtime identity management. Behavioral layers for anomaly detection. Multiple anchors cross-validate — the silicon says the node is intact, the software CA says the workload is authorized, the behavioral layer says the workload's pattern of activity is normal for its role. A divergence at any layer triggers investigation.

### Distributed (Multi-Party)

For environments where no single root is acceptable — nuclear command and control, top-secret intelligence systems, multi-jurisdictional financial infrastructure. The master key is split across N independent authorities using threshold cryptography (Shamir's Secret Sharing). Recovery requires M-of-N authorities to cooperate. No single entity can unilaterally bootstrap trust.

---

## D2: Identity Model — Human vs. Machine

Identity management is the dimension most vulnerable to category errors. The patterns that secure human access break when applied to machines, and vice versa. The octagon requires treating these as distinct subtypes:

### Human Identity Patterns

Humans authenticate infrequently, behave in messy but patterned ways, and are vulnerable to credential theft, MFA fatigue, and social engineering. The patterns that work for human identity:

**Zero Standing Privileges (ZSP):** No persistent accounts. No "admin" role that sits waiting to be used. When a human needs access, they request it. The system mints a time-bounded, scope-bounded credential. When the task completes — or the TTL expires — the credential self-destructs. A stolen credential has a blast radius of minutes, not years.

**Trust Decay:** The moment a session is established, its trust score begins to degrade. After 30 minutes, the score has dropped below the threshold for sensitive actions, and the user is seamlessly re-verified through behavioral signals — typing cadence, mouse movement patterns, application interaction sequences — without an interruption. By the 8-hour mark, the session would require explicit re-authentication for any action, but behavioral decay ensures the session was never "trusted" for long.

**Probationary Identity:** The most sophisticated human identity pattern. Initial authentication does not grant access to real resources. The user interacts with a functionally identical but data-isolated environment while the system builds a behavioral baseline over 10-15 minutes of activity. Only when behavior matches the expected archetype profile does the system transition the session to real data. The attacker who stole credentials cannot pass behavioral baseline — their activity patterns don't match the legitimate user's.

### Machine/Workload Identity Patterns

Machines authenticate at boot, run continuously, and should behave deterministically. A microservice should access the same set of resources in roughly the same patterns every time it runs. The patterns that work for machine identity:

> **📋 Technical Primer: SPIFFE and SPIRE**
>
> SPIFFE (Secure Production Identity Framework for Everyone) is a CNCF standard for workload identity. Rather than workloads identifying themselves by IP address, service account token, or declared name, SPIFFE assigns each workload a cryptographically verifiable identity of the form `spiffe://trust-domain/path`.
>
> SPIRE is the reference implementation. It runs as an agent on each node. When a workload requests an identity, SPIRE *attests* the workload — it examines the workload's process, checks its binary hash, verifies its Kubernetes attributes, and potentially calls out to hardware TPM attestors — before issuing a short-lived x.509 certificate. The certificate contains the verified SPIFFE ID and is automatically rotated.
>
> In zero-trust terms: SPIRE gives you Epistemic Integrity (Axiom 7) for workload identity. The certificate is not self-declared — it is issued based on cryptographic proof of what the workload actually is.

**Cryptographic Workload Identity:** The workload identity is not a JWT or a service account token that the workload declares for itself. It is an x.509 certificate minted by SPIRE *after* verifying the workload's code hash against a known-good manifest. The identity is cryptographic proof of what the workload is, not what it claims to be.

**Static JIT for Machines:** A machine credential may have a longer TTL than a human credential — a microservice may authenticate once per deployment rather than once per session — but the principle is the same. The credential is time-bounded, and the workload must periodically re-attest to maintain it.

---

## D3: Enforcement Layer — The Mediation Boundary

The enforcement layer is where Axiom 3 (Unbypassable Mediation) materializes. Every layer of enforcement eliminates a class of bypass.

### Network Perimeter

Still present in most architectures as a defense-in-depth layer. Firewalls and NACLs block bulk scanning and known-bad IPs. But as a *zero-trust enforcement layer*, the perimeter is insufficient: once an attacker is inside — a compromised VPN endpoint, a phished credential, a rogue container — the perimeter offers no further mediation.

### Service Mesh (Sidecar Proxy)

Deploying a service mesh (Istio, Linkerd, Cilium) extends enforcement to the pod level. Every inter-service communication passes through a sidecar proxy that evaluates policy before forwarding the request. The mesh provides:

- **Pod-level mediation:** Pod A cannot reach Pod B unless policy explicitly allows it. Lateral movement requires a policy decision at every hop.
- **Mutual TLS by default:** Every inter-pod connection is encrypted and mutually authenticated, satisfying the minimum form of Axiom 8 (Bilateral Symmetry) at the transport layer.
- **Policy as configuration:** Mesh policies are declarative and version-controlled — satisfying Axiom 2 for the network layer.

### Application / API Gateway

Enforcement embedded in the application or at the API gateway provides the richest context: the gateway sees the full HTTP request, understands the application-level semantics, and can evaluate policy against specific API paths, methods, and payloads. Identity-aware proxies extend this model to user-facing access.

### Data-Level (Cryptographic)

The payload itself carries its policy. The storage and transport layers are "dumb" — they hold encrypted blobs they cannot decrypt. Access requires the requesting entity to satisfy the policy conditions embedded in the data envelope. This is the enforcement layer that survives a fully compromised storage infrastructure.

### Bilateral (Mutual Enforcement)

Axiom 8 elevates bilateral enforcement from an option to a requirement. The client must evaluate policy before sending data — "Is it safe for me to transmit this to that destination?" — and refuse to send if the destination fails verification. The server's enforcement is the ultimate gatekeeper, but the client's enforcement is the data sovereignty layer.

---

## D4: Attestation Modality — The Verdict's Evidence

Attestation is the evidence on which the verdict is based. The modality determines what can be faked and what cannot.

### Trust on First Use (TOFU)

The deployment pipeline is the only attestation. If code passes CI/CD, it is trusted at runtime — forever. This is the default for most startups and the root of the supply chain injection vulnerability. A typosquatted NPM package looks identical to a legitimate one at the CI/CD level. Without runtime attestation, the malicious code is trusted from the moment it deploys.

### Single Source

One attestation signal — typically the IDP's token validity. If the token is cryptographically correct, the entity is trusted. This is the root of the "stolen token = total breach" pattern. The token proves the entity *was* authenticated. It proves nothing about whether the entity *is still* the legitimate user or workload.

### Behavioral / Heuristic

Pattern-matching attestation. "This user normally accesses JIRA first, then email, then git." "This microservice normally makes 200 requests per minute to the database with a 50ms average latency." Deviations from baseline trigger investigation. Behavioral attestation is weaker than cryptographic attestation (it can be learned and spoofed by a patient adversary) but stronger than nothing — it catches the 90% of attackers who do not have weeks to profile a victim's behavior.

### Cascading / Layered

The boot chain model. Each layer measures the next and extends the attestation chain: UEFI firmware measures the bootloader, the bootloader measures the kernel, the kernel measures the container runtime, the container runtime measures the workload image. If any measurement differs from the expected golden value, the chain breaks. This is how you detect a kernel rootkit, a compromised hypervisor, or a tampered bootloader — each breaks the layer above it.

### Heterogeneous Triple

The strongest practical attestation. Three independent observation modalities monitor the same entity from different vantage points:

- **Observer A (eBPF kernel agent):** Watches syscalls, network flows, file access patterns from inside the kernel.
- **Observer B (Hypervisor monitor):** Watches memory access, CPU state, and I/O from outside the VM or container.
- **Observer C (Hardware performance counters):** Reads silicon-level metrics — cache miss rates, branch prediction patterns, power draw — that software cannot forge.

The three observers emit independently signed observations. A Byzantine consensus engine compares them. If two say "normal" and one says "anomalous," the entity is investigated. If all three agree, the attestation is as strong as physically possible without custom silicon.

---

## Key Takeaways

1. **Silicon trust anchor is the minimum requirement for Axiom 7 (Epistemic Integrity). Without hardware-attested provenance, the policy engine evaluates state claims that compromised software can fabricate.**
2. **Human and machine identity require different patterns. ZSP and behavioral baselines work for humans. Cryptographic workload identity (SPIFFE/SPIRE) is required for machines. Category errors create structural vulnerabilities.**
3. **Enforcement must be layered — perimeter, mesh, gateway, data, bilateral — because each layer closes a bypass available to the layer before it. Bilateral enforcement is not optional; Axiom 8 requires it.**
4. **Single-source attestation is the root of the "stolen token = total breach" path. To close this, add a second independent attestation signal — behavioral, hardware, or ideally both.**

---

## Cross-References

- **Next:** [Chapter 6: Dimensions 5-9 — Response, Distribution, Observability, Posture, Continuity](./06-dimensions-response-to-human.md)
- **Builds on:** [Chapter 4: The Morphological Matrix](./04-the-morphological-matrix.md)
- **Related:** [Chapter 7: Meta-Patterns](./07-meta-patterns.md)
- **Related:** [Appendix D: Quick-Reference Card](../appendix/appendix-d-quick-reference.md)
