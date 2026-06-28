# Appendix E: CISA Zero Trust Maturity Model v2.0 Crosswalk

> **Prerequisites:** [§2: The Octagon](../01-foundations/02-the-octagon.md), [§4: The Morphological Matrix](../02-methodology/04-the-morphological-matrix.md), [§7: Meta-Patterns](../02-methodology/07-meta-patterns.md), [§13: Self-Assessment Diagnostic](../04-synthesis/13-self-assessment.md)

---

The CISA Zero Trust Maturity Model (ZTMM) v2.0, published April 2023, defines zero-trust maturity across five pillars and three cross-cutting capabilities with four maturity stages (Traditional, Initial, Advanced, Optimal). It was developed under EO 14028 and aligned to OMB M-22-09 as a measurement instrument for federal agencies. It is the dominant maturity model in U.S. federal zero-trust adoption.

The Octagon measures architectural integrity against eight axiomatic invariants. The ZTMM measures organizational progress toward zero-trust adoption. Both are necessary. Neither is sufficient alone.

## Reading the Crosswalk

This appendix enables bidirectional use:

- **ZTMM → Octagon:** When the ZTMM says a function is at a given maturity stage, this crosswalk identifies which Octagon axioms and matrix dimensions are relevant.
- **Octagon → ZTMM:** When an axiom is violated, this crosswalk identifies which ZTMM function is likely below the threshold maturity.

The crosswalk is diagnostic, not prescriptive. A ZTMM function can be at Advanced while the corresponding Octagon axiom is still violated — maturity does not guarantee architectural integrity [DR-§1.1].

---

## Part I: Five Pillar Crosswalk

### Identity Pillar

| ZTMM Function | Traditional | Initial | Advanced | Optimal | Octagon Axiom(s) | Matrix Dimension(s) |
|--------------|-------------|---------|----------|---------|-----------------|-------------------|
| Authentication | Password + MFA optional | MFA required, centralized IDP | Phishing-resistant MFA (FIDO2/WebAuthn) | Continuous auth + behavioral signals | Axiom 1 (No Intrinsic Trust), Axiom 4 (Continuous Verification) | D2 (Identity Model), D4 (Attestation Modality) |
| Identity Lifecycle Management | Manual provisioning | Semi-automated, role-based | Automated JIT, birthright removal | ZSP (no standing privileges) | Axiom 5 (Deterministic Bounded Authority) | D2 (Identity Model) |
| Access Control | Static roles | Attribute-based (ABAC) | Risk-adaptive, just-in-time | Policy-as-code, continuous evaluation | Axiom 2 (Verifiable Policy), Axiom 3 (Unbypassable Mediation) | D2 (Identity Model), D6 (Policy Distribution) |
| ICAM Integration | Siloed identity stores | Federated, single IDP | Multi-IDP with trust framework | Cross-agency identity federation | Axiom 8 (Bilateral Symmetry) | D3 (Enforcement Layer) |

### Devices Pillar

| ZTMM Function | Traditional | Initial | Advanced | Optimal | Octagon Axiom(s) | Matrix Dimension(s) |
|--------------|-------------|---------|----------|---------|-----------------|-------------------|
| Policy Enforcement & Compliance Monitoring | Manual device checks | Agent-based compliance | Real-time posture assessment | Continuous hardware-anchored attestation | Axiom 7 (Epistemic Integrity) | D1 (Trust Anchor), D4 (Attestation Modality) |
| Asset & Supply Chain Risk Management | Manual inventory | Automated discovery, basic SBOM | Continuous SBOM + vulnerability correlation | Cryptographic workload identity + supply chain provenance | Axiom 7 (Epistemic Integrity) | D1 (Trust Anchor) |
| Resource Access | Device = network location | Device = identity proxy aware | Device signal informs risk score | Device attestation gates resource access | Axiom 4 (Continuous Verification) | D3 (Enforcement Layer), D4 (Attestation Modality) |
| Device Threat Protection | Signature-based AV | EDR + centralized threat feeds | Behavioral threat detection + EDR correlation | AI-augmented detection + automated containment | Axiom 6 (Byzantine Fault Tolerance) | D5 (Violation Response) |

