---
type: bmad-distillate
sources:
  - "../../../../../books/sources/zt-downloads/21-Threat-Modeling-Shostack.md"
  - "../../../../../books/sources/zt-downloads/22-Designing-Data-Intensive-Apps-Kleppmann.md"
  - "../../../../../books/sources/zt-downloads/19-Understanding-Cryptography-2Ed-Paar.md"
downstream_consumer: "Zero-Trust Octagon project — Axiom 6, Appendix A, Archetype attack traces"
created: "2026-06-23"
token_estimate: 2000
---
# STRIDE Threat Modeling (Shostack — Ch 3)
- **S**poofing: Pretending to be someone/something else. Violates authentication. Victims: processes, external entities, people
- **T**ampering: Modifying data on disk, network, memory. Violates integrity. Victims: data stores, data flows, processes
- **R**epudiation: Claiming you didn't do something. Violates non-repudiation. Victims: processes. Requires audit logging
- **I**nformation Disclosure: Exposing info to unauthorized parties. Violates confidentiality. Victims: data stores, data flows
- **D**enial of Service: Consuming resources to deny service. Violates availability. Victims: processes, data stores
- **E**levation of Privilege: Gaining unauthorized capabilities. Violates authorization. Victims: processes
- **STRIDE-per-element**: Apply STRIDE to each DFD element (external entity, process, data flow, data store, trust boundary)
- **STRIDE-per-interaction**: Apply STRIDE to each interaction between elements — more granular
- **Anti-STRIDE thinking**: Each threat is opposite of desired property. Properties are: Authentication, Integrity, Non-Repudiation, Confidentiality, Availability, Authorization (AINA CA)

# Attack Trees (Shostack — Ch 4)
- Root = attack goal. Children = sub-goals. AND/OR nodes. Leaf = atomic attack action
- **Scoring**: Can add cost, skill, detection probability to each leaf
- **Uses**: Identify weakest path. Compare defensive investments. Communicates attacker perspective to non-security stakeholders
- **Example**: "Get key from HSM" → physical access OR side-channel OR insider → sub-attacks for each
- **Limitation**: Can be very large. Focus on most plausible paths, not exhaustive enumeration

# Attack Libraries (Shostack — Ch 5)
- **CAPEC** (Common Attack Pattern Enumeration and Classification): Community-maintained attack pattern catalog
- **OWASP Top 10**: Web app attack patterns. Updated periodically. Industry standard
- **MITRE ATT&CK**: Post-compromise adversary behavior. Tactics + Techniques + Procedures. Used for detection engineering
- **CWE** (Common Weakness Enumeration): Software weaknesses that enable attacks. Development-side complement to CAPEC

# BFT & Consensus (Kleppmann — Ch 9)
- **Consensus problem**: Getting all nodes to agree on a value despite faults. Fundamental distributed systems primitive
- **Uses**: Leader election, distributed locks, atomic commits
- **FLP impossibility**: In asynchronous network, no deterministic algorithm guarantees consensus with even one faulty node
- **Paxos**: Classic consensus algorithm. Complex to implement correctly. Used in Chubby, ZooKeeper
- **Raft**: More understandable consensus. Leader-based. Used in etcd, Consul, Kafka (with KRaft)
- **Practical BFT**: Consensus with Byzantine (arbitrary/malicious) faults. Requires 3f+1 nodes for f faulty. HotStuff, Tendermint
- **Linearizability**: Strongest consistency model. System appears as single copy of data. Every read sees most recent write. Comes at performance cost
- **Causal consistency**: Weaker than linearizability. Operations that are causally related are seen in same order by all. Concurrent ops can be seen in different order
- **Eventual consistency**: Weakest useful guarantee. If writes stop, replicas converge. Hard to program against. Subtle bugs

# Replication & Transactions (Kleppmann — Ch 5, 7)
- **Single-leader**: Writes to one node, replicates to followers. Read scaling. Leader failure needs failover
- **Multi-leader**: Writes to multiple nodes. Better availability, conflict resolution needed
- **Leaderless**: Dynamo-style. Writes to quorum. Read repair + anti-entropy
- **Transaction isolation levels**: Read Uncommitted → Read Committed → Repeatable Read → Serializable
- **Weak isolation pitfalls**: Dirty reads, dirty writes, read skew, lost updates, write skew, phantom reads
- **Serializable**: Strongest isolation. Can use actual serial execution, two-phase locking, or optimistic concurrency control (OCC with serializable snapshot isolation - SSI)

# Distributed Systems Fundamentals (Kleppmann — Ch 8)
- **Network unreliability**: Packets lost, delayed, duplicated, reordered. Timeouts imperfect. Network partitions are real
- **Clock unreliability**: Time-of-day clocks can jump backwards. Monotonic clocks can't compare across nodes. Drift is real
- **Process pauses**: GC pause, VM suspend, OS scheduling. Can be seconds or minutes. Other nodes can't distinguish from crash
- **Byzantine faults**: Nodes behaving arbitrarily (malicious, buggy). Hardest fault model. Practical in blockchain/cryptographic contexts
- **Fault tolerance = fault detection + graceful degradation + redundancy**. No single answer — depends on threat model

# Cryptography for ZT Context (Paar 2Ed)
- **Symmetric ciphers**: AES (standard), ChaCha20 (stream, modern). Authenticated encryption (GCM, ChaCha20-Poly1305) = encrypt+MAC
- **Asymmetric crypto**: RSA (2048+ bits), ECC (P-256, P-384, P-521). ECC = smaller keys, faster than RSA. X25519 for key agreement
- **Hash functions**: SHA-2 (256/512), SHA-3 (Keccak). SHA-256 = current standard. Used in certificates, signatures, integrity verification
- **PKI**: Certificate Authorities, certificate chains, CRLs, OCSP. X.509 v3 standard. Chain of trust from root CA to leaf cert
- **Post-Quantum** (new in 2Ed): ML-KEM (Kyber — FIPS 203), ML-DSA (Dilithium — FIPS 204), SLH-DSA (SPHINCS+ — FIPS 205)
- **PQC migration**: Hybrid certs (RSA+ML-KEM) during transition. Larger key sizes (ML-KEM ~1KB, ML-DSA ~2KB vs ECC ~32B). Plan now for data that needs long-term confidentiality
- **PQC challenge**: Shor's algorithm breaks RSA/ECC once quantum computer exists. Store-now-decrypt-later threat. Current encrypted data at risk

# Applied to Octagon
- STRIDE directly applicable to Archetype attack trace analysis (Epic 2). Octagon Axiom 6 (BFT) grounded in Kleppmann's consensus/BFT theory
- PQC (Paar) directly feeds Appendix A (Quantum/AI stress-tests) and D1 (Trust Anchor — PKI migration)
- Linearizability vs consensus trade-offs inform D6 (Policy Distribution) architecture choices
