---
type: bmad-distillate
sources:
  - "../../../../../books/sources/zt-downloads/04-Project-Zero-Trust-Finney.md"
downstream_consumer: "Zero-Trust Octagon project — Epics 2-4"
created: "2026-06-23"
token_estimate: 1400
parts: 1
---

## Origin Story (Foreword by John Kindervag)
- Traditional firewall model (PIX ASA): internal = trust=100, external = trust=0. Danger: once attacker is inside, no policy stops lateral movement or data exfiltration
- "Trust" is a human emotion injected into digital systems for no technical reason — the proximate cause of numerous breaches
- ZT born at Forrester (2008). Kindervag's original ZT report published Sept 2010: "No More Chewy Centers: Introducing the Zero Trust Model of Information Security"
- EO 14028 (2021) inverted incentive structure — now ZT adoption is mandated, not radical

## Chapter 1: The Case for Zero Trust
- MarchFit (fitness company) hit by ransomware on Dylan's first day. 3nc0r3 demands payment after exfiltrating data
- Key tension: restore from backups vs pay ransom. Decision: don't pay, restore + upgrade EDR in parallel
- Aaron Rapaport (ZT expert, student of Kindervag) brought in to lead ZT transformation
- Dylan assigned as 6-month ZT project lead reporting to both Noor (CIO) and Olivia (CEO)
- Core question Aaron asks: "Do you believe prevention is possible?" — ZT = prevention strategy
- Olivia's insight: "In every other area of business we have a strategy. ZT will be our security strategy"

## Chapter 2: Zero Trust Is a Strategy
- Distinction: strategy ≠ vendor/technology. Strategy persists as tools change
- The 4 ZT Design Principles introduced. Aaron's framework: Define outcomes → Inside-out design → Determine access → Inspect + log all traffic
- The 5-Step ZT Design Methodology: Protect surface → Transaction flows → Architecture → Policy → Monitor/maintain
- Lessons from other business strategies: strategy aligns, focuses, defines success metrics
- Without strategy: reactive tool purchasing, no way to measure progress

## Chapter 3: Trust Is a Vulnerability (Physical Security)
- Physical security = perfect analogy for ZT. You naturally place controls around things you protect
- MarchFit's physical security was outsourced to 3rd parties — cameras on public IPs, default passwords ("MarchFit"), shared vendor logins
- Card readers/camera systems often installed by construction contractors with zero security consideration
- Shodan.io search: MarchFit's IoT devices (cameras) publicly exposed and indexable
- **Key insight**: You can't have cybersecurity without physical security. Physical security requires cybersecurity (modern card readers/cameras = networked devices)
- Microsegmentation demonstrated: separate VLANs for cameras, card readers, employee workstations
- Problem management ≠ incident management. ZT addresses underlying source (trust) not just symptoms
- Social engineering demo: paper airplane under door triggers motion sensor → door opens without badge

## Chapter 4: The Crown Jewels (ERP)
- Protect surface selection starts with understanding how the business makes money (CFO interview)
- MarchFit's ERP = crown jewel. ERP systems are often security blind spots (no logs, no vuln scans, no code review)
- Transaction flow mapping reveals how DAAS components interact
- ERP change control is critical — unauthorized changes to financial data are catastrophic
- Key: understand business processes + relationships, not just packet flows

## Chapter 5: The Identity Cornerstone
- Identity = both a protect surface AND a critical control. Must be protected better than almost anything else
- Consumer IAM separated from employee/privileged account management
- Provisioning/deprovisioning lifecycle; orphaned accounts = risk
- MFA essential but can be subverted (SIM-jacking, MFA fatigue)
- Privileged Access Management (PAM) for admin accounts
- Continuous reauthentication, not just at login
- NIST SP 800-207 focuses on identity to drive ZT deployments

