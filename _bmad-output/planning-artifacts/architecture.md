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
  - "_bmad-output/planning-artifacts/research/technical-markdown-wiki-publishing-research-2026-05-24.md"
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
- Not a compliance framework — no SOC 2, ISO 27001, HIPAA, or PCI DSS mapping. Appendix E provides a structured crosswalk to CISA ZTMM v2.0. Chapters cite the full federal ZT standards ecosystem (NIST SP 800-207A, DoD ZT Ref Arch, NIST FIPS 203-205, NIST CSF 2.0, NSA ZIG, DoD DTM-25-003, EO 14028) as validation and context, demonstrating measurement instrument vs. verification instrument complementarity.
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
├── index.md                               # Home page (layout: home)
├── 01-foundations/
│   ├── index.md
│   ├── 00-preface.md                      # Layer 0: Foundation
│   ├── 01-the-case-for-zero-trust.md      # Layer 1: Theory
│   ├── 02-the-octagon.md                  # Layer 1: Theory
│   └── 03-octagon-as-instrument.md        # Layer 1: Theory
├── 02-methodology/
│   ├── index.md
│   ├── 04-the-morphological-matrix.md     # Layer 2: Architecture
│   ├── 05-dimensions-trust-to-attestation.md
│   ├── 06-dimensions-response-to-human.md
│   └── 07-meta-patterns.md                # Layer 2: Architecture
├── 03-archetypes/
│   ├── index.md
│   ├── 08-archetype-a-holy-grail.md       # Layer 3: Reality
│   ├── 09-archetype-b-fortune-500.md      # Layer 3: Reality
│   ├── 10-archetype-c-startup.md          # Layer 3: Reality
│   ├── 11-archetype-d-lean-defense.md     # Layer 3: Reality
│   └── 12-cross-trace-synthesis.md        # Layer 3: Reality
├── 04-synthesis/
│   ├── index.md
│   ├── 13-self-assessment.md              # Layer 4: Action
│   ├── 14-enterprise-turnaround.md        # Layer 4: Action
│   ├── 15-velocity-defender.md            # Layer 4: Action
│   ├── 16-scaling-pat.md                  # Layer 4: Action
│   ├── 17-the-aspirants-gate.md           # Layer 4: Action
│   └── 18-decision-matrix-and-conclusion.md
├── appendix/
│   ├── index.md
│   ├── appendix-a-quantum-ai-threats.md   # Layer 5: Appendices
│   ├── appendix-b-validation-checklist.md # Layer 5: Appendices
│   ├── appendix-c-glossary.md             # Layer 5: Appendices
│   ├── appendix-d-quick-reference.md      # Layer 5: Appendices
│   └── appendix-e-cisa-ztmm-crosswalk.md  # Layer 5: Appendices
├── public/                                # Static assets
├── .vitepress/
│   ├── config.ts                          # VitePress + vitepress-sidebar
│   └── theme/
│       ├── index.ts                       # Theme entry point
│       └── custom.css                     # Terminal dark theme
├── .github/workflows/deploy.yml           # GitHub Pages deployment
└── .nojekyll

_bmad-output/
└── planning-artifacts/
    ├── architecture.md                    # This document
    ├── prds/
    │   └── prd-zero-trust-2026-05-24/
    │       ├── prd.md
    │       └── addendum.md
    └── research/
        ├── domain-cybersecurity-*.md
        ├── technical-zero-trust-*.md
        └── technical-markdown-wiki-publishing-research-2026-05-24.md
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

## Wiki Publishing Infrastructure

### Infrastructure Scope

The 23-chapter textbook is delivered as a static documentation wiki — not as flat markdown files in a repository. The wiki infrastructure is the delivery mechanism for all content decisions made in Core Architectural Decisions and provides the rendered environment where cross-references resolve, search indexes content, and the terminal dark theme sets visual identity.

### Core Infrastructure Decisions