### Networks Pillar

| ZTMM Function | Traditional | Initial | Advanced | Optimal | Octagon Axiom(s) | Matrix Dimension(s) |
|--------------|-------------|---------|----------|---------|-----------------|-------------------|
| Network Segmentation | Perimeter firewall | Micro-segmentation (VLAN) | Software-defined micro-segmentation | Identity-based micro-segmentation (service-level) | Axiom 3 (Unbypassable Mediation) | D3 (Enforcement Layer) |
| Traffic Encryption | TLS for external only | TLS for internal critical paths | mTLS for all service-to-service | mTLS + PQC-ready cipher negotiation | Axiom 8 (Bilateral Symmetry) | D3 (Enforcement Layer), D1 (Trust Anchor) |
| Network Resilience | Manual failover | Automated failover, basic DDoS | Multi-region resilience, traffic engineering | Self-healing, predictive capacity | Axiom 6 (Byzantine Fault Tolerance) | D5 (Violation Response) |
| Visibility & Network Analytics | Flow logs (NetFlow) | Deep packet inspection (sampled) | Full packet capture + ML anomaly detection | Real-time encrypted traffic analysis + hardware-anchored telemetry | Axiom 7 (Epistemic Integrity) | D7 (Observability Trust) |

### Applications & Workloads Pillar

| ZTMM Function | Traditional | Initial | Advanced | Optimal | Octagon Axiom(s) | Matrix Dimension(s) |
|--------------|-------------|---------|----------|---------|-----------------|-------------------|
| Application Authorization | Static API keys | OAuth 2.0, short-lived tokens | SPIFFE/SPIRE, cryptographic identity | Continuous workload attestation + proof-before-action | Axiom 5 (Deterministic Bounded Authority), Axiom 4 (Continuous Verification) | D2 (Identity Model), D4 (Attestation Modality) |
| Secure Software Supply Chain | Manual code review | Automated SAST + dependency scanning | SBOM + attestation at build | CI/CD pipeline integrity + deployment policy enforcement | Axiom 7 (Epistemic Integrity) | D1 (Trust Anchor), D6 (Policy Distribution) |
| Threat Protection for Applications | WAF (signature-based) | RASP + behavioral detection | API security + runtime attestation | AI-augmented application threat detection + automated quarantine | Axiom 6 (Byzantine Fault Tolerance) | D5 (Violation Response) |
| Application Access | VPN-based | Identity-aware proxy (IAP) | Continuous access evaluation (CAE) | Proof-before-connect + proof-before-action | Axiom 3 (Unbypassable Mediation), Axiom 4 (Continuous Verification) | D3 (Enforcement Layer) |

### Data Pillar

| ZTMM Function | Traditional | Initial | Advanced | Optimal | Octagon Axiom(s) | Matrix Dimension(s) |
|--------------|-------------|---------|----------|---------|-----------------|-------------------|
| Data Inventory Management | Manual data inventory | Automated discovery, basic classification | Continuous inventory + classification correlation | Cryptographic provenance for all data assets | Axiom 7 (Epistemic Integrity) | D7 (Observability Trust) |
| Data Categorization | Ad-hoc labeling | Policy-based classification | Automated classification + data lineage | Cryptographic data tagging + provenance | Axiom 7 (Epistemic Integrity) | D1 (Trust Anchor) |
| Data Availability | Manual backup | Automated backup/recovery | Geo-redundant, RTO/RPO-defined | Self-healing, cryptographic integrity at rest | Axiom 6 (Byzantine Fault Tolerance) | D5 (Violation Response) |
| Data Access | File-system ACLs | Attribute-based, audit logged | Real-time policy evaluation + JIT access | Proof-before-action, per-operation authorization | Axiom 3 (Unbypassable Mediation), Axiom 5 (Deterministic Bounded Authority) | D3 (Enforcement Layer), D2 (Identity Model) |
| Data Encryption | At-rest only, static keys | TLS in transit, key rotation | End-to-end encryption, HSM-backed keys | PQC-ready, hardware-anchored key hierarchy | Axiom 8 (Bilateral Symmetry), Axiom 7 (Epistemic Integrity) | D1 (Trust Anchor) |

