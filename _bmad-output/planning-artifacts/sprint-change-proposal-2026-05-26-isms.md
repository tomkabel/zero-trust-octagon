# Sprint Change Proposal: ISMS.online Analysis Integration

**Date:** 2026-05-26
**Scope:** Moderate — story content expansions within existing epic boundaries
**Change Trigger:** `_bmad-output/isms-online-analysis.md` identified 8 additions and 4 modifications across Epics 1-4 from ISO 27001:2022 corpus analysis

---

## Issue Summary

A systematic analysis of 2,987 scraped ISMS.online files mapped ISO 27001:2022 requirements, Annex A controls, and cross-standard content against the Zero Trust Octagon model. The analysis identified structural gaps in the project's current content plan where ISO 27001 operationalizes concepts the Octagon defines architecturally — and where the Octagon exceeds ISO requirements in ways that should be explicitly documented.

## Impact Analysis

### Epic Impact

| Epic | Impact | Severity |
|------|--------|----------|
| Epic 1 (Foundations) | Story 1-5 scope expands: +2 subsections, ~1 D9 modification | Low |
| Epic 2 (Archetypes) | Story 2-5 scope expands: +2 synthesis items, ~1 supply chain modification | Low |
| Epic 3 (Synthesis) | Stories 3-2,3-3,3-4 scope expands (+opportunity columns); Story 3-6 scope modified (~risk-appetite filter) | Low |
| Epic 4 (Appendices) | Story 4-1 scope expands (+2 subsections); Story 4-6 scope expands (+ISO mapping); Story 4-3 (+7 glossary terms) | Low |

No epics added, removed, or re-sequenced. No epics invalidated.

### Artifact Conflicts

| Artifact | Status |
|----------|--------|
| PRD | No conflict. NFR-6 explicitly scopes standards mappings to appendices |
| Architecture | No conflict. Existing patterns accommodate new content |
| UI/UX | N/A |
| Sprint Status | Story descriptions need updating |

## Recommended Approach: Direct Adjustment

All 8 additions and 4 modifications fit within existing story boundaries. No rollback, no MVP scope reduction, no epic restructuring.

## Detailed Change Proposals

### Epic 1 Changes

**Story 1-5: Dimensions Deep-Dive D1-D9**

OLD SCOPE: Define nine dimensions with 4-7 ordered values each. Deep-dive D1-D4 (Chapter 5), D5-D9 (Chapter 6). Document D9 discovery, sub-dimensions ($A_{D9}$, $D_{D9}$, $\sigma_{TTR}$, $B_{D9}$), and upgrade path.

NEW SCOPE: Same as above, PLUS:

- **Accountability Gap Taxonomy** — Add after D9 sub-dimensions: enumerate 5 failure modes from ISO 27001 Clause 8.1 analysis (ghost ownership, backup absence, siloed reviews, template decay, tool fragmentation) with diagnostic questions and remediation patterns
- **Metric Selection Framework** — Add to D7 analysis: three KPI types (incident velocity, control health, culture/training) from ISO 27001 Clause 9.1, with mapping to Axiom 2 (verifiable policy vs. decision-useful metrics)
- **D9 analysis modification** — Integrate accountability gap taxonomy as the "where D9 fails" diagnostic

---

### Epic 2 Changes

**Story 2-5: Cross-Trace Synthesis and Meta-Patterns**

OLD SCOPE: Compare four archetype attack traces across MTTD/MTTR/exfiltration/business impact/intelligence yield. Extract Implicit Trust Trap and Supply Chain as unifying blind spots. Generalize SaaS Blind Spot beyond Archetype D.

NEW SCOPE: Same as above, PLUS:

- **AI Supply Chain as Distinct Threat Vector** — Add synthesis section with comparison table (traditional vs AI supply chain properties: change triggers, provenance mechanisms, determinism, vulnerability classes) per ISO 42001 analysis. Distinguish model poisoning, training data tampering, and prompt injection from CI/CD injection
- **Supplier Dimension Matrix** — Add graduated Octagon dimension application by supplier tier (Tier 1 critical → Tier 4 no impact) per Annex A 5.19. Show which dimensions apply at each tier
- **Synthesis 2 modification** — Expand supply chain section from binary (defended/undefended) to graduated (tiered defense). Use A.5.19's four-tier supplier categorization as the segmentation basis

---

### Epic 3 Changes

**Stories 3-2, 3-3, 3-4: Implementation Pathways (Enterprise, Velocity, Solo)**

OLD SCOPE: Provide implementation pathway with phased approach, gate checks, escape hatches, cost estimates, and axiom-addressing statements per chapter.

NEW SCOPE: Same as above, PLUS:

