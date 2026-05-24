---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
workflowType: 'architecture'
lastStep: 8
status: 'complete'
completedAt: '2026-05-24'
inputDocuments:
  - "_bmad-output/planning-artifacts/prds/prd-zero-trust-2026-05-24/prd.md"
  - "_bmad-output/planning-artifacts/prds/prd-zero-trust-2026-05-24/addendum.md"
  - "_bmad-output/planning-artifacts/research/domain-cybersecurity-quantum-threats-ai-security-emerging-standards-2026-05-24.md"
  - "_bmad-output/planning-artifacts/research/technical-zero-trust-architectures-2025-2026-developments-research-2026-05-24.md"
  - "docs/00-preface.md"
  - "docs/01-the-case-for-zero-trust.md"
  - "docs/02-the-octagon.md"
  - "docs/03-octagon-as-instrument.md"
  - "docs/04-the-morphological-matrix.md"
  - "docs/05-dimensions-trust-to-attestation.md"
  - "docs/06-dimensions-response-to-human.md"
  - "docs/07-meta-patterns.md"
  - "docs/08-archetype-a-holy-grail.md"
  - "docs/09-archetype-b-fortune-500.md"
  - "docs/10-archetype-c-startup.md"
  - "docs/11-archetype-d-lean-defense.md"
  - "docs/12-cross-trace-synthesis.md"
  - "docs/13-self-assessment.md"
  - "docs/14-enterprise-turnaround.md"
  - "docs/15-velocity-defender.md"
  - "docs/16-scaling-pat.md"
  - "docs/17-the-aspirants-gate.md"
  - "docs/18-decision-matrix-and-conclusion.md"
  - "docs/appendix-a-quantum-ai-threats.md"
  - "docs/appendix-b-validation-checklist.md"
  - "docs/appendix-c-glossary.md"
  - "docs/appendix-d-quick-reference.md"
workflowType: 'architecture'
project_name: 'zero-trust'
user_name: 'Notroot'
date: '2026-05-24'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements (22 FRs across 8 categories):**

| Category | FRs | Architectural Significance |
|----------|-----|--------------------------|
| Octagon (Axioms) | FR-1, FR-2, FR-3 | Theoretical foundation — 8 axiomatic invariants with corollaries, refinement history, and auditable validation instrument |
| Morphological Matrix | FR-4, FR-5, FR-6 | Configuration space — 9 dimensions (D1-D9), covariance clusters, leverage point hierarchy (D5 > D4 > D8 > D2 > D7) |
| Attack Traces | FR-7, FR-8, FR-9, FR-10, FR-11 | Validation layer — 4 archetypal breaches (Holy Grail, Fortune 500, Startup, Solo Operator) + cross-trace synthesis |
| Implementation Pathways | FR-12, FR-13, FR-14, FR-15 | Action layer — 4 decision trees (24-month, 12-month, 6-month + failure pivots) with gate checks and cost estimates |
| Self-Assessment | FR-16 | Entry point — 12-question diagnostic routing to archetype-specific pathway |
| Decision Matrix | FR-17 | Practical output — pain-threat pairs mapped to dimensions and chapters |
| Appendices | FR-18, FR-19, FR-20, FR-21 | Supporting artifacts — quantum/AI stress-test, validation checklist, glossary, quick-reference card |
| Navigation | FR-22 | Structural integrity — explicit prerequisites, relative cross-references, acyclic dependency graph |

**Non-Functional Requirements:**
- Vendor-neutral — technologies named only in footnotes as points of reference
- Not a compliance framework — no SOC 2, ISO 27001, HIPAA, or PCI DSS mapping
- Independently verifiable — every claim must be traceable to 2025-2026 research reports
- Acyclic chapter dependency graph — no later chapter depends on a concept introduced later
- Terminological consistency — all domain terms in FRs, axioms, and traces appear in glossary

