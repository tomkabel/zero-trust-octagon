# 16. Scaling Pat: Hardening Archetype D in 6 Months

> **Learning Objectives**
> - Eliminate Pat as the single point of failure by adding automated fallback for clear-cut anomaly cases
> - Close the MFA fatigue attack vector with FIDO2 hardware key mandates
> - Expand the IAP's mediation to the SaaS layer using browser-level enforcement
> - Build a realistic hardening plan that fits within a solo operator's budget and time

**Prerequisites:** [Chapter 11: Archetype D — Full Attack Trace](./11-archetype-d-lean-defense.md), [Chapter 12: Cross-Trace Synthesis](./12-cross-trace-synthesis.md), [Chapter 13: Self-Assessment](./13-self-assessment.md)

---

**Starting state:** D1: Software CA | D2: Static JIT | D3: IAP/Gateway | D4: Single | D5: Auto-Escalate | D6: Push | D7: Implicit | D8: Fused (1 person) | D9: Single SPOF

**Octagon violations:** 5 of 8 (+ partial on 8). **Budget:** Minimum. **Constraint:** Pat's time and attention — not money.

This chapter is written differently from Chapters 14 and 15. The other archetypes have dedicated teams and controlled rollouts. Pat has a phone, a Slack channel, and a budget that counts in hundreds, not millions. Every recommendation must be actionable within a week and cost less than a monthly SaaS subscription.

---

## Week 1-4: Eliminate the Bus Factor

**Total cost:** $50/user one-time (hardware keys). **Time:** 1-2 hours of Pat's time total.

### D4: Single → Single + Hardware Key Mandate

The single most impactful dollar Pat can spend — and it is $50 per employee, one-time.

**What you do:**

1. Buy hardware security keys (FIDO2/WebAuthn — YubiKey or equivalent) for every employee. Total cost for 50 employees: $2,500.
2. In the identity provider admin console (Google/Okta/Entra), disable mobile-push MFA for all users. Make hardware keys the only permitted second factor.
3. Send a 5-minute Slack message: "New company policy. Password + security key is the only way to log in. Pick up your key from the server room on Monday."

**What this achieves:** MFA fatigue — the attack vector used in Chapter 11's trace — is eliminated. The attacker can have the employee's password and still cannot authenticate because they do not have physical access to the employee's hardware key. Prompt bombing is irrelevant — the key is not a push notification.

**Axioms addressed:** Axiom 4 (hardware-backed, phishing-resistant authentication — the session theft window is reduced because the credentials alone are insufficient).

### D9: Single Human → Automated Fallback

Pat cannot work 24 hours a day. But the system can.