- **Opportunity Capture Column** — Add to each pathway's phase table: what business value each dimension upgrade unlocks beyond defense (procurement doors opened, deal acceleration, compliance posture, audit readiness, trust signaling). Ground in risk-opportunity duality from ISO 27001 Clause 6.1

**Story 3-6: Decision Matrix and Conclusion**

OLD SCOPE: Present decision matrix with 7 pain-threat pairs mapping to specific dimensions, chapters, and rationale. Forward-looking analysis (quantum, AI, hardware commoditization).

NEW SCOPE: Same as above, PLUS:

- **Risk-Appetite Filter** — Add sentence: "The dimension to start with is the one your risk assessment identifies as highest-exposure, filtered through the leverage hierarchy." Incorporate risk-opportunity duality — each pain point also identifies a missed opportunity
- Reference ISO 27001's risk assessment methodology (Clause 8.2) as the recommended prioritization input

---

### Epic 4 Changes

**Story 4-1: Appendix A — Quantum and AI Adversary Stress-Tests**

OLD SCOPE: Harvest-Now-Decrypt-Later, PQC migration timeline, AI-generated attack chains, hardware attestation commoditization, SaaS enforcement common interface.

NEW SCOPE: Same as above, PLUS:

- **Temporal Epistemic Integrity** — Provenance proofs have a shelf life determined by cryptographic algorithms protecting them. "Harvest now, decrypt later" means data encrypted today with RSA/ECDSA is at risk of future decryption. Axiom 7 must account for the data lifetime dimension — architectures must plan for algorithm migration as continuous operation
- **Regulatory Cryptography Constraints** — Add subsection on cryptographic jurisdiction: cross-border encryption restrictions (China's cryptography law, Russia's certification requirements), national cryptography standards (SM2/SM4, GOST), and how they create architectural constraints for globally deployed zero-trust systems

**Story 4-6: Appendix E — CISA ZTMM Crosswalk**

OLD SCOPE: Map CISA Zero Trust Maturity Model v2.0 pillars to Octagon dimensions. Demonstrate measurement instrument vs. verification instrument complementarity.

NEW SCOPE: Same as above, PLUS rename/expand to:

- **Standards Cross-Reference Appendix** — Covers both CISA ZTMM v2.0 and ISO 27001:2022 conformance mapping
- **Axiom → ISO 27001 Clause Mapping Table** — Each of the 8 Octagon axioms mapped to its corresponding ISO 27001:2022 requirements clauses, with "where ISO satisfies" and "where the Octagon exceeds ISO" columns
- **Dimension → ISO Control Coverage Table** — Each of the 9 dimensions mapped to most-relevant Annex A controls, with best-fit ISO level and gaps identified
- **Archetype → ISO Applicability Table** — What ISO 27001 offers each archetype (B: compliance target, C: market differentiator, D: aspirational framework) and what's still missing

**Story 4-3: Appendix C — Glossary**

OLD SCOPE: Populate glossary with all domain terms from chapters 1-18 and appendices A-D.

NEW SCOPE: Same as above, PLUS 7 new terms:
- accountability gap
- supplier tier
- AI supply chain
- conformance mapping
- temporal epistemic integrity
- harvest-now-decrypt-later (HNDL)
- metric selection framework

---

## Implementation Handoff

**Scope Classification:** Moderate — requires story description updates in sprint-status.yaml, but no epic restructuring.

### Handoff Recipients

| Role | Responsibility |
|------|---------------|
| Developer agent (bmad-dev-story) | Execute modified stories per updated descriptions when Epics 1-4 are reached |
| Sprint plan (sprint-status.yaml) | Updated story descriptions reflect new scope |

### Next Steps

1. Update `sprint-status.yaml` with modified story descriptions (this change)
2. When Epic 1 begins, stories 1-5 reflect expanded scope
3. When Epic 2 begins, story 2-5 reflects expanded scope
4. When Epic 3 begins, stories 3-2,3-3,3-4,3-6 reflect modifications
5. When Epic 4 begins, stories 4-1,4-3,4-6 reflect expanded scope

### Success Criteria

- All 8 ISMS analysis additions appear in their respective chapter outputs
- All 4 modifications reflected in final content
- New glossary terms added to Appendix C
- No architectural pattern violations (cross-refs downstream-only, terminology consistent, citations traceable)

---

## Approval

- [x] Change trigger identified: ISMS.online analysis integration
- [x] Epic impact assessed: 4 epics, 8 stories affected
- [x] Artifact conflicts resolved: None
- [x] Path forward selected: Direct Adjustment
- [x] Edit proposals documented: 8 stories modified
- [x] User approved: Yes
- [x] Sprint status updated
- [x] Handoff documented