| # | Decision | Choice | Rationale |
|---|----------|--------|-----------|
| 11 | Static site generator | VitePress 1.6+ | <100ms HMR, Vue 3 + Vite, TypeScript-native config, built-in local search and dark mode, actively maintained by Vue.js core team. Jekyll (podman-arch-guide) was evaluated and rejected: 6-30s rebuilds, Liquid stack traces, Ruby toolchain requirement, and sunsetting trajectory |
| 12 | Sidebar auto-generation | vitepress-sidebar (jooy2, 20.4K weekly downloads) | Filesystem-based sidebar with zero manual configuration. Adding a file or directory auto-appears in navigation. Matches skid-security-research's proven pattern. `generateSidebar()` with `documentRootPath`, `useTitleFromFrontmatter`, `capitalizeFirst`, `collapsed: false`, `includeRootIndexFile: true` |
| 13 | Directory structure | Hybrid numbered + named (Option B from research) | Groups 23 files into 5 logical sections (01-foundations, 02-methodology, 03-archetypes, 04-synthesis, 05-advanced) + appendix/ directory. Directory prefixes enforce deterministic ordering; `vitepress-sidebar` respects lexicographic sort. Individual files drop numeric prefixes since directory ordering handles sequence |
| 14 | Design system | CSS variable overrides on VitePress default theme | Port podman-arch-guide's terminal dark theme via `--vp-c-*` variable overrides. Deep black background (`#0a0a0f`), JetBrains Mono + IBM Plex Sans typography, `#00ff9f`/`#00d4ff`/`#b967ff` accent palette, scanline overlay via `::after` pseudo-element, glow effects, custom scrollbar |
| 15 | Theme extension | Extend, don't fork | Use `extends: DefaultTheme` in `.vitepress/theme/index.ts`. Import `vitepress/theme-without-fonts` to avoid Inter font bundling. CSS variables for design tokens, layout slots for structural injection, Vue components only for interactive elements (terminal prompt, card grid, badges) |
| 16 | Deployment architecture | GitHub Actions + GitHub Pages | Atomic deploys with `configure-pages`, `upload-pages-artifact`, `deploy-pages`. Path-filtered builds only trigger on `docs/**`, `.vitepress/**`, `package.json`. Zero-cost (free tier for public repos). `.nojekyll` file at repo root. `cleanUrls: true` + `base: '/zero-trust/'` |
| 17 | Build pipeline | npm scripts in package.json | `"docs:dev": "vitepress dev docs"`, `"docs:build": "vitepress build docs"`, `"docs:preview": "vitepress preview docs"`. 2-3 second production builds for 23 pages. Local search provider builds index at build time |

### Decision Dependency Graph (Infrastructure)

```
VitePress SSG (11) ── affects ──> Sidebar auto-generation (12)
                                    Theme extension (15)
                                    Build pipeline (17)

Sidebar auto-generation (12) ── affects ──> Directory structure (13)
                                              Frontmatter strategy

Directory structure (13) ── affects ──> Cross-reference paths (Decision 7)
                                        File organization (Architecture § Layer Boundaries)

Design system (14) ── affects ──> Theme extension (15)
                                   Custom CSS file

Deployment architecture (16) ── affects ──> Build pipeline (17)
                                             GitHub Pages configuration
```

### Directory Structure (Post-Restructuring)

```
docs/
├── index.md                               # Home page with hero layout
├── 01-foundations/
│   ├── index.md                           # Section landing page
│   ├── 00-preface.md
│   ├── 01-the-case-for-zero-trust.md
│   ├── 02-the-octagon.md
│   └── 03-octagon-as-instrument.md
├── 02-methodology/
│   ├── index.md
│   ├── 04-the-morphological-matrix.md
│   ├── 05-dimensions-trust-to-attestation.md
│   ├── 06-dimensions-response-to-human.md
│   └── 07-meta-patterns.md
├── 03-archetypes/
│   ├── index.md
│   ├── 08-archetype-a-holy-grail.md
│   ├── 09-archetype-b-fortune-500.md
│   ├── 10-archetype-c-startup.md
│   ├── 11-archetype-d-lean-defense.md
│   └── 12-cross-trace-synthesis.md
├── 04-synthesis/
│   ├── index.md
│   ├── 13-self-assessment.md
│   ├── 14-enterprise-turnaround.md
│   ├── 15-velocity-defender.md
│   ├── 16-scaling-pat.md
│   ├── 17-the-aspirants-gate.md
│   └── 18-decision-matrix-and-conclusion.md
├── appendix/
│   ├── index.md
│   ├── appendix-a-quantum-ai-threats.md
│   ├── appendix-b-validation-checklist.md
│   ├── appendix-c-glossary.md
│   ├── appendix-d-quick-reference.md
│   └── appendix-e-cisa-ztmm-crosswalk.md
├── public/
│   └── (static assets)
├── .vitepress/
│   ├── config.ts                          # VitePress + vitepress-sidebar config
│   └── theme/
│       ├── index.ts                       # Theme entry (extends DefaultTheme)
│       └── custom.css                     # Terminal dark theme overrides
├── .github/
│   └── workflows/
│       └── deploy.yml                     # GitHub Pages deployment pipeline
├── .nojekyll
└── package.json
```

