---
type: bmad-distillate
sources:
  - "../../../../../books/sources/zt-downloads/04-Project-Zero-Trust-Finney.md"
downstream_consumer: "Zero-Trust Octagon project — Epics 2-4"
created: "2026-06-23"
token_estimate: 700
parts: 1
---

## Core ZT Terms (Finney Framework)

- **Zero Trust**: Strategic initiative preventing data breaches by eliminating digital trust from systems. "Never trust, always verify." Strategy decoupled from technology
- **Protect Surface**: Opposite of attack surface. Contains single DAAS element. Finite, under organization's control. Each ZT environment has multiple protect surfaces
- **DAAS**: Data, Applications, Assets, Services — the sensitive resources placed into individual protect surfaces
- **Microperimeter**: Layer 7 boundary formed when Segmentation Gateway + Kipling Method Policy are deployed around a protect surface. Controls as close to protect surface as possible
- **Segmentation Gateway (SG)**: Layer 7 gateway for network segmentation based on users, applications, data. Physical (on-prem) or Virtual (cloud). Next-gen firewalls deployed in ZT mode function as SGs
- **Kipling Method Policy (KMP)**: ZT policy using Who, What, When, Where, Why, How — crosses languages/cultures. Replaces IP/port rules with identity/application/context rules at Layer 7
- **Asserted Identity**: Identity is always an assertion. The identity system "asserts" that a device is generating packets under control of the asserted entity
- **Data Toxicity**: 4Ps framework — PCI (credit card), PII (personally identifiable info), PHI (patient health), IP (intellectual property). Data becomes "toxic" if stolen/exfiltrated
- **Trust Levels**: Existing paradigm: internal=trusted, external=untrusted. ZT: all packets untrusted, trust level = 0. All successful attacks exploit trust
- **ZT Architecture**: Compilation of tools/technologies for a ZT environment. Tailor-made per protect surface. Layer 7 SG + microperimeter + KMP
- **ZT Environment**: Location of ZT architecture. Includes on-prem networks, public/private clouds, endpoints, SD-WAN

## Identity & Access Terms

- **IAM**: Identity and Access Management — life cycle of identity from creation to removal. Four areas: authentication, authorization, user management, directory services
- **PAM**: Privileged Access Management — protects admin accounts (e.g., Domain Admin). Audit/track admin activities. Biggest internal target
- **CIAM**: Consumer Identity and Access Management — outward-facing identity, separated from employee/privileged platforms
- **MFA**: Multifactor authentication — vulnerable to SIM-jacking, MFA fatigue. Continuous reauthentication needed
- **ZTNA**: Zero Trust Network Access (Gartner 2019) — tools for authenticated private network access. Broadens VPN definition to include SWG, SASE agents

## Security Infrastructure Terms

- **SOC**: Security Operations Center — 24x7 monitoring of telemetry. Should provide continuous feedback to improve controls, not just escalate alerts
- **SIEM**: Security Information and Event Management — centralized, forensically-secure log repository. Parse/normalize log data, correlate suspicious activity
- **EDR**: Endpoint Detection and Response — ML-based behavioral detection (vs signature-based antivirus). "Facial recognition, not fingerprints"
- **SOAR**: Security Orchestration, Automation, and Response — playbook-based automated cross-system responses. Reduce response time from hours to seconds
- **CASB**: Cloud Access Security Broker — proxy/API integration for security controls in cloud services
- **SASE**: Secure Access Services Edge — agent-based remote access with policy enforcement, browser isolation, cloud proxying
- **WAF**: Web Application Firewall — Layer 7 only. Stops SQLi, XSS, credential stuffing. OWASP Top 10 protection
- **SWG**: Secure Web Gateway — proxy for outbound traffic to enforce company web policies. Prevents malware from malicious URLs

## Zero Trust Concepts

- **Microsegmentation**: Small network segments preventing lateral movement. Flat networks = attacker can move freely. Microperimeter = Layer 7 microsegment
- **Containment**: Primary ZT prevention mechanism. Limits blast radius via microsegmentation + least privilege. Also: fast identification of impacted resources reduces attacker dwell time
- **Policy Engine**: NIST SP 800-207 concept. Hypothetical centralized system for just-in-time, continuously-authenticated access decisions
- **Least-Privilege Access**: "Does user need access to this specific resource to do their job?" Mitigates stolen credential AND insider attacks
- **Transaction Flow**: Mapping how DAAS components interact on the network. Determines where to place controls. Protect surface design depends on this

## Frameworks Referenced

- **MITRE ATT&CK**: TTP analysis of attacker behavior for defender understanding
- **MITRE Engage**: Active defense framework — deception technologies (breadcrumbs, lures, decoys, honeypots) to disrupt attacks
- **NIST SP 800-207**: Zero Trust Architecture standard — identity-driven ZT deployments; policy engine + policy enforcement point model
- **NIST CSF**: Identify → Protect → Detect → Respond → Recover. ZT SOC maps to Detect/Respond/Recover phases
- **CIS Critical Security Controls**: 18 controls. Referenced as complementary framework
- **OWASP Top 10**: Web application vulnerability categories. Used for DevOps security testing
- **CISA Tabletop Exercise Packages**: Free templates for tabletop exercises