**Scale & Complexity:**
- Primary domain: Cybersecurity architecture knowledge system
- Complexity level: High — multiple interdependent subsystems (axioms, matrix, traces, pathways)
- Output: 23 markdown files (18 chapters + 4 appendices + 1 preface)
- Architecture type: Conceptual/theoretical reference architecture, not software system

### Technical Constraints & Dependencies

- **Research provenance chain**: Domain research → Technical research → Textbook claims. Every architectural assertion must have a traceable research source
- **Axiom stability**: The 8 core axioms (Octagon) are stable and published. Axioms 9-13 (Hendecagon/Tridecagon) are forward-looking and acknowledged as not yet formalized with corollaries
- **Dimension orthogonality**: D1-D9 must be independent (no dimension subsumes another). D9 (Human Continuity) was a late discovery validated by inference, not by direct measurement instrument
- **PQC timeline dependency**: ZTA deployment deadline (2027) comes BEFORE PQC migration deadline (2030-2035), creating a cryptographic rework dependency within the architecture's operational lifetime
- **AI adversary speed asymmetry**: 27-second breakout times force architectural consideration of machine-speed automated response

### Cross-Cutting Concerns

1. **Axiom-to-dimension mapping**: Each axiom must map to 1-3 morphological dimensions. This mapping table is the critical connective tissue between Parts I and II
2. **Archetype consistency**: Each of the 4 attack traces must use the vocabulary and value sets defined by the morphological matrix. No trace can depend on a dimension value not defined in Part II
3. **Research validation integrity**: The dependency chain (domain research → technical research → textbook) must be acyclic and each claim must be independently verifiable
4. **Navigation integrity**: Cross-references must form a connected graph where prerequisites are always earlier in the dependency ordering
5. **Trickle-Truth Garden novelty**: Individual components have prior art (honeypots, canary tokens, MTD). The claim of novel synthesis must be explicitly bounded

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation):**

| # | Decision | Choice | Rationale |
|---|----------|--------|-----------|
| 1 | Axiom-to-dimension mapping | Direct mapping | Each axiom explicitly maps to 1-3 dimensions. Supports auditability requirement — the instrument must be falsifiable |
| 2 | Chapter dependency topology | Strictly upstream-only | No same-layer cross-references. All references point to earlier layers. Matches PRD's acyclic requirement |
| 3 | Archetype consistency rules | Matrix-first (extend before use) | Traces can only reference dimension values defined in the matrix. New values extend the matrix first (as D9 was discovered) |
| 4 | Research provenance | Inline citation markers | Claims carry markers like `[DR-§4.2]` or `[TR-§2]` resolving to research report sections. Supports independent verifiability (SM-3) |
| 5 | Trickle-Truth Garden novelty | Explicit prior art section | Chapter 6 dedicates a section naming each prior-art component (honeypots, canary tokens, MTD, DARPA), then demarcates what the Garden adds: adaptive garbage pollution rate, temporal manipulation, state-anchored deterministic synthesis, real-time TTP classification, and the EBK |
| 6 | Glossary consistency | Validation gate | Appendix B checklist item ensures all domain terms in a chapter appear in the glossary with consistent definitions |
| 7 | Cross-reference format | Inline markdown sections | Prerequisites and cross-references are markdown sections with relative links in chapter body |
| 8 | Self-assessment routing | Truth-table validation | 12-row truth table per archetype. Drift from pattern uses tiebreaker dimensions (velocity, budget). Auditable and deterministic |
| 9 | Implementation pathway gates | Gate + escape-hatch | Every gate has a standard `Condition → Success/Failure → documented pivot` structure, plus an "Other Failure: return to self-assessment" escape hatch |
| 10 | Forward-looking axioms (Axioms 9-13) | Peer-review narrative | Chapter 18 tells the refinement story (Octagon → Hendecagon → Tridecagon) with adversarial stress-test motivation and gap analysis, without formalizing corollaries |

### Decision Dependency Graph