### Migration Strategy

**Phase 1: Scaffold (15 minutes)**
1. Initialize `package.json` with `npm init`
2. Install dependencies: `npm install -D vitepress vitepress-sidebar`
3. Add npm scripts for dev/build/preview
4. Create `.vitepress/config.ts` with base path, sidebar auto-generation, and local search
5. Create `.vitepress/theme/index.ts` extending default theme without fonts
6. Create `.vitepress/theme/custom.css` with terminal dark theme variables
7. Add `.nojekyll` at repo root

**Phase 2: Restructure (15 minutes)**
1. Create section directories: `01-foundations/` through `appendix/`
2. Move existing `.md` files into appropriate directories
3. Create section `index.md` landing pages
4. Create `docs/index.md` with `layout: home` and hero section

**Phase 3: Frontmatter (30 minutes)**
1. Add `title` and `description` frontmatter to all 23+ `.md` files
2. Add `outline: deep` for long-form chapters
3. Verify all pages appear in auto-generated sidebar

**Phase 4: Design (1-2 hours)**
1. Port podman-arch-guide CSS tokens to `--vp-c-*` variables
2. Add Google Fonts (JetBrains Mono + IBM Plex Sans) via `@import`
3. Add scanline overlay effect via `::after` pseudo-element
4. Add gradient background effects
5. Register custom Vue components if needed (terminal prompt, card grid, badges)

**Phase 5: Deploy (15 minutes)**
1. Create `.github/workflows/deploy.yml` with Node 24, configure-pages, build, and deploy steps
2. Configure GitHub Pages → Source: "GitHub Actions" in repository settings
3. Push to main — verify deployment at `https://<user>.github.io/zero-trust/`

**Total effort:** ~2-4 hours for complete, production-ready wiki with automated sidebar, terminal dark theme, and CI/CD deployment.

### CSS Variable Mapping (podman-arch-guide → VitePress)

| podman-arch-guide CSS | VitePress CSS Variable | Value |
|----------------------|----------------------|-------|
| `--bg-primary` | `--vp-c-bg` | `#0a0a0f` |
| `--bg-secondary` | `--vp-c-bg-soft` | `#12121a` |
| `--bg-tertiary` | `--vp-c-bg-alt` | `#1a1a24` |
| `--text-primary` | `--vp-c-text-1` | `#e8e8ed` |
| `--text-secondary` | `--vp-c-text-2` | `#9898a6` |
| `--accent-green` | `--vp-c-brand-1` | `#00ff9f` |
| `--accent-cyan` | `--vp-c-brand-2` | `#00d4ff` |
| `--accent-purple` | `--vp-c-brand-3` | `#b967ff` |
| `--font-display` | `--vp-font-family-mono` | `JetBrains Mono`, monospace |
| `--font-body` | `--vp-font-family-base` | `IBM Plex Sans`, sans-serif |

### Infrastructure-Specific Implementation Patterns

**`.vitepress/config.ts` pattern:**
```typescript
import { defineConfig } from 'vitepress'
import { generateSidebar } from 'vitepress-sidebar'

export default defineConfig({
  base: '/zero-trust/',
  title: 'Zero Trust Architecture',
  description: 'A reference architecture textbook for zero-trust deployment',
  cleanUrls: true,
  markdown: {
    lineNumbers: true,
    theme: { dark: 'github-dark' }
  },
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
    ],
    sidebar: generateSidebar({
      documentRootPath: '/docs',
      collapsed: false,
      capitalizeFirst: true,
      useTitleFromFrontmatter: true,
      includeRootIndexFile: true,
    }),
    search: { provider: 'local' },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/...' }
    ]
  }
})
```

**`.vitepress/theme/index.ts` pattern:**
```typescript
import DefaultTheme from 'vitepress/theme-without-fonts'
import './custom.css'

export default {
  extends: DefaultTheme,
}
```

**`.vitepress/theme/custom.css` pattern:**
```css
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

:root {
  --vp-c-bg: #0a0a0f;
  --vp-c-bg-soft: #12121a;
  --vp-c-bg-alt: #1a1a24;
  --vp-c-text-1: #e8e8ed;
  --vp-c-text-2: #9898a6;
  --vp-c-brand-1: #00ff9f;
  --vp-c-brand-2: #00d4ff;
  --vp-c-brand-3: #b967ff;
  --vp-font-family-base: 'IBM Plex Sans', sans-serif;
  --vp-font-family-mono: 'JetBrains Mono', monospace;
}

.VPDoc::after {
  content: '';
  position: fixed;
  inset: 0;
  background: repeating-linear-gradient(
    0deg, transparent, transparent 2px,
    rgba(0, 0, 0, 0.03) 2px, rgba(0, 0, 0, 0.03) 4px
  );
  pointer-events: none;
  z-index: 9999;
}
```

