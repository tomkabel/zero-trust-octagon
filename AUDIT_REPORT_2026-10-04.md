# Whole-Repository Quality Audit

**Date:** 2026-10-04
**Scope:** every tracked text file: `docs/` (chapters 00–19, appendices A–G, 16 engineering specs), `src/` (code and tests), root status docs, `research/`
**Method:** 8 parallel read-only audits, one per area, each checking cross-chapter consistency. Facts were checked against primary standards (FIPS 203/204/205, NIST SP 800-207, CISA ZTMM v2.0, the W3C WebAuthn spec, OpenID SSF/CAEP, the EU AI Act, the Cyber Resilience Act, NIS2), installed library type definitions, and the source books.
**Test run:** `npx vitest run` passes all 89 tests in 8 files. **This proves little:** the WebAuthn server tests mock an API shape that the installed `@simplewebauthn/server` 14.0.1 no longer uses (see C-1), and three logger mocks never take effect.

**Categories:** 1 Factual error · 2 Logical inconsistency · 3 Misattribution/misreference · 4 Conceptual error · 5 Low-quality generated text · 6 Nonsensical passage

About 320 findings in total. This report lists every Critical and High finding individually, groups the Medium and Low ones by area, and opens with the problems that run through the whole repo, because fixing those once resolves dozens of individual findings.

Items marked **[verify]** are ones the auditor was not fully certain about. Check them against the primary source before editing.

---

## 0. Problems that run through the whole repo (fix these first)

| # | Theme | Where | Problem | Fix |
|---|---|---|---|---|
| X1 | Archetype scores disagree everywhere | ch3:135, ch10:114, ch12:105-110, ch16:165/179, App. D:63 | Recounting ch3's own colour grid gives B = 6.5 and C = 6.0 violations, not the stated 6 and 5.5. Ch12 ranks D (3/8) above C (3.5/8) while saying the ranking "aligns with Octagon satisfaction". Ch10 says "four axioms violated" but lists five. Ch16 puts C at both ~6/8 and 5/8. App. D gives B as "2/6". | Recompute one integer score per archetype and use it everywhere. Define "half an axiom" or drop it. |
| X2 | Trickle-Truth false positives | ch4:110, ch6:55/208-210/452, ch7:123, ch12:122, App. C | Throughout, a false positive is treated as "the attacker gets fake data". A false positive is a **legitimate user**, who would get synthetic data. "Business impact: None / Who pays: Attacker" is therefore wrong. | Add a false-positive cost analysis and a recovery/rollback path. |
| X3 | "Byzantine fault tolerance" misused | ch2:106, ch4:95/137/168, ch5:171, ch7:196, ch14:198, research/threat-crypto | Three observers under "Byzantine consensus" tolerate **f = 0** faults (Byzantine consensus needs n ≥ 3f+1). What is described is 2-of-3 voting. A single point of failure is an availability fault, not a Byzantine one. Kleppmann's DDIA explicitly assumes non-Byzantine faults; Paxos and Raft handle crash faults only. Remediation Plan item 2.5 is still open. | State n and f. Call it "majority voting / triple modular redundancy". Cite Castro & Liskov (PBFT). |
| X4 | Impossible propagation latency | ch1:89, ch4:123, ch6:136/261, ch7:247, ch8:26/95/166, App. C:82 | Global policy propagation is claimed at "3 ms", "sub-10 ms", "<50 ms" and "sub-millisecond" in different places. Light in fibre needs ~35–100 ms one way between continents. | Use one figure and scope it to "regional / in-cluster". |
| X5 | Engineering docs don't match `src/` | anti-relay, nfc-relay, webauthn-client, webauthn-server, enrollment, redis-challenge, siem, soar | The docs call themselves the "canonical source", yet their class names, method names (`storeChallenge` vs `issueChallenge`, etc.), thresholds (25 ms vs 40 ms), env vars (`REDIS_PASSWORD` vs `REDIS_SECURITY_PASSWORD`) and logger argument order (pino `(obj,msg)` vs `src` `(msg,ctx)`) all differ from the code. | Regenerate the snippets from `src/`, or label them "illustrative sketch". |
| X6 | Invalid RP ID / origin pair | `src/webauthn-server/...:54-55`, `src/webauthn-client/...:105`, `src/enrollment/...:76`, compliance-appendices:153, enrollment, identity-fabric | RP ID `internal.enterprise.eu` paired with origin `https://enterprise.eu`. The RP ID must be the origin's domain or a parent of it, so browsers will reject every `create()`/`get()`. | Use RP ID `enterprise.eu`, or origin `https://internal.enterprise.eu`. |
| X7 | "Active-active Redis" | multi-region-redis:6-8/15/28/83-87/164-165, terraform:80-117/233-245 | Open-source `redis:7.2` with `replicaof` gives one primary and read-only replicas. CRDT active-active is Redis Enterprise only. ElastiCache Global Datastore has a single primary region. The partition behaviour, last-write-wins merge and chaos tests described in these docs all rest on a capability this setup does not have. | Redesign as primary/replica with Sentinel, or state that Redis Enterprise is required. |
| X8 | Revocation keys don't line up | caep:92, multi-region-redis:127, soar:67, `src/zta-redis/...:55-61` | `revoked:session:` is keyed by token ID in one doc, user ID in another and session ID in a third, and no code ever reads the key. Revocation silently does nothing. | Pick one subject (an `sid` claim), use it in every doc, and add an `isRevoked` check on the request path. |
| X9 | Synced passkeys treated as device-bound | webauthn-client:167, identity-fabric:67, enrollment:287, `src` | `residentKey: required` on Apple/Google platform authenticators creates **synced** passkeys (backup flags BE/BS set). The docs call them "non-exportable / locked to this machine". The server never checks `credentialDeviceType`. | Explain BE/BS and enforce `single_device` where device binding is required. |
| X10 | Wrong CAEP/SSF standards body and identifiers | App. C:36, ch19:210-212, caep:135-158, identity-fabric:101, `src/identity-fabric/IdentityFabric.ts:126-157` | Described as an "IETF draft" and expanded as "Continuous Access Evaluation *Protocol*". CAEP is an OpenID Foundation **Profile**, and SSF and CAEP 1.0 became Final in 2025. The event types used are invented (`tenant.identity.device_compromised`) instead of real URIs such as `https://schemas.openid.net/secevent/caep/event-type/session-revoked`. RFC 9493 is cited for SETs; the right one is RFC 8417. | Correct the standards body, name, status and event URIs. |
| X11 | Smart-ID "suspension" | soar:18/97-107, auditor-topology:118 | An enterprise relying party cannot suspend a citizen's Smart-ID account. Doing so would also lock the user out of banks and government services, and would break the recovery path, which uses Smart-ID. | Lock the enterprise account and its credentials instead. Make escalation to SK ID Solutions a manual step. |
| X12 | Dangling citation keys | ch9:134, ch10:144/164, ch19 `[TR-§3]` and `[↗]`, App. A `[DR-§2.3]` `[TR-§3.1.4]`, App. E `[DR-§1.1]`, ch3:183 `[DR-§1]`, ch6:298/409 "ISMS analysis §2.1" | None of these keys resolve to a reference anywhere in the repo. | Add a references appendix, or replace the keys with real citations. |
| X13 | Broken anchors | ch3:96/107, App. B:96, ch18:63, and glossary links in ch2/3/4/5/6 (`#trickle-truth`, `#heterogeneous-triple`, `#byzantine-fault-tolerance-bft`, `#merkle-attested-telemetry`, `#data-diode`, `#event-streamed-pub-sub-policy`, `#morphological-matrix`, `#epistemic-integrity`, `#behavioral-attestation`) | VitePress keeps the "—" in heading slugs, and the glossary has no `<a id>` for these terms. | Add `{#id}` to the headings and `<a id>` tags in the glossary. |
| X14 | Root status docs overstate completion | REMEDIATION_PLAN:331-358, IMPLEMENTATION_COMPLETE:118-122/4/228/254, SESSION_SUMMARY:67/146-151 | All success criteria are ticked, but the glossary is untouched, no validation report exists, and the BFT and supply-chain items are still open. The docs say "Removed APT names", yet ch10:168 still has "Sapphire Sleet". The commit hashes quoted don't exist (the real ones are e5e2d73, d379244, 9eeb80b, 398ef9e). Issue counts differ between documents (12 vs 8). | Correct the status, or move these files to an archive. |

