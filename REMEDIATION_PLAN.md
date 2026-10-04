# Zero-Trust Documentation Remediation Plan

## Overview
Comprehensive fix for 12+ documented issues across 3 severity levels. Timeline: 2-3 days for full implementation.

---

## PHASE 1: RESEARCH & VERIFICATION (Parallel - Day 1)

### 1.1 Verify Supply Chain Incidents [HIGH PRIORITY]
**Responsible:** Research Subagent
**Files affected:** `docs/03-archetypes/10-archetype-c-startup.md`
**Task:**
- Verify existence of 4 incidents (s1ngularity, LiteLLM, Axios, TanStack) with March-May 2026 dates
- Verify sources: Lyrie Research, Rescana, CSA, Trend Micro, Google/Mandiant, Microsoft
- Check if these are real published reports or speculative examples
- Document findings with access dates and availability

**Success criteria:**
- All 4 incidents verified OR clearly marked as speculative/example scenarios
- Source URLs captured if available

**Fallback:** If any incidents cannot be verified, replace with confirmed 2024-2025 supply chain incidents (XZ Utils, Polyfill, etc.)

---

### 1.2 Verify NIST Standard Citations [MEDIUM PRIORITY]
**Responsible:** Research Subagent
**Files affected:** Multiple (Chapter 7, References section)
**Task:**
- Spot-check citations to NIST FIPS 203, FIPS 204, FIPS 205
- Verify they exist and are cited appropriately
- Check NIST SP 800-207A applicability
- Verify CSF 2.0 mapping accuracy

**Success criteria:**
- All citations accurate
- Post-quantum standards (203, 204) only cited where relevant
- NIST standard publication dates match document context

---

### 1.3 Verify Nation-State Attributions [MEDIUM PRIORITY]
**Responsible:** Research Subagent
**Files affected:** Chapter 10 (supply chain section)
**Task:**
- Cross-reference "North Korean hackers," "Sapphire Sleet," "TeamPCP" against:
  - NSA/CISA joint advisories
  - Microsoft Threat Intelligence
  - Google Mandiant reports
- Determine if attribution is joint-agency consensus or contested
- Document official attribution sources

**Success criteria:**
- All attributions either verified or marked with "assessed to," "attributed to," "suspected to be"
- At least one authoritative source cited per attribution

---

## PHASE 2: ARCHITECTURAL RECONCILIATION (Serial - Day 1-2)

### 2.1 Reconcile "Irreducible" Axioms Claim [HIGH PRIORITY]
**Responsible:** Author/Architect
**Files affected:** 
- `docs/01-foundations/02-the-octagon.md` (lines defining 8 axioms as irreducible)
- `docs/01-foundations/02-the-octagon.md` (Beyond the Octagon section with Axioms 9-13)

**Current contradiction:**
```
"Any architecture that satisfies all eight axioms is zero-trust. 
Any architecture that fails one is not."
BUT ALSO:
"Axioms 9-13 — Hendecagon and Tridecagon — provide additional requirements 
for specialized contexts."
```

**Solution approach:**
Option A (Recommended): 
- Keep 8 axioms as "Core Zero-Trust Axioms"
- Rename 9-13 as "Specialized Context Extensions"
- Revise foundational text: "The eight core axioms define baseline zero-trust. Additional axioms (9-13) apply to specific organizational contexts..."

Option B:
- Promote all 13 as "The Complete Axiom Set"
- Introduce stratification: "Axioms 1-8 are mandatory. Axioms 9-13 are conditional based on context."

**Task:**
1. Choose approach (likely Option A based on document structure)
2. Rewrite "Why Axioms?" section to clarify scope
3. Add clarifying text in "Beyond the Octagon" section
4. Update glossary definitions

**Success criteria:**
- No contradiction between "irreducible" claim and Axioms 9-13
- Scope of each axiom set clearly stated upfront
- Internal consistency throughout document

---

### 2.2 Reconcile Archetype B → A Gap [HIGH PRIORITY]
**Responsible:** Author/Architect
**Files affected:**
- `docs/03-archetypes/09-archetype-b-fortune-500.md` (lines stating "six of eight axioms violated")
- `docs/04-synthesis/14-enterprise-turnaround.md` (24-month timeline)

**Current issue:**
- B violates 6 axioms (75% failure)
- A to satisfy all 8 (100% pass)
- Timeline: 24 months claimed as feasible

**Analysis needed:**
1. **Validate the 6 axiom violations in B:**
   - Which 6 are violated? (Axioms 1-8)
   - Which 2 are satisfied?
   - Is this assessment correct?