```
Axiom-to-dimension mapping (1) ── affects ──> Archetype traces (3)
                                               Self-assessment routing (8)
                                               Forward-looking axioms (10)

Chapter dependency topology (2) ── affects ──> Cross-reference format (7)
                                               Implementation pathway gates (9)

Research provenance (4) ── affects ──> Trickle-Truth Garden novelty (5)
                                        Forward-looking axioms (10)

Archetype consistency (3) ── affects ──> Implementation pathway gates (9)
                                        Glossary consistency (6)
```

### Decision Impact Analysis

**Implementation Sequence (for AI agents):**

1. Establish chapter dependency graph (Decision 2) — defines build order
2. Validate axiom-to-dimension mapping table (Decision 1) — critical connective tissue
3. Apply matrix-first archetype consistency rules (Decision 3) — gate for traces
4. Implement inline citation markers (Decision 4) — provenance infrastructure
5. Add explicit prior art section to Chapter 6 (Decision 5)
6. Implement cross-reference format across all chapters (Decision 7)
7. Build self-assessment truth table (Decision 8)
8. Structure implementation pathway gates with escape hatches (Decision 9)
9. Draft Chapter 18 peer-review narrative (Decision 10)
10. Validate glossary consistency via Appendix B checklist (Decision 6)

## Implementation Patterns & Consistency Rules

### Pattern Categories Defined

**6 critical conflict points** identified where AI agents working across 23 markdown files could make inconsistent choices.

### Terminology Patterns

**Glossary as Authoritative Vocabulary:**
- All domain terms must match Appendix C entries exactly
- New terms must be added to the glossary in the same change as the chapter that introduces them
- No aliases or synonyms for glossary-defined concepts
- First use of a glossary term in a chapter: `**Term Name**[↗]` (bold + glossary link)
- Subsequent uses: plain text, no re-bolding

**Example (Good):**
```
The **Trickle-Truth**[↗] response grafts the attacker's session...
```
**Anti-Pattern:**
```
The deceptive response (sometimes called "garden mode") redirects the attacker...
```

### Cross-Reference Patterns

**Reference Format:**
```
[§Chapter-Number: Section-Name](../path/to/file.md#section-anchor)
```

- Section anchors: lowercase-kebab-case derived from section heading
- Placed in a `**Cross-References**` section at chapter end
- Three sub-labels: `**Next:**`, `**Builds On:**`, `**Related:**`
- Strictly upstream-only: no forward references, no same-layer references (Decision 2)
- `**Next:**` declares the recommended next chapter for linear readers
- `**Builds On:**` declares explicit prerequisites (must be earlier layers)
- `**Related:**` declares optional connections (must be earlier layers)

**Example (Good):**
```
**Cross-References**

**Next:** [§13: Self-Assessment](../13-self-assessment.md)
**Builds On:** [§2: The Octagon](../02-the-octagon.md#axiom-4-continuous-verification), [§4: The Morphological Matrix](../04-the-morphological-matrix.md)
**Related:** [§7: Meta-Patterns](../07-meta-patterns.md#covariance-clusters)
```

**Anti-Pattern:**
```
See Chapter 14 for implementation.  // missing format, forward reference
```

### Dimension Value Vocabulary

**Format:** `D{N}: {Exact Matrix Value Name}`

- Values must match Chapters 4-6 exactly — no synonyms
- New values follow Decision 3: extend matrix first, register in Chapter 7, then reference
- Case-sensitive matching on value names

**Example (Good):**
```
D4: Behavioral Attestation detects the anomaly before data moves. D3: Service Mesh enforces...
```
**Anti-Pattern:**
```
Behavioral attestation (D4) detects...  // inconsistent prefix placement
D4: continuous behavioral checks  // not a defined matrix value
```

### Research Citation Patterns

**Format:** `[DR-§Section-Number]` (domain research) or `[TR-§Section-Number]` (technical research)

- Section numbers match the actual heading structure in research reports
- Multiple citations separated by commas: `[DR-§4.2, TR-§3]`
- Citations at sentence end are placed before the period
- Not every sentence needs a citation — cite at claim granularity