## Chapter 6: Zero Trust DevOps
- DevOps pipeline can embed security testing (SAST, dependency scanning, container scanning)
- Remove trust from code: embedded passwords/emails/IPs = vulnerabilities
- OWASP Top 10, dependency scanning, code review in CI/CD
- Infrastructure as Code + security as code = policies version-controlled and auditable
- Containers: scan images, don't run as root, use read-only filesystems
- Shift Left: find vulnerabilities early, not in production

## Chapter 7: Zero Trust SOC
- SOC correlates strongly with Monitor + Maintain phase of ZT methodology
- SOC should provide continuous feedback to improve controls, not just escalate alerts
- Monitor and Maintain phase: inspect + log all traffic up through Layer 7
- **Containment measurement**: key SOC metric — how fast can you detect AND contain?
- MITRE ATT&CK framework for understanding TTPs of attacker behavior
- SOC needs telemetry from cloud, network, endpoint controls
- MSSP alignment: must align with your protect surfaces, incorporate pen test findings, integrate with internal tools
- Alert fatigue is real — ZT reduces false positives by defining known legitimate traffic

## Chapter 8: Cloudy with a Chance of Trust
- Cloud isn't one protect surface — it's many. Each cloud service needs its own protect surface analysis
- Limited visibility into cloud services requires additional tools: WAFs, CASBs, API monitoring
- Strong IT governance (PMO) to enforce consistent controls across cloud services
- Third-party vendor management: contracts must specify security requirements (CIAQ, SOC 2, ISO 27001)
- SDP/SASE as cloud-delivered ZT enforcement for remote workers
- "Design from the inside out" applies to cloud too — start with data, work outward
- Shared Responsibility Model: understand what cloud provider secures vs what you must secure
- Container security in cloud: Kubernetes + network policies + admission controllers

## Chapter 9: A Sustainable Culture
- People are the most important part of security. Culture determines whether changes stick
- Security must be integrated into everything: training, weekly meetings, onboarding
- The Pygmalion Effect: expectations drive performance. If you expect people to be security liabilities, they will be
- Innovation Security Advisory Council (ISAC): cross-departmental group that owns security culture
- Security awareness: "security minute" at every meeting; wellness program integration; praise good security behavior
- Shadow IT exists because people find secure alternatives too hard — make security easy, not a blocker
- **Key insight**: Security culture is everyone's job, not just the security team's. Bottom-up + top-down support needed

## Chapter 10: The Tabletop Exercise
- Every organization should run cybersecurity tabletops like annual fire drills
- Three objectives: (1) Avoid disruption to operations during incident, (2) Distinguish real issues from false positives, (3) Identify gaps in controls, procedures, resources, training
- CISA provides free tabletop templates. MarchFit's MSEL (Master Scenario Events List) included in Appendix C
- Live-fire exercises need weeks of preparation; scenario realism is critical
- MSEL structure: injects (timed events), expected outcomes, learning points, max time per inject
- Tabletop timeline covers 1 day (8:35 AM to overnight) with 14 injects
- Key lesson: mistakes should be something you prepare for and learn from, not something you avoid
- Cyber insurance carrier participates in negotiation discussions during incident

## Chapter 11: Every Step Matters (Conclusion)
- Transaction flow matrix: shows how protect surfaces interact. Blast radius from one can impact others
- Breach and Attack Simulation (BAS) tools for real-time control testing
- MITRE Engage Matrix: deception technologies (breadcrumbs, lures, decoys, honeypots) for active defense
- Deception effects: NSA study showed red teams doubted their own tools when they knew deception was deployed — psychological effect persists even when deception isn't actually active
- Dylan becomes MarchFit's first dedicated CISO. Builds security team from Project Zero Trust members
- Key takeaway: "We're not measured on whether we are hacked or not. We're measured on how we respond."
- Success requires: executive support + diverse IT team + basic inventory/risk register + focus on protect surfaces not attack surfaces
- Technology silos prevent collaboration — ZT breaks them down by unifying teams around a singular focus: preventing/containing data breaches
