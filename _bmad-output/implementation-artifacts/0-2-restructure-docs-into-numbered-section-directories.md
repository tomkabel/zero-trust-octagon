# Story 0.2: Restructure docs/ into Numbered Section Directories

Status: done

### Review Findings

#### decision-needed

#### defer

#### patch

- [x] [Review][Patch] P1: 36 broken `./` cross-section links — prerequisites and cross-references in 10 files fixed: 02-methodology/04-the-morphological-matrix, 03-archetypes/08-11-*.md, 04-synthesis/13-16,18-*.md

#### defer

- [x] [Review][Defer] Df1: Metadata note in `docs/04-synthesis/17-the-aspirants-gate.md` about same-directory paths — not a regression, implementation note about path structure. — deferred, pre-existing
- [x] [Review][Defer] Df2: Content additions to `docs/02-methodology/06-dimensions-response-to-human.md` (~60+ lines: buffer overflow, cross-session identity consistency, combined termination criteria, MTTR→TTR rename, D9 caveats, de-grafting protocol expansion). — deferred, valid content but out of scope for file-restructure story; belongs in Epic 1-4 content work.
- [x] [Review][Defer] Df3: Content additions to `docs/appendix/appendix-a-quantum-ai-threats.md` (4 new ZTA-PQC structural risks). — deferred, valid content but out of scope for file-restructure story; belongs in Epic 4 content work.
- [x] [Review][Defer] Df4: SPIFFE/SPIRE identity vs. integrity distinction in `docs/03-archetypes/10-archetype-c-startup.md`. — deferred, valid content but out of scope for file-restructure story; belongs in Epic 2-3 content work.

### Re-review (2026-05-27)

#### decision-needed

#### patch

#### defer

- [x] [Review][Defer] Df5: Duplicate "Synthesis 5" headings in `docs/03-archetypes/12-cross-trace-synthesis.md` (lines 96, 111) break heading anchor chain — second heading unreachable via anchor. — deferred, pre-existing content issue; not caused by file restructure
- [x] [Review][Defer] Df6: MTTR→TTR rename incomplete — 8 files + glossary still use MTTR; the rename in Df2 only touched one formula notation. — deferred, part of Df2 content scope; needs systematic rename pass across all files
- [x] [Review][Defer] Df7: "2/6" should be "2/8" in Archetype B Quick Reference (`docs/appendix/appendix-d-quick-reference.md` L54) — inconsistency with all other chapter references. — deferred, pre-existing typo
- [x] [Review][Defer] Df8: EBK (Epistemic Binding Key) missing from glossary (`docs/appendix/appendix-c-glossary.md`) — ~37 references across planning docs and Chapter 6 with no glossary entry. — deferred, pre-existing glossary gap
- [x] [Review][Defer] Df9: "abort-and-graft" term introduced in `docs/02-methodology/06-dimensions-response-to-human.md` without glossary entry. — deferred, part of Df2 content scope
- [x] [Review][Defer] Df10: External cross-references outside `docs/` (README, CI configs, GitHub templates) may still link to old flat paths. — deferred, out of scope for file-restructure story
- [x] [Review][Defer] Df11: `00-preface.md` numbering convention in `01-foundations/` directory creates zero-index vs one-index dissonance. — deferred, style concern; not a correctness issue
- [x] [Review][Defer] Df12: FR-23/FR-24 added to PRD with no corresponding content in `docs/` yet — forward references in planning artifacts. — deferred, content to be written in Epics 4 and 1-4 respectively

## Story

As the dev agent,
I need the 23 flat markdown files restructured into 5 logical sections + appendix directory,
so that the auto-generated sidebar creates collapsible navigation groups matching the layer architecture.

## Acceptance Criteria