---

## 1. Critical and High findings by area

### 1.1 Foundations & Methodology ch. 1–5 (`docs/01-foundations/`, `docs/02-methodology/04-05`)

| Location | Cat | Sev | Finding | Fix |
|---|---|---|---|---|
| 03-octagon-as-instrument.md:135 | 2 | Critical | The violation totals don't match the colours in the same table (see X1). | Recount. |
| 00-preface.md:48 | 1/2 | High | Says EO 14028 "created" the ecosystem behind NIST SP 800-207. SP 800-207 (Aug 2020) came out 9 months **before** the EO (May 2021). The ZT plan requirement is §3(b)(ii), not §3(c). | Say "built on", and fix the section number. |
| 01-the-case-for-zero-trust.md:30 | 1/3 | High | Wrong §3(c) citation. DoD "Capability 1.1" is User Inventory, not segmentation. The Reference Architecture is conflated with the Strategy/Roadmap. The "VPN-less mandate" is unverified. | Correct all three; source or soften the VPN-less claim. |
| 01-the-case-for-zero-trust.md:44 | 3 | High | The "five assertions" are credited to SP 800-207. They are Gilman & Barth's (*Zero Trust Networks*, 2017); SP 800-207 §2.1 has **seven tenets**. | Re-attribute. |
| 02-the-octagon.md:181/209 vs 01:116 | 2 | High | The eight axioms are called "collectively sufficient", yet Axioms 9–13 "must be satisfied". | Call 9–13 candidate axioms, or qualify "sufficient". |
| 02-the-octagon.md:211 vs 03:187/198 | 2 | High | Ch2 says Axioms 7 & 8 are the most violated; ch3 says 7 & 4 (its own data shows 4, 6 and 7). | Align the two chapters. |
| 05-dimensions:46 vs :88, 03:103 | 2 | High | Axiom 7 is said to require a silicon trust anchor "at minimum", but elsewhere any cryptographic provenance is accepted. | Pick one rule. |
| 04-morphological-matrix.md:32/82, 05:179 | 2 | High | Says "exactly one value per dimension", but D3 is described as layered and D1 Hybrid is a mixture. "Independent dimensions" contradicts the chapter's own "Independence Fallacy" section. | Allow multi-valued dimensions. |
| 05-dimensions:106/114 | 3 | High | The policy decision/enforcement components are cited to SP 800-207 §3.3, which is the Trust Algorithm. They are defined in the §3 introduction. | Cite §3. |
| X3, X13 | | High | See the cross-cutting table. | |

### 1.2 Methodology ch. 6–7