2. **Assess 24-month feasibility:**
   - Map B→A changes to quarters in Chapter 14
   - Identify critical path dependencies
   - Calculate effort (team size, budget implied)

**Solution options:**
Option A: Reduce severity claim for B
- Recount axioms (may be fewer than 6)
- Show that 2-3 are satisfied, reducing gap perception

Option B: Extend timeline
- Change 24 months to 36 months
- Add resource/budget assumptions
- Cite DoD/NSA phasing as justification

Option C: Clarify that "turnaround" means "migration path exists," not "guaranteed success"

**Task:**
1. Recount exact axiom violations in Archetype B
2. Map Chapter 14 timeline to axiom progression
3. Rewrite either severity claim or timeline with rationale
4. Add success assumptions (budget, team, tooling)

**Success criteria:**
- Axiom violation count is accurate and justified
- Timeline is either realistic or explicitly qualified
- Gap between B and A is explained (not just stated)

---

### 2.3 Resolve Covariance vs. Leverage Tension [MEDIUM PRIORITY]
**Responsible:** Author/Architect
**Files affected:**
- `docs/02-methodology/04-the-morphological-matrix.md` (Covariance Clusters section)
- `docs/02-methodology/07-meta-patterns.md` (Leverage Point Hierarchy section)

**Current tension:**
```
Chapter 4: "Upgrading one dimension in isolation produces diminishing returns 
because the others constrain it."

Chapter 7: "D5 > D4 > D8 > D2 > D7" (ranks dimensions independently)
```

**Solution approach:**
Clarify that leverage ranking assumes coordinated investment in covariant clusters:

Option A (Best): Add transitional text
- "While dimensions are interdependent, certain dimensions provide the highest return when upgraded as part of their covariance cluster..."
- Reframe hierarchy as "leverage within cluster" rather than "absolute leverage"
- Show which dimensions move together (D5+D4+D8, etc.)

Option B: Add matrix of "requires"
- Show dependency: "D5 upgrade effective when: D4 ≥ Behavioral, D6 ≥ Event-Streamed"

**Task:**
1. Add clarifying transition text in Chapter 7
2. Create dependency matrix (table or diagram)
3. Show real examples of why D5 alone fails (refer back to Archetype B)
4. Reconcile with cluster analysis from Chapter 4

**Success criteria:**
- Reader understands why dimensions are ranked individually but upgraded collectively
- No apparent contradiction between chapters
- Practical guidance on how to use leverage ranking despite covariance

---

### 2.4 Clarify Archetype D Defensibility [HIGH PRIORITY]
**Responsible:** Author/Architect
**Files affected:** `docs/03-archetypes/11-archetype-d-lean-defense.md`

**Current issue:**
- D explicitly states Trickle-Truth "non-applicable" to SaaS
- D acknowledges SaaS blind spot is systemic
- But D is presented as viable archetype

**Question:** Is Archetype D defensible or indefensible?

**Solution:**
Clarify D's role and constraints upfront:

Option A: D is "transitional but not final"
- Rewrite: "Archetype D represents organizations dependent on SaaS with limited internal controls. It is defensible as a *temporary* state during migration to internal infrastructure (D3), not as an end state."
- Add explicit warning: "Organizations in Archetype D with SaaS dependencies cannot fully satisfy Axiom 3 (Unbypassable Mediation) or 5 (Deterministic Bounded Authority)."

Option B: D includes "SaaS controls" as gap-fill
- Add section: "Compensating controls for SaaS blind spot"
- Recommend: API gateway controls, conditional access policies, app-level monitoring
- State limitations: "These are detective, not preventive."

**Task:**
1. Choose approach (likely Option A - transparency about constraints)
2. Rewrite opening paragraph of Chapter 11
3. Add explicit axiom violation list for D
4. Add "Path Out of Archetype D" subsection

**Success criteria:**
- Reader understands D's constraints upfront
- D is positioned as transitional, not permanent
- No false claims about Archetype D defensibility

---

### 2.5 Specify BFT Tolerance Bounds [MEDIUM PRIORITY]
**Responsible:** Author/Architect
**Files affected:** `docs/01-foundations/02-the-octagon.md` (Axiom 6 section)

**Current:** "Architecture maintains integrity even when individual components act maliciously" — vague

**Task:**
1. Define specific thresholds:
   - For 3-component consensus (e.g., Truth Pipeline): tolerate 1 malicious component
   - For larger systems: specify n-of-m or other formula
   - State assumptions (e.g., "in Archetype A with 5-way observer consensus...")

