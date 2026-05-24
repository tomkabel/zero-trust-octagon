# 8. Archetype A: The Holy Grail — Full Attack Trace

> **Learning Objectives**
> - Trace a full attack lifecycle against a silicon-anchored, bilaterally enforced, Trickle-Truth-protected architecture
> - Identify the emergent properties that arise when high-maturity dimension values reinforce each other
> - Calculate the attacker-defender cost asymmetry that Trickle-Truth produces
> - Recognize the operational burdens (self-quarantine rate, event-stream trust surface) that accompany this architecture

**Prerequisites:** [Chapter 4: The Morphological Matrix](./04-the-morphological-matrix.md), [Chapter 5: Dimensions 1-4](./05-dimensions-trust-to-attestation.md), [Chapter 6: Dimensions 5-9](./06-dimensions-response-to-human.md)

---

Archetype A is not a starting point. It is the destination — the configuration where all eight Octagon axioms are satisfied and the dimensions of the morphological matrix converge on the high-maturity cluster. This chapter traces what happens when an attack target built to this specification is probed.

**Configuration:**
- D1: Silicon (Root of Trust) — hardware attestation anchored in TPM/silicon
- D2: Probationary Identity + Trust Decay — behavioral probation before full trust
- D3: Bilateral + Service Mesh + Data — enforcement at every layer
- D4: Heterogeneous Triple — eBPF, hypervisor, hardware counter observers
- D5: Trickle-Truth — garbage pollution, invisible detection
- D6: Event-Streamed — sub-10ms global policy propagation
- D7: Air-Gapped Truth Pipeline — cryptographically attested, independently verified
- D8: Presumptively Wrong — architecture evolves through falsification
- D9: Fully Automated — no human in the loop for standard response

---

## Phase 0: Silicon Birth

The server arrives from the foundry. Embedded in its CPU package is a cryptographic identity burned into fuses during fabrication — a private key that will never leave the silicon. This is the trust anchor.

At first power-on:
1. The CPU microcode measures itself. The TPM extends a Platform Configuration Register (PCR). The silicon root signs the measurement.
2. The UEFI firmware attests to the bootloader. The bootloader attests to the kernel. Each stage extends the measurement chain, and each extension is signed by the silicon root.
3. Before the node is permitted to join the cluster, its attestation report is verified against the organization's **Cryptographic Bill of Materials (CBOM)** — the expected golden measurements for every component. Any mismatch — a single bit — and the node never joins.

This verification demands an operational cost: the data center plans for 10% of hardware to self-quarantine at any given moment. Cosmic ray bit-flips, thermal micro-fractures, and benign hardware degradation produce false-positive attestation failures. The cluster absorbs this by over-provisioning by 10-15% and treating quarantined nodes as a normal operational event, not a security incident.

---

## Phase 1: Workload Onboarding

A new payments microservice is deployed. It does not receive a full identity at boot.

1. The workload receives a **probationary identity** — a cryptographically scoped token declaring: "I am a workload claiming to be 'payments.' I am being observed."
2. During probation (configurable — e.g., 15 minutes), the workload has minimal access: service registry, time service, log sink. No databases. No message queues. No inter-service communication.
3. Three independent observers begin their work:
   - **eBPF kernel agent:** Syscall patterns. Does this workload behave like a payments microservice — network connections, file I/O, signal handling — or like a cryptominer?
   - **Hypervisor monitor:** Memory access and I/O patterns from outside the container. Is this workload accessing regions it has no business accessing?
   - **Hardware performance counters:** Cache miss rates, branch prediction patterns, power consumption curves. Silicon-level signals that are physically impossible for software to forge.
4. The three streams flow through a **data diode** (unidirectional physical gateway) into the air-gapped Truth Pipeline. A Byzantine consensus engine evaluates them.
5. After the probation window elapses with all three observers reporting "normal" behavior matching the expected archetype, the workload graduates to a full identity. It is now trusted to make bilateral policy decisions.

**Emergent property:** The silicon anchor proves the node is authentic. The probationary period proves the workload is benign. Neither alone is sufficient. Both together satisfy Axiom 7 (Epistemic Integrity) and Axiom 4 (Continuous Verification) simultaneously.

---

## Phase 2: Normal Operation

A standard inter-service request: the payments service needs to query the ledger service for a transaction.

1. **Client-side evaluation:** The payments sidecar evaluates its local policy against the request. The policy is a deterministic state machine running in a WASM module, cached locally and updated via the event stream. The evaluation produces `Allow` only if: the requester's identity is attested, the identity's TTL has not expired, the request verb is `GET`, the resource path is `/ledger/transactions/{id}`, and the client's attestation report shows all three observers report "healthy."
2. **Policy hash exchange:** The request includes an `X-Policy-Hash` header. The ledger sidecar verifies that the hash of the client's policy matches its own. If the hashes diverge — a version drift between deployment cycles — the request is denied and an alert is emitted. No silent policy mismatch.
3. **Server-side evaluation:** The ledger sidecar independently evaluates its policy against the same request. Both sides must return `Allow` for the request to proceed.
4. **Attestation context:** The request envelope includes a hardware-signed snapshot of the payments workload's current attestation state — the consensus output of all three observers, signed by the node's TPM. The server does not need to re-verify the client's integrity from scratch; it verifies the signature on the attestation report.
5. Both sides log the full decision context — policy ID, input hash, decision, timestamp, and attestation report — to the immutable state ledger.

**Emergent property:** Bilateral enforcement with hardware attestation is fast because the server trusts the signed attestation report rather than re-running the full attestation pipeline. The bilateral check focuses on *policy correctness*, not *node trustworthiness*, which is the expensive part.

