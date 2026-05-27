---
stepsCompleted: [1, 2, 3, 4]
inputDocuments:
  - "_bmad-output/planning-artifacts/prds/prd-zero-trust-2026-05-24/prd.md"
  - "_bmad-output/planning-artifacts/prds/prd-zero-trust-2026-05-24/addendum.md"
  - "_bmad-output/planning-artifacts/research/technical-markdown-wiki-publishing-research-2026-05-24.md"
  - "_bmad-output/planning-artifacts/architecture.md"
---

# zero-trust - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for the Zero-Trust Reference Architecture Textbook, decomposing the requirements from the PRD, Architecture, and Addendum into implementable stories. The textbook comprises 23+ markdown files (18 chapters + 5 appendices + 1 preface + section landing pages) delivered via a VitePress static documentation wiki with automated sidebar, terminal dark theme, and GitHub Pages deployment. Stories span two categories: infrastructure setup (Epic 0 — wiki scaffolding, restructuring, theming, deployment pipeline) and content editing/validation (Epics 1-4 — applying architecture decisions, consistency patterns, and quality gates to all markdown files).

## Requirements Inventory

### Functional Requirements

#### Octagon: Eight Axioms of Zero-Trust (FR-1 through FR-3)

FR-1: Present eight axioms with precise invariant definitions, each accompanied by 2-3 derived corollaries. Each axiom must map to 1-3 morphological dimensions in a documented mapping table. A reader must be able to determine whether any given architecture satisfies or violates each axiom.

FR-2: Document the axiomatic evolution from Octagon (8) through Hendecagon (11) to Tridecagon (13). Preserve original formulations of Axioms 3, 5, 6 with the issues that triggered reformulation. Document Axioms 7 and 8 as peer-review additions with the gaps they closed. Acknowledge Axioms 10-13 (Hendecagon/Tridecagon) as forward-looking extensions in Chapter 18 without formalizing corollaries.

FR-3: Convert each of the 8 Octagon axioms into an auditable question with green/yellow/red scoring criteria, enabling an 8-question architecture audit. Each axiom produces exactly one diagnostic question with exactly three scoring thresholds. The instrument must detect the confidence/reality gap by measuring deployed capabilities versus claimed maturity.

#### Morphological Matrix (FR-4 through FR-6)

FR-4: Define nine dimensions (D1: Trust Anchor, D2: Identity Model, D3: Enforcement Layer, D4: Attestation Modality, D5: Violation Response, D6: Policy Distribution, D7: Observability Trust, D8: Organizational Posture, D9: Human Continuity). Each dimension must have 4-7 named, distinct values ordered from lowest to highest maturity. Document D9 as a late discovery during Archetype D analysis.

FR-5: Identify covariance clusters — which dimension values naturally co-vary because each enables the others. Document the low-maturity cluster (Software PKI ↔ Single Attestation ↔ Push ↔ Hard Deny ↔ Implicit Observability ↔ Siloed Org) and the high-maturity cluster (Silicon Anchor ↔ Triple Attestation ↔ Event-Streamed ↔ Trickle-Truth ↔ Air-Gapped Pipeline ↔ Presumptively Wrong). Explain why uncoordinated dimension upgrades produce diminishing returns.

FR-6: Establish the leverage point hierarchy ranking dimensions by upgrade impact: D5 > D4 > D8 > D2 > D7. Document the D4/D5 dependency deadlock (they must be upgraded together). Justify the ranking with cross-archetype trace evidence.

#### Attack Traces (FR-7 through FR-11)

FR-7: Narrate Archetype B (Fortune 500) attack trace: credential theft via infostealer → lateral movement → data exfiltration. Show how Single Source attestation enables the attack, Hard Deny causes business damage, siloed teams cannot coordinate, and implicit observability makes the attack invisible until tripwire.

FR-8: Narrate Archetype C (Startup) attack trace: CI/CD supply chain injection → deployment → data exfiltration. Show how Trust on First Use attestation passes the injected dependency, Degrade Gracefully preserves uptime at cost of confidentiality, and the 2025-2026 supply chain incidents validate the trace.

FR-9: Narrate Archetype D (Solo Operator) attack trace: MFA fatigue → credential compromise → SaaS session hijack. Show how the IAP protects self-hosted resources but not SaaS platforms, Single Source attestation produces low-signal alerts, bus factor of 1 produces bimodal MTTR, and implicit trust in SaaS vendor logs creates invisibility.

FR-10: Narrate Archetype A (Holy Grail) aspirational trace where the attacker encounters Trickle-Truth. Triple attestation detects anomaly before data moves, Trickle-Truth grafts session to synthetic environment, yielding zero data exfiltration, zero business impact, and positive intelligence yield.

FR-11: Extract meta-patterns from all four traces in a cross-trace synthesis chapter. Build a cross-mapped comparison table (MTTD, MTTR, exfiltration, business impact, intel yield). Document the visible middle fallacy and supply chain as the unifying blind spot. Validate all traces against 2026 domain and technical research.

#### Implementation Pathways (FR-12 through FR-15)

FR-12: Provide Archetype B implementation pathway (24-month enterprise turnaround). Q1-2: detection modernization (D4 + D5 together, $1.5-2.5M). Q3-4: enforcement modernization (D3, $2-3.5M). Year 2: observability and organization (D7, D8). Gate 1: if behavioral tuning fails, pivot to hardware-backed attestation. All phases must include explicit axiom-addressing statements.

FR-13: Provide Archetype C implementation pathway (12-month velocity defender). Q1: supply chain hardening (image signing + admission control + eBPF, $150-250K). Q2-3: identity and authority (SPIFFE/SPIRE, $200-350K). Q4: selective quarantine + network policy enforcement. Gate 1: if eBPF false positives persist, pivot to confidential containers. Every upgrade measured against the metric: does it add more than 60 seconds to CI/CD?

FR-14: Provide Archetype D implementation pathway (6-month scaling Pat). Week 1-4: eliminate bus factor (hardware keys + automated fallback + SaaS audit logging, ~$2,500 + $500/month). Month 2-3: automated response for clear cases. Month 4-6: browser-level SaaS enforcement. Gate 3: if alert load hasn't dropped below 30 min/day, reduce SaaS footprint. All recommendations must cost less than a monthly SaaS subscription and be actionable within a week.

FR-15: Document the Aspirant's Gate — the three most common gate failure patterns across all pathways and their correct pivots. Document the common failure of skipping D4 before D5. Map each gate failure to its specific pivot: behavioral tuning fails → hardware-backed attestation, eBPF false positives → confidential containers, automation cannot keep up → reduce SaaS footprint.

#### Self-Assessment Diagnostic (FR-16)

FR-16: Present 12 diagnostic questions spanning D1-D9 plus budget, primary threat, and deployment velocity. Each question must have exactly 4 ordered answer choices mapping to archetypes A-D. Questions must measure deployed capabilities, not aspirations. Document explicit tiebreakers for B/C and C/D boundaries using velocity and budget as decisive dimensions. Present the confidence/reality gap (57% vs 69%) as rationale for accurate self-assessment.

#### Decision Matrix (FR-17)

FR-17: Present a decision matrix with 7 rows (pain-threat pairs). Each row identifies a primary pain point and primary threat, maps to a specific morphological dimension with rationale, and references the corresponding implementation chapter. The matrix must be the textbook's most practical output: identify your pain, read the corresponding row, act.

#### Appendices (FR-18 through FR-21)

FR-18: Stress-test the Octagon against quantum computing threats (Harvest-Now-Decrypt-Later, PQC migration timeline: NIST deprecation of RSA/ECC by 2030, disallowance by 2035) and AI-generated attack chains (autonomous cloud exploitation, prompt injection, agentic adversaries). Show that ZTA deployment deadline (DoD 2027) comes before PQC migration deadline. Demonstrate AI attacks target D4 (behavioral attestation) and Axiom 7 (epistemic integrity). Position hardware-anchored cryptographic provenance as the mitigation for both.

FR-19: Provide a printable 8-question architecture validation checklist derived from the Octagon with green/yellow/red scoring per axiom. Each axiom maps to one diagnostic question with explicit scoring thresholds. Design for annual re-use and post-incident application.

FR-20: Define all domain terms used throughout the textbook in a glossary with cross-references. Every domain term introduced in the textbook must appear in the glossary. Definitions must be consistent with usage in FRs, axioms, and traces.

FR-21: Provide a single-page quick-reference card listing all eight axioms with one-line definitions, all nine dimensions with value ranges, and all four archetypes with starting configuration and primary threat.

#### Cross-Chapter Navigation (FR-22)

FR-22: Implement prerequisite and cross-reference system across all 18 chapters. Every chapter header must include a "Prerequisites" section with chapter references. Every chapter end must include a "Cross-References" section with Next, Builds On, and Related links. A reader must be able to navigate from self-assessment (Chapter 13) → archetype-specific implementation chapter without reading the entire book. Cross-references must only flow downward in the layer graph (no forward or same-layer references). The chapter dependency graph must be acyclic.

### Non-Functional Requirements

NFR-1: Vendor-neutral — technologies named only in footnotes as points of reference. The Octagon axioms must remain true when today's hardware is obsolete and today's vendors have been acquired.

NFR-2: Not a compliance framework — does not map to SOC 2, ISO 27001, HIPAA, or PCI DSS controls. Defines an orthogonal analysis framework, not a replacement for NIST SP 800-207 or CISA ZTMM.

NFR-3: Independently verifiable — every architectural claim must be traceable to 2025-2026 research reports (domain + technical) via inline citation markers.

NFR-4: Acyclic chapter dependency graph — no later chapter depends on a concept introduced in a later chapter. All prerequisites must reference earlier layers only.

NFR-5: Terminological consistency — all domain terms used in FRs, axioms, and traces must appear in Appendix C glossary with consistent, non-conflicting definitions.

NFR-6: Research provenance format — inline citation markers must use `[DR-§Section]` (domain research) or `[TR-§Section]` (technical research) format, placed before sentence-ending periods, at claim granularity.

NFR-7: Cross-reference direction — all chapter cross-references flow strictly downward in the 6-layer dependency graph. No same-layer or forward references permitted.

NFR-8: Dimension value fidelity — all `D{N}: Value Name` references must use exact matrix value names from Chapters 4-6. No synonyms or paraphrased value names. Case-sensitive matching enforced.

