---
type: bmad-distillate
sources:
  - "../../../../../books/sources/zt-downloads/01-Zero-Trust-Architecture-Green-Ortiz.md"
downstream_consumer: "Zero-Trust Octagon project — Epics 2-4"
created: "2026-06-23"
token_estimate: 3500
---
## Core Concept
- Cisco Press ZT practitioner's guide by 7 authors with combined 85+ years experience. 4.6/5 rating
- 80/20 rule: methods help 80% of customers; remaining 20% use as reference model
- Uses fictional customer across industries to illustrate problem statements + solutions
- Product-agnostic approach: "products will change, but functionality and business-aligned goals remain"

## Cisco's Five Zero Trust Capability Pillars
- **Policy & Governance**: Establishes how tightly the org is governed, data retention, recovery, data management between groups. Includes: Change Control (ITIL), Data Governance (PII/ePHI/PCI/IP classification), Data Retention, QoS, Redundancy, Replication (encrypted backups), BCP, DR (RPO/RTO), Risk Classification
- **Identity**: AAA — Authentication (validation of who/what), Authorization (policy-determined resource access), Accounting (audit trail). Certificate Authority for strong device identity. IoT challenges: MUD/MAC-based auth is weaker. Identity alone ≠ access — full context needed
- **Vulnerability Management**: Continuous assessment, scanning, patching. Feeds into policy decisions
- **Enforcement**: Segmentation gateways, microperimeters, Layer 7 policy enforcement. Evolves from monitoring to active blocking
- **Analytics**: Telemetry collection, behavioral analysis, ML/AI-driven detection. Feeds continuous improvement loop

## ZT Discovery Workshop Methodology
- **Purpose**: Understand business, tools, capabilities BEFORE implementing ZT. Common mistake: skipping risk/impact understanding
- **Must-have**: Executive sponsor with C-suite authority + broad cross-business influence. Mandate from board of directors
- **Key success factor**: All major business units represented. Workshop = mission-critical priority, not business-as-usual
- **Workshop phases**: Planning (initial meeting, artifacts, logistics) → Collect Data (hardware/software resiliency, topology, protocols, configs, power/environment, device security) → Analyze Data → Presentation (exec summary, detailed tech report, 90-day improvement plan, 360-day plan)
- **Outcome**: Documented current-state, functional goals, risk exposure mapping, inter-unit relationship understanding

## Zero Trust Reference Architecture
- **Enforcement proximity**: Controls should be placed as close as possible to the protect surface
- **Branch**: Simplest ZT starting point. Small number of homogeneous endpoints. Deploy posture agents, policy download via RADIUS, traffic collection (NetFlow). Challenge: consumer-grade network devices may lack security features
- **Campus**: Larger, more diverse endpoints. Start with access-layer identification. MACSec for switch-to-switch auth+encryption. Posture: agents for PCs, NMAP/scanners for IoT. VLAN/subnet/VRF as natural control points. Continual analysis feeds evolving policy
- **Core Network**: Relies on underlying infrastructure. Device identity critical (loopback IP, hostname, model, location, metadata). Secure device management (control plane, management plane)
- **WAN**: MPLS, Internet, SD-WAN links. SD-WAN overlays for secure transport
- **Cloud**: Different enforcement model. CASB, cloud-native controls, API integrations

## Enclave Design (Chapter 4)
- **User Layer**: Identity-driven access. Posture assessment before network admission
- **Proximity Networks**: IoT/OT isolation. Separate VLANs/VRFs for devices that shouldn't communicate broadly
- **Cloud**: Shared Responsibility Model. Cloud-specific enforcement (WAF, API gateway, CASB)
- **Enterprise**: Data center enforcement. Segmentation gateways at aggregation points
- **Business Services**: ERP, CRM, critical apps. Highest-priority protect surfaces

## Segmentation (Chapter 6)
- OSI Model context: ZT requires Layer 7 segmentation (not just L3/L4)
- Upper layer segmentation models: application-layer controls for granular policy
- Common network-centric models: VLAN-based, VRF-based, firewall-centric
- **Key principle**: Map communications BEFORE restricting — successful ZT segmentation requires understanding baseline traffic patterns

## Common Challenges (Chapter 7)
- Organizational silos prevent cohesive ZT implementation
- Legacy infrastructure lacking security features (especially branch)
- Shadow IT: unknown devices/services on network
- M&A integration: merging disparate architectures
- Budget: ZT requires investment; build business case incrementally
- IoT device authentication: certificates often infeasible; MUD/MAC weaker but necessary

## Operations (Chapter 10)
- Steady-state monitoring: inspect + log all traffic through Layer 7
- Continuous policy refinement based on analytics telemetry
- Tabletop exercises to validate BCP/DR plans
- ZT is a journey, not a destination — continuous improvement loop

## Organizational Dynamics
- Shift from connectivity mindset to security mindset required
- Security team alone cannot implement ZT — needs network, server, app, cloud teams
- Key performance indicators (KPIs) tied to business outcomes
- Stakeholder buy-in: demonstrate value incrementally (start with branch, prove concept, expand)
- Board/executive communication: ZT = risk reduction + business enablement, not just security project

## Enforcement Plan (Chapter 9)
- Stepwise approach: Monitor → Analyze → Enforce
- Phase 1: Deploy visibility tools (NetFlow, traffic taps, logging)
- Phase 2: Analyze traffic patterns, identify protect surfaces, draft policies
- Phase 3: Deploy enforcement in non-blocking mode (log-only)
- Phase 4: Validate policies, tune based on false positives
- Phase 5: Move to active enforcement (blocking mode)
- **Critical**: Due diligence at each phase before progressing — rushing to enforcement breaks business

## Replication & DR
- Encrypted backups to offline/off-site storage
- Automation required to prevent errors (wrong data overwritten)
- BCP protects human life first. DR focuses on system recovery
- RPO/RTO defined per-system before production go-live
- "If there's no testing, there's no DR plan" — without BCP+DR, no valid ZT strategy