1. The following directory structure must exist under `docs/` with all 23 existing files moved:

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
│   └── appendix-d-quick-reference.md           (moved)
│   └── (appendix-e-cisa-ztmm-crosswalk.md will be added by Story 4.6)
├── public/
│   └── .gitkeep                                 (created new — placeholder so git tracks the empty directory)
├── .vitepress/                                  (already exists — do NOT touch)
│   ├── config.ts
│   └── theme/
│       ├── index.ts
│       └── custom.css
```

2. Each section `index.md` must have `title` frontmatter matching the section name and a brief 1-2 sentence description of what that section covers.

3. `docs/index.md` must use `layout: home` with a hero section containing:
   - `name: "Zero Trust Architecture"`
   - `text` (tagline)
   - `tagline` (subtitle)
   - A brief 2-3 sentence description of the textbook

4. All file moves must be git-tracked — use `git mv` so history is preserved.

5. `npm run docs:build` must succeed with zero warnings after restructuring.

6. The auto-generated sidebar must show 5 collapsible section groups (Foundations, Methodology, Archetypes, Synthesis, Appendices), with each file nested under its parent directory. (The sidebar "groups collapse" count is 5 — one per directory containing an `index.md`.)

7. `docs/public/` must exist as a version-controlled directory (via a `.gitkeep` placeholder) for future static assets.

8. No VitePress config files are modified. `.md` file content changes are restricted to cross-reference path repairs only — file body content (axioms, traces, dimensions, glossary entries, chapter prose) must not be altered.

## Tasks / Subtasks

- [ ] Task 1: Create all target directories (AC: #7)
  - [ ] Create: `docs/01-foundations/`, `docs/02-methodology/`, `docs/03-archetypes/`, `docs/04-synthesis/`, `docs/appendix/`
  - [ ] Create: `docs/public/` with a `.gitkeep` placeholder file inside (git does not track empty directories)
  - [ ] Verify directories exist before attempting file moves

- [ ] Task 2: Move all 23 files into their target directories (AC: #1, #4, #8)
  - [ ] Move 01-foundations files: 00-preface.md, 01-the-case-for-zero-trust.md, 02-the-octagon.md, 03-octagon-as-instrument.md
  - [ ] Move 02-methodology files: 04-the-morphological-matrix.md, 05-dimensions-trust-to-attestation.md, 06-dimensions-response-to-human.md, 07-meta-patterns.md
  - [ ] Move 03-archetypes files: 08-archetype-a-holy-grail.md, 09-archetype-b-fortune-500.md, 10-archetype-c-startup.md, 11-archetype-d-lean-defense.md, 12-cross-trace-synthesis.md
  - [ ] Move 04-synthesis files: 13-self-assessment.md, 14-enterprise-turnaround.md, 15-velocity-defender.md, 16-scaling-pat.md, 17-the-aspirants-gate.md, 18-decision-matrix-and-conclusion.md
  - [ ] Move appendix files: appendix-a-quantum-ai-threats.md, appendix-b-validation-checklist.md, appendix-c-glossary.md, appendix-d-quick-reference.md
  - [ ] Use `git mv` for every file move (NOT regular `mv`)
  - [ ] Verify no `.md` files remain directly under `docs/` (except the new index.md)

- [ ] Task 2.5: Repair all broken internal cross-reference paths (AC: #8)
  - [ ] Use the reference table in Dev Notes → Cross-Reference Path Rewrite Rules to update every `[text](./OLD-FILENAME.md)` or `[text](../OLD-FILENAME.md)` link in the 23 content files
  - [ ] Files in `01-foundations/` referencing siblings: change `./` to keep same-dir reference (no change needed — they remain in same directory)
  - [ ] Files in `02-methodology/` referencing files now in different sections: change `./04-the-morphological-matrix.md` → `./04-the-morphological-matrix.md` (same dir, unchanged)
  - [ ] Files referencing files now in a *different* section: change `./04-the-morphological-matrix.md` → `../02-methodology/04-the-morphological-matrix.md`
  - [ ] Files in `appendix/` referencing chapter files: change `./../02-the-octagon.md` → `../01-foundations/02-the-octagon.md` and `../03-octagon-as-instrument.md` → `../01-foundations/03-octagon-as-instrument.md`
  - [ ] The appendix files already used `../` parent traversal — these now resolve to `../01-foundations/` instead of the flat root
  - [ ] Run `grep -rn '\./.*\.md' docs/` and `grep -rn '\.\./.*\.md' docs/` before and after repairs to audit all link fixes
  - [ ] Do NOT alter chapter body content — only cross-reference `[text](path)` link targets and prerequisite declarations

- [ ] Task 3: Create section landing pages (AC: #2)
  - [ ] Create `docs/01-foundations/index.md` with `title: Foundations` and a 1-2 sentence description
  - [ ] Create `docs/02-methodology/index.md` with `title: Methodology` and a 1-2 sentence description
  - [ ] Create `docs/03-archetypes/index.md` with `title: Archetypes` and a 1-2 sentence description
  - [ ] Create `docs/04-synthesis/index.md` with `title: Synthesis` and a 1-2 sentence description
  - [ ] Create `docs/appendix/index.md` with `title: Appendices` and a 1-2 sentence description
  - [ ] Each must use YAML frontmatter with `title:` (drives sidebar label via useTitleFromFrontmatter)

- [ ] Task 4: Create home page (AC: #3)
  - [ ] Create `docs/index.md` with `layout: home` YAML frontmatter
  - [ ] Include hero section with name, text, tagline, and brief description
  - [ ] Verify `npm run docs:dev` renders the home page at root URL

- [ ] Task 5: Verify end-to-end (AC: #5, #6)
  - [ ] Run `npm run docs:build` — must succeed with zero warnings
  - [ ] Run `npm run docs:dev` and verify sidebar shows 5 collapsible groups + appendix
  - [ ] Verify all 23 files appear in sidebar under their correct parent group
  - [ ] Verify section index.md pages appear as the top-level item in each sidebar group
  - [ ] Verify `git status` shows no untracked files left behind (only moves + new index files)
  - [ ] Verify `npm run docs:preview` serves the production build correctly

## Dev Notes

### What This Story Does

This story is a file-system restructure + cross-reference repair: move 23 flat markdown files from `docs/` into numbered section directories and update every internal `[text](./file.md)` link to reflect the new paths. Chapter body content is not edited. Config is not changed. The VitePress + vitepress-sidebar scaffold from Story 0.1 already handles subdirectory discovery — the sidebar auto-generates collapsible groups for any directory containing `.md` files.

**Why cross-reference repair is mandatory here, not deferred:**
The 23 content files contain ~100 internal cross-references using flat sibling-relative paths (`./02-the-octagon.md`, `./04-the-morphological-matrix.md`). Before restructure, these resolve correctly because all files sit at the same directory level. After moving files into subdirectories, every link that crosses section boundaries becomes dead. `ignoreDeadLinks: true` in the VitePress config (added by Story 0.1) suppresses build warnings for links to files that *don't exist yet* (Epics 1-4 content). The cross-references broken by this story's file moves point to files that *do* exist — they just moved. These are two different categories of dead links, and `ignoreDeadLinks: true` should not be relied on to mask the second category. Repairing cross-reference paths as part of this story means the build will pass with `ignoreDeadLinks: false` for all cross-references between the 23 existing files. Cross-references to files not yet created will still need the flag — that's fine.

### Cross-Reference Path Rewrite Rules

File moves break existing `[text](path.md)` links. The following table provides the exact rewrite for every cross-reference pattern. **Rule:** for each moved file, search for all `[text](./FILENAME.md)` and `[text](../FILENAME.md)` patterns and replace them with the new relative path from the file's new location.

**Pattern A: Same-section siblings (NO CHANGE)**

Files within the same target directory that reference each other keep their `./` prefix — both files move together, so the relative relationship is preserved.

| Source file (new location) | References | Keep as | Reason |
|---|---|---|---|
| `01-foundations/02-the-octagon.md` | `./01-the-case-for-zero-trust.md`, `./03-octagon-as-instrument.md` | `./01-the-case-for-zero-trust.md`, `./03-octagon-as-instrument.md` | Same directory |
| `02-methodology/04-the-morphological-matrix.md` | `./05-dimensions-trust-to-attestation.md`, etc. | unchanged | All methodology files stay together |
| `03-archetypes/09-archetype-b-fortune-500.md` | `./10-archetype-c-startup.md`, `./11-archetype-d-lean-defense.md` | unchanged | All archetype files stay together |
| `04-synthesis/14-enterprise-turnaround.md` | `./15-velocity-defender.md`, `./16-scaling-pat.md`, `./17-the-aspirants-gate.md` | unchanged | All synthesis files stay together |

**Pattern B: Cross-section references (MUST CHANGE)**

Files referencing targets in a *different* section need updated paths.

| Source file (new location) | Old reference | New reference |
|---|---|---|
| `01-foundations/02-the-octagon.md` | `./04-the-morphological-matrix.md` | `../02-methodology/04-the-morphological-matrix.md` |
| `01-foundations/02-the-octagon.md` | `./appendix-c-glossary.md` | `../appendix/appendix-c-glossary.md` |
| `01-foundations/03-octagon-as-instrument.md` | `./04-the-morphological-matrix.md` | `../02-methodology/04-the-morphological-matrix.md` |
| `01-foundations/03-octagon-as-instrument.md` | `./appendix-b-validation-checklist.md` | `../appendix/appendix-b-validation-checklist.md` |
| `01-foundations/03-octagon-as-instrument.md` | `./12-cross-trace-synthesis.md` | `../03-archetypes/12-cross-trace-synthesis.md` |
| `01-foundations/01-the-case-for-zero-trust.md` | `./13-self-assessment.md` | `../04-synthesis/13-self-assessment.md` |
| `02-methodology/05-dimensions-trust-to-attestation.md` | `./07-meta-patterns.md` | unchanged (same dir) |
| `02-methodology/05-dimensions-trust-to-attestation.md` | `./appendix-d-quick-reference.md` | `../appendix/appendix-d-quick-reference.md` |
| `02-methodology/06-dimensions-response-to-human.md` | `./08-archetype-a-holy-grail.md` | `../03-archetypes/08-archetype-a-holy-grail.md` |
| `02-methodology/06-dimensions-response-to-human.md` | `./appendix-d-quick-reference.md` | `../appendix/appendix-d-quick-reference.md` |
| `02-methodology/07-meta-patterns.md` | `./08-archetype-a-holy-grail.md` | `../03-archetypes/08-archetype-a-holy-grail.md` |
| `02-methodology/07-meta-patterns.md` | `./12-cross-trace-synthesis.md` | `../03-archetypes/12-cross-trace-synthesis.md` |
| `03-archetypes/08-archetype-a-holy-grail.md` | `./14-enterprise-turnaround.md` | `../04-synthesis/14-enterprise-turnaround.md` |
| `03-archetypes/09-archetype-b-fortune-500.md` | `./14-enterprise-turnaround.md` | `../04-synthesis/14-enterprise-turnaround.md` |
| `03-archetypes/10-archetype-c-startup.md` | `./15-velocity-defender.md` | `../04-synthesis/15-velocity-defender.md` |
| `03-archetypes/11-archetype-d-lean-defense.md` | `./16-scaling-pat.md` | `../04-synthesis/16-scaling-pat.md` |
| `03-archetypes/12-cross-trace-synthesis.md` | `./13-self-assessment.md` | `../04-synthesis/13-self-assessment.md` |

**Pattern C: Appendix files referencing chapter files (MUST CHANGE)**

Appendix files already use `../` parent traversal from `docs/` root. After restructure, appendix files live in `docs/appendix/`, so `../` traverses to `docs/` (the correct parent). These need the section directory inserted into the path.

| Source file (new location) | Old reference | New reference |
|---|---|---|
| `appendix/appendix-a-quantum-ai-threats.md` | `./../02-the-octagon.md` | `../01-foundations/02-the-octagon.md` |
| `appendix/appendix-a-quantum-ai-threats.md` | `./../04-the-morphological-matrix.md` | `../02-methodology/04-the-morphological-matrix.md` |
| `appendix/appendix-a-quantum-ai-threats.md` | `./../05-dimensions-trust-to-attestation.md` | `../02-methodology/05-dimensions-trust-to-attestation.md` |
| `appendix/appendix-a-quantum-ai-threats.md` | `./../06-dimensions-response-to-human.md` | `../02-methodology/06-dimensions-response-to-human.md` |
| `appendix/appendix-b-validation-checklist.md` | `../03-octagon-as-instrument.md` | `../01-foundations/03-octagon-as-instrument.md` |
| `appendix/appendix-b-validation-checklist.md` | `../07-meta-patterns.md` | `../02-methodology/07-meta-patterns.md` |
| `appendix/appendix-b-validation-checklist.md` | `../18-decision-matrix-and-conclusion.md` | `../04-synthesis/18-decision-matrix-and-conclusion.md` |

**Pattern D: Cross-references in appendix files using inconsistent path styles**

`appendix-a` uses `./../` (double-dot from within docs/) while `appendix-b` uses `../` (single-dot from within docs/). Both resolve correctly from `docs/` root today. After restructure, both must be updated to `../SECTION/FILE.md`.

**Automated repair approach:**
1. After all `git mv` operations complete, run a sed/script pass over every file using the mapping table above
2. Verify with: `grep -rn '\.\/.*\.md' docs/0* docs/appendix/ | grep -v index.md | grep -v node_modules`
3. For each remaining match, check whether it crosses section boundaries — if yes, fix; if same-section, leave
4. Prefer exact targeted replacements (the table above enumerates all known patterns) rather than a fragile regex that might match prose descriptions of filenames

### Architecture Compliance

**From architecture.md — Decision 13 (Directory Structure):**
- Hybrid numbered + named sections: `01-foundations/`, `02-methodology/`, `03-archetypes/`, `04-synthesis/`
- Directory prefixes enforce deterministic sidebar ordering
- Individual files keep their numeric prefixes (directory ordering handles sequence)
- `public/` directory for static assets (standard VitePress convention)
- This is **Phase 2** of the 5-phase migration strategy from architecture.md

**From architecture.md — Directory Structure (Post-Restructuring):**
This story implements the exact directory tree documented there. Note: the architecture shows `.github/`, `.nojekyll`, and `package.json` at repo root — these are correctly placed already (Story 0.1 reconciled this).

### Story 0.1 Intelligence

**Critical context from the previous story's Dev Notes and implementation:**
- `"type": "module"` was added to `package.json` for ESM compatibility — this is working and must stay
- `ignoreDeadLinks: true` was added to `config.ts` (not in original spec) because the existing `.md` files contain cross-references like `[§Chapter: Title](./04-the-morphological-matrix.md#section-anchor)` that reference files which exist today. After restructure + cross-reference repair (Task 2.5 of this story), all links between the 23 existing files will resolve correctly. The `ignoreDeadLinks` flag must remain because some cross-references point to files/chapters that won't exist until Epics 1-4 create them. **Do NOT remove this flag**, but also do not rely on it to mask broken links caused by this story's file moves — repair those explicitly.
- The `withSidebar()` API with `documentRootPath: 'docs'` already scans the entire `docs/` tree recursively. Moving files into subdirectories requires zero config changes — subdirectories automatically become collapsible sidebar groups.
- All 23 files currently appear as a flat list in the sidebar. After restructure, they will appear nested under group headers matching the directory names.
- VitePress config lives at `docs/.vitepress/config.ts` — the standard convention where `.vitepress/` is inside the docs source directory. Do not move it.
- The `.vitepress/` directory must remain inside `docs/` alongside the content files.

### Architecture Delta: Decision 13 text vs. tree

Architecture Decision 13 says *"Groups 23 files into 5 logical sections (01-foundations, 02-methodology, 03-archetypes, 04-synthesis, **05-advanced**)"*. The architecture's own "Directory Structure (Post-Restructuring)" tree shows only 4 content sections (01-04) + appendix — no `05-advanced/`. Decision 13's text was never updated when the section count was reduced from 5 to 4 during architecture authoring. **This story follows the tree, not the stale decision text.** The 05-advanced concept was folded into 04-synthesis (chapters 14-18 are the "advanced" implementation pathways). A future architecture amendment should reconcile Decision 13's text with the actual tree.


### Files to Create

| File | Type | Purpose |
|------|------|---------|
| `docs/index.md` | NEW | Home page with `layout: home` hero section |
| `docs/01-foundations/index.md` | NEW | Section landing page |
| `docs/02-methodology/index.md` | NEW | Section landing page |
| `docs/03-archetypes/index.md` | NEW | Section landing page |
| `docs/04-synthesis/index.md` | NEW | Section landing page |
| `docs/appendix/index.md` | NEW | Section landing page |
| `docs/public/` | NEW | Empty directory for static assets |

### Files to Move (23 total)

All 23 existing `.md` files move from `docs/` into their target subdirectory. Use `git mv` for each:

| Source | Destination |
|--------|-------------|
| `docs/00-preface.md` | `docs/01-foundations/00-preface.md` |
| `docs/01-the-case-for-zero-trust.md` | `docs/01-foundations/01-the-case-for-zero-trust.md` |
| `docs/02-the-octagon.md` | `docs/01-foundations/02-the-octagon.md` |
| `docs/03-octagon-as-instrument.md` | `docs/01-foundations/03-octagon-as-instrument.md` |
| `docs/04-the-morphological-matrix.md` | `docs/02-methodology/04-the-morphological-matrix.md` |
| `docs/05-dimensions-trust-to-attestation.md` | `docs/02-methodology/05-dimensions-trust-to-attestation.md` |
| `docs/06-dimensions-response-to-human.md` | `docs/02-methodology/06-dimensions-response-to-human.md` |
| `docs/07-meta-patterns.md` | `docs/02-methodology/07-meta-patterns.md` |
| `docs/08-archetype-a-holy-grail.md` | `docs/03-archetypes/08-archetype-a-holy-grail.md` |
| `docs/09-archetype-b-fortune-500.md` | `docs/03-archetypes/09-archetype-b-fortune-500.md` |
| `docs/10-archetype-c-startup.md` | `docs/03-archetypes/10-archetype-c-startup.md` |
| `docs/11-archetype-d-lean-defense.md` | `docs/03-archetypes/11-archetype-d-lean-defense.md` |
| `docs/12-cross-trace-synthesis.md` | `docs/03-archetypes/12-cross-trace-synthesis.md` |
| `docs/13-self-assessment.md` | `docs/04-synthesis/13-self-assessment.md` |
| `docs/14-enterprise-turnaround.md` | `docs/04-synthesis/14-enterprise-turnaround.md` |
| `docs/15-velocity-defender.md` | `docs/04-synthesis/15-velocity-defender.md` |
| `docs/16-scaling-pat.md` | `docs/04-synthesis/16-scaling-pat.md` |
| `docs/17-the-aspirants-gate.md` | `docs/04-synthesis/17-the-aspirants-gate.md` |
| `docs/18-decision-matrix-and-conclusion.md` | `docs/04-synthesis/18-decision-matrix-and-conclusion.md` |
| `docs/appendix-a-quantum-ai-threats.md` | `docs/appendix/appendix-a-quantum-ai-threats.md` |
| `docs/appendix-b-validation-checklist.md` | `docs/appendix/appendix-b-validation-checklist.md` |
| `docs/appendix-c-glossary.md` | `docs/appendix/appendix-c-glossary.md` |
| `docs/appendix-d-quick-reference.md` | `docs/appendix/appendix-d-quick-reference.md` |

### What NOT to do

- Do NOT use regular `mv` — every file move must use `git mv` to preserve git blame history
- Do NOT modify chapter body content (axiom definitions, trace narratives, dimension descriptions, glossary entries, research citations) — only cross-reference link targets and prerequisite declarations are repaired
- Do NOT touch `docs/.vitepress/config.ts` — the sidebar auto-discovers subdirectories
- Do NOT touch `docs/.vitepress/theme/index.ts` or `custom.css` — those are for Story 0.3
- Do NOT remove `ignoreDeadLinks: true` from config — cross-references to files that won't exist until Epics 1-4 still need the dead-link suppression after cross-reference paths are repaired
- Do NOT create `docs/appendix/appendix-e-cisa-ztmm-crosswalk.md` — that file will be created by Story 4.6. The architecture's target-state tree showing it under `appendix/` is aspirational (post-Epic-4), not a requirement for this story.
- Do NOT move `.vitepress/` out of `docs/` — it stays inside the docs source directory
- Do NOT remove any existing files — all 23 `.md` files must survive the move
- Do NOT add frontmatter `title` or `description` to the 23 content files — that's for Epic 1+
- Do NOT create the `05-advanced/` section referenced in Architecture Decision 13's decision text — the architecture's own directory tree at "Directory Structure (Post-Restructuring)" shows a 4-section layout (01-04 + appendix). Decision 13's text is stale and conflicts with the tree. Follow the tree.

### Section Index Content Guidelines

Each section `index.md` follows this minimal pattern:

```yaml
---
title: Foundations
---

Foundational concepts of the zero-trust architectural framework.
```

Section titles: Foundations, Methodology, Archetypes, Synthesis, Appendices

### Home Page Content Guidelines

`docs/index.md`:

```yaml
---
layout: home

hero:
  name: "Zero Trust Architecture"
  text: "A Reference Textbook"
  tagline: "Rigorous zero-trust deployment from first principles — not products, not compliance checklists."
---

Zero Trust Architecture is a comprehensive reference work that builds a vendor-neutral zero-trust framework from eight irreducible axioms. It defines a nine-dimension morphological matrix for evaluating architectural maturity, traces four archetypal breach scenarios to demonstrate failure modes, and provides actionable implementation pathways for organizations of every scale.
```

### Testing & Verification

1. **`npm run docs:build` with zero warnings**: Run `npm run docs:build 2>&1 | grep -i warn` — must produce no output
2. **Sidebar shows collapsible groups**: Start `npm run docs:dev`, open browser, verify "Foundations", "Methodology", "Archetypes", "Synthesis", "Appendices" appear as 5 collapsible sidebar sections
3. **All 23 files in correct groups**: Expand each sidebar section, verify file count matches the mapping table above
4. **Home page renders**: Navigate to root URL, verify hero section with name, text, tagline, and description
5. **Section indexes render**: Click each section group title in sidebar, verify the section landing page appears with correct title and description
6. **Git history preserved**: Run `git log --follow docs/01-foundations/00-preface.md` — must show the file's full commit history
7. **No stale files or missing files**: Run `find docs -name "*.md" -not -path "docs/.vitepress/*" -not -path "docs/node_modules/*" | wc -l` — must produce exactly 30 (23 content files + 6 index files + 1 root index = 30 total `.md` files). Run `find docs -name "*.md" -not -path "docs/.vitepress/*" -not -path "docs/node_modules/*" | sort` and manually verify the list matches the canonical file set.
8. **`npm run docs:preview` works**: Run the preview server, verify the full site renders in production mode
9. **Cross-reference paths resolve correctly**: Temporarily set `ignoreDeadLinks: false` in `docs/.vitepress/config.ts`, run `npm run docs:build`, verify zero dead-link warnings for the 23 content files. Cross-references to Epics 1-4 files will still warn — that's expected. Restore `ignoreDeadLinks: true` after verification.
10. **Public directory is tracked**: Run `git ls-files docs/public/` — must show `docs/public/.gitkeep`
11. **Run `npm run docs:dev`, navigate through cross-reference links**: Click at least 10 cross-reference links across different section boundaries in the rendered wiki. Verify they all resolve to the correct page.

### References

- [Source: architecture.md — Directory Structure (Post-Restructuring)]
- [Source: architecture.md — Migration Strategy Phase 2: Restructure]
- [Source: architecture.md — Implementation Decisions 12-13 (vitepress-sidebar, directory structure)]
- [Source: epics.md — Epic 0 Story 0.2 Acceptance Criteria]
- [Source: Story 0.1 — Dev Notes (ignoreDeadLinks, withSidebar, VitePress config location)]
- [Source: vitepress-sidebar docs — Automatic directory-based grouping](https://vitepress-sidebar.cdget.com/guide/getting-started)

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List

**Created:**
- docs/index.md
- docs/01-foundations/index.md
- docs/02-methodology/index.md
- docs/03-archetypes/index.md
- docs/04-synthesis/index.md
- docs/appendix/index.md
- docs/public/.gitkeep

**Moved (git mv):**
- docs/00-preface.md → docs/01-foundations/00-preface.md
- docs/01-the-case-for-zero-trust.md → docs/01-foundations/01-the-case-for-zero-trust.md
- docs/02-the-octagon.md → docs/01-foundations/02-the-octagon.md
- docs/03-octagon-as-instrument.md → docs/01-foundations/03-octagon-as-instrument.md
- docs/04-the-morphological-matrix.md → docs/02-methodology/04-the-morphological-matrix.md
- docs/05-dimensions-trust-to-attestation.md → docs/02-methodology/05-dimensions-trust-to-attestation.md
- docs/06-dimensions-response-to-human.md → docs/02-methodology/06-dimensions-response-to-human.md
- docs/07-meta-patterns.md → docs/02-methodology/07-meta-patterns.md
- docs/08-archetype-a-holy-grail.md → docs/03-archetypes/08-archetype-a-holy-grail.md
- docs/09-archetype-b-fortune-500.md → docs/03-archetypes/09-archetype-b-fortune-500.md
- docs/10-archetype-c-startup.md → docs/03-archetypes/10-archetype-c-startup.md
- docs/11-archetype-d-lean-defense.md → docs/03-archetypes/11-archetype-d-lean-defense.md
- docs/12-cross-trace-synthesis.md → docs/03-archetypes/12-cross-trace-synthesis.md
- docs/13-self-assessment.md → docs/04-synthesis/13-self-assessment.md
- docs/14-enterprise-turnaround.md → docs/04-synthesis/14-enterprise-turnaround.md
- docs/15-velocity-defender.md → docs/04-synthesis/15-velocity-defender.md
- docs/16-scaling-pat.md → docs/04-synthesis/16-scaling-pat.md
- docs/17-the-aspirants-gate.md → docs/04-synthesis/17-the-aspirants-gate.md
- docs/18-decision-matrix-and-conclusion.md → docs/04-synthesis/18-decision-matrix-and-conclusion.md
- docs/appendix-a-quantum-ai-threats.md → docs/appendix/appendix-a-quantum-ai-threats.md
- docs/appendix-b-validation-checklist.md → docs/appendix/appendix-b-validation-checklist.md
- docs/appendix-c-glossary.md → docs/appendix/appendix-c-glossary.md
- docs/appendix-d-quick-reference.md → docs/appendix/appendix-d-quick-reference.md

**Modified (cross-reference repairs):**
- docs/01-foundations/01-the-case-for-zero-trust.md
- docs/01-foundations/02-the-octagon.md
- docs/01-foundations/03-octagon-as-instrument.md
- docs/02-methodology/04-the-morphological-matrix.md
- docs/02-methodology/05-dimensions-trust-to-attestation.md
- docs/02-methodology/06-dimensions-response-to-human.md
- docs/02-methodology/07-meta-patterns.md
- docs/03-archetypes/08-archetype-a-holy-grail.md
- docs/03-archetypes/09-archetype-b-fortune-500.md
- docs/03-archetypes/10-archetype-c-startup.md
- docs/03-archetypes/11-archetype-d-lean-defense.md
- docs/03-archetypes/12-cross-trace-synthesis.md
- docs/04-synthesis/13-self-assessment.md
- docs/04-synthesis/14-enterprise-turnaround.md
- docs/04-synthesis/15-velocity-defender.md
- docs/04-synthesis/16-scaling-pat.md
- docs/appendix/appendix-a-quantum-ai-threats.md
- docs/appendix/appendix-b-validation-checklist.md

### Change Log

- Restructured docs/ from flat to 5 numbered section directories per architecture decision
- Moved 23 content files using git mv to preserve git history
- Repaired cross-reference paths for all inter-section links
- Created section landing pages with title frontmatter for sidebar grouping
- Created home page with hero layout
- Added public/.gitkeep for static assets directory
e List
