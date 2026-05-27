# 11. Archetype D: SaaS-Glued Lean Defense

> **Learning Objectives**
> - Trace an MFA fatigue + SaaS session hijack attack against a solo-operator deployment
> - Identify the SaaS Blind Spot: the gap between what the identity-aware proxy protects and what the SaaS layer exposes
> - Explain bimodal MTTR distributions and why they produce false confidence
> - Recognize human continuity (D9) as the dimension most universally overlooked in zero-trust planning

**Prerequisites:** [Chapter 4: The Morphological Matrix](../02-methodology/04-the-morphological-matrix.md), [Chapter 5: Dimensions 1-4](../02-methodology/05-dimensions-trust-to-attestation.md), [Chapter 6: Dimensions 5-9](../02-methodology/06-dimensions-response-to-human.md)

---

Archetype D is the reality for a 30-to-100-person fully remote company with exactly one person handling IT, Security, and DevOps. We call them Pat. Pat has no CAPEX budget, no on-premise hardware, no Kubernetes clusters, and no SIEM. Pat's defense is identity-aware proxies, hardware security keys, SaaS vendor dashboards, and human intuition.

**Configuration:**
- D1: Software CA (PKI-based) — Google Workspace, Okta, or Entra ID
- D2: Static JIT — standard OIDC/SAML sessions, 12-24 hour TTLs
- D3: Application / Gateway — Identity-Aware Proxy (Cloudflare Access, Tailscale)
- D4: Single Source — IDP authentication + basic device posture check
- D5: Auto-Escalate to Human — webhook to Slack, no automated playbooks
- D6: Push — clicking "Save" in the IAP SaaS dashboard
- D7: Implicit Trust — if the SaaS vendor logs it, it happened
- D8: Fused (Shared Blast Radius) — Pat is the CISO, network admin, and helpdesk
- D9: Single Point of Failure — Pat. One human. No fallback.

---

## The Attack: MFA Fatigue + SaaS Session Hijack

### T-0h: The Spear-Phishing Campaign

A sophisticated adversary launches an AI-generated spear-phishing campaign against a Junior Marketing Manager. The email is well-researched, personalized, and bypasses Google Workspace's spam filters. The manager clicks a link and enters their credentials on a convincing phishing page.

The attacker now has a valid username and password. But they do not have the second factor — the company uses mobile-push MFA.

---

### T+2h: MFA Fatigue (Prompt Bombing)

Late at night, the attacker begins sending repeated MFA push notifications to the manager's phone — one every few minutes for over an hour. This is MFA fatigue: the psychological exploit of flooding a target with authentication prompts until they accept one, either by accident or because they assume the system is malfunctioning and accepting will make it stop.

At 1:47 AM, the manager, half-asleep, taps "Accept."

The attacker now has a valid Google Workspace session cookie.

---

### T+0s: The IAP Check

The attacker attempts to access `finance.internal-startup.com`. Because D3 is an identity-aware proxy (IAP), this DNS record does not resolve to a server — it resolves to a SaaS edge node that demands identity before forwarding traffic.

The attacker presents the stolen Google Workspace session cookie. The IAP checks the IDP (D1: Software CA). The session is valid. The math checks out.

But the IAP has a second rule: the requesting device must be running the company's MDM profile. The attacker is on a Kali Linux VM in a bulletproof hosting center. The device posture check **fails**.

The IAP denies access. A JSON webhook fires to Pat's Slack channel: `#sec-critical-alerts`.

```
Warning: Valid Auth but Failed Device Posture for finance.internal-startup.com
IP: 193.x.x.x | ASN: Unknown Hosting | User: Junior Marketing Manager
Time: 1:47 AM
```

**The IAP worked.** The attacker did not reach the finance dashboard. This is the device posture check doing exactly what it was designed to do.

---

### The Structural Blind Spot: What the IAP Does Not Protect

The attacker has a valid Google Workspace session. The IAP denied access to `finance.internal-startup.com`. But the IAP only protects self-hosted resources — the applications behind it.

The attacker still has a valid session for **every SaaS platform that uses Google SSO**.

- **Google Drive** — all company documents accessible
- **Google Mail** — the manager's email, potentially including forwarded financial reports
- **Slack** — the company's internal communications
- **Notion** — the company wiki and internal documentation
- **Any third-party SaaS** that accepts Google as an identity provider

These platforms do not route through Pat's IAP. They authenticate directly with Google. The attacker's stolen session is valid everywhere.

---

### Scenario Branching: Three Possible Outcomes

The effectiveness of Archetype D's defense now depends entirely on D9 (Human Continuity).

#### Scenario D1 — Pat Is Unavailable

Pat is asleep. It is 1:47 AM. The phone is on silent. The Slack notification sits unread.

For the next 25+ minutes, the attacker has uninterrupted access to Google Drive, Mail, Slack, and every SSO-connected SaaS platform. They exfiltrate documents, read internal communications, map the organization structure, and potentially identify additional targets.

**Data exfiltrated:** Unknown. Google Workspace's default audit logging does not capture detailed file access events at the base tier. Pat may never know exactly what was accessed.

**MTTR:** 25+ minutes (when Pat wakes up).

#### Scenario D2 — Pat Is Available but Fatigued

Pat's phone buzzes. Pat glances at the Slack notification.

This is the third alert this week. The first two were false positives — a VP tried to access the CRM from their personal laptop at 10 PM, and a salesperson's MDM cert had expired. The alert format is identical.

Pat thinks: "Junior Marketing Manager. Weird IP. Probably nothing — they're on a work trip." Pat swipes the notification away and goes back to sleep.