---

## Phase 3: Attack — The Compromised User

A determined Medium-tier attacker compromises a developer workstation via a targeted phishing campaign. They steal a valid session token. The attacker authenticates and enters the probationary period.

**T+0s — Initial access:**
The attacker navigates to an internal dashboard. The system allows the request — the session is valid — but because the identity model uses Trust Decay, the session token's trust score has degraded since authentication. The attacker encounters Micro-Friction: a subtle step-up authentication challenge for this specific action. They pass it — they have the credentials.

**T+47s — Behavioral mismatch detected:**
The three observers feed into the continuous behavioral attestation layer. In parallel with the transparent re-verification:

- The attacker's mouse movement cadence does not match the developer's long-term baseline (behavioral signal, Observer A).
- They request resources in a different order than the developer's established pattern — no "check email, then JIRA, then git" sequence (Observer A).
- They access endpoints the developer has never accessed in months of recorded history.

**T+130s — Byzantine consensus reaches confidence threshold:**
The Truth Pipeline's consensus engine evaluates the divergence across all three observers. The behavioral signals diverge from baseline. The hypervisor observer reports no memory anomaly (the attacker is not injecting code — they are using the browser). The hardware counters are within normal variance. The consensus: "With 87% confidence, this session does not belong to the expected user. Action: Trickle-Truth."

**T+131s — The graft:**
The PDP publishes `transition:session_48294:trickle-truth` to the NATS JetStream event backbone. Within 3 milliseconds, every enforcement point — every sidecar, every API gateway, every load balancer — updates its local WASM-cached policy state. The attacker's session is atomically grafted to the garden environment.

**T+250ms — The attacker's next click:**
The attacker clicks a link in the dashboard. The request is routed to the garden. The garden's LLM fabricator generates a response with identical schema, convincing data, and internal consistency. The dashboard renders. The attacker sees a working application.

**For the next 47 minutes:**
The attacker explores. They run queries. They attempt lateral movement. They exfiltrate data. Every byte of it is synthetic. Every TTP they demonstrate is recorded by the air-gapped Truth Pipeline — invisible to the attacker, who cannot observe the observation.

**No alert is sent to the attacker. No lockout. No redirect. No "access denied."** From the attacker's perspective, the attack is proceeding perfectly.

---

## Phase 4: Post-Incident

The playbook is updated automatically from the engagement: "Medium-tier attacker, MFA fatigue entry vector, probing pattern showed interest in financial data, used tool X for exfiltration."

The architecture stress-tests itself against this exact attack pattern in the Dojo. The engagement data feeds into a new red team scenario. If the red team finds a bypass, it forces a morphological parameter change.

**Cost accounting:**
- Real data exposed: Zero.
- Business impact: None. The business operated normally.
- Attacker resources expended: 47 minutes of operator time, exfiltration bandwidth, tooling compute for data analysis.
- Defender resources expended: LLM inference cost for 47 minutes of synthetic data generation (~$45 at current cloud rates for a modest deployment).
- Intelligence yield: Full TTP profile, tool fingerprints, interest pattern analysis.

The attacker paid more for the attack than the defender paid to defend.

---

## Bilateral Cost Asymmetry

| Cost Category | Attacker | Defender |
|--------------|----------|----------|
| Time invested | 47+ minutes of skilled operator time | Automated (zero human time) |
| Compute | Exfiltration + analysis tooling | LLM inference ($45) |
| Data gained | Zero (all synthetic) | Complete TTP profile |
| Intelligence | None (believed attack succeeded) | Full weaponization of observed TTPs |
| Follow-on risk | High (will repeat known-working TTPs against other targets, making them predictable) | Low (playbook updated for this exact pattern) |

---

## The Self-Quarantine Burden

Archetype A's greatest operational challenge is not attackers. It is *itself*. The 10% self-quarantine rate from silicon attestation — caused by cosmic ray bit-flips, thermal degradation, and buggy firmware updates — means the cluster is constantly shedding nodes. The infrastructure must be over-provisioned by 10-15% simply to absorb the self-inflicted attrition. Operations teams spend a meaningful fraction of their time triaging quarantined nodes to determine: *hardware degradation, or actual attack?*

This is the trade-off at the peak of the capability surface: mathematical certainty of integrity at the cost of brittle infrastructure. Organizations that adopt Archetype A accept this trade-off as a first-order design decision.

---

## Key Takeaways

1. **Archetype A satisfies all eight Octagon axioms. It is the only archetype that does — and the cost is extreme engineering maturity and continuous self-quarantine attrition.**
2. **Trickle-Truth inverts the attacker-defender cost model. The attacker expends resources on fake data while the defender gains intelligence. The attacker cannot determine whether they were detected.**
3. **The air-gapped Truth Pipeline provides mathematically certain observability — but it must be physically isolated from the production network via data diodes, or the attacker gains a path to compromise it.**
4. **The event stream that distributes policy is a critical trust surface. In Archetype A, it is secured by hardware-attested producers and independent observation — breaking the infinite regress.**

---

## Cross-References

- **Next:** [Chapter 9: Archetype B — Fortune 500 Illusion of Control](./09-archetype-b-fortune-500.md)
- **Builds on:** [Chapter 5: Dimensions 1-4](./05-dimensions-trust-to-attestation.md), [Chapter 6: Dimensions 5-9](./06-dimensions-response-to-human.md)
- **Related:** [Chapter 7: Meta-Patterns](./07-meta-patterns.md)
- **Related:** [Chapter 14: The Enterprise Turnaround (B → A Path)](./14-enterprise-turnaround.md)