**Example (Good):**
```
The confidence/reality gap is 57% versus 69% [DR-§1, TR-§4].
```
**Anti-Pattern:**
```
[Domain Research section 4.2]  // wrong format
[TR 3]  // missing §
```

### Prerequisite Declaration Pattern

Every chapter (1-18) must include a prerequisites section immediately after the chapter title.

**Format:**
```
**Prerequisites:** Chapter N (Chapter Title), Chapter M (Chapter Title)
```

- "None" for Chapter 1
- Multiple prerequisites separated by commas
- Matches actual file names for the prerequisite chapters

**Example (Good):**
```
**Prerequisites:** Chapter 2 (The Octagon), Chapter 4 (The Morphological Matrix)
```
**Anti-Pattern:**
```
// prerequisites section missing entirely
// "You should read chapters 2 and 4 first"  // informal, not structured
```

### Glossary Entry Pattern

New glossary entries must be added to Appendix C in the same change as the chapter that introduces them.

**Format:**
```
**Term Name**: Definition sentence. _See also: [related-term](#related-term)._
```

- Alphabetically ordered within Appendix C
- Cross-references within glossary use relative anchor links
- Definitions must be consistent with usage in PRD, axioms, and traces (FR-20)

### Enforcement Guidelines

**All AI agents MUST:**
- Run the Appendix B validation checklist on any chapter they modify
- Verify glossary consistency (Decision 6): all domain terms in the chapter appear in Appendix C
- Verify cross-reference integrity: no forward references, all links resolve
- Verify dimension value vocabulary: all D{N} references use exact matrix value names
- Verify citation format: all research citations use `[DR-§...]` / `[TR-§...]` format
- Verify prerequisite declaration: section exists with correct format

**Pattern Enforcement:**
- Appendix B checklist is the gate — any chapter failing a checklist item is blocked
- New patterns or pattern changes are documented here in the architecture decision document
- Pattern violations discovered during implementation must be fixed before the chapter change is accepted

## Project Structure & Boundaries

### Existing Directory Layout

```
docs/
├── 00-preface.md                          # Layer 0: Foundation
├── 01-the-case-for-zero-trust.md          # Layer 1: Theory
├── 02-the-octagon.md                      # Layer 1: Theory
├── 03-octagon-as-instrument.md            # Layer 1: Theory
├── 04-the-morphological-matrix.md         # Layer 2: Architecture
├── 05-dimensions-trust-to-attestation.md  # Layer 2: Architecture
├── 06-dimensions-response-to-human.md     # Layer 2: Architecture
├── 07-meta-patterns.md                    # Layer 2: Architecture
├── 08-archetype-a-holy-grail.md           # Layer 3: Reality
├── 09-archetype-b-fortune-500.md          # Layer 3: Reality
├── 10-archetype-c-startup.md              # Layer 3: Reality
├── 11-archetype-d-lean-defense.md         # Layer 3: Reality
├── 12-cross-trace-synthesis.md            # Layer 3: Reality
├── 13-self-assessment.md                  # Layer 4: Action
├── 14-enterprise-turnaround.md            # Layer 4: Action
├── 15-velocity-defender.md                # Layer 4: Action
├── 16-scaling-pat.md                      # Layer 4: Action
├── 17-the-aspirants-gate.md               # Layer 4: Action
├── 18-decision-matrix-and-conclusion.md   # Layer 4: Action
├── appendix-a-quantum-ai-threats.md       # Layer 5: Appendices
├── appendix-b-validation-checklist.md     # Layer 5: Appendices
├── appendix-c-glossary.md                 # Layer 5: Appendices
└── appendix-d-quick-reference.md          # Layer 5: Appendices

_bmad-output/
└── planning-artifacts/
    ├── architecture.md                    # This document
    ├── prds/
    │   └── prd-zero-trust-2026-05-24/
    │       ├── prd.md
    │       └── addendum.md
    └── research/
        ├── domain-cybersecurity-*.md
        └── technical-zero-trust-*.md
```