---

## Part II: Cross-Cutting Capabilities

The ZTMM defines three cross-cutting capabilities that span all five pillars. These have direct Octagon mappings that are bidirectionally useful for readers navigating between the two frameworks.

| ZTMM Cross-Cutting Capability | Traditional | Initial | Advanced | Optimal | Octagon Axiom(s) | Matrix Dimension(s) |
|------------------------------|-------------|---------|----------|---------|-----------------|-------------------|
| Visibility & Analytics | SIEM, log aggregation | Centralized analytics, basic correlation | ML-based anomaly detection, UEBA | Hardware-anchored telemetry, independent verification | Axiom 7 (Epistemic Integrity) | D7 (Observability Trust), D4 (Attestation Modality) |
| Automation & Orchestration | Manual response | Playbook-driven, SOAR | Automated triage + enrichment | Fully automated response + deception orchestration | Axiom 4 (Continuous Verification), Axiom 5 (Deterministic Bounded Authority) | D5 (Violation Response), D6 (Policy Distribution) |
| Governance | Policy documentation | Policy version control | Policy-as-code, automated compliance | Continuous governance, real-time policy verification | Axiom 2 (Explicit, Verifiable Policy) | D8 (Organizational Posture) |

---

## Part III: Bidirectional Navigation

### ZTMM → Octagon

When the ZTMM says X, the Octagon says Axiom Y:

| ZTMM Statement | Octagon Translation |
|---------------|---------------------|
| "Identity authentication at Optimal" | Axioms 1, 4 satisfied — trust is a transient verdict, continuously re-verified |
| "Network segmentation at Traditional" | Axiom 3 violated — the perimeter is the only mediation layer |
| "Data encryption at Advanced" | Axiom 7 partially satisfied — encryption exists but provenance is not cryptographically verified |
| "Visibility & Analytics at Initial" | Axiom 7 violated — telemetry is trusted implicitly without independent verification |
| "Automation & Orchestration at Advanced" | Axioms 4, 5 partially satisfied — automated response exists but authority vectors may not be deterministic |

### Octagon → ZTMM

When Axiom Z is violated, you are at ZTMM Traditional/Initial for capability W:

| Octagon Violation | ZTMM Status |
|-------------------|-------------|
| Axiom 1 violated (trust by position) | Identity pillar: Traditional (password auth, no MFA) |
| Axiom 2 violated (policy not verifiable) | Governance: Traditional (policy not in version control, not replayable) |
| Axiom 3 violated (unmediated paths exist) | Networks: Traditional (perimeter-only) or Applications: Traditional (VPN-based) |
| Axiom 4 violated (verification at auth only) | Identity: Traditional — sessions trusted for entire TTL |
| Axiom 7 violated (no provenance chain) | Visibility & Analytics: Traditional — telemetry trusted at face value |

---

The ZTMM measures organizational progress. The Octagon verifies architectural integrity. Both are necessary. Neither is sufficient alone.

---

## Cross-References

**Builds On:** [§2: The Octagon](../01-foundations/02-the-octagon.md) — the eight axioms. [§4: The Morphological Matrix](../02-methodology/04-the-morphological-matrix.md) — the nine dimensions. [§7: Meta-Patterns](../02-methodology/07-meta-patterns.md) — leverage hierarchy and covariance clusters. [§13: Self-Assessment Diagnostic](../04-synthesis/13-self-assessment.md) — archetype routing and confidence/reality gap.

**Related:** [§14: Enterprise Turnaround](../04-synthesis/14-enterprise-turnaround.md) — 24-month pathway with ZTMM cross-reference. [§15: Velocity Defender](../04-synthesis/15-velocity-defender.md) — 12-month pathway. [§16: Scaling Pat](../04-synthesis/16-scaling-pat.md) — 6-month pathway. [Appendix B: Validation Checklist](./appendix-b-validation-checklist.md) — complementary frameworks note.
