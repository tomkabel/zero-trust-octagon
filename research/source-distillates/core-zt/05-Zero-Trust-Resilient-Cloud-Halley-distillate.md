---
type: bmad-distillate
sources:
  - "../../../../../books/sources/zt-downloads/05-Zero-Trust-Resilient-Cloud-Halley.md"
downstream_consumer: "Zero-Trust Octagon project — Epics 2-4"
created: "2026-06-23"
token_estimate: 3000
---
## Core Concept
- Cisco Press (2025). Josh Halley, Dhrumil Prajapati, Ariel Leza, Vinay Saini. 864 pages — most comprehensive 2025 ZT implementation reference
- Focus: hands-on deploying automated ZT architectures at scale. Covers EVPN, Meraki, Terraform/Ansible, quantum security, Industrial ZT
- Part 1: ZT Network Deployment (ZTNA, SSE/SASE, segmentation, TrustSec)
- Part 2: Network Automation (DHCP, campus automation, PnP/ZTP, routing, auth, quantum security, convergence)
- Part 3: Deployment Best Practices (SDN lifecycle, wired/wireless assurance, large-scale deployment)
- Part 4: Cloud Security (cloud-native security foundations, application security, data center segmentation)

## ZT Strategy Definitions (Chapter 3)
- **ZT = strategy, not product**. Six elements: (1) Define strategy, (2) Identify business workflows, (3) Select tools/technologies, (4) Apply ZT using SSE/SASE, (5) Deploy ZTNA, (6) Iterate
- **Business workflow identification**: Map critical data flows before designing controls. Understand what normal looks like
- **SSE/SASE as ZT delivery mechanism**: Cloud-delivered enforcement. Single-pass architecture for SWG, CASB, ZTNA, FWaaS
- **ZTNA deployment scenarios**: (1) Remote access (VPN replacement), (2) Internal app access (microsegmentation), (3) Third-party/partner access (limited, time-bound), (4) Cloud app access (CASB integration)

## Security & Segmentation (Chapter 4)
- **TrustSec**: Cisco's tag-based segmentation. Security Group Tags (SGTs) assigned to endpoints. Policy based on SGT, not IP
- **Segmentation options**: (1) VLAN-based (Layer 2), (2) VRF-based (Layer 3), (3) Firewall-centric (stateful), (4) SGT-based (Cisco TrustSec), (5) Microsegmentation (host-based agents or service mesh)
- **Control plane transport**: SGT Propagation via SXP (SGT Exchange Protocol). Uses TCP for reliable SGT-to-IP mapping distribution
- **Data plane enforcement**: SGT in MACsec or inline tagging. Enforcement at any network device in path

## Automation at Scale (Part 2 - Unique Contribution)
- **Campus automation** (Ch 6): Catalyst Center (formerly DNA Center) for intent-based networking. Policy templates, automated device profiling, software image management
- **PnP/ZTP** (Ch 7): Zero-touch provisioning for branch devices. Ship switch → plug in → auto-configure from cloud/on-prem controller. No on-site IT needed
- **Routing automation** (Ch 8): SD-WAN policy-based routing. Traffic engineering for ZT enforcement. Segment routing for path differentiation
- **Auth automation** (Ch 9): 802.1X, MAB (MAC Auth Bypass), EasyConnect. ISE as policy engine. Automated certificate enrollment (SCEP/EST)
- **Key principle**: Automation eliminates human error in policy deployment. Manual changes at scale = inconsistency = security gaps

## Quantum Security (Chapter 10)
- **Quantum threat**: Shor's algorithm breaks RSA/ECC. Grover's halves symmetric key strength. Timeline: 10-15 years for cryptographically relevant quantum computer
- **Post-Quantum Cryptography (PQC)** : ML-KEM (FIPS 203) for key exchange, ML-DSA (FIPS 204) for signatures, SLH-DSA (FIPS 205) as hash-based backup
- **Migration strategy**: (1) Inventory all crypto usage, (2) Prioritize by risk (long-lived certs first), (3) Hybrid certs (RSA/ECC + PQC), (4) Test compatibility, (5) Full migration after standards stabilize
- **Crypto agility**: Design systems that can swap algorithms without architecture changes
- **Quantum-safe ZT**: PQC for PKI, quantum key distribution (QKD) for high-security links, hybrid crypto for long-term secrets

## SDN Deployment Best Practices (Chapter 12)
- **Deployment lifecycle**: (1) Plan & Design (requirements, architecture, capacity), (2) Deploy & Migrate (phased rollout, parallel run), (3) Operate & Manage (monitoring, troubleshooting, optimization)
- **Network convergence** (Ch 11): Layer 3 routed access (eliminate spanning tree). Fabric-based architectures (VXLAN/EVPN). Convergence testing methodology
- **Large-scale deployment** (Ch 14): Case study — Fast Burger chain. Standardized SD-WAN + ZT at 500+ locations. Centralized policy with local enforcement

## Cloud-Native Security (Part 4)
- **Cloud-native ZT foundations** (Ch 15): Workload identity (SPIFFE/SPIRE). Service mesh for microsegmentation. Policy as code in IaC
- **CNAPP** (Ch 16): Cloud-Native Application Protection Platform — unified CSPM, CWPP, CIEM, container scanning, IaC scanning
- **Cloud infrastructure security pillars**: (1) Identity & Access (cloud IAM), (2) Workload protection, (3) Network security (cloud firewalls, security groups), (4) Data protection (encryption, key management), (5) Monitoring/compliance
- **Key management**: Cloud KMS, HSM. Envelope encryption. Key rotation policies. Separation of duties for crypto access
- **Serverless security**: Short-lived execution. Minimal attack surface. But less visibility — need dedicated monitoring
- **Multi-cloud**: Consistent policy across AWS/Azure/GCP. Cloud-agnostic tooling (Terraform, Crossplane)

## Data Center Segmentation (Chapter 17)
- **On-prem → Cloud migration**: Extend ZT policies from DC to cloud. Consistent segmentation rules regardless of workload location
- **Hybrid/multi-cloud segmentation**: ACI on-prem → cloud-native security groups. Policy translation between environments
- **Web3 implications**: Immutable trust models for hybrid cloud. Blockchain-based policy distribution for decentralized enforcement
- **Zero Trust + Microsegmentation for DC**: Application-centric policy (not network-centric). Automated policy generation from traffic analysis

## Key Industrial ZT Considerations
- **OT/IoT segmentation**: Critical infrastructure must be separated. Purdue Model alignment. Unidirectional gateways for OT safety
- **Convergence monitoring**: Track security posture across all enforcement domains (network, cloud, endpoint, data)
- **Zero Trust for Industrial**: ISA/IEC 62443 standards alignment. Defense-in-depth for ICS/SCADA
