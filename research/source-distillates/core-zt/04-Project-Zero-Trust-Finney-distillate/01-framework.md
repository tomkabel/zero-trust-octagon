---
type: bmad-distillate
sources:
  - "../../../../../books/sources/zt-downloads/04-Project-Zero-Trust-Finney.md"
downstream_consumer: "Zero-Trust Octagon project — Epics 2-4"
created: "2026-06-23"
token_estimate: 900
parts: 1
---

## Core Concept
- Project Zero Trust: business-novel approach to teaching ZT as organizational strategy, not technology rollout
- Created by George Finney (CISO, Southern Methodist University), foreword by John Kindervag
- Foundational premise: "Prevention is the most efficient way of stopping breaches, and Zero Trust is the best strategy for implementing prevention in technology"
- ZT strategy decoupled from technology — strategy remains as tools change

## The Four Zero Trust Design Principles
- **Define business outcomes**: Align ZT to grand strategic outcomes of the organization; makes cybersecurity a business enabler, not inhibitor
- **Design from the inside out**: Start with DAAS elements (Data, Applications, Assets, Services) and protect surfaces; design outward from there
- **Determine who or what needs access**: Too many users get too much access with no business reason — least-privilege, need-to-know
- **Inspect and log all traffic**: All traffic to/from protect surface must be inspected/logged for malicious content and unauthorized activity, up through Layer 7

## The Five-Step Zero Trust Design Methodology
- **Define the protect surface**: Identify DAAS elements to protect. Opposite of attack surface (which is infinite); protect surface is finite, under your control
- **Map the transaction flows**: Understand how the network works to place proper controls. Traffic movement determines design
- **Build a Zero Trust architecture**: Steps 1-2 illuminate the design. Place controls as close as possible to the protect surface. Every ZT architecture is tailor-made for each protect surface
- **Create a Zero Trust policy**: Use Kipling Method (Who, What, When, Where, Why, How). Layer 7 policy enforcement. Replaces IP/port rules with identity-application-context rules
- **Monitor and maintain**: Inspect + log all traffic through Layer 7. Telemetry feeds behavioral analytics, ML, AI to stop attacks in real-time. Each protect surface becomes more robust over time

## Zero Trust Implementation Curve
- 6-9 months is realistic timeline for demonstrable value (not completion)
- Break journey into bite-sized pieces; use first phase to build business case for next
- Benchmark maturity changes over time using ZT Maturity Model
- ZT primarily focuses on **prevention**; key mechanism is **containment** (limits lateral movement via microsegmentation, least privilege)

## Zero Trust Maturity Model (5 levels per methodology step)
- Based on standard Capability Maturity Model: Initial → Repeatable → Defined → Managed → Optimized
- Applied per protect surface (single DAAS element each)
- Step 1 (Define protect surface): Unknown → Automated discovery → Fully auto-classified
- Step 2 (Map flows): Conceptual interviews → Automated real-time mapping
- Step 3 (Architect): Cannot design → Layer 7 segmentation gateways → Multi-variable controls
- Step 4 (Create policy): Layer 3 → Who/What statements → Custom user-specific → Layer 7 granular
- Step 5 (Monitor): Low visibility → Central data lake → AI/ML analytics → Fully automated alert/refine

## Kipling Method Policy (KMP)
- Named after Kipling's "Who, What, When, Where, Why, How" poem — crosses languages/cultures
- **Who**: Validated asserted identity (replaces source IP in traditional firewall rules)
- **What**: Application identity validated at Layer 7 (replaces port/protocol)
- **When**: Time limitations; many rules should not be 24/7
- **Where**: Location of resource and accessor; impossible travel detection
- **Why**: Resource classification (public/private/secret/top secret); compliance, privacy, IP considerations
- **How**: Controls applied (encryption, URL filtering, sandboxing, signatures, anomaly detection)

## Key Implementation Insights
- Start with **inventory** — you can't protect what you don't know exists. Unknown traffic = blocked by default
- Use **protect surfaces** (not attack surfaces) — limits scope, makes controls manageable
- Prioritize using **Business Impact Assessment** and **risk register**
- Learning protect surfaces (e.g., physical security) before crown jewels (e.g., ERP)
- Identity is the **cornerstone** — both a protect surface AND a critical control
- **Containment** is the key prevention mechanism — limits blast radius via microsegmentation
- 6-9 months for first demonstrable value; maturity tracking via capability model
- Build diverse team from across IT (not just security) — breaks silos
- **Every Step Matters** — incremental progress compounds