**Axiom violation:** Axiom 4 (Continuous Verification). Single-source attestation produces low-signal, high-noise alerts. Without a second independent signal (behavioral baseline, hardware attestation, geolocation correlation), Pat cannot distinguish between a novice employee mistake and a sophisticated attacker. The alert format gives no context beyond the raw attributes.

**Attacker exfiltration window:** Hours, until the manager wakes up and reports the MFA prompts.

#### Scenario D3 — Pat Is Available and Alert

Pat's phone buzzes. Pat reads the alert. Pat applies human context instantly: "Why is Junior Marketing trying to access the Finance dashboard from an Eastern European hosting provider at 1:47 AM?"

Pat opens the Google Workspace admin app. Sees the 15 failed MFA push notifications followed by the 1 success — a textbook MFA fatigue attack. Pat recognizes the pattern immediately because Pat has been doing this for years.

With three taps: revoke all Google sessions for the manager, force password reset, enable login challenge. Type in Slack: "Your account was phished. Locked down. Call me when you're up."

**MTTR:** ~3 minutes. **Attacker exfiltration window:** ~3 minutes — probably accessed some Drive files, likely didn't get through everything.

---

### The Bimodal MTTR Problem

Pat's MTTR is not a single number. It is a distribution with two peaks:

| Scenario | MTTR | Probability (estimated) | Data Loss |
|----------|------|------------------------|-----------|
| Pat available and alert | ~3 minutes | ~40% | Minimal — some Drive files |
| Pat available but fatigued | Indefinite (until user reports) | ~30% | Significant |
| Pat unavailable | 25+ minutes | ~30% | Substantial |

Averaging these produces a deceptively reasonable number (~10-15 minutes). But averages obscure the bimodal structure. In security metrics, bimodal distributions are worse than consistently bad ones — they produce false confidence ("last time it took 3 minutes") that masks the catastrophic tail risk.

---

## Root Cause Analysis

| Step | What Failed | Root Axiom Violation | Structural Fix |
|------|------------|---------------------|----------------|
| MFA fatigue succeeded | Mobile-push MFA is phishable | Axiom 4 (Continuous Verification) | D4: Mandate FIDO2/WebAuthn hardware keys ($50/user, one-time) |
| SaaS blind spot | IAP doesn't protect SaaS platforms | Axiom 3 (Unbypassable Mediation) | D3: Deploy browser extension to enforce policies on SaaS access |
| No independent verification | Single-source attestation produces noisy alerts | Axiom 7 (Epistemic Integrity) | D7: Subscribe to SaaS identity monitoring service for cross-vendor verification |
| Pat is the bottleneck | All alerts go to one human | Axiom 6 (Byzantine Fault Tolerance) | D9: Add automated response for clear-cut cases; hire a second person |
| Vendor black-box PDP | Cloudflare/Tailscale PDP is not replayable | Axiom 2 (Verifiable Policy) | D6: Hard to fix at Pat's scale; acknowledged debt |
| 12-24h session TTL | Stolen session has enormous exploitation window | Axiom 4 (Continuous Verification) | D2: Shorten session TTLs to 4 hours for sensitive roles |

---

## The SaaS Blind Spot — Generalized

The IAP gap is not unique to Pat. It applies to *any* architecture that protects self-hosted resources with an identity-aware proxy while leaving SaaS platforms to authenticate directly with the identity provider. The attacker does not need to reach the protected application. They can reach Google Drive, Slack, Notion, GitHub, and a hundred other SaaS platforms that accept the same stolen identity token.

The textbook's broader lesson: **A zero-trust architecture must account for every system that consumes the same identity, not only the systems behind the proxy.** A "SaaS Coverage Map" — identifying every platform that trusts the IDP and what data it holds — is a required dimension of any zero-trust deployment.

---

## The Trickle-Truth Non-Applicability

Trickle-Truth cannot solve Pat's problem. The reason is structural: the attacker is not interacting with a system Pat controls. They are interacting with Google Drive, which Pat cannot make serve fake data. Trickle-Truth requires the defender to own the application serving data to the attacker. For SaaS platforms, the defender is a tenant, not an operator.

This is a hard boundary on the Trickle-Truth pattern. It applies only where the defender controls the data plane. For SaaS consumption, the defense must be *preventative* (hardware keys that eliminate the credential theft vector) rather than *deceptive*.

---

## Key Takeaways

1. **Archetype D achieves the highest security-per-dollar of any non-Holy-Grail architecture. For $10/user/month, Pat stops an MFA fatigue attack with a device posture check — a defense that Fortune 500 organizations with million-dollar budgets fail to implement.**
2. **The SaaS Blind Spot is structural: identity-aware proxies protect only self-hosted resources. The attacker's stolen Google session gives them access to every SaaS platform that trusts the same IDP.**
3. **Bimodal MTTR distributions produce false confidence. Pat's average response time looks acceptable; the distribution contains a catastrophic tail.**
4. **D9 (Human Continuity) is the most universally overlooked zero-trust dimension. "Auto-Escalate to Human" is only as good as the human's availability — and "one human" means "sometimes unavailable."**

---

## Cross-References

- **Next:** [Chapter 12: Cross-Trace Synthesis — What the Four Breaches Teach](./12-cross-trace-synthesis.md)
- **Builds on:** [Chapter 5: Dimensions 1-4](../02-methodology/05-dimensions-trust-to-attestation.md), [Chapter 6: Dimensions 5-9](../02-methodology/06-dimensions-response-to-human.md)
- **Related:** [Chapter 7: Meta-Patterns](../02-methodology/07-meta-patterns.md)
- **Related:** [Chapter 16: Scaling Pat (D Hardening Path)](../04-synthesis/16-scaling-pat.md)