NFR-9: Gateway integrity — each of the 6 fidelity gates must be verified before agents proceed to the next layer. No gate can be skipped.

NFR-10: Glossary synchronization — new terms must be added to Appendix C in the same change as the chapter that introduces them. Glossary must be alphabetically ordered with cross-reference anchor links.

### Additional Requirements (from Architecture)

AR-1: Implement 6 consistency patterns (glossary vocabulary, cross-reference format, dimension value vocabulary, research citation format, prerequisite declaration pattern, glossary entry pattern) with good/anti-pattern examples across all 23 files.

AR-2: Respect the 6-layer dependency graph (Foundation → Theory → Architecture → Reality → Action → Appendices). Cross-references only flow downward; no forward or same-layer references.

AR-3: Apply 6 fidelity gates sequenced by layer for quality enforcement. Gate 1 (Layers 0-1): all 8 axioms defined. Gate 2 (Layers 1-2): axiom-to-dimension mapping table complete. Gate 3 (Layers 2-3): all dimension values registered, no trace uses undefined values. Gate 4 (Layers 3-4): all attack traces cross-referenced against research. Gate 5 (Layers 4-5): all pathways have gate checks with escape hatches. Gate 6 (final): Appendix B checklist validates all chapters.

AR-4: Maintain research provenance chain — domain research → technical research → textbook claims must be bidirectionally traceable. Every claim carries a citation marker resolving to a specific research report section.

AR-5: Run Appendix B validation checklist on every chapter modification. Any chapter failing a checklist item is blocked until the violation is fixed.

AR-6: Apply matrix-first archetype consistency rules — attack traces can only reference dimension values already defined in the morphological matrix (Chapters 4-6). New values must extend the matrix first, register in Chapter 7, then be referenced.

AR-7: Follow the 10-step implementation sequence from the architecture's Decision Impact Analysis: validate chapter dependency graph → verify axiom-to-dimension mapping → apply matrix-first consistency → implement citation markers → add prior art section to Chapter 6 → implement cross-reference format → build self-assessment truth table → structure pathway gates → draft Chapter 18 peer-review narrative → validate glossary consistency.

AR-8: Track incremental completion — update `stepsCompleted` in frontmatter for each processed chapter. Document per-epic completion as stories are implemented.

### Additional Requirements (from Architecture — Wiki Infrastructure)

AR-9: Follow 7 wiki infrastructure decisions (Architecture Decisions 11-17): VitePress SSG, vitepress-sidebar, Option B directory structure, CSS variable theme extension, extend-don't-fork theme pattern, GitHub Actions + Pages deployment, npm script build pipeline.

AR-10: Reseed docs/ directory from flat structure to numbered sections (01-foundations/, 02-methodology/, 03-archetypes/, 04-synthesis/, appendix/) before any content editing begins, so cross-reference paths in Architecture Decision 7 resolve correctly in the rendered wiki.

AR-11: Create `package.json` with `docs:dev`, `docs:build`, `docs:preview` scripts. Dependencies: `vitepress` (^1.6), `vitepress-sidebar` (^1.33). No other runtime dependencies.

AR-12: Port podman-arch-guide terminal dark theme to `.vitepress/theme/custom.css` via `--vp-c-*` CSS variable overrides. Use `@import` for Google Fonts (IBM Plex Sans + JetBrains Mono). Add scanline overlay via `::after` pseudo-element. Do not fork or replace VitePress default theme components.

AR-13: Create `.github/workflows/deploy.yml` with path-filtered trigger (`docs/**`, `.vitepress/**`, `package.json`), Node 24, `configure-pages`, npm ci → build → upload artifact → deploy. Zero-cost GitHub Pages hosting.

AR-14: All 23+ content files must use YAML frontmatter with `title` (drives sidebar label and page title) and `description` (SEO, social previews, search results). Long-form chapters should include `outline: deep`.

AR-15: Wiki must be verified functional before any content editing begins — dev server starts, build completes without warnings, sidebar auto-generates, search works, theme renders correctly.

### UX Design Requirements

None — this is a textbook production project with no user interface. All stories concern markdown document editing, validation, and consistency enforcement across 23 files.

### FR Coverage Map