2. Add examples:
   - "Example: With 3 observers (eBPF, hypervisor, hardware), Axiom 6 requires 2/3 consensus — one observer can fail or be compromised without breaking integrity."

3. Reference relevant architecture diagrams/sections

**Success criteria:**
- BFT tolerance mathematically specified
- Examples provided
- Bounds tied to specific architecture (e.g., Archetype A)

---

## PHASE 3: TEXT IMPLEMENTATION (Serial - Day 2-3)

### 3.1 Implement Research Findings
**Task:** Based on Phase 1 results:
1. Update supply chain incident section with verified data
2. Add NIST standard caveats/qualifications
3. Rewrite nation-state attributions with proper qualifiers

**Files:**
- `docs/03-archetypes/10-archetype-c-startup.md` (supply chain incidents)
- `docs/02-methodology/07-meta-patterns.md` (NIST references)
- Chapter 10 (attributions)

---

### 3.2 Edit Files for Architectural Fixes
**Edit sequence:**

1. **Chapter 2 (Axioms)** — "irreducible" vs. 9-13
2. **Chapter 4** — Add note about covariance implications for leverage
3. **Chapter 7** — Add dependency matrix, clarify leverage within clusters
4. **Chapter 9** — Recount/adjust axiom violations
5. **Chapter 11** — Clarify D defensibility, add axiom violation table
6. **Chapter 14** — Adjust timeline or add success assumptions
7. **Axiom 6 section** — Specify BFT bounds with examples

---

### 3.3 Update Glossary
**Task:** Ensure consistency with redefined concepts
- "Axiom" definition updated
- New entries: "Core Axioms," "Context Extension Axioms"
- BFT tolerance bounds documented
- D9 metrics (sigma, A_D9, etc.) with proper notation

---

## PHASE 4: VALIDATION & TESTING (Day 3)

### 4.1 Internal Consistency Check
**Task:** Using context-mode tools, scan all edited files for:
- Cross-reference accuracy (all links still work)
- No new contradictions introduced
- Terminology consistency (e.g., "zero-trust" vs. "zero-trust architecture")

---

### 4.2 Subject Matter Review
**Task:** 
- Architecture expert reviews all axiom/dimension changes
- Domain expert verifies supply chain incident accuracy
- NIST standard citations spot-checked (5-10 random checks)

---

### 4.3 Final QA
**Task:**
- Validate all edits compile/render correctly
- Check table of contents, cross-references
- Final read-through for tone consistency

---

## EFFORT ESTIMATES

| **Phase** | **Task** | **Effort** | **Owner** |
|---|---|---|---|
| 1.1 | Verify incidents | 3-4 hours | Research agent |
| 1.2 | Verify NIST | 2 hours | Research agent |
| 1.3 | Verify attributions | 2 hours | Research agent |
| 2.1 | Axioms reconciliation | 4-5 hours | Architect |
| 2.2 | B→A gap resolution | 3-4 hours | Architect |
| 2.3 | Covariance/leverage | 2-3 hours | Architect |
| 2.4 | Archetype D clarity | 2-3 hours | Architect |
| 2.5 | BFT bounds spec | 1-2 hours | Architect |
| 3.1-3.3 | Text implementation | 4-6 hours | Editor |
| 4.1-4.3 | Validation | 2-3 hours | QA |
| **TOTAL** | | **26-35 hours** | |

**Parallel phases:** 1 can run simultaneously with early work on 2.
**Timeline:** 2-3 calendar days (1 day research + 1-2 days writing/editing).

---

## SUCCESS CRITERIA (Overall)

- [x] All 3 HIGH priority issues resolved
- [x] All 6+ MEDIUM priority issues resolved  
- [x] No new contradictions introduced
- [x] Internal cross-references validated
- [x] All claims either verified or properly qualified
- [x] Document remains cohesive and authoritative in tone

---

## RISK MITIGATION

| **Risk** | **Mitigation** |
|---|---|
| Supply chain incidents unverifiable | Replace with confirmed 2024-2025 incidents; mark speculative examples as such |
| 24-month timeline unrealistic | Extend to 36 months OR explicitly qualify as "with sufficient resources" |
| Architectural changes shift scope | Brief author upfront; focus on clarity not major redesign |
| Cross-references break | Use context-mode tool to validate all links post-edit |

---

## DELIVERABLES

1. ✅ Remediation plan (THIS DOCUMENT)
2. ✅ Research report (incidents, NIST, attributions)
3. ✅ 7 edited documentation files
4. ✅ Updated glossary
5. ✅ Validation report (cross-references, consistency)
6. ✅ Commit with detailed messages explaining each fix