### Layer Boundaries (Decision 2)

```
Layer 0: Foundation
  └── 00-preface.md
        ↓
Layer 1: Theory  
  └── 01, 02, 03
        ↓
Layer 2: Architecture
  └── 04, 05, 06, 07
        ↓
Layer 3: Reality
  └── 08, 09, 10, 11, 12
        ↓
Layer 4: Action
  └── 13, 14, 15, 16, 17, 18
        ↓
Layer 5: Appendices
  └── appendix-a, b, c, d
```

Cross-references only flow downward in this graph. No same-layer references.

### Requirements to Structure Mapping

**FR Category → Files:**

| FR Category | Primary Files | Supporting Files |
|-------------|---------------|------------------|
| Octagon (FR-1, FR-2, FR-3) | 02-octagon, 03-instrument | 01-case |
| Morphological Matrix (FR-4, FR-5, FR-6) | 04-matrix, 05-dimensions-D1-D4, 06-dimensions-D5-D9, 07-meta-patterns | — |
| Attack Traces (FR-7–11) | 08, 09, 10, 11, 12-cross-synthesis | 04-matrix, 07-meta-patterns |
| Implementation Pathways (FR-12–15) | 14, 15, 16, 17-aspirants-gate | 13-self-assessment, 18-conclusion |
| Self-Assessment (FR-16) | 13-self-assessment | 02-octagon, 04-matrix |
| Decision Matrix (FR-17) | 18-conclusion | All implementation chapters |
| Appendices (FR-18–21) | appendix-a, b, c, d | All chapters |
| Navigation (FR-22) | All files (prerequisite + cross-reference sections) | — |

**Cross-Cutting Concerns → Files:**

| Concern | Primary Location | Touches |
|---------|-----------------|---------|
| Axiom-to-dimension mapping | 07-meta-patterns (mapping table) | 02, 04 |
| Research provenance | All chapters (inline citations) | Research reports |
| Glossary consistency | appendix-c (glossary) | All chapters |
| Prerequisite declarations | All chapters 01-18 | — |
| Cross-reference integrity | All chapters (Cross-References sections) | — |

### Integration Points

**Internal (between chapters):**
- Axiom references: `[§2: The Octagon](../02-the-octagon.md#axiom-4-continuous-verification)`
- Dimension references: `D4: Behavioral Attestation` + `[§4: Matrix](../04-the-morphological-matrix.md)`
- Research citations: `[DR-§4.2]`, `[TR-§3]`
- Gateway: Chapter 13 self-assessment routes to 14, 15, or 16 based on truth table

**External (to research reports):**
- Domain research: cited as `[DR-§Section-Number]` → resolves to `planning-artifacts/research/domain-*.md`
- Technical research: cited as `[TR-§Section-Number]` → resolves to `planning-artifacts/research/technical-*.md`

### Fidelity Gates

Each layer has a validation gate before agents can work on the next layer:

1. **Layer 0-1 gate**: All 8 axioms defined with corollaries, refinement history documented
2. **Layer 1-2 gate**: Axiom-to-dimension mapping table complete and validated
3. **Layer 2-3 gate**: All dimension values registered in Chapter 7, no trace can use undefined values
4. **Layer 3-4 gate**: All attack traces cross-referenced against research, archetype-to-pathway routing validated
5. **Layer 4-5 gate**: All pathways have gate checks with escape hatches, decision matrix complete
6. **Final gate**: Appendix B checklist validates all chapters

## Architecture Validation Results

### Coherence Validation ✅