Epic 0: Wiki infrastructure — VitePress SSG, vitepress-sidebar, terminal dark theme, GitHub Pages deployment
FR-1 (Axiom Declaration): Epic 1 — Chapter 02: The Octagon
FR-2 (Axiom Refinement History): Epic 1 — Chapters 02, 18
FR-3 (Octagon as Validation Instrument): Epic 1 — Chapter 03: Octagon as Instrument
FR-4 (Dimension Definition): Epic 1 — Chapters 04, 05, 06
FR-5 (Covariance Cluster Identification): Epic 1 — Chapter 07: Meta-Patterns
FR-6 (Leverage Point Hierarchy): Epic 1 — Chapter 07: Meta-Patterns
FR-7 (Archetype B Attack Trace): Epic 2 — Chapter 09: Archetype B Fortune 500
FR-8 (Archetype C Attack Trace): Epic 2 — Chapter 10: Archetype C Startup
FR-9 (Archetype D Attack Trace): Epic 2 — Chapter 11: Archetype D Lean Defense
FR-10 (Archetype A Attack Trace): Epic 2 — Chapter 08: Archetype A Holy Grail
FR-11 (Cross-Trace Synthesis): Epic 2 — Chapter 12: Cross-Trace Synthesis
FR-12 (Archetype B Implementation): Epic 3 — Chapter 14: Enterprise Turnaround
FR-13 (Archetype C Implementation): Epic 3 — Chapter 15: Velocity Defender
FR-14 (Archetype D Implementation): Epic 3 — Chapter 16: Scaling Pat
FR-15 (Aspirant's Gate): Epic 3 — Chapter 17: The Aspirant's Gate
FR-16 (Self-Assessment Diagnostic): Epic 3 — Chapter 13: Self-Assessment
FR-17 (Decision Matrix): Epic 3 — Chapter 18: Decision Matrix and Conclusion
FR-18 (Quantum + AI Stress-Test): Epic 4 — Appendix A
FR-19 (Validation Checklist): Epic 4 — Appendix B
FR-20 (Glossary): Epic 4 — Appendix C
FR-21 (Quick-Reference Card): Epic 4 — Appendix D
FR-22 (Cross-Chapter Navigation): Epic 1 (Chapters 00-07), Epic 2 (Chapters 08-12), Epic 3 (Chapters 13-18), Epic 4 (Appendices + global consistency pass)

## Epic List

### Epic 0: Wiki Infrastructure — VitePress, Theme, and Deployment

The textbook content is delivered as a static documentation wiki with automated sidebar, terminal dark theme, and CI/CD deployment. The infrastructure must exist before content editing begins — content editors need a working local dev server with hot reload to verify cross-references, citation formatting, and glossary links render correctly. Without the wiki, the `[§Chapter: Title](../path/to/file.md#anchor)` cross-reference format (Architecture Decision 7) can't be visually validated.

**FRs covered:** FR-22 (Navigation — rendered verification)
**Infrastructure:** VitePress 1.6+, vitepress-sidebar, GitHub Actions + Pages, terminal dark theme CSS
**Files:** package.json, .vitepress/config.ts, .vitepress/theme/index.ts, .vitepress/theme/custom.css, .github/workflows/deploy.yml, .nojekyll
**Research basis:** `technical-markdown-wiki-publishing-research-2026-05-24.md`

### Story 0.1: Scaffold VitePress Project and Dependencies

As the dev agent,
I need a working VitePress project with vitepress-sidebar auto-generating navigation,
So that content editors have a local dev server with hot module reload for verifying rendered output.

**Acceptance Criteria:**

**Given** the zero-trust repository with 23+ flat markdown files in `docs/` and no existing Node.js tooling
**When** the dev agent sets up the wiki infrastructure
**Then** `package.json` must exist at the repo root with these scripts:
- `"docs:dev": "vitepress dev docs"` — local dev server with HMR
- `"docs:build": "vitepress build docs"` — production build
- `"docs:preview": "vitepress preview docs"` — preview production build
**And** `package.json` must include devDependencies: `vitepress` (^1.6), `vitepress-sidebar` (^1.33)
**And** `.vitepress/config.ts` must exist at repo root with:
- `base: '/zero-trust/'`
- `title: 'Zero Trust Architecture'`
- `cleanUrls: true`
- `markdown: { lineNumbers: true, theme: { dark: 'github-dark' } }`
- `themeConfig.search: { provider: 'local' }`
- `themeConfig.nav` with at minimum `{ text: 'Home', link: '/' }`
- `generateSidebar()` import from `vitepress-sidebar` with `documentRootPath: '/docs'`, `collapsed: false`, `capitalizeFirst: true`, `useTitleFromFrontmatter: true`, `includeRootIndexFile: true`
**And** `.vitepress/theme/index.ts` must exist extending `vitepress/theme-without-fonts` (not the default with bundled Inter font)
**And** `.vitepress/theme/custom.css` must exist (minimal skeleton OK — Story 0.3 fills it in)
**And** `.nojekyll` empty file must exist at the repo root
**And** `npm run docs:dev` must start successfully and serve the wiki on localhost
**And** all existing `.md` files must appear in the auto-generated sidebar without manual configuration

### Story 0.2: Restructure docs/ into Numbered Section Directories

As the dev agent,
I need the 23 flat markdown files restructured into 5 logical sections + appendix directory,
So that the auto-generated sidebar creates collapsible navigation groups matching the layer architecture.

**Acceptance Criteria:**

**Given** 23 flat markdown files in `docs/` (00-preface through appendix-d)
**When** the dev agent restructures the directory
**Then** the following directory structure must exist:

```
docs/
├── index.md                                    (created new — home page with layout: home)
├── 01-foundations/
│   ├── index.md                                (section landing)
│   ├── 00-preface.md                           (moved from root)
│   ├── 01-the-case-for-zero-trust.md           (moved)
│   ├── 02-the-octagon.md                       (moved)
│   └── 03-octagon-as-instrument.md             (moved)
├── 02-methodology/
│   ├── index.md
│   ├── 04-the-morphological-matrix.md          (moved)
│   ├── 05-dimensions-trust-to-attestation.md   (moved)
│   ├── 06-dimensions-response-to-human.md      (moved)
│   └── 07-meta-patterns.md                     (moved)
├── 03-archetypes/
│   ├── index.md
│   ├── 08-archetype-a-holy-grail.md            (moved)
│   ├── 09-archetype-b-fortune-500.md           (moved)
│   ├── 10-archetype-c-startup.md               (moved)
│   ├── 11-archetype-d-lean-defense.md          (moved)
│   └── 12-cross-trace-synthesis.md             (moved)
├── 04-synthesis/
│   ├── index.md
│   ├── 13-self-assessment.md                   (moved)
│   ├── 14-enterprise-turnaround.md             (moved)
│   ├── 15-velocity-defender.md                 (moved)
│   ├── 16-scaling-pat.md                       (moved)
│   ├── 17-the-aspirants-gate.md                (moved)
│   └── 18-decision-matrix-and-conclusion.md    (moved)
├── appendix/
│   ├── index.md
│   ├── appendix-a-quantum-ai-threats.md        (moved)
│   ├── appendix-b-validation-checklist.md      (moved)
│   ├── appendix-c-glossary.md                  (moved)
│   ├── appendix-d-quick-reference.md           (moved)
│   └── appendix-e-cisa-ztmm-crosswalk.md       (placeholder if not yet created)
└── public/                                      (created new — empty, for static assets)
```

**And** each section `index.md` must have minimal content: `title` frontmatter matching the section name and a brief description of what that section covers
**And** `docs/index.md` must use `layout: home` with a hero section containing the textbook title, subtitle, and a brief description
**And** all file moves must be git-tracked (use `git mv` so history is preserved)
**And** `npm run docs:build` must succeed with zero warnings after restructuring
**And** the auto-generated sidebar must show 5 collapsible section groups + appendix, with each file nested under its parent directory

### Story 0.3: Port Terminal Dark Theme CSS

As the dev agent,
I need the podman-arch-guide terminal dark theme ported to VitePress CSS variables,
So that the wiki has the black-background, scanline-overlay, JetBrains Mono aesthetic specified in the architecture.

**Acceptance Criteria:**

**Given** the skeleton `custom.css` from Story 0.1
**When** the dev agent populates the terminal dark theme
**Then** `.vitepress/theme/custom.css` must contain:

```
Color palette (--vp-c-* overrides):
  --vp-c-bg: #0a0a0f           (deep black background)
  --vp-c-bg-soft: #12121a      (slightly lighter for cards/code blocks)
  --vp-c-bg-alt: #1a1a24       (alternate surface)
  --vp-c-text-1: #e8e8ed       (primary text)
  --vp-c-text-2: #9898a6       (secondary/muted text)
  --vp-c-brand-1: #00ff9f      (primary accent — green)
  --vp-c-brand-2: #00d4ff      (secondary accent — cyan)
  --vp-c-brand-3: #b967ff      (tertiary accent — purple)

Typography:
  @import of Google Fonts: IBM Plex Sans (400, 500, 600) + JetBrains Mono (400, 500)
  --vp-font-family-base: 'IBM Plex Sans', sans-serif
  --vp-font-family-mono: 'JetBrains Mono', monospace

Scanline effect:
  .VPDoc::after pseudo-element with:
    position: fixed; inset: 0;
    background: repeating-linear-gradient(
      0deg, transparent, transparent 2px,
      rgba(0, 0, 0, 0.03) 2px, rgba(0, 0, 0, 0.03) 4px
    );
    pointer-events: none; z-index: 9999;

Code blocks:
  Inline code color: var(--vp-c-brand-1)
  Block code background: var(--vp-c-bg-soft)
  Border color: var(--vp-c-brand-1) at 15% opacity

Selection:
  ::selection with green text on black background

Scrollbar:
  Custom styling with accent color on hover

Glow effects:
  box-shadow with accent colors at 10-15% opacity on focused elements
```

**And** the Google Fonts `@import` must be at the top of the file (before any CSS rules)
**And** `npm run docs:dev` must render with the terminal dark theme visible — black background, green/cyan/purple accents, JetBrains Mono in code blocks
**And** the scanline overlay effect must be visible on document pages but must NOT interfere with click/scroll interactivity (`pointer-events: none`)
**And** dark mode must be the default (and only) mode — override VitePress's light/dark toggle if needed
**And** all custom CSS must use VitePress's official `--vp-c-*` CSS variable API — no monkey-patching internal VitePress classes except for scanlines/glow

### Story 0.4: Create GitHub Actions Deployment Pipeline

As the dev agent,
I need a GitHub Actions workflow that builds and deploys the wiki to GitHub Pages,
So that push-to-main triggers automatic deployment with zero manual steps.

**Acceptance Criteria:**

**Given** a working `npm run docs:build` that outputs to `docs/.vitepress/dist/`
**When** the dev agent creates the deployment pipeline
**Then** `.github/workflows/deploy.yml` must exist with:

```
Trigger:
  push to main branch, filtered to paths:
    - 'docs/**'
    - '.vitepress/**'
    - 'package.json'
    - '.github/workflows/deploy.yml'
  workflow_dispatch (manual trigger)

Permissions:
  contents: read
  pages: write
  id-token: write

Concurrency:
  group: pages
  cancel-in-progress: false (prevents stale deployments)

Build job:
  runs-on: ubuntu-latest
  Steps:
    1. actions/checkout@v5
    2. actions/setup-node@v6
       with: node-version: 24, cache: npm
    3. actions/configure-pages@v4
    4. npm ci
    5. npm run docs:build
    6. actions/upload-pages-artifact@v3
       with: path: docs/.vitepress/dist

Deploy job:
  needs: build
  runs-on: ubuntu-latest
  environment:
    name: github-pages
    url: ${{ steps.deployment.outputs.page_url }}
  Steps:
    1. actions/deploy-pages@v4
       id: deployment
```

**And** the workflow must reference `actions/checkout@v5` (latest major version as of 2026)
**And** the workflow must reference `actions/setup-node@v6` (latest major version as of 2026)
**And** Node.js version must be `24` (current LTS as of 2026)
**And** the path filter must exclude irrelevant changes (code changes outside `docs/`, `.vitepress/`, `package.json`, or the workflow itself)
**And** the `concurrency` group must prevent multiple simultaneous deployments from conflicting
**And** the `deploy` job must use `environment: github-pages` so the deployment URL is available via `${{ steps.deployment.outputs.page_url }}`

### Story 0.5: Wiki Infrastructure Verification and Smoke Test

As the architecture validator,
I need to verify the full wiki pipeline works end-to-end,
So that Epic 0 is complete and content editors have a fully functional publishing system.

**Acceptance Criteria:**

**Given** all infrastructure from Stories 0.1-0.4 is in place
**When** the dev agent runs the verification
**Then** `npm run docs:dev` must start successfully with zero errors — verify by checking process exit code
**And** `npm run docs:build` must complete with zero warnings — build output must exist at `docs/.vitepress/dist/`
**And** all 23+ content files must appear in the auto-generated sidebar with their frontmatter `title` as the sidebar label
**And** the 5 section directories (01-foundations through 04-synthesis + appendix) must appear as collapsible sidebar groups
**And** the terminal dark theme must render — spot-check: black background, green accent on active nav items, JetBrains Mono in code blocks, scanline overlay visible
**And** local search must return results — search for "octagon" must return relevant pages
**And** dark mode must be the only mode — no light/dark toggle visible (or light mode disabled)
**And** all internal links must resolve during `npm run docs:build` — VitePress build fails on dead links by default
**And** `docs/.vitepress/dist/` must contain `index.html`, section directories, and asset files (JS/CSS)
**And** `.nojekyll` must exist at repo root (verify file exists and is empty)
**And** the deploy workflow syntax must be valid — run `act --dryrun` or manual YAML validation
**And** the wiki must be functional offline — `npm run docs:preview` must serve the production build locally

### Epic 1: The Octagon — Axioms, Matrix, and Audit Framework

Reader can understand the 8 axioms with corollaries, map any architecture to the 9-dimension configuration space, understand covariance clusters and leverage points, and apply the 8-question Octagon audit instrument in under one hour. Covers Layers 0-2 (Foundation, Theory, Architecture) — 8 chapters with prerequisite declarations, cross-references, axiom-to-dimension mapping table, inline citations, and all 6 consistency patterns applied.

**FRs covered:** FR-1, FR-2, FR-3, FR-4, FR-5, FR-6, FR-22 (Layers 0-2)
**Files:** 00-preface.md, 01-the-case-for-zero-trust.md, 02-the-octagon.md, 03-octagon-as-instrument.md, 04-the-morphological-matrix.md, 05-dimensions-trust-to-attestation.md, 06-dimensions-response-to-human.md, 07-meta-patterns.md

### Story 1.1: Foundation — Preface and Case for Zero-Trust

As a reader,
I want a clear preface and opening chapter that sets the stage,
So that I understand the textbook's purpose, audience, structure, and why the perimeter model is dead.

**Acceptance Criteria:**

**Given** the existing `00-preface.md` and `01-the-case-for-zero-trust.md` with drafted content
**When** the dev agent edits both files
**Then** `00-preface.md` must have a `**Prerequisites:** None` declaration immediately after the chapter title
**And** `00-preface.md` must have a `**Cross-References**` section at chapter end with `**Next:**` pointing to Chapter 1
**And** `01-the-case-for-zero-trust.md` must have a `**Prerequisites:**` section declaring `00-preface.md` as its only prerequisite
**And** `01-the-case-for-zero-trust.md` must have a `**Cross-References**` section at chapter end with `**Next:**` pointing to Chapter 2, `**Builds On:**` pointing to Chapter 0, and `**Related:**` empty
**And** all cross-reference links must use relative markdown links in `[§Chapter-Number: Section-Name](../path/to/file.md#section-anchor)` format
**And** both files must pass the Appendix B checklist items applicable to Layer 0-1 chapters

### Story 1.2: The Octagon — Eight Axioms with Corollaries

As a reader,
I want a rigorous presentation of the eight axioms,
So that I can evaluate whether any architecture satisfies or violates each invariant.

**Acceptance Criteria:**

**Given** the existing `02-the-octagon.md` with drafted content
**When** the dev agent edits the file
**Then** each of the 8 axioms must be stated as an invariant, not an implementation recommendation
**And** each axiom must have 2-3 derived corollaries
**And** a documented axiom-to-dimension mapping table must be present, mapping each axiom to 1-3 morphological dimensions (D1-D9)
**And** the axiom refinement history section must document: original formulations of Axioms 3, 5, 6 with the issues that triggered reformulation
**And** it must document Axioms 7 and 8 as peer-review additions with the gaps they closed
**And** it must acknowledge Axioms 9-13 (Hendecagon/Tridecagon) as forward-looking extensions in a dedicated section
**And** the file must carry `**Prerequisites:** Chapter 1 (The Case for Zero-Trust)`
**And** `**Cross-References**` must include `**Next:**` to Chapter 3, `**Builds On:**` to Chapter 1
**And** all dimension value references must use exact matrix vocabulary (e.g., `D1: Silicon Anchor`, not synonyms)
**And** all research citations must use `[DR-§Section]` / `[TR-§Section]` format

### Story 1.3: Octagon as Validation Instrument

As a security engineer,
I want to audit any architecture against the Octagon in under one hour,
So that I can detect the confidence/reality gap between claimed and deployed zero-trust maturity.

**Acceptance Criteria:**

**Given** the existing `03-octagon-as-instrument.md` with drafted content
**When** the dev agent edits the file
**Then** each of the 8 Octagon axioms must be converted into exactly one diagnostic question
**And** each question must have exactly three scoring thresholds: green (satisfies axiom), yellow (partially satisfies), red (violates axiom)
**And** the instrument must include a section explaining how it detects the confidence/reality gap by measuring deployed capabilities versus claimed maturity
**And** the file must carry `**Prerequisites:** Chapter 2 (The Octagon)`
**And** `**Cross-References**` must include `**Next:**` to Chapter 4, `**Builds On:**` to Chapter 2
**And** cross-references to specific axioms must use relative links like `[§2: The Octagon](../02-the-octagon.md#axiom-4-continuous-verification)`

### Story 1.4: Morphological Matrix Foundation

As an architect,
I want a clear definition of all nine morphological dimensions with ordered value sets,
So that I can map my organization's posture to a specific configuration.

**Acceptance Criteria:**

**Given** the existing `04-the-morphological-matrix.md` with drafted content
**When** the dev agent edits the file
**Then** all 9 dimensions (D1: Trust Anchor through D9: Human Continuity) must be defined with explicit, named value sets
**And** each dimension must have 4-7 named, distinct values ordered from lowest to highest maturity
**And** D9 (Human Continuity) must be documented as a late discovery during Archetype D analysis, including the operational failure patterns that justified its addition
**And** the file must carry `**Prerequisites:** Chapter 2 (The Octagon)`
**And** `**Cross-References**` must include `**Next:**` to Chapter 5, `**Builds On:**` to Chapter 2
**And** first-use of any glossary term must use bold + link format: `**Term Name**[↗]`
**And** all dimension value names must be consistent with the exact names used in Chapters 5 and 6 (verified by reading both files)

> **And** `04-the-morphological-matrix.md` must name the CISA ZTMM explicitly where maturity models are critiqued, changing "Most zero-trust guidance presents a maturity model..." to "Most zero-trust guidance — including CISA's Zero Trust Maturity Model v2.0, the most widely adopted federal framework — presents a maturity model..."
> **And** `04-the-morphological-matrix.md` must include a new subsection "Where Devices Fit in the Matrix" explaining: the ZTMM Devices pillar functions (Policy Enforcement & Compliance Monitoring, Asset & Supply Chain Risk Management, Resource Access, Device Threat Protection) map across D1 (hardware trust anchor), D4 (device attestation), and D7 (endpoint telemetry trust); devices are a cross-dimensional concern, not a standalone dimension
> **And** `04-the-morphological-matrix.md` must include a sidebar "DoD Zero Trust Pillar Mapping" showing how each DoD 7-pillar (User, Device, Network/Environment, Application & Workload, Data, Visibility & Analytics, Automation & Orchestration) maps to primary Octagon dimensions and axioms
> **And** `04-the-morphological-matrix.md` must include a sidebar "CSF Profiles and Morphological Dimensions" showing how the NIST CSF 2.0 Profile concept is the governance-level equivalent of the project's dimensional self-assessment, and how CSF Tiers (Partial, Risk Informed, Repeatable, Adaptive) map approximately to the Low-Maturity → High-Maturity cluster progression

### Story 1.5: Dimensions Deep Dive (D1-D9)

As an architect,
I want deep technical content on every morphological dimension,
So that I understand the full configuration space, including the Trickle-Truth Garden specification and leverage hierarchy.

**Acceptance Criteria:**

**Given** the existing `05-dimensions-trust-to-attestation.md` and `06-dimensions-response-to-human.md` with drafted content
**When** the dev agent edits both files
**Then** `05-dimensions-trust-to-attestation.md` must provide deep dive on D1-D4 with all value sets expanded and explained
**And** `06-dimensions-response-to-human.md` must provide deep dive on D5-D9 with all value sets expanded and explained
**And** Chapter 6 must include an explicit "Prior Art" section naming each component that has prior art (honeypots, canary tokens, MTD, DARPA active defense) and demarcating what the Trickle-Truth Garden adds: adaptive garbage pollution rate, temporal manipulation, state-anchored deterministic synthesis, real-time TTP classification, and the Epistemic Binding Key
**And** the leverage point hierarchy (D5 > D4 > D8 > D2 > D7) must be justified with cross-archetype evidence
**And** the D4/D5 dependency deadlock (they must be upgraded together) must be explicitly documented
**And** both files must carry prerequisite declarations (`05` requires Chapter 4, `06` requires Chapter 5)
**And** `05` must have `**Next:**` to Chapter 6; `06` must have `**Next:**` to Chapter 7
**And** all `D{N}: Value Name` references must use exact values from Chapter 4's dimension definitions

> **And** `05-dimensions-trust-to-attestation.md` must include a comparison table mapping NIST SP 800-207 deployment variations (Device-Agent/Gateway, Enclave Gateway, Resource Portal, Application Sandbox) to D3 (Enforcement Layer) values (Network, Service Mesh, Gateway, Data, Silicon, Bilateral), showing for each NIST variation which D3 values satisfy it
> **And** `05-dimensions-trust-to-attestation.md` must add SP 800-207A citations wherever service mesh or API gateway enforcement is discussed as a D3 value, establishing the pattern as formally NIST-validated
> **And** `05-dimensions-trust-to-attestation.md` must add a DoD data-centric security citation to the D3=Data (Cryptographic) discussion, where data carries its own policy envelope, as the implementation of the DoD's "protect the data, not the network" principle

### Story 1.6: Meta-Patterns — Covariance, Leverage, and Mapping

As an architect,
I want to understand which dimension clusters co-vary and which dimensions give the highest upgrade leverage,
So that I can sequence my zero-trust investment for maximum impact.

**Acceptance Criteria:**

**Given** the existing `07-meta-patterns.md` with drafted content
**When** the dev agent edits the file
**Then** the low-maturity covariance cluster must be explicitly documented: Software PKI ↔ Single Attestation ↔ Push ↔ Hard Deny ↔ Implicit Observability ↔ Siloed Org
**And** the high-maturity covariance cluster must be explicitly documented: Silicon Anchor ↔ Triple Attestation ↔ Event-Streamed ↔ Trickle-Truth ↔ Air-Gapped Pipeline ↔ Presumptively Wrong
**And** the chapter must explain why uncoordinated dimension upgrades produce diminishing returns (covariance insight)
**And** the axiom-to-dimension mapping table must be present and validated as the critical connective tissue between Parts I and II — every axiom must map to 1-3 dimensions, every dimension must be referenced by at least one axiom
**And** the file must carry `**Prerequisites:** Chapter 4 (The Morphological Matrix), Chapter 6 (Dimensions: Response to Human)`
**And** `**Cross-References**` must include `**Next:**` to Chapter 8, `**Builds On:**` to Chapters 4 and 6, `**Related:**` to Chapter 2
**And** no cross-reference may point forward (to Chapters 8+) or to same-layer files (Chapters 4, 5, 6)

> **And** `07-meta-patterns.md` must include a "Data Lifecycle" subsection reframing ZTMM Data pillar functions in Octagon terms: Data Inventory Management → precondition for Axiom 3 (can't mediate access to unknown data), Data Categorization → input to Axiom 5 (authority vectors calibrated to data sensitivity), Data Availability → constraint on Axiom 6 (BFT must maintain availability under partition)
> **And** `07-meta-patterns.md` must include a "Governance as a Cross-Dimensional Concern" subsection mapping the ZTMM's Governance capability (Traditional: ad hoc policies/manual processes → Optimal: fully automated enterprise-wide policies with continuous enforcement) to D8 (Organizational Posture) and Axiom 2
> **And** `07-meta-patterns.md` must include the structured cross-cutting capability mapping table: Visibility & Analytics → Axiom 7 + D7/D4, Automation & Orchestration → Axiom 4 + Axiom 5 + D5/D6, Governance → Axiom 2 + D8, with bidirectional explanation text
> **And** `07-meta-patterns.md` must include a CSF 2.0 Govern subsection mapping Govern subcategories to D8 values: GV.OC (Organizational Context) → Siloed→Fused transition, GV.RM (Risk Management Strategy) → Economic-Contract, GV.RR (Roles/Responsibilities) → Presumptively Wrong + Dojo, GV.PO (Policies/Processes) → Axiom 2 enforcement across D8
> **And** `07-meta-patterns.md` must add a DTM-25-003 citation validating D8 as a first-class security control: "The DoD determined that ZT execution required a dedicated Portfolio Management Office and Chief ZT Officer — governance structures specifically created because the existing organizational model couldn't execute ZT. This validates D8 as an architectural dimension."
> **And** `07-meta-patterns.md` must add DTM-25-003 citation to the D8=Economic-Contract discussion, showing the DoD's ZT PfMO funding prioritization authority validates the model
> **And** `07-meta-patterns.md` must add a note about multi-location federation for D6 (Policy Distribution): when the event stream itself is partitioned across geographic regions, the PDP/PEP model must account for CAP theorem constraints — SP 800-207A provides guidance for federated PDP deployments
> **And** `07-meta-patterns.md` must add a DoD centralized orchestration citation to D6=Event-Streamed: the DoD's requirement for centralized policy orchestration with distributed enforcement is the architectural driver for Event-Streamed policy, validating it is not an academic exercise
> **And** `07-meta-patterns.md` must add the NSA Target/Advanced phase boundary as validation of covariance clusters: "The NSA's decision to separate Target and Advanced levels, with a distinct implementation phase boundary, validates the project's finding that the low-maturity and high-maturity clusters are qualitatively different states, separated by a phased transition, not a smooth gradient"
> **And** `07-meta-patterns.md` must include a nuanced discussion of the DoD's hybrid COA approach: "The DoD's hybrid COA approach (COA 1 + COA 2 combined) works because of scale resources ($10B+) that can absorb the inefficiency of non-covariant dimension upgrades. Organizations with smaller budgets face steeper covariance penalties and should follow the clustered upgrade paths in Part IV"
> **And** `07-meta-patterns.md` must include a note on PQC signature size impact: ML-DSA signatures (2,427-4,627 bytes vs. ECDSA's 64 bytes) have measurable operational consequences for event-stream bandwidth, attestation report size, and SPIFFE/SPIRE certificate bundles

### Story 1.7: Layer 0-2 Navigation Integrity and Consistency Gate

As the architecture validator,
I want all 8 Layer 0-2 chapters to pass the Appendix B checklist,
So that Epic 1 is complete and Epic 2 can begin with a validated foundation.

**Acceptance Criteria:**

**Given** all 8 files (00-preface through 07-meta-patterns) have been edited by Stories 1.1-1.6
**When** the dev agent runs a comprehensive consistency validation pass
**Then** every chapter must have a `**Prerequisites**` section immediately after the title, with "None" for Chapter 0 only
**And** every chapter (except 07) must have a `**Cross-References**` section at chapter end with `**Next:**`, `**Builds On:**`, and `**Related:**` sub-labels
**And** no cross-reference may be a forward reference — all `**Builds On:**` and `**Related:**` must point to earlier layers
**And** all dimension value references across all 8 files must use exact vocabulary from Chapters 4-6 (spot-check 5 random `D{N}:` references per file)
**And** all research citations must use `[DR-§Section]` / `[TR-§Section]` format (spot-check 5 random citations per file)
**And** every glossary term first-used in any of the 8 chapters must appear in Appendix C (read appendix-c-glossary.md and verify)
**And** all cross-reference links must resolve — run a link-check script or manual verification that each `[§...](../path/to/file.md#...)` link points to an existing file and valid section anchor
**And** the axiom-to-dimension mapping table in Chapter 7 must be bidirectional: every axiom maps to 1-3 dimensions, every dimension is referenced by at least one axiom
**And** no same-layer cross-references exist — files in the same layer must not reference each other
**And** the full Appendix B validation checklist must be run on all 8 files and produce zero failures

> **And** `00-preface.md` must cite EO 14028 as the policy genesis of the federal ZT ecosystem: "This book exists because Executive Order 14028 (May 2021) mandated Zero Trust Architecture adoption across the U.S. Federal Government. That mandate created the regulatory and standards ecosystem this book navigates."
> **And** `01-the-case-for-zero-trust.md` must include a softened compliance dismissal: after the existing critique of compliance frameworks, add a paragraph contextualizing the ZTMM specifically as a measurement instrument that the Octagon complements rather than replaces
> **And** `01-the-case-for-zero-trust.md` must include a new subsection "Why Not Just Use the ZTMM?" explaining: the ZTMM measures how far you've come; the Octagon tells you whether you've arrived; both are necessary
> **And** `01-the-case-for-zero-trust.md` must cite SP 800-207A as the NIST document specifically written for cloud-native ZTA audiences ("ZTA for Cloud-Native Multi-Location Environments")
> **And** `01-the-case-for-zero-trust.md` must cite EO 14028 §3(c) cloud migration mandate as the policy driver for cloud-native ZTA
> **And** `01-the-case-for-zero-trust.md` must cite the DoD ZT Ref Arch's VPN-less implementation requirement as federal validation that the perimeter model is dead
> **And** the "Accessible Applications" connection must be cited: the ZTMM's Optimal stage for accessible applications (making mission-critical apps available over open public networks) is the regulatory driver that creates the SaaS Blind Spot the project's Archetype D trace addresses

### Epic 2: Attack Traces — Four Archetypal Breaches

Reader can trace four realistic attack scenarios against four archetypes, see exactly where each morphological configuration fails, extract meta-patterns including the detect-respond gap and visible middle fallacy, and validate all claims against 2025-2026 domain and technical research. Covers Layer 3 (Reality) — 5 chapters with full attack narratives, cross-trace comparison table, matrix-first vocabulary validation, and research citations.

**FRs covered:** FR-7, FR-8, FR-9, FR-10, FR-11, FR-22 (Layer 3)
**Files:** 08-archetype-a-holy-grail.md, 09-archetype-b-fortune-500.md, 10-archetype-c-startup.md, 11-archetype-d-lean-defense.md, 12-cross-trace-synthesis.md

### Story 2.1: Archetype B — Fortune 500 Breach

As a security engineer,
I want a full attack trace of a Fortune 500 deployment from credential theft to data exfiltration,
So that I can see exactly where Single Source attestation, Hard Deny response, and implicit observability fail.

**Acceptance Criteria:**

**Given** the existing `09-archetype-b-fortune-500.md` with drafted content
**When** the dev agent edits the file
**Then** the attack narrative must trace a complete incident timeline: credential theft via infostealer → lateral movement → data exfiltration
**And** it must attribute each phase failure to a specific morphological dimension value: Single Source attestation (D4) enables the initial access, Hard Deny (D5) causes business damage, Siloed Org (D8) prevents coordinated response, Implicit Observability (D7) makes the attack invisible until tripwire
**And** the trace must include MTTD, MTTR, exfiltration volume, and business impact metrics in a summary table
**And** all dimension value references must use exact vocabulary from Chapters 4-6 (no values not already defined in the morphological matrix)
**And** research citations must validate the trace against 2025-2026 breach data (e.g., Storm-2949 cloud-native lateral movement) using `[TR-§Section]` format
**And** the file must carry `**Prerequisites:** Chapter 4 (The Morphological Matrix), Chapter 7 (Meta-Patterns)`
**And** `**Cross-References**` must include `**Next:**` to Chapter 10, `**Builds On:**` to Chapters 4 and 7

### Story 2.2: Archetype C — Startup Supply Chain Breach

As a security engineer,
I want a full attack trace of a hyper-growth startup from CI/CD injection to data loss,
So that I can see how TOFU attestation and Degrade Gracefully create the supply chain blind spot.

**Acceptance Criteria:**

**Given** the existing `10-archetype-c-startup.md` with drafted content
**When** the dev agent edits the file
**Then** the attack narrative must trace: CI/CD supply chain injection → deployment → data exfiltration
**And** it must attribute each phase failure: Trust on First Use attestation (D4: TOFU) means the injected dependency passes all checks, Degrade Gracefully (D5) preserves uptime at the cost of confidentiality
**And** the GitOps + fused teams pattern must show excellent MTTD/MTTR but the degradation window still permits exfiltration
**And** the trace must be validated against 2025-2026 supply chain incidents: TanStack/TeamPCP (84 malicious packages), Axios/Sapphire Sleet (100M+ weekly downloads poisoned), UNC6426 (AWS takeover <72 hours) with inline `[TR-§Section]` citations
**And** the file must carry `**Prerequisites:** Chapter 4 (The Morphological Matrix), Chapter 7 (Meta-Patterns)`
**And** `**Cross-References**` must include `**Next:**` to Chapter 11, `**Builds On:**` to Chapters 4 and 7

> **And** `10-archetype-c-startup.md` must cite NIST CSF 2.0's supply chain risk management (SCRM) emphasis as the regulatory framework that elevates supply chain injection to a first-class zero-trust concern
> **And** `10-archetype-c-startup.md` must cite EO 14028 §4 software supply chain security mandate (including SBOM requirements), establishing that the CI/CD attestation patterns in Archetype C are the architectural implementation of what the EO requires at the procurement level

### Story 2.3: Archetype D — Solo Operator SaaS Hijack

As a security engineer,
I want a full attack trace of a solo operator from MFA fatigue to SaaS session hijack,
So that I can see how the IAP's SaaS blind spot and bus factor of 1 create catastrophic failure modes.

**Acceptance Criteria:**

**Given** the existing `11-archetype-d-lean-defense.md` with drafted content
**When** the dev agent edits the file
**Then** the attack narrative must trace: MFA fatigue → credential compromise → SaaS session hijack
**And** it must show: the IAP protects self-hosted resources but not SaaS platforms using the same identity token (SaaS Blind Spot)
**And** Single Source attestation (D4) produces low-signal, high-noise alerts that are dismissed
**And** the bus factor of 1 produces a bimodal MTTR distribution: 3 minutes (Pat at desk) or 25+ minutes (Pat unavailable)
**And** implicit trust in SaaS vendor logs means the attacker's SaaS access generates no alerts
**And** the trace must be validated against the RSA ID IQ Report (88% identity-related breaches) with `[DR-§Section]` citation
**And** the file must carry `**Prerequisites:** Chapter 4 (The Morphological Matrix), Chapter 7 (Meta-Patterns)`
**And** `**Cross-References**` must include `**Next:**` to Chapter 12, `**Builds On:**` to Chapters 4 and 7

### Story 2.4: Archetype A — Holy Grail Trickle-Truth

As an architect,
I want the aspirational trace where zero-trust actually works,
So that I can see what the target state looks like when all 8 axioms are satisfied.

**Acceptance Criteria:**

**Given** the existing `08-archetype-a-holy-grail.md` with drafted content
**When** the dev agent edits the file
**Then** the attack narrative must trace an intrusion attempt that encounters the Trickle-Truth Garden
**And** triple attestation (D4: Triple) must detect the anomaly before data moves
**And** Trickle-Truth (D5) must describe: the session grafting mechanism, garbage pollution rate (R), temporal manipulation, and state-anchored deterministic synthesis — referencing Chapter 6's full technical spec
**And** the trace must conclude with zero data exfiltration, zero business impact, and positive intelligence yield (TTP classification from adversary behavior in the garden)
**And** the trace must include the same MTTD, MTTR, exfiltration, business impact, and intel yield metrics as the other traces for comparison
**And** the file must carry `**Prerequisites:** Chapter 4 (The Morphological Matrix), Chapter 6 (Dimensions: Response to Human), Chapter 7 (Meta-Patterns)`
**And** `**Cross-References**` must include `**Next:**` to Chapter 9, `**Builds On:**` to Chapters 4, 6, and 7

### Story 2.5: Cross-Trace Synthesis and Meta-Patterns

As a technical leader,
I want to see all four traces compared side-by-side,
So that I can extract the detect-respond gap, the visible middle fallacy, and supply chain as the unifying blind spot.

**Acceptance Criteria:**

**Given** the existing `12-cross-trace-synthesis.md` with drafted content
**When** the dev agent edits the file
**Then** a cross-mapped comparison table must be present with columns: Archetype, MTTD, MTTR, Exfiltration Volume, Business Impact, Intel Yield — one row per archetype (A, B, C, D)
**And** the visible middle fallacy must be explicitly documented: the attacker observes defensive responses and adapts — each trace shows an example of this feedback loop
**And** supply chain must be identified as the unifying blind spot across all four traces with supporting evidence
**And** the detect-respond gap must be named as the true operational metric for zero-trust effectiveness, with numbers from each trace
**And** all four archetype attack traces must be cross-referenced against 2026 domain and technical research using `[DR-§Section]` and `[TR-§Section]` citations
**And** the D4/D5 dependency deadlock evidence must be synthesized from all four traces into a single argument
**And** the file must carry `**Prerequisites:** Chapters 8, 9, 10, 11 (All four Archetype traces)`
**And** `**Cross-References**` must include `**Next:**` to Chapter 13, `**Builds On:**` to Chapters 8-11, `**Related:**` to Chapter 7

### Story 2.6: Layer 3 Consistency Gate

As the architecture validator,
I want all 5 Layer 3 chapters to pass the matrix-first vocabulary check and Appendix B checklist,
So that Epic 2 is complete and no trace uses dimension values not defined in Chapters 4-6.

**Acceptance Criteria:**

**Given** all 5 Layer 3 files (08 through 12) have been edited by Stories 2.1-2.5
**When** the dev agent runs a comprehensive consistency validation pass
**Then** every `D{N}: Value Name` reference in all 5 files must use exact vocabulary from Chapters 4-6 — no synonyms, no paraphrased values (spot-check 10 random dimension references across the 5 files)
**And** no trace may reference a dimension value that was first defined in a later chapter (matrix-first rule — verify by reading Chapters 4-6 as the authoritative dimension registry)
**And** every chapter must have `**Prerequisites**` section referencing only Layer 0-2 files (Chapters 0-7)
**And** every chapter must have `**Cross-References**` section with `**Next:**`, `**Builds On:**`, and `**Related:**` — all pointing to earlier layers only
**And** all research citations must use `[DR-§Section]` / `[TR-§Section]` format (spot-check 5 random citations per file)
**And** all cross-reference links must resolve successfully
**And** no same-layer cross-references exist — files within Layer 3 must not reference each other (only earlier layers)
**And** the MTTD, MTTR, exfiltration, business impact, and intel yield numbers in the Chapter 12 comparison table must match the individual values stated in Chapters 8-11
**And** the full Appendix B checklist must be run on all 5 files and produce zero failures

### Epic 3: Action Plan — Self-Assessment, Pathways, and Decision Matrix

Reader can self-diagnose into an archetype via 12 questions with tiebreakers, receive a phased implementation pathway with gate checks, cost estimates, and documented failure pivots, and use the decision matrix to map pain-threat pairs to immediate action. Covers Layer 4 (Action) — 6 chapters with truth-table routing, gate-check + escape-hatch structure, decision matrix rows, and the peer-review narrative (Octagon → Hendecagon → Tridecagon).

**FRs covered:** FR-12, FR-13, FR-14, FR-15, FR-16, FR-17, FR-22 (Layer 4)
**Files:** 13-self-assessment.md, 14-enterprise-turnaround.md, 15-velocity-defender.md, 16-scaling-pat.md, 17-the-aspirants-gate.md, 18-decision-matrix-and-conclusion.md

### Story 3.1: Self-Assessment Diagnostic

As an architect under pressure to "do zero trust,"
I want a 12-question diagnostic that maps my answers to an archetype,
So that I can receive a routed implementation pathway without reading the entire textbook first.

**Acceptance Criteria:**

**Given** the existing `13-self-assessment.md` with drafted content
**When** the dev agent edits the file
**Then** the chapter must present exactly 12 questions covering D1-D9 plus Budget, Primary Threat, and Deployment Velocity
**And** each question must have exactly 4 ordered answer choices mapping to archetypes A-D
**And** questions must measure deployed capabilities, not aspirations — explicitly stated as a design principle with the confidence/reality gap (57% vs 69%) as rationale
**And** a truth-table must be present where each of the 12 questions maps answer choices to archetype scores
**And** explicit tiebreakers must be documented for B/C and C/D boundaries using velocity and budget as decisive dimensions
**And** the routing logic must direct: Archetype B → Chapter 14, Archetype C → Chapter 15, Archetype D → Chapter 16, Archetype A → Chapter 14 (target state acknowledgment)
**And** the file must carry `**Prerequisites:** Chapter 2 (The Octagon), Chapter 4 (The Morphological Matrix)`
**And** `**Cross-References**` must include `**Next:**` to Chapter 14, `**Builds On:**` to Chapters 2 and 4

> **And** `13-self-assessment.md` must include a ZTMM maturity mapping table after the 12 diagnostic questions, formatted as:

| Your Self-Assessment Result | Likely ZTMM Maturity Profile |
|----------------------------|------------------------------|
| Mostly B answers | Identity: Advanced, Devices: Advanced, Networks: Initial/Advanced, Apps: Initial/Advanced, Data: Initial |
| Mostly C answers | Identity: Initial/Advanced, Devices: Initial, Networks: Initial, Apps: Advanced, Data: Traditional |
| Mostly D answers | Identity: Advanced, Devices: Traditional, Networks: Traditional, Apps: Initial, Data: Traditional |

> **And** the table must include a note explaining pillar-average masking as a contributor to the confidence/reality gap
> **And** `13-self-assessment.md` must include an "NSA's Phased Model" sidebar comparing NSA ZIG's 5 implementation phases (Discovery, Phase One/Identity-Devices-Apps, Phase Two/Network-Data, Phase Three-Four/Advanced) to the project's archetype pathways, with a timeline mapping table

### Story 3.2: Archetype B Implementation — Enterprise Turnaround (24 Months)

As a technical leader whose Fortune 500 deployment was breached,
I want a phased 24-month implementation pathway with gate checks, cost estimates, and explicit axiom coverage,
So that I can fund and sequence detection and response modernization together.

**Acceptance Criteria:**

**Given** the existing `14-enterprise-turnaround.md` with drafted content
**When** the dev agent edits the file
**Then** the pathway must be structured in 4 quarters:
- Q1-2: Detection modernization — upgrade D4 (Attestation) + D5 (Response) together ($1.5-2.5M), explicitly addressing Axioms 4 and 5
- Q3-4: Enforcement modernization — upgrade D3 (Enforcement Layer, $2-3.5M), addressing Axiom 2
- Year 2: Observability and organization — upgrade D7 (Observability Trust) + D8 (Organizational Posture)
**And** Gate 1 must follow the structure: `Condition (behavioral tuning success) → if FAIL: pivot to hardware-backed attestation`
**And** every phase must include an explicit "Axioms Addressed" statement referencing specific axiom numbers from Chapter 2
**And** the D4/D5 dependency deadlock must be explicitly called out as the reason they are upgraded together in Q1-2
**And** cost estimates must be realistic within the stated ranges, no specific vendor endorsements
**And** the file must carry `**Prerequisites:** Chapter 4 (The Morphological Matrix), Chapter 9 (Archetype B Trace), Chapter 13 (Self-Assessment)`
**And** `**Cross-References**` must include `**Next:**` to Chapter 15, `**Builds On:**` to Chapters 4, 9, and 13

> **And** `14-enterprise-turnaround.md` must include a "Coming From a Maturity Model" subsection: "If you've done a CISA ZTMM assessment: Your [Identity/Devices/Networks/Data] pillar is likely at [level]. This maps to the following morphological matrix configuration: [D1=X, D2=Y, ...]. The implementation pathway below addresses the integration gaps your ZTMM assessment doesn't measure — specifically, the seams between [high pillar] and [low pillar] that create the lateral movement surface."
> **And** `14-enterprise-turnaround.md` must include a sidebar "The DoD's COA 1: The Military Equivalent" establishing: "If the DoD, with its $10B+ budget, is struggling with the same architectural transition you're attempting, that's not discouraging — it's validating. The problem is hard. Here's the architectural approach."
> **And** `14-enterprise-turnaround.md` must reference the DoD's FY 2027 full ZT framework implementation target as validating the 24-month timeline
> **And** `14-enterprise-turnaround.md` must include an NSA phase comparison table: Discovery → Ch13 Self-Assessment, Phase One (Identity/Devices/Apps) → Months 1-8, Phase Two (Network/Data) → Months 8-16, Phase Three-Four (Advanced) → Months 16-24

### Story 3.3: Archetype C Implementation — Velocity Defender (12 Months)

As an SRE at a high-velocity startup,
I want a 12-month implementation pathway that never adds more than 60 seconds to CI/CD,
So that I can harden our supply chain without killing deployment velocity.

**Acceptance Criteria:**

**Given** the existing `15-velocity-defender.md` with drafted content
**When** the dev agent edits the file
**Then** the pathway must be structured in 3 phases:
- Q1: Supply chain hardening — image signing + admission control + eBPF ($150-250K), addressing Axiom 4
- Q2-3: Identity and authority — SPIFFE/SPIRE deployment ($200-350K), addressing Axiom 2
- Q4: Selective quarantine + network policy enforcement, addressing Axiom 5
**And** Gate 1 must follow the structure: `Condition (eBPF false positive rate below threshold) → if FAIL: pivot to confidential containers`
**And** every upgrade must be measured against a single metric: "does this add more than 60 seconds to CI/CD?"
**And** each phase must include an explicit "Axioms Addressed" statement
**And** the file must carry `**Prerequisites:** Chapter 4 (The Morphological Matrix), Chapter 10 (Archetype C Trace), Chapter 13 (Self-Assessment)`
**And** `**Cross-References**` must include `**Next:**` to Chapter 16, `**Builds On:**` to Chapters 4, 10, and 13

> **And** `15-velocity-defender.md` must include a "Coming From a Maturity Model" subsection with ZTMM-to-matrix mapping format (same structure as Chapter 14)

### Story 3.4: Archetype D Implementation — Scaling Pat (6 Months)

As a solo operator,
I want a 6-month pathway where every recommendation costs less than a monthly SaaS subscription,
So that I can achieve zero-trust on a one-person budget.

**Acceptance Criteria:**

**Given** the existing `16-scaling-pat.md` with drafted content
**When** the dev agent edits the file
**Then** the pathway must be structured in 3 phases:
- Month 1: Eliminate bus factor — hardware keys + automated fallback + SaaS audit logging (~$2,500 + $500/month), addressing Axioms 2 and 7
- Months 2-3: Automated response for clear cases, addressing Axiom 5
- Months 4-6: Browser-level SaaS enforcement, addressing Axiom 3
**And** Gate 3 must follow the structure: `Condition (alert load below 30 min/day) → if FAIL: reduce SaaS footprint`
**And** all recommendations must cost less than a monthly SaaS subscription and be actionable within a week
**And** each phase must include an explicit "Axioms Addressed" statement
**And** the file must carry `**Prerequisites:** Chapter 4 (The Morphological Matrix), Chapter 11 (Archetype D Trace), Chapter 13 (Self-Assessment)`
**And** `**Cross-References**` must include `**Next:**` to Chapter 17, `**Builds On:**` to Chapters 4, 11, and 13

> **And** `16-scaling-pat.md` must include a "Coming From a Maturity Model" subsection with ZTMM-to-matrix mapping format (same structure as Chapter 14)

### Story 3.5: The Aspirant's Gate — Failure Pivots

As an implementer following any pathway,
I want to know what happens when a gate check fails,
So that I don't get stuck — I have a documented pivot to an alternative path.

**Acceptance Criteria:**

**Given** the existing `17-the-aspirants-gate.md` with drafted content
**When** the dev agent edits the file
**Then** the chapter must document the three most common gate failure patterns:
- Gate Failure 1 (B): Behavioral tuning fails → pivot to hardware-backed attestation
- Gate Failure 2 (C): eBPF false positives never drop → pivot to confidential containers
- Gate Failure 3 (D): Automation cannot keep up → reduce SaaS footprint
**And** the common failure pattern "skipping D4 before D5" must be explicitly documented as detected across all archetypes
**And** every gate failure must include an "Other Failure" escape hatch: return to Chapter 13 self-assessment and re-route
**And** each gate failure must reference the specific chapter(s) where the original gate was defined
**And** the file must carry `**Prerequisites:** Chapters 14, 15, 16 (All three implementation pathways), Chapter 13 (Self-Assessment)`
**And** `**Cross-References**` must include `**Next:**` to Chapter 18, `**Builds On:**` to Chapters 14, 15, 16, and 13

### Story 3.6: Decision Matrix, Forward-Looking Axioms, and Conclusion

As a technical leader,
I want a decision matrix that maps my pain to the first dimension to upgrade and the chapter to read,
So that I can act immediately without reading the entire textbook.

**Acceptance Criteria:**

**Given** the existing `18-decision-matrix-and-conclusion.md` with drafted content
**When** the dev agent edits the file
**Then** the decision matrix must have exactly 7 rows, each with: primary pain point, primary threat, starting dimension (D{N}), rationale, and implementation chapter reference
**And** the matrix must be positioned as the book's most practical output: "identify your pain, read the corresponding row, act"
**And** the peer-review narrative must tell the Octagon → Hendecagon → Tridecagon refinement story with:
- What each new axiom adds and the gap it closes
- The adversarial stress-testing motivation for each extension
- Explicit acknowledgment that Axioms 10-13 are not yet formalized with corollaries
**And** the PQC timeline must be presented: NIST deprecation of RSA/ECC by 2030, disallowance by 2035, ZTA deployment deadline (DoD 2027) coming before PQC migration
**And** the conclusion must reinforce: "Zero-trust is not something you buy. It is something you build."
**And** the file must carry `**Prerequisites:** Chapters 14, 15, 16, 17 (All implementation pathways)`
**And** `**Cross-References**` must include `**Builds On:**` to Chapters 14-17, `**Related:**` to Appendix A

> **And** `18-decision-matrix-and-conclusion.md` must undergo a major PQC section expansion with:
> - **Standard nomenclature**: Replace "Dilithium" with ML-DSA (FIPS 204) and "SPHINCS+" with SLH-DSA (FIPS 205). Add full FIPS 203/204/205 citations
> - **Key establishment**: Add a subsection "Key Establishment (FIPS 203 — ML-KEM)" explaining that every encrypted channel (PDP→PEP policy sync, PEP→PEP data channel, attestation report transport, event stream) must transition to ML-KEM for key establishment. Note: ML-KEM-768 recommended for general use, ML-KEM-1024 for high-security environments (Archetype A)
> - **Signature size operational impact table**: Quantify bandwidth, latency, and storage implications per architectural component:

| Component | ECDSA P-256 (64 bytes) | ML-DSA-65 (3,465 bytes) | Impact |
|-----------|------------------------|--------------------------|--------|
| Event stream (10K events/sec) | 640 KB/s | ~35 MB/s | 50× bandwidth increase |
| Attestation report (single) | 1 KB | ~5 KB | 5× request size increase |
| SPIFFE/SPIRE certificate | ~1 KB | ~5 KB | 5× certificate bundle size |

> - **Cross-family diversity**: Update the dual-stack recommendation to specify: for Archetype A (high-security): ML-KEM-1024 + SLH-DSA-SHAKE-256s for signatures; for general use: ML-KEM-768 + ML-DSA-65 with SLH-DSA as a fallback for critical path signing (root CA, silicon attestation anchors). Explain that dual-stack within a single PQC family (all lattice-based) still has single-family risk
> - **PQC migration timeline overlay**: Add a table showing PQC milestones intersecting implementation phases per archetype. For each archetype's timeline, identify which cryptographic transitions should happen in parallel
> - **Three Futures section**: Cite relevant FIPS, EO 14028, and DoD documents when discussing cryptographic futures

### Story 3.7: Layer 4 Consistency Gate

As the architecture validator,
I want all 6 Layer 4 chapters to pass the Appendix B checklist,
So that Epic 3 is complete and cross-references between self-assessment, pathways, gates, and decision matrix are internally consistent.

**Acceptance Criteria:**

**Given** all 6 Layer 4 files (13 through 18) have been edited by Stories 3.1-3.6
**When** the dev agent runs a comprehensive consistency validation pass
**Then** the truth-table in Chapter 13 must produce correct archetype routing to Chapters 14, 15, or 16 for all 12 answer-choice combinations (test each of the 12 questions with all 4 answer choices)
**And** every gate mentioned in Chapters 14-16 must have a corresponding entry in Chapter 17 (Aspirant's Gate) — verify bi-directionally
**And** every `**Next:**` in Chapters 14-16 must point to the correct successor (14→15, 15→16, 16→17, 17→18)
**And** every decision matrix row in Chapter 18 must reference a chapter that actually exists and covers the claimed topic
**And** all axiom references must use the exact numbering from Chapter 2 (verify Phase "Axioms Addressed" statements in Chapters 14-16 match Chapter 2)
**And** no forward references — all `**Builds On:**` and `**Related:**` must point to earlier layers (0-3)
**And** all cross-reference links must resolve successfully
**And** the full Appendix B checklist must be run on all 6 files and produce zero failures

### Epic 4: Appendices, Glossary, and Global Consistency

Reader has quantum/AI adversary stress-tests, a printable 8-question validation checklist, a complete glossary of all domain terms with cross-references, and a single-page quick-reference card. All 23 files are internally consistent — cross-references resolve, citations are correctly formatted, dimension values use exact matrix vocabulary, terminology is glossary-consistent, and Appendix B checklist passes on all chapters. Covers Layer 5 (Appendices) plus a global consistency validation pass across all prior layers.

**FRs covered:** FR-18, FR-19, FR-20, FR-21, FR-22, FR-23 (Appendices + global pass), all NFRs (NFR-1 through NFR-10), all ARs (AR-1 through AR-8)
**Files:** appendix-a-quantum-ai-threats.md, appendix-b-validation-checklist.md, appendix-c-glossary.md, appendix-d-quick-reference.md, appendix-e-cisa-ztmm-crosswalk.md + consistency validation pass on all 23 chapters

### Story 4.1: Appendix A — Quantum and AI Adversary Stress-Tests

As a security engineer planning a multi-year zero-trust deployment,
I want to understand how quantum computing and AI-speed adversaries stress the Octagon,
So that I can plan for post-quantum cryptography migration on the same timeline as my ZTA deployment.

**Acceptance Criteria:**

**Given** the existing `appendix-a-quantum-ai-threats.md` with drafted content
**When** the dev agent edits the file
**Then** the appendix must present the full PQC migration timeline: NIST IR 8547 finalized August 2024, RSA/ECC deprecation by 2030, disallowance by 2035
**And** it must show that the ZTA deployment deadline (DoD 2027) comes before the PQC migration deadline, creating a cryptographic rework dependency
**And** it must document the Harvest-Now-Decrypt-Later threat and its implications for current encrypted data
**And** the AI adversary section must cover: autonomous cloud exploitation (Mexico breach — Claude autonomously identifying SCADA interfaces), prompt injection attacks against AI-augmented security tools, and agentic adversaries operating below human response thresholds
**And** it must demonstrate that AI-generated attacks disproportionately target D4 (Behavioral Attestation) and Axiom 7 (Epistemic Integrity)
**And** it must position hardware-anchored cryptographic provenance as the common mitigation for both quantum and AI threats
**And** the 27-second breakout time for AI-driven attacks must be cited against research data
**And** the file must carry `**Prerequisites:** Chapter 2 (The Octagon), Chapter 7 (Meta-Patterns), Chapter 12 (Cross-Trace Synthesis)`
**And** all research citations must use `[DR-§Section]` / `[TR-§Section]` format resolving to the domain and technical research reports

### Story 4.2: Appendix B — Architecture Validation Checklist

As a security engineer,
I want a printable 8-question checklist derived from the Octagon with green/yellow/red scoring,
So that I can independently audit any architecture and re-use the checklist annually or post-incident.

**Acceptance Criteria:**

**Given** the existing `appendix-b-validation-checklist.md` with drafted content
**When** the dev agent edits the file
**Then** each of the 8 Octagon axioms must map to exactly one diagnostic question
**And** each question must have exactly three scoring thresholds: Green (satisfies axiom fully), Yellow (partial), Red (violates axiom)
**And** the scoring criteria must be explicit and falsifiable — a reader can determine the score without interpretation
**And** the checklist must be designed for annual re-use and post-incident application (stated in intro text)
**And** it must match the diagnostic questions and scoring thresholds from Chapter 3 (03-octagon-as-instrument.md) exactly — no divergence
**And** the file must carry `**Prerequisites:** Chapter 3 (Octagon as Instrument)`
**And** `**Cross-References**` must include `**Builds On:**` to Chapter 3

> **And** `appendix-b-validation-checklist.md` must include a "Complementary Frameworks" note at the end: "This checklist validates architectural integrity against the Octagon. For organizational maturity assessment, use CISA ZTMM v2.0 (see Appendix E for crosswalk). For governance assessment, use NIST CSF 2.0 Govern function (see §7.X). For implementation planning, cross-reference NSA ZIG Primer (see §13.X)."

### Story 4.3: Appendix C — Glossary Population and Consistency

As a reader encountering unfamiliar domain terms,
I want a complete glossary where every domain term is defined consistently with its usage throughout the textbook,
So that I can look up any term without ambiguity.

**Acceptance Criteria:**

**Given** the existing `appendix-c-glossary.md` with drafted content
**When** the dev agent reads all 23 files to extract every domain term, then edits the glossary
**Then** every domain term used in any chapter must appear in the glossary with a consistent definition
**And** glossary entries must be alphabetically ordered
**And** each entry must follow the format: `**Term Name**: Definition sentence. _See also: [related-term](#related-term)._`
**And** cross-references within the glossary must use relative anchor links
**And** definitions must be consistent with usage in FRs, axioms, traces, and implementation pathways (FR-20)
**And** the glossary must be comprehensive — spot-check: Octagon, morphological matrix, Trickle-Truth, Epistemic Binding Key (EBK), covariance cluster, detect-respond gap, confidence/reality gap, SaaS Blind Spot, visible middle fallacy, 8 axioms by name, 9 dimensions (D1-D9), 4 archetypes (A-D), each named dimension value

> **And** `appendix-c-glossary.md` must include new entries for: Executive Order 14028 (EO 14028), FIPS 203 (ML-KEM), FIPS 204 (ML-DSA), FIPS 205 (SLH-DSA), ML-KEM, ML-DSA, SLH-DSA, NIST SP 800-207A, NIST CSF 2.0 Govern, DoD ZT PfMO, ICAM, SBOM
**And** the file must carry `**Prerequisites:** All chapters (01-18)`
**And** `**Cross-References**` must include `**Builds On:**` to all prior chapters

### Story 4.4: Appendix D — Quick-Reference Card

As a reader who has finished the textbook,
I want a single-page quick-reference card with all axioms, dimensions, and archetypes,
So that I can keep the Octagon at hand without re-reading 18 chapters.

**Acceptance Criteria:**

**Given** the existing `appendix-d-quick-reference.md` with drafted content
**When** the dev agent edits the file
**Then** all 8 axioms must be listed with one-line definitions
**And** all 9 dimensions must be listed with value ranges (D1 through D9)
**And** all 4 archetypes must be summarized with: archetype name, starting configuration values for D1-D9, primary threat, and implementation chapter reference
**And** the leverage point hierarchy (D5 > D4 > D8 > D2 > D7) must be included
**And** the entire card must fit on a single page when printed (review for conciseness)
**And** the file must carry `**Prerequisites:** All chapters and appendices`
**And** `**Cross-References**` must include `**Builds On:**` to all prior chapters, with links to each chapter for readers who want the full treatment

### Story 4.5: Global Consistency Validation — All 23 Files

As the final quality gate,
I want every chapter in the textbook to pass the Appendix B checklist, verify glossary consistency, validate cross-reference integrity, and confirm all 6 implementation patterns are applied correctly,
So that the textbook is ready for publication with no internal inconsistencies.

**Acceptance Criteria:**

**Given** all 23 files (00-preface through appendix-d) have been edited by all prior stories
**When** the dev agent runs the global consistency validation
**Then** NFR-1 (vendor-neutral): A scan of all 23 files must show zero vendor endorsements in body text — any technology mentions must be in footnotes or explicitly marked as points of reference
**And** NFR-2 (no compliance mapping): Zero mentions of SOC 2, ISO 27001, HIPAA, or PCI DSS control mappings anywhere in the 23 files (within reason — glossary may define them as excluded)
**And** NFR-3 (independently verifiable): Every architectural claim must have a traceable research citation — spot-check 10 random claims across 5 random chapters, each must have an inline `[DR-§]` or `[TR-§]` citation within 2 paragraphs
**And** NFR-4 (acyclic dependency): Run a dependency check — for every `**Builds On:**` reference, the referenced file's layer number must be strictly less than the referencing file's layer number
**And** NFR-5 (terminological consistency): Every glossary term used in any chapter must appear in Appendix C with a non-conflicting definition — read Appendix C, compile the term list, grep each term across all chapters, verify consistency
**And** NFR-6 (citation format): All research citations must match `[DR-§Section]` or `[TR-§Section]` format — spot-check 5 citations per layer (25 total)
**And** NFR-7 (cross-reference direction): All cross-references in all chapters must flow downward in the layer graph — no forward or same-layer references
**And** NFR-8 (dimension fidelity): All `D{N}:` references across all files must use exact matrix value names from Chapters 4-6
**And** NFR-9 (gateway integrity): Each of the 6 fidelity gates from the Architecture must be independently verifiable as passing
**And** NFR-10 (glossary synchronization): Any term introduced in a chapter edit during this epic must appear in Appendix C — verify by diffing Appendix C against the glossary-first-use markers in all chapters
**And** AR-1 (6 consistency patterns): Verify each pattern has good/anti-pattern examples visible — glossary vocabulary handles first-use `**Term**[↗]` markers, cross-reference format matches `[§N: Title](../path.md#anchor)`, dimension values are exact, citations use correct format, prerequisites declared, glossary entries formatted correctly
**And** AR-2 (6-layer graph): All 23 files must be assigned to a layer, and cross-references must respect layer boundaries
**And** AR-3 (6 fidelity gates): Confirm each gate passes — Layer 0-1 (axioms defined), Layer 1-2 (mapping table), Layer 2-3 (dimension registry), Layer 3-4 (traces cross-referenced), Layer 4-5 (pathways with escape hatches), Final (Appendix B passes all)
**And** AR-4 (research provenance chain): For 5 randomly selected claims across the 4 archetype traces, verify each has a citation that can be traced back to a specific section in the domain or technical research reports
**And** AR-5 (Appendix B as gate): The Appendix B checklist must be run on all 23 files and produce zero failures
**And** AR-6 (matrix-first): All dimension values referenced in Chapters 8-18 must appear in Chapters 4-6 — no forward-defined values
**And** AR-7 (implementation sequence): Verify the 10-step sequence from the Architecture Decision Impact Analysis has been followed — each step must be demonstrably complete
**And** AR-8 (incremental tracking): The frontmatter `stepsCompleted` in epics.md must reflect all completed work
**And** FR-22 (navigation integrity): Every chapter 01-18 must have a `**Prerequisites**` section with correct chapter references, and every chapter must have a `**Cross-References**` section (except 00-preface which may omit `**Cross-References**`)
**And** FR-20 (glossary complete): A manual spot-check of 15 domain terms across random chapters must confirm each appears in Appendix C with a consistent definition
**And** the final output must be evaluated: can a reader start at Chapter 13 (self-assessment), answer 12 questions, receive an archetype diagnosis, and follow a `**Next:**` chain that leads them from 13 → 14/15/16 → 17 → 18 without hitting dead ends or missing chapters?

> **And** Appendix E entries must be validated against all chapter content — every ZTMM pillar/function referenced in Appendix E must have corresponding treatment in the referenced chapters
> **And** ZTMM cross-reference subsections must exist in Chapters 14, 15, and 16
> **And** the Chapter 13 ZTMM maturity mapping table must be cross-checked against actual ZTMM v2.0 function definitions for accuracy
> **And** NFR-2's amended language must be verified as consistent with Appendix E's content and the project's "orthogonal, not competing" claim
> **And** all PQC references across all chapters must use FIPS-standard nomenclature (ML-KEM, ML-DSA, SLH-DSA) — no legacy "Dilithium" or "SPHINCS+" references
> **And** every cited reference document (EO 14028, SP 800-207A, FIPS 203-205, CSWP.29/CSF 2.0, DoD ZT Ref Arch, DoD Execution Roadmap, NSA ZIG, DTM-25-003) must appear at least once in the document body where the citation context makes sense (not just in the glossary)
> **And** cross-reference links from all new sidebars and subsections must resolve correctly

### Story 4.6: Appendix E — CISA ZTMM v2.0 Crosswalk

As a federal reader required to use the CISA ZTMM,
I want a systematic mapping from ZTMM pillars and functions to Octagon axioms and dimensions,
So that I can immediately translate my ZTMM maturity assessment into Octagon terms.

**Acceptance Criteria:**

**Given** the ZTMM cross-analysis at `_bmad-output/planning-artifacts/ztmm-cross-analysis-2026-05-26.md`
**When** the dev agent creates a new file `appendix-e-cisa-ztmm-crosswalk.md`
**Then** the appendix must contain a mapping table with columns: ZTMM Pillar, ZTMM Function, Traditional description, Initial description, Advanced description, Optimal description, Octagon Axiom(s), Matrix Dimension(s)
**And** every ZTMM pillar (Identity, Devices, Networks, Applications & Workloads, Data) must appear with all its functions
**And** three cross-cutting capabilities (Visibility & Analytics, Automation & Orchestration, Governance) must have explicit axiom-to-dimension mappings
**And** the appendix must include a "Reading the Crosswalk" section explaining bidirectional use: ZTMM→Octagon ("When the ZTMM says X, the Octagon says Axiom Y") and Octagon→ZTMM ("When Axiom Z is violated, you're at ZTMM Traditional/Initial for capability W")
**And** the appendix must explicitly state: "The ZTMM measures organizational progress. The Octagon verifies architectural integrity. Both are necessary. Neither is sufficient alone."
**And** the appendix must be ~2-3 pages when rendered
**And** the file must carry `**Prerequisites:** Chapter 2 (The Octagon), Chapter 4 (The Morphological Matrix), Chapter 7 (Meta-Patterns), Chapter 13 (Self-Assessment)`
**And** `**Cross-References**` must include `**Builds On:**` to Chapters 2, 4, 7, and 13
