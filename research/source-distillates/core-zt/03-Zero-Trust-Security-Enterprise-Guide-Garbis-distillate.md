---
type: bmad-distillate
sources:
  - "../../../../../books/sources/zt-downloads/03-Zero-Trust-Security-Enterprise-Guide-Garbis.md"
downstream_consumer: "Zero-Trust Octagon project — Epics 2-4"
created: "2026-06-23"
token_estimate: 2500
---
## Core Concept
- Apress (2021). Jason Garbis (Optiv IAM expert, IDSA Technical Architect), Jerry Chapman. 4.7/5 (107 reviews)
- Foreword by Brig Gen (Ret) Greg Touhill (former US CISO) + Dr. Chase Cunningham ("Dr. Zero Trust")
- Most practical, component-by-component ZT enterprise architecture guide with deployment diagrams
- Companion video series at https://ZeroTrustSecurity.guide
- Focus: organizational + governance aspects alongside technical ZT implementation

## Strategic Overview (Chapters 1-4)
- ZT is a **strategic initiative** requiring organizational commitment, not a technology purchase
- Perimeter model is dead — COVID-19 accelerated the pivot (mass mobility, cloud, SaaS, BYOD) ("no outside or inside anymore")
- ZT ≠ specific products. Many vendors falsely claim ZT capabilities for legacy gear
- Key strategy phases: Understand business → Assess current state → Define target architecture → Develop roadmap → Execute iteratively
- **Executive sponsorship is non-negotiable** — ZT touches every part of the organization

## IAM-Focused ZT Architecture (Garbis's Core Contribution)
- **Identity as the new perimeter**: In a perimeter-less world, identity is the primary security boundary
- **IAM components for ZT**: (1) Identity Governance (provisioning, certifications, access reviews), (2) Authentication (MFA, passwordless, risk-based), (3) Authorization (fine-grained, context-aware), (4) Directory Services (centralized identity store)
- **Consumer IAM (CIAM)** separated from workforce IAM — different trust profiles, different controls
- **Privileged Access**: PAM for admin accounts. JIT (Just-In-Time) access, session recording, credential rotation
- **API security**: APIs are the new endpoints. OAuth2/OIDC for API auth. API gateways enforce policy. API discovery + inventory critical
- **Identity Fabric**: Abstraction layer connecting multiple identity sources (AD, Azure AD, Okta, Ping) to policy engines

## Zero Trust Enforcement Points
- **Network enforcement**: Segmentation gateways, microsegmentation, SD-WAN policies, Next-Gen Firewalls
- **Endpoint enforcement**: Device posture, EDR, disk encryption, mobile device management (MDM)
- **Application enforcement**: Application gateways, WAFs, API gateways, service mesh
- **Data enforcement**: DLP, encryption (at rest, in transit), tokenization, data classification labels
- **Cloud enforcement**: CASB, cloud security posture management (CSPM), cloud workload protection (CWPP)

## Deployment Diagrams (Book's Unique Value)
- Each chapter includes architecture diagrams showing component placement and data flow
- **VPN replacement**: User → SASE agent → ZTNA gateway → internal app (no full network access)
- **Microsegmentation**: Protect surface → Segmentation Gateway → Microperimeter → DAAS element
- **Cloud ZT**: On-prem DC → CASB → Cloud apps. Policy enforced at CASB, not at network edge
- **Remote access**: Device posture check at SASE agent → Identity verification → App-specific tunnel → Resource

## Organizational & Governance Insights (D8 Relevance)
- **ZT Program Office**: Dedicated team to drive ZT across silos. Reports to CISO/CIO. Includes representation from IT, Security, App Dev, Cloud, Business Units
- **Communication plan**: Regular updates to execs (risk reduction metrics, progress, wins). Business-value language, not security-technical
- **Policy lifecycle**: Write → Approve → Deploy → Monitor → Refine. Policy as code (version-controlled). Annual policy review cycle
- **Risk acceptance**: Some legacy systems can't support ZT — formal risk acceptance process needed
- **Vendor management**: ZT requirements in RFPs, contracts. Verify vendor ZT claims, don't accept marketing

## Maturity & Measurement
- **Assess current state**: Against 5 pillars (Identity, Devices, Networks, Apps/Workloads, Data)
- **Define target**: For each pillar, describe desired state at 12/24/36 months
- **Gap analysis**: Current vs target → prioritized work items
- **Metrics**: % of apps behind ZT enforcement, % of users on MFA, MTTR for incidents, policy coverage, exception count
- **Maturity progression**: Manual/Ad-hoc → Defined/Repeatable → Managed/Measured → Optimized

## Implementation Roadmap Guidance
- **Phase 1 (0-6 months)**: Identity foundation (MFA for all, PAM for admins, identity governance), deploy ZTNA for remote access. Select one application as pilot
- **Phase 2 (6-12 months)**: Microsegmentation for pilot protect surface. Expand ZTNA to all remote users. Deploy device posture checks
- **Phase 3 (12-18 months)**: Expand microsegmentation to critical apps. Deploy data classification + DLP. Cloud workload protection
- **Phase 4 (18-24 months)**: Full ZT enforcement across all protect surfaces. Automated policy management. Continuous monitoring + improvement
- **Key insight**: "Don't boil the ocean" — sequential protect surface approach. Each phase builds on previous

## Key Technology Patterns
- **SDP (Software-Defined Perimeter)**: Controller-based architecture. Controller authenticates user/device, then connects to gateway. Gateway doesn't accept connections until controller directs it
- **SASE/SSE**: Cloud-delivered ZT. Converges networking + security (SWG, CASB, ZTNA, FWaaS). Single-pass architecture
- **Service Mesh**: Istio, Linkerd, Consul. Envoy sidecar proxies enforce mTLS + authorization for service-to-service calls. Application-layer microsegmentation
- **Zero Trust Data**: Data classification → encryption → access policies → DLP → monitoring. Data-centric security model
- **Deception Tech**: Honeypots, honeytokens, breadcrumbs. Active defense to detect lateral movement

## Architectures Covered
- Traditional data center → ZT migration patterns
- Cloud-native (K8s) ZT with service mesh
- Hybrid/multi-cloud ZT with consistent policy
- M&A integration (merging two ZT environments)
- Remote/branch office ZT with SASE/ZTNA

## Key Takeaways (from chapter summaries)
- ZT is strategy + architecture + operations — all three needed for success
- Identity must be the cornerstone; everything flows from verified identity
- Microsegmentation is the primary prevention mechanism for lateral movement
- Automation is essential at scale — manual policy management doesn't scale
- Prepare for ZT to take 18-36 months for full enterprise coverage
- Culture and governance are bigger challenges than technology
- Measure what matters: risk reduction, business enablement, operational efficiency