**`.github/workflows/deploy.yml` pattern:**
```yaml
name: Deploy Wiki to GitHub Pages
on:
  push:
    branches: [main]
    paths:
      - 'docs/**'
      - '.vitepress/**'
      - 'package.json'
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
      - uses: actions/setup-node@v6
        with:
          node-version: 24
          cache: npm
      - uses: actions/configure-pages@v4
      - run: npm ci
      - run: npm run docs:build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: docs/.vitepress/dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/deploy-pages@v4
```

### Research Provenance

All infrastructure decisions derived from `technical-markdown-wiki-publishing-research-2026-05-24.md`, which analyzed two reference implementations (podman-arch-guide: Jekyll + custom terminal theme; skid-security-research: VitePress + vitepress-sidebar) plus 40+ web sources including VitePress official documentation, DeepWiki architecture analysis, GitHub issues, and migration case studies.

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
- [x] Complete directory structure defined (23+ files)
- [x] Layer boundaries established (6 layers)
- [x] Integration points mapped
- [x] Requirements to structure mapping complete

**Wiki Publishing Infrastructure**
- [x] SSG choice documented (VitePress + rationale)
- [x] Sidebar auto-generation configured (vitepress-sidebar)
- [x] Directory restructure plan defined (Option B — numbered sections)
- [x] Design system specified (terminal dark theme via CSS variables)
- [x] Deployment architecture designed (GitHub Actions + Pages)
- [x] Build pipeline configured (package.json scripts)
- [x] Migration strategy phased (5 phases, 2-4 hours)
- [x] CSS variable mapping table provided (podman → VitePress)
- [x] Config file patterns specified (config.ts, theme/index.ts, custom.css, deploy.yml)

### Architecture Readiness Assessment

**Overall Status:** READY FOR IMPLEMENTATION

**Confidence Level:** High — all checklist items verified, all 22+ FRs mapped, no critical gaps

**Key Strengths:**
- Decisions form a coherent dependency graph — no contradictions
- 6 implementation patterns prevent agent conflicts at specific conflict points
- 6 fidelity gates create layer-by-layer quality enforcement
- Self-assessment → pathway routing → escape hatch → re-routing forms a closed loop
- Research provenance chain (domain → technical → textbook) is bidirectionally traceable
- Wiki publishing infrastructure fully specified with config patterns and CSS mapping
- 17 architectural decisions documented (10 content + 7 infrastructure)

**Areas for Future Enhancement:**
- D9 measurement instrument design (PRD follow-up #3)
- Hendecagon/Tridecagon formal corollary development (PRD follow-up #2)
- Interactive self-assessment tool automation

### Implementation Handoff

**AI Agent Guidelines:**
- Follow all 17 architectural decisions exactly as documented (10 content + 7 infrastructure)
- Apply 6 implementation patterns consistently across all chapters
- Respect the 6-layer dependency graph — no forward references
- Run Appendix B checklist on every chapter modification
- Verify glossary consistency before committing any chapter change
- Deploy wiki infrastructure before content editing begins (Epic 0 → Epic 1)

**Implementation Sequence (from Decision Impact Analysis + Infrastructure):**

*Infrastructure setup (prerequisite for all content work):*
0. Scaffold VitePress + vitepress-sidebar + package.json (Decisions 11-12, 17)
1. Restructure docs/ into numbered section directories (Decision 13)
2. Port terminal dark theme CSS (Decision 14-15)
3. Create GitHub Actions deploy pipeline (Decision 16)

*Content implementation (requires working dev server for preview):*
4. Validate chapter dependency graph (Decision 2)
5. Verify axiom-to-dimension mapping table (Decision 1)
6. Apply matrix-first archetype consistency (Decision 3)
7. Implement inline citation markers (Decision 4)
8. Add explicit prior art section to Chapter 6 (Decision 5)
9. Implement cross-reference format across all chapters (Decision 7)
10. Build self-assessment truth table (Decision 8)
11. Structure pathway gates with escape hatches (Decision 9)
12. Draft Chapter 18 peer-review narrative (Decision 10)
13. Validate glossary consistency via Appendix B (Decision 6)