**What you do (1 hour of Pat's time, using n8n or Zapier):**

1. Create an automation workflow that receives the IAP alert webhook.
2. Check the following conditions:
   - Source IP is from an unexpected country or hosting provider
   - Time of day is outside normal business hours
   - User's device posture check failed
3. If all three conditions are met → automatically:
   - Revoke the user's active sessions through the IDP API
   - Send a notification to the user: "Suspicious login detected. Your sessions have been reset. If you were expecting this message, contact Pat."
   - Log the event with full context.
4. If conditions are ambiguous → forward to Pat's Slack channel (the original Auto-Escalate behavior).

**What this achieves:** Clear-cut attacks (unusual IP, off-hours, failed device posture) are handled without Pat. Ambiguous cases still escalate — but Pat's alert load drops significantly.

**Axioms addressed:** Axiom 6 (the system can now act without Pat), Axiom 4 (automated re-verification on anomaly — the response does not wait for Pat's availability).

### SaaS Gap Closure: Audit Logging

**What you do (1-2 hours of Pat's time):**

1. Audit every SaaS platform that uses Google SSO. The list is longer than Pat expects. Document what data each platform holds.
2. For the top 3 most data-sensitive platforms (likely Google Workspace, Slack, and one other), enable the Business or Enterprise audit logging tier. This captures resource-level access events (file reads, message history, API calls), not just authentication events.
3. Create a simple weekly review: compare IDP authentication logs vs. SaaS platform access logs. Any user who authenticated but has no corresponding SaaS access events is anomalous.

**What this achieves:** The SaaS Blind Spot from Chapter 11 is partially closed. Pat now has visibility into *what* was accessed, not just *that* someone authenticated.

**Axioms addressed:** Axiom 2 (partial — auditable logs across the SaaS surface), Axiom 7 (partial — cross-vendor log correlation provides independent verification).

---

## Month 2-3: Observability & Automation

**Total cost:** ~$500/month (SaaS monitoring). **Time:** 2-3 hours of Pat's time.

### D5: Auto-Escalate → Automated Response for Clear Cases

The automation from Week 1 handled the most obvious cases. Now extend it.

**What you do (using the same n8n/Zapier workflow):**

1. Add additional triggers: repeated failed authentications from the same unusual IP across multiple accounts, attempts to access resources the user has never accessed, logins from a device that has never been associated with that user.
2. For each trigger, define an automated response: session revocation, password reset notification, and a blocked resource list.
3. Pat handles *only* the cases where multiple signals are contradictory (e.g., device posture fail but known home IP, or off-hours but user was in a known travel location).

**Operational target:** Pat's alert load drops by 60%. The automation handles the high-confidence, low-ambiguity cases. Pat focuses on the edge cases that require human judgment.

**Axioms addressed:** Axiom 4 (automated re-verification on anomalies), Axiom 6 (the system survives Pat's unavailability for clear-cut cases).

### D7: SaaS Dual Verification

**What you do ($500/month for a SaaS identity monitoring platform):**

Subscribe to a service that cross-references IDP authentication events with IAP access events. The service alerts when:

- A user authenticated to the IDP but the IAP has no corresponding access event for that user at that time (potential SAAS-side access that bypassed the IAP).
- A user accessed a SaaS resource from a different IP than their IDP authentication (potential session hijack).
- A user's authentication event was accepted but their known device fingerprint did not match (potential cookie theft).

Multiple vendors offer this pattern: Push Security, Obsidian Security, and similar platforms. The cost is roughly $8-12/user/month for the company's size — within Pat's budget.

**Axioms addressed:** Axiom 7 (partial — cross-vendor correlation provides provenance that a single vendor's logs cannot), Axiom 2 (independent verification of vendor log consistency).

---

## Month 4-6: The IAP Gap

**Total cost:** $3-5/user/month (browser security platform). **Time:** 2-4 hours of Pat's time.

### D3: IAP → IAP + Browser Enforcement

Closing the SaaS Blind Spot requires enforcement past the IAP boundary. The browser is the new enforcement point.

**What you do:**

Deploy a company-managed browser extension that enforces access policies on all SaaS platforms, not just those behind the IAP. The extension:

- Intercepts requests to SaaS platforms (Google Drive, Slack, GitHub, etc.).
- Checks the user's device posture and authentication state before allowing the request.
- Routes SaaS traffic through verification transparently.
- Logs access events for platforms that do not provide native audit logging.

Multiple vendors offer this pattern: Island, Talon, or similar enterprise browser platforms. For a 50-person company, the cost is roughly $150-250/month.

**Axioms addressed:** Axiom 3 (SaaS platforms no longer bypass mediation — the browser extension closes the gap between the IAP and the SaaS surface).

### Hardware Key Exception Management

As the organization grows, Pat will encounter situations where hardware keys are difficult (contractors, shared kiosks, legacy systems). Define a formal exception process:

1. Exceptions require documented justification and a specific expiration date.
2. Excepted accounts receive additional monitoring — every session is flagged for Pat's review.
3. The exception list is reviewed monthly. Exceptions that have passed their expiration are automatically re-enabled for hardware key enforcement.

---

## Beyond 6 Months: The Pat Ceiling

Archetype D can reach C-level maturity (~6/8 Octagon) on $3K-$7K/month. But D cannot reach A without more people. The bottleneck becomes Pat.

**When to hire a second person:**

- When Pat's alert load (after automation) consistently exceeds 30 minutes per day — Pat should spend 30 minutes reviewing security alerts, not hours.
- When Pat misses a critical alert — once the tail risk becomes a real incident.
- When Pat takes more than 2 consecutive vacation days — the system will be un-monitored for that period.

**Budget for the hire:** $100K-$130K/year (generalist security/IT engineer). This doubles Pat's capability and eliminates the last structural risk: D9 becomes "Small Rotation" instead of "Single SPOF."

---

## End State (6-12 Months)

- **Octagon:** 5 of 8 axioms satisfied (Axioms 6, 7, 8 remain partial — full Byzantine fault tolerance, cryptographic provenance, and bilateral symmetry require infrastructure no solo operator can afford).
- **Total monthly cost:** $3K-$7K/month (including monitoring tools, browser enforcement, and amortized hardware key cost).
- **Pat's alert load:** Reduced by ~60%. Pat focuses on edge cases, not every alert.
- **Attack surface closed:** MFA fatigue eliminated. SaaS blind spot partially closed. Automated fallback removes Pat from the critical path for clear-cut attacks.

---

## Gate Checks

**Gate 1 (Week 4):** After hardware key mandate, measure whether any employee had MFA fatigue incidents in the preceding month. Baseline should be zero going forward.

**Gate 2 (Month 2):** Measure what percentage of alerts the automation handles without Pat. If <40% of clear-cut cases are automated, the trigger conditions are too conservative. Tune the thresholds — be more aggressive in auto-revoking for obviously anomalous scenarios.

**Gate 3 (Month 6):** If after browser enforcement deployment, Pat's alert load has not dropped below 30 minutes per day, the SaaS surface is too fragmented for the current tooling. Pivot: reduce SaaS footprint. Migrate from many point-solution SaaS vendors to fewer, higher-quality platforms that all support the same security telemetry pipeline. This is a business decision, not a security one — but it is the correct path.

---

## Key Takeaways

1. **FIDO2 hardware keys ($50/user, one-time) close the MFA fatigue attack vector completely. This is the single best dollar any organization can spend on zero-trust.**
2. **Automated fallback for clear-cut cases removes Pat from the critical path for the most common attack patterns, reducing MTTR from "whenever Pat wakes up" to "instant."**
3. **The browser is the new enforcement boundary for SaaS. An identity-aware proxy cannot mediate what it cannot see; the browser extension closes the gap for ~$3-5/user/month.**
4. **Archetype D can reach C-level maturity (6/8 Octagon) on $3K-$7K/month — but cannot reach A without hiring a second person. The Pat Ceiling is real.**

---

## Cross-References

- **Next:** [Chapter 17: The Aspirant's Gate — When the Path Breaks](./17-the-aspirants-gate.md)
- **Builds on:** [Chapter 11: Archetype D — Full Attack Trace](./11-archetype-d-lean-defense.md)
- **Related:** [Chapter 13: Self-Assessment](./13-self-assessment.md)
- **Related:** [Chapter 18: Decision Matrix and Conclusion](./18-decision-matrix-and-conclusion.md)