| Location | Cat | Sev | Finding | Fix |
|---|---|---|---|---|
| 07-meta-patterns.md:123; 06:210/452 | 4/2 | Critical | False positives are said to feed the attacker (see X2). | |
| 06-dimensions-response-to-human.md:55/208/452 | 2 | High | Hard Deny is blamed for data taken *before* detection, which is equally lost under every response type. The text also admits real data can leak after grafting (:77, :140). | Say "no *post-detection* loss", and use the same pre-detection loss in both columns. |
| 06:209 | 2 | High | "Attacker learns they were detected: Never" is contradicted at :165, :200 and :158. | Say "no protocol-level signal". |
| 07:108/159 | 4/2 | High | Trickle-Truth is called "prevention" and "MTTD barely matters". It only starts after detection, so leakage is bounded by MTTD. | Fix the framing. |
| 06:110/114 | 4/2 | High | Per-identity synthetic universes: different content for the same record ID across accounts is itself a giveaway. :114 contradicts this. | Give each attacker campaign its own universe instead. |
| 07:182 vs :332 | 2 | High | "D9 is not governed by any axiom" vs "every dimension is governed". | Say D1–D8 are governed. |
| 07:221 vs :188, ch4:178 | 2 | High | Says "ZTMM V&A Optimal ⇒ Axiom 7 satisfied", which contradicts the stated orthogonality. | Make it a one-way cap, or remove it. |
| 06:219/229-245 vs 07:50 | 2/3 | High | The ranking is said to derive from ch4 dimensional analysis (which doesn't exist) and, in ch7, from attack traces. "Uniformly" is circular, and the text calls it an "architectural proof". | Pick one origin and drop the "proof" claim. |
| 06:177 | 1/3 | High | DARPA Plan X was an offensive cyber-operations planning program, not deception research. The Cyber Grand Challenge was about automated vulnerability finding and patching. | Remove the attribution. |
| 07:238 | 3 | High | A partition-default requirement is attributed to SP 800-207A, which contains no such requirement **[verify]**. | Cite the section or remove. |
| 06:298/409 | 3 | High | "ISMS analysis §2.1" does not exist. | Cite a real source. |
| 06:380-383 | 2/1 | High | Headcount is mixed up with concurrent availability. "Three people → 24/7 guaranteed" is false: a single 24/7 seat needs about 5–6 FTE. | Fix the bands and align them with ch4. |

### 1.3 Archetypes ch. 8–12

| Location | Cat | Sev | Finding | Fix |
|---|---|---|---|---|
| 12-cross-trace-synthesis.md:105-110 | 2 | Critical | The ranking contradicts the scores (see X1). | |
| 12:112 vs :34 | 2 | Critical | "B spends more than A" contradicts the cost table in the same chapter. | Rewrite. |
| 12:31 | 2/3 | High | Archetype A's threat vector is given as "Silicon supply chain"; the ch8 trace is phishing plus token theft. | Fix. |
| 08:85-98 vs :114 | 2 | High | Detection at T+47s, graft at T+131s: an 84-second window of real access, yet "Real data exposed: Zero". | Acknowledge the window. |
| 08:56 vs :92-95 | 4 | High | A data diode cannot carry the consensus verdict back to the PDP. | Add an attested return channel. |
| 08:97 | 2/6 | High | "T+250ms" appears after T+131s, so the timeline runs backwards. | Use T+131.25s. |
| 08:95 vs :26/:166 | 1/2 | High | "3 ms globally" contradicts the chapter's own "sub-10 ms" and "~50 ms" (see X4). | |
| 08:79/82 vs :109 | 2 | High | The entry vector is phishing in one place and MFA fatigue in another. A stolen token does not pass step-up authentication. | Pick one vector. |
| 08:92, 12:122 | 4 | High | At 87% confidence, about 13% of grafted sessions are legitimate users; this cost is ignored. | |
| 11:190 vs :57-67 | 2 | High | Says posture "stops" the MFA-fatigue attack; the trace shows the attacker kept access to SaaS. | Fix. |
| 11:29 | 2 | High | Recommends migrating to B, the archetype the book rates worst. | Recommend A-pattern controls or C instead. |
| 09:56 vs :101 | 2 | High | The attack passes a "business hours" check, then a page fires at 3:00 AM 19 minutes later. | Fix the times. |
| 09:58/43 vs :88 | 2 | High | The attacker is on the corporate VPN, yet the tripwire fires on an "unrecognized ASN". | |
| 09:115 | 2 | High | The vector is described as "phishing", but ch9 uses an infostealer. The backdoor step is missing from the timeline. | |
| 09:134 | 1/3 | High | The 45–55% credential figure and Fortune-500 dwell times don't match DBIR 2025 (~22%) or M-Trends 2025 **[verify]**. Storm-2949 is unverifiable. | Cite the actual figures. |
| 10:148 | 1/4 | High | SolarWinds SUNSPOT injected code **before** signing, not after. | Fix. |
| 10:169 | 1/3 | High | The axios→Vercel link is likely wrong; the Vercel incident is attributed to a third-party AI-tool compromise **[verify]**. | Remove unless sourced. |
| 10:39 | 4 | High | npm postinstall scripts run at install time (on laptops and CI), not dormant until production. | Fix the mechanism. |
| 12:151 | 4 | High | A "product of dollar losses" is dimensionally meaningless and contradicts :153. | Describe the interaction qualitatively. |
| 10:159 | 1 | High | "s1ngularity" was the campaign name; the compromised packages were `nx`. | Fix. |

### 1.4 Synthesis ch. 13–19

| Location | Cat | Sev | Finding | Fix |
|---|---|---|---|---|
| 18-decision-matrix:131/133/150 | 1 | Critical | Wrong sizes: ML-DSA-65 signatures are **3,309 B** (not 3,465) and SLH-DSA-SHAKE-256s signatures **29,792 B** (not 9,152). The derived figures (92 MB/s, 140×, "2–3×") are therefore wrong, and the two are not at comparable security categories. | Recompute at matching categories. |
| 18:122 | 1 | High | ML-KEM-768 is category 3 (≈AES-192), not 128-bit. | Fix. |
| 18:137 | 1/4 | High | Signature size is confused with key size (SLH-DSA-256s public key = 64 B). | Fix. |
| 18:159 | 1 | High | CNSA 2.0 does not require PQC for new NSS acquisitions in 2025; that requirement starts 1 Jan **2027**. | Fix. |
| 18:101 vs :165 | 2 | High | The CRQC date of "2028–2032" contradicts "2030 is before any credible CRQC". | Use one sourced estimate. |
| 18:165 vs :103/161/172 | 2 | High | "Transitions are sequential" contradicts "parallel" and "immediately" elsewhere in the chapter. | Rewrite. |
| 14-enterprise-turnaround:74 (+18:161/165/205) | 1 | High | The DoD FY2027 goal is **target-level** ZT, not full ZTA. The COA descriptions are wrong. | Fix in all four places. |
| 14:80 | 1/2 | High | The strategy was published Nov 2022 with an FY2027 deadline, a window of about 5 years, not 3. | Fix. |
| 14:168-209, :236-238 | 2 | High | Quarters 5–8 already are Year 2. The Q8 gate cannot block Year 2. The NSA table gives a third schedule. | Renumber into one timeline. |
| 14:224, 17:45/127 | 2/6 | High | A false-positive gate of "≤80%" passes systems where 4 in 5 alerts are false. The following sentence doesn't parse. | Set a realistic precision threshold. |
| 14:48 vs :50 | 2 | High | The proposed resolution recommends the ordering that the previous paragraph says fails. | Make them consistent. |
| 14:249 | 2 | High | Going from 2/8 to 8/8 is 4×, not "2×". The $9.5–15M cost can't be funded from a $2–5M/yr budget. | Recompute. |
| 17-aspirants-gate:71-81, 15:149 | 4/6 | High | Confidential containers do not stop supply-chain injection (the malicious code runs inside the TEE). Nitro Enclaves are not "confidential containers". Ch15 names this pivot but never describes it. | Rework the pivot. |
| 18:26 | 2 | High | The matrix says "start with D4", violating the book's core "D5 before D4" rule. | Pair D4 with D5. |
| 16-scaling-pat:41 vs :56 | 2 | High | Identity is rated "Advanced (phishing-resistant)", but the starting state uses mobile-push MFA. | Fix. |
| 16:165/213 vs :179, ch12 | 2 | High | The end state is ~6/8 in one place and 5/8 in another. | Make consistent. |
| 16:25 vs :165/180, 13:159 | 2 | High | The "hundreds" budget is contradicted by $36–84K/yr plus a hire. The line items don't add up. | Reconcile. |
| 19-identity-root-proof-gate:210/212 | 1 | High | CAEP is called an IETF draft (see X10). | |
| 13-self-assessment:191-192 | 3 | High | The question→dimension labels are shifted (Q1 should map to D1, Q2 to D2). | Fix. |
| 13:55-60 | 6 | High | Q1 options B, C and D are all "Same as A", and the note contradicts option A. | Rewrite the question. |
| 13:206 vs :219/262 | 2 | High | "Mostly A ⇒ Archetype A" vs "A is not a possible diagnosis". | Define one rule. |
| 13:27/29 | 2 | High | From 57% and 69%, the only valid inference is an overlap of ≥26%. Independence would predict about 39%, so the inference is invalid. | Remove it, or cite conditional data. |

### 1.5 Appendices A–G

| Location | Cat | Sev | Finding | Fix |
|---|---|---|---|---|
| appendix-a:18/74 | 1/4 | Critical | Says Shor "halves" RSA-2048 to 512-bit. Shor breaks RSA **completely**, and 2048 → 512 is a quarter anyway. | Say "completely broken". |
| appendix-c:151 | 1/3 | Critical | SP 800-207 (2020, ZTA) and 800-207A (2023, cloud-native access control) are merged into one entry. PIP is not an 800-207 component. | Split into two entries. |
| appendix-a:47 | 4 | Critical | Says FIPS 140-3 "mandates classical algorithms". It doesn't: ML-KEM and ML-DSA can be validated under it. The "compliance deadlock" argument collapses. | Reframe as a validation-backlog risk. |
| appendix-a:62/32 | 1 | Critical | "No FIPS 140-3 PQC module as of May 2026". CAVP ML-KEM/ML-DSA certificates exist from late 2024, and AWS-LC FIPS 3.0 was validated with ML-KEM in 2025 **[verify]**. | Check the CMVP database. |
| appendix-a:31-39 | 1 | Critical | The CNSA 2.0 "Phase 1–4" timeline is invented. Official prefer/exclusive dates: browsers and cloud 2025/2033, networking 2026/2030, OS 2027/2033. CNSA applies to NSS only. | Replace with the official table. |
| appendix-a (whole) | 4 | Critical | "Harvest now, decrypt later" is never mentioned, so the key-exchange priority is wrong. | Add HNDL and rank hybrid key exchange first. |
| appendix-a:225-240 | 4 | Critical | "Accept either signature" during the hybrid period is a downgrade attack. | Require both signatures (AND). |
| appendix-e:33-36/60-63 | 1 | Critical | These ZTMM v2.0 function names are not CISA's. Real Identity functions: Authentication, Identity Stores, Risk Assessments, Access Management. The Applications & Workloads list is also wrong, and Networks is missing Traffic Management. | Use CISA's names verbatim. |
| appendix-e:31-85 | 4/3 | High | Stage-cell text is the author's paraphrase presented as CISA's. "VLAN = micro-segmentation" is wrong. | Label it as interpretation. |
| appendix-e:105-112 vs :23 | 2 | High | "Axiom violated ⇒ Traditional/Initial" contradicts :23. | Use "at most stage X". |
| appendix-e:42-45 vs ch4:174-176 | 2 | High | All four Devices→dimension mappings differ from ch4. | Use one mapping. |
| appendix-a:265-266 vs :20 | 2 | High | TPM quotes use ECDSA P-256, the same hardness assumption as P-256 ECDHE, so the two can't be broken 3–4 years apart. The dates also conflict with :20. | Merge the rows and cite a source. |
| appendix-a:124/154/164 | 2 | High | Axioms 1, 4 and 5 are marked "Resists quantum", yet they depend on signatures the appendix says are forgeable. | Qualify. |
| appendix-a:53/60 | 1 | High | Says "4–10× larger". Real ratios: ML-DSA-44 signature ~38×, ML-KEM-768 ~37×, SLH-DSA >100×. | Fix. |
| appendix-a:156/251 vs :286 | 4/2 | High | TPMs do not attest keystroke origin. "No new hardware" contradicts the earlier sections. | Rewrite. |
| appendix-a:100/104/106 | 1/4/5 | High | The uncited "Mexico breach / Claude SCADA" story is called "canonical". Reconnaissance is not an attack on behavioral attestation. D4 is misnamed. | Cite or soften. |
| appendix-c:40 | 1 | High | CBOM is a cryptographic-asset inventory (CycloneDX), not golden boot measurements. | Fix the definition. |
| appendix-a:49 | 3/1 | High | EUCC is a certification scheme, not a crypto authority. UK NCSC endorses the same NIST algorithms. | Fix. |
| appendix-a:28 | 1 | High | Missing: HQC (selected Mar 2025), FN-DSA/FIPS 206 (draft), SP 800-208 LMS/XMSS. SLH-DSA is not in CNSA 2.0. | Add these. |
| appendix-a:36-37 | 1 | High | NIST IR 8547 is still a draft: 112-bit RSA/ECC deprecated after 2030, all quantum-vulnerable algorithms disallowed after 2035. | Fix. |

### 1.6 Engineering docs: identity, WebAuthn, relay

| Location | Cat | Sev | Finding | Fix |
|---|---|---|---|---|
| X6 | 1 | Critical | Invalid RP ID / origin pair. | |
| anti-relay-cryptographic-channel-binding.md:77-155 | 1 | Critical | The documented class has no relation to `src/channel-binding/SoTAAntiRelayValidator.ts`. | Rewrite. |
| anti-relay:147-154 | 4 | Critical | `verifyIdCardSignature() { return true; }` is presented as a working implementation. | Mark it as a stub. |
| anti-relay:36-37 | 4 | Critical | Says relay attackers "cannot decrypt". A relay forwards ciphertext without decrypting, so ECDH gives no relay resistance. | Explain distance bounding instead. |
| anti-relay:34-36 | 1 | High | Web NFC is Android Chrome only, NDEF only, with no APDU access, so it can't read an eID card from a workstation. | Specify PC/SC middleware. |
| anti-relay:43 | 4 | High | clientDataHash is SHA-256 of clientDataJSON, which the browser builds; it is not a hash of the options. The scheme is circular. | Bind to the server challenge. |
| anti-relay:55-58, nfc-relay:53 | 4 | High | An Envoy RTT check is not distance bounding. ISO 14443 frame waiting time can reach about 5 s. | Reframe as a heuristic. |
| nfc-relay-threat-defense.md:84-95 | 4 | High | Subtracts a client timestamp from the server's `performance.now()`; there is no shared clock. | Remove. |
| nfc-relay:72-112; webauthn-client:45-160; webauthn-server:57-61; enrollment:47-160 | 1 | High | Docs don't match `src/` (see X5). | |
| enrollment:95/131-140, nfc:98-102, index:91 | 1 | High | Logger called with pino argument order. | |
| enrollment:73/83 + `src` | 4 | High | `user.id` contains the national ID code; WebAuthn says it must not contain PII. | Use a random handle. |
| enrollment:75-76/106-112 + `src` | 2 | High | The challenge is not bound to the user or session at finalize. | Bind it server-side. |
| webauthn-client:167, identity-fabric:67, enrollment:287 | 4 | High | Synced passkeys (see X9). | |
| webauthn-client:85/169, identity-fabric:63 | 4 | High | The AAGUID is present without enterprise attestation. Enterprise attestation requires a pre-provisioned RP ID. Platform authenticators return `none`. | Separate the two concepts. |
| enrollment:117-121 | 2 | High | Apple passkeys are listed as approved but would fail the zero-AAGUID check. The listed AAGUIDs are placeholders. | Fix. |
| zero-trust-identity-blueprint.md:22-30 | 4 | High | Says the authenticator "asserts the origin". It sees only the rpId and clientDataHash. | Fix the diagram. |
| auditor-topology-schematics.md:93 | 4 | High | `userVerification:"required"` is just an RP request option. The evidence is the UV flag in authenticatorData. | Fix. |
| blueprint:76 vs identity-fabric:52-54 | 2 | High | Classic Smart-ID is rated "High" phishing resistance, yet it is relayable. | Downgrade. |
| identity-fabric:120 vs `src/IdentityFabric.ts:98-100` | 2 | High | "Never let AI block" contradicts `routeSession` returning `'block'`. | Align. |
| identity-fabric:101 | 1/3 | High | Invented SSF event type (see X10). | |
| auditor-topology:118 | 4 | High | Smart-ID suspension (see X11). | |
| identity-fabric:116 | 1 | High | Misstates AI Act Art. 5(1)(f) (emotion recognition at work) and 5(1)(g) (categorization by race, politics, union membership, religion, sex life). Gender and medical status are not in (g). | Quote accurately. |

### 1.7 Engineering docs: infrastructure, SIEM, SOAR, compliance

| Location | Cat | Sev | Finding | Fix |
|---|---|---|---|---|
| multi-region-redis:6-8/15/28/83-87/164/165 | 1/4 | Critical | Active-active Redis (see X7). | |
| terraform:80-117 | 1 | Critical | ElastiCache Global Datastore is not active-active. | |
| terraform:55/69 | 1 | Critical | `enable_key_rotation` on an asymmetric SIGN_VERIFY key makes `terraform apply` fail. | Remove it. |
| terraform:233-245 | 2/4 | Critical | Writes to a read-only replica. The LWW assertion is trivially true. | Rewrite the test. |
| terraform:142-169/270 | 2 | Critical | The chaos experiments target Kubernetes pods, the tests hit Docker IPs, and Terraform builds ElastiCache: three different environments. | Use one environment. |
| siem-logging-pipeline.md:160/197 | 2 | Critical | `stats BY src_ip` but no event carries `src_ip`, so the P1 replay rule never fires. | Add the field, or `fillnull`. |
| soar:175-180 + siem:205-207 | 2/1 | Critical | The Splunk webhook sends no auth header, `.conf` files don't expand `${ENV}`, and the payload shape doesn't match. Every alert gets a 401. | Use a custom alert action or HMAC. |
| X8 | 2 | Critical | Revocation key mismatch. | |
| caep:146 | 3 | High | `"https://openid.net"` is not a CAEP event URI. | Use the `device-compliance-change` URI. |
| caep:135/147-158 | 3/1 | High | Wrong RFC (9493 vs 8417). The subject should be in top-level `sub_id`; `reason` should be `reason_admin`/`reason_user`. | Rebuild from SSF 1.0. |
| caep:6/17 | 4 | High | SSF is delivered over HTTP push/poll (RFC 8935/8936), not gRPC. | Retitle. |
| caep:34-47 | 6 | High | Unused Go imports, so the code doesn't compile. There's no `main`. | Fix. |
| compliance-audit-appendices:153-154 | 1 | High | Invalid RP ID (see X6). | |
| redis-challenge:187 (+k8s:58, multi-region:50) | 1 | High | `volatile-ttl` can evict revocation keys, which un-revokes those sessions. | Use `noeviction`. |
| redis-challenge:11/62-138 | 1 | High | Doc doesn't match `src` (see X5). | |
| k8s:142 | 2 | High | Env var name mismatch, so the pod crashes at startup. | |
| redis-challenge:78, k8s:271 | 6 | High | A base64 password inside a `redis://` URL breaks URL parsing. | Pass it separately. |
| siem:202/219/236 | 1 | High | Splunk `alert.severity = 1` means debug, not critical. | Use 6 (fatal) or 5 (severe). |
| siem:174-176/214 | 6/2 | High | Neither the PPL nor the SPL parses. The query also counts per user, so a mass revocation goes undetected. | Fix the queries. |
| siem:11/62-101 | 1 | High | The doc describes a Pino logger; `src` doesn't use Pino. | Sync. |
| soar:84-86/126-128 | 1 | High | The `error` field shape is wrong, so the failure reason is lost. | Fix. |
| siem:15/22-30 | 2/1 | High | Claims KMS log signing, but the Fluent Bit config has no signing step. | Add it or drop the claim. |
| soar:18/97-107 | 1/4 | High | Smart-ID suspension (see X11). | |
| soar:183 | 4 | High | A shared Redis client is disconnected after each alert. | Use one long-lived client. |
| soar:8/195, compliance:53-56 | 2 | High | "Sub-second / <300 ms" claims, against a 1-minute cron plus async replication. | Give realistic bounds. |

### 1.8 Code (`src/`), root docs, research

| Location | Cat | Sev | Finding | Fix |
|---|---|---|---|---|
| src/webauthn-server/EnterpriseWebAuthnServerValidator.ts:89-92 | 4 | Critical | `@simplewebauthn/server` v14 returns `registrationInfo.credential.{id,publicKey,counter}` and `aaguid` as a string. The code reads the old v9 shape, so every real registration is rejected as "anonymized". | Use the v14 shape. |
| .../__tests__/EnterpriseWebAuthnServerValidator.test.ts:46-95 | 4 | Critical | The mocks use the v9 shape, which hides the failure above. | Mock v14, and add one test against the real library. |
| src/enrollment/ZtaEnrollmentOrchestrator.ts:145-157, src/identity-fabric/IdentityFabric.ts:40-55 | 4 | Critical | Unsigned JSON is accepted as an "eIDAS High LoA" credential. | Verify signatures, or label it a stub. |
| ZtaEnrollmentOrchestrator.ts:99-143 | 4 | Critical | Any outstanding challenge can finalize any enrollment. | Bind the challenge to the session. |
| ZtaEnrollmentOrchestrator.ts:118-127 | 2 | High | The challenge is consumed twice when the real validator is injected, so every enrollment fails. | Consume it once. |
| ZtaEnrollmentOrchestrator.ts:70/95/103/141 | 4 | High | Redis connects and disconnects per request; concurrent requests break each other. | Connect at startup. |
| src/channel-binding/SoTAAntiRelayValidator.ts:16-103 | 4 | High | Not channel binding (not tied to TLS). Uses `!==` instead of constant-time comparison. Replayable for 5 minutes. Logs hash prefixes. | Use a TLS exporter and `timingSafeEqual`, consume on use, stop logging. |
| 3 test files: `vi.mock('../zta-siem/ztaLogger')` | 4 | High | The path resolves from `__tests__/`, so the mocks never apply. | Use `'../../zta-siem/ztaLogger'`. |
| src/zta-redis/ZtaRedisPipelineManager.ts:55-61 | 4 | High | Revocation is written but never read (see X8). | |
| IdentityFabric.ts:75-95 | 4 | High | No signals means risk 0 (fails open). Averaging dilutes a critical signal. | Fail closed and use max. |
| IdentityFabric.ts:43 | 4 | High | A "high" assurance level is rejected when "substantial" is required. | Compare by order. |
| IdentityFabric.ts:126-157/149 | 3/4 | High | Invented CAEP events. `revoke_all` revokes one session. A risk value is written into `trustScore`. | Fix all three. |
| ZtaEnrollmentOrchestrator.ts:68/78/88-91 | 4 | High | The national ID ends up in `user.id` and in logs. | Use an opaque handle. |
| src/zta-siem/ztaLogger.ts:20/45-53 | 4 | High | Context can overwrite `level`, `timestamp` and tags (log forgery). Challenges are written to logs. | Nest the context and redact challenges. |
| src/nfc-defense/AntiRelayEnrollmentEngine.ts:14-29 | 4 | High | A 40 ms software round-trip time is not distance bounding. | Call it a heuristic. |
| src/webauthn-client/WebAuthnClientHandler.ts:63 | 4 | High | `attestation:'enterprise'` needs a policy-provisioned RP ID; without one the browser downgrades and zeroes the AAGUID. | Document this, or use `direct` with MDS3. |
| ZtaEnrollmentOrchestrator.ts:47 | 4 | High | A placeholder AAGUID is in the production allowlist. | Remove it. |
| README.md:83 vs LICENSE | 1 | High | README and `package.json` say ISC; LICENSE is CC BY 4.0. | Pick one. |
| README.md:22/24 | 2 | High | The README's definitions of Axioms 6 and 8 differ from the book's. | Copy from ch2. |
| X14 | 1/2 | High | Root status docs overstate completion. | |
| research/annotated-bibliography/report.md:2/6/70/74/85 | 2 | High | Says 26 books but lists 28. The recent-title count and "≥4.0 rating" claims are wrong. Three ISBNs fail checksum. | Fix. |
| research/.../02-Zero-Trust-Networks-2Ed-Rais-distillate.md:24-29/52/70-72 | 3 | Critical | "Agents" is misdefined as endpoint software. The case studies are invented; the real ones are BeyondCorp and PagerDuty. ZTMM is missing the Initial stage. | Re-distil from the book. |
| research/.../03-...Garbis-distillate.md:10/29/42/53/60-63 | 3 | High | Garbis's and Chapman's affiliations are swapped. Content not in the book has been added. | Fix. |
| research/source-distillates/threat-crypto-distilled.md:39-41/71, report.md:55 | 3/1 | High | ZooKeeper uses Zab. KRaft and HotStuff are not in DDIA. Kleppmann cited as grounding for BFT (see X3). | Fix. |

---

## 2. Medium and Low findings (grouped)

### Factual / standards
- ch5:130/133: SP 800-207's Device Agent/Gateway and Device Application Sandboxing models are mischaracterised.
- ch1:42: ZTMM stage for app accessibility is wrong (Advanced vs Optimal), and the causal claim about the SaaS blind spot is a non sequitur.
- ch4:198/200: CSF Profiles existed in CSF 1.0, not new in 2.0; Tiers are not maturity levels.
- ch4:20: ZTMM v2 has four stages, not three.
- ch4:24: the matrix is "3,888,000 configurations", not "thousands".
- ch4 (whole): Zwicky's morphological analysis and Ritchey's cross-consistency assessment are not credited.
- ch2:124: TPM quotes attest the boot chain, not patch level.
- ch4:67, ch5:86/90: SPIRE workload selectors are misdescribed, TPM attestors are node attestors, and SVIDs *are* zero standing privilege.
- ch5:60: Shamir secret sharing reconstructs the key in one place; threshold signatures are what's needed.
- ch4:90/ch5:143: TOFU is misdefined.
- ch5:169: hardware performance counters are not "unforgeable"; power draw is not an HPC.
- ch7:244: ML-DSA-44 signature is 2,420 B.
- ch7:318: the EEA has 30 states, not 27.
- ch7:289: the CRA does not mandate signed SBOMs or in-toto/SLSA.
- ch7:148-150: DoD ZT PfMO was established in 2022, before DTM-25-003; the "Chief ZT Officer" title is unverified.
- ch7:42/44: NSA documents are "Guidelines"; the $10B+ figure is uncited.
- ch6:57: "trickle truth" is not a behavioral-economics term.
- ch6:179: Pawlick & Zhu (2021) have two authors, so "et al." is wrong.
- ch13:233, ch14:68: ZTMM does not average pillars; stage order is Traditional < Initial < Advanced < Optimal.
- ch13:239-247, ch14:88-96, ch18:205: NSA ZIG phases are misdescribed **[verify]**.
- ch18:176/203/207: EO 14028 does not address PQC; cite NSM-10, the Quantum Computing Cybersecurity Preparedness Act and OMB M-23-02. EO 14028 did not "mandate" ZTA adoption (M-22-09 did).
- ch16:149: Talon is now Prisma Access Browser, and both products are full enterprise browsers, not extensions.
- ch18:118/125: observability is D7, not D6; a KEM does not do bulk encryption.
- ch10:144: GV.SC is a CSF category, not a function; EO 14028 §4 directed guidance rather than mandating.
- App C:136/198: ML-DSA signatures are 2.4–4.6 KB, SLH-DSA 8–50 KB.
- App C:141: dimensions have 4–6 values.
- App C:42: SEV-SNP is AMD technology, not Azure.
- App C:115: ICAM is federal (FICAM), not DoD.
- caep:168, compliance:88: EUDI PID uses ISO mdoc and SD-JWT VC, not W3C VC.
- caep:188-201: JSONPath for mdoc namespaces needs bracket notation.
- caep:220-232: `verified_claims.verification` is required.
- caep:241, soar:15: NIS2 incident reporting is Art. 23, not Art. 21.
- caep:267: AI Act Annex III excludes identity verification.
- identity-fabric:48, nfc:45: selective disclosure is not a zero-knowledge proof.
- identity-fabric:61: AppID and Facet IDs are U2F concepts.
- webauthn-client:113: the `uvm` extension was dropped from WebAuthn L3.
- blueprint:66: NIS2 MFA applies "where appropriate".
- research/k8s-security-distillate.md: SeccompDefault GA is 1.27, not 1.19; SLSA L4 doesn't exist in v1.0; Bottlerocket is not Firecracker.
- research/threat-crypto-distilled.md:67: hybrid certificates pair RSA/ECDSA with ML-DSA, not ML-KEM.
- research/report.md:15/29: ZTN 2nd ed ISBN 978-1-492-09659-7; Rice & Hausenblas published 2018, not 2023.

### Logical / internal consistency
- ch2:52 vs :68: "allow-all" break-glass paths are inconsistent with the corollary.
- ch2:94/153: "computationally impossible" overclaims, and Saltzer–Schroeder complete mediation is uncredited.
- ch2:166-173 vs ch4:120: Axiom 2's primary dimension differs between chapters.
- ch3:126/130: B is green on Axiom 1 and D green on Axiom 5, both contradicted elsewhere.
- ch3:183, ch13:27: the RSA ID IQ statistics are an ecological fallacy.
- ch4:95/137: D4 Heterogeneous Triple duplicates D7.
- ch4:151, ch6:13/331/337/442, ch18:43/240: D8 is called "zero cost" while also needing a cyber range or being the "hardest".
- ch5:74/76 vs ch2:128: behavior-only access violates Corollary 7.3.
- ch6:63: "four components" but five are listed.
- ch6:81: the drop-oldest rationale argues against itself.
- ch6:150-154: t_min makes gaming easier, not harder.
- ch6:237: better detection does not cause more outages.
- ch6:274: signatures shift the regress rather than breaking it, and replay isn't handled.
- ch6:292, ch4:135, ch8:56: a data diode is not an air gap.
- ch7:34/40/96/106/109/173-180/217-218: cluster values, the D6 reference, Archetype D's response speed and axiom-dimension tables disagree with ch4, ch2 and ch11.
- ch9:138-147: Axiom 6 counted twice and Axiom 1 missing.
- ch9:146/129: MTTR is shorter than one of its own components.
- ch10:119: SPIRE would correctly attest the poisoned image.
- ch10:182: UNC6426 took 72 hours, not seconds.
- ch11:36 vs :57: hardware keys vs push MFA.
- ch11:73: the timeline resets.
- ch11:151-155: averaging includes an "Indefinite" value.
- ch12:26-27/30/49/51/57/66/83/95/101/116/130/134: MTTD/MTTR summaries contradict the traces; "None require new hardware" contradicts the air-gap fix; duplicate "Synthesis 5" heading; D7 confused with detection; wrong pair for C.
- ch14:185/198/29/100-102: heading contradicts its body; 3-node "BFT"; §14.2 doesn't exist; duplicate H2.
- ch15:102/108-112/124: Trickle-Truth without Event-Streamed; TPM vs "no hardware"; SVIDs vs "no code changes".
- ch16:90: the correlation logic is inverted.
- ch16:188-190: gate measured before the mandate.
- ch17:114-115: 75% passes a ≤80% gate.
- ch17:51-57: authentication is confused with session detection.
- ch18:31/88/97/229: recommends GitOps to C, which already has it; wrong corollary; "eight axioms will not change" next to the 13-axiom extension.
- App A:202-209/228/265: column scope wrong; D8 should be Axiom 8.
- App B:118: D9 is not cheap.
- App D:47/48/54/65: axiom-dimension rows contradict ch2 and ch4; "Solo operator (30-100 person)".
- App E:85: Governance→D8 conflicts with ch2.
- k8s:190-239: SOAR egress and TCP/53 are missing; ingress-nginx is not Envoy.
- redis-challenge:21/35/93-113: Redis port published on all interfaces; the challenge is not user-bound.
- siem:117-130: expired challenges get paged as replays.
- soar:15-19/64-81: tier numbering inverted.
- multi-region:101: replay window under async replication.
- terraform:142/171: Chaos Mesh `scheduler` was removed in 2.x; no `loss` action.
- index.md:57/133: the dependency map is wrong.
- Root docs: RESEARCH_FINDINGS dates disagree with ch10; "8-15" vs "8-12 FTE"; §2.5 vs §2.4; phase numbering mismatch; "No content removed" is false.
- project-context.md: stale file and epic counts.

### Low-quality generated text (category 5) and incoherent passages (category 6)
- zero-trust-identity-blueprint.md:81-86: leftover chatbot closing line ("Is assistance needed drafting…?"). Delete it.
- Off-topic or duplicate references: identity-fabric [4][16][21][28][29][32], [12]=[13]; blueprint [21][29], [27]=[34]; anti-relay [6].
- App A:43=:53 and :64=:268: duplicated paragraphs. "The practical consequence is unchanged:" (:55) refers to nothing that changed.
- App E:14=:117: duplicated sentence.
- ch13:29-31/35/43: repeated sentences.
- App C:56/:108: D9 defined twice.
- App C:155: circular Octagon definition.
- Overclaims: "mathematically certain" (ch8:140/170/181, App C:221); "cryptographically indistinguishable" (ch6:87); "architectural proof" (ch6:245); "canonical demonstration" (App A:100).
- Incoherent: ch2:140 Cor. 8.2 ("infrastructure holds no intrinsic trust over the client"); ch3:116 and App B:90 ("Server authenticates to client; client does not authenticate server"); ch7:40 ("higher-dimension upgrades amplify lower-dimension"); ch6:181-190 EBK section, which is never defined; ch17 title "Skipping D4 Before D5"; ch17:31 "occurrence response"; ch17:19 leftover editorial note; App A:96; App D:60/116.
- Uncited figures to source or mark as illustrative:
  - ch8:42/117: 10% quarantine, $45 LLM cost.
  - ch9:131: $500K–2M.
  - ch10:159/164/176: 275 AWS accounts, 95–97M downloads, TanStack details.
  - ch11: outcome probabilities.
  - ch12:34: cost brackets.
  - ch13:24-27: 69%, 88%, 91%.
  - ch4:151: 1/100th budget.
  - ch5:153: 90% of attackers.
  - ch6:381/402: 50% MTTR variance, >10 alerts/day.
  - ch7:124/140-143: outage costs, cost floors.
  - App A:20: CRQC 2028–2035.
  - App C:189: 10% quarantine.
  - ch17:142: B→D re-diagnosis.
  - Engineering: all RTT figures, the 95% acoustic threshold, the auditor timeline, the Smart-ID+ details.
- Hash fixtures in compliance:114/147: 65 hex characters, and all reuse the SHA-256-of-empty-string suffix.
- Placeholder AAGUIDs: `adce0002-…` is Chrome on Mac, not YubiKey.

---

## 3. Suggested remediation order

1. **Code correctness:** C-1/2 (move to the v14 API), X6 (RP ID), enrollment challenge binding, revocation read path, logger mock paths. Then add one test that uses the real `@simplewebauthn/server`.
2. **Factual errors in standards and crypto:** App A (Shor, CNSA 2.0, FIPS 140-3, HNDL, AND-hybrid); ch18 PQC sizes and dates; App E ZTMM functions; App C SP 800-207/207A, CAEP, CBOM; ch1/preface EO 14028 and SP 800-207 attributions.
3. **Internal consistency of the scoring model:** X1, X2, and the ch12 synthesis tables. These shape the book's central argument.
4. **Engineering infrastructure:** X7 (Redis topology), X8, SIEM/SOAR wiring, Terraform/Kubernetes validity.
5. **Citations and links:** X12, X13, the research distillates.
6. **Text quality:** remove duplicates, chatbot residue and overclaims; source or label the uncited figures.
7. **Root status docs:** correct X14, or archive them.