| Decision Pair | Compatibility |
|---------------|---------------|
| D1 (direct mapping) + D3 (matrix-first) | Direct mapping makes dimension relationships explicit; matrix-first ensures traces don't reference unmapped values |
| D2 (upstream-only) + D7 (inline cross-refs) | Upstream-only guarantees all cross-references resolve; inline format makes violations visible |
| D4 (inline citations) + D5 (prior art section) | Both strengthen provenance; citations for general claims, prior art section for novelty boundary |
| D8 (truth-table) + D9 (gate escape-hatch) | Escape hatches return to Chapter 13 self-assessment, which uses the truth-table for routing |
| D6 (glossary gate) + glossary entry pattern | Gate validates entries exist; pattern defines entry format |
| D10 (peer-review narrative) + D2 (upstream-only) | Chapter 18 in Layer 4 can reference all earlier layers for the refinement story |

### Requirements Coverage Validation ✅

All 22 functional requirements (FR-1 through FR-22) and 7 non-functional requirements traced to architectural decisions. See Requirements to Structure Mapping in Project Structure section.

### Implementation Readiness Validation ✅

- **10 critical decisions** documented with rationales
- **6 consistency patterns** with good/anti-pattern examples
- **6 fidelity gates** sequenced by layer
- **5-layer dependency graph** with explicit cross-reference rules

### Gap Analysis

**No critical gaps.** Three items below are PRD-acknowledged limitations, not architectural gaps:

| Item | Status | Reference |
|------|--------|-----------|
| D9 measurement instrument | Acknowledged open question | PRD §8, Open Question #3 |
| Axioms 10-13 formal corollaries | Explicitly out of scope for MVP | PRD §6.2 |
| Trickle-Truth prior art enumeration | Implementation task (D5) | Technical research already identified references |

### Architecture Completeness Checklist

**Requirements Analysis**
- [x] Project context thoroughly analyzed
- [x] Scale and complexity assessed
- [x] Technical constraints identified
- [x] Cross-cutting concerns mapped

**Architectural Decisions**
- [x] Critical decisions documented with rationale
- [x] Decision dependency graph complete
- [x] Integration patterns defined
- [x] Forward-looking extensions accounted for

**Implementation Patterns**
- [x] Terminology conventions established
- [x] Cross-reference patterns defined
- [x] Citation format specified
- [x] Prerequisite declaration pattern documented

**Project Structure**
- [x] Complete directory structure defined (23 files)
- [x] Layer boundaries established (6 layers)
- [x] Integration points mapped
- [x] Requirements to structure mapping complete

### Architecture Readiness Assessment

**Overall Status:** READY FOR IMPLEMENTATION

**Confidence Level:** High — all 16 checklist items verified, all 22 FRs mapped, no critical gaps

**Key Strengths:**
- Decisions form a coherent dependency graph — no contradictions
- 6 implementation patterns prevent agent conflicts at specific conflict points
- 6 fidelity gates create layer-by-layer quality enforcement
- Self-assessment → pathway routing → escape hatch → re-routing forms a closed loop
- Research provenance chain (domain → technical → textbook) is bidirectionally traceable

**Areas for Future Enhancement:**
- D9 measurement instrument design (PRD follow-up #3)
- Hendecagon/Tridecagon formal corollary development (PRD follow-up #2)
- Interactive self-assessment tool automation

### Implementation Handoff

**AI Agent Guidelines:**
- Follow all 10 architectural decisions exactly as documented
- Apply 6 implementation patterns consistently across all chapters
- Respect the 6-layer dependency graph — no forward references
- Run Appendix B checklist on every chapter modification
- Verify glossary consistency before committing any chapter change

**Implementation Sequence (from Decision Impact Analysis):**
1. Validate chapter dependency graph (Decision 2)
2. Verify axiom-to-dimension mapping table (Decision 1)
3. Apply matrix-first archetype consistency (Decision 3)
4. Implement inline citation markers (Decision 4)
5. Add explicit prior art section to Chapter 6 (Decision 5)
6. Implement cross-reference format across all chapters (Decision 7)
7. Build self-assessment truth table (Decision 8)
8. Structure pathway gates with escape hatches (Decision 9)
9. Draft Chapter 18 peer-review narrative (Decision 10)
10. Validate glossary consistency via Appendix B (Decision 6)
