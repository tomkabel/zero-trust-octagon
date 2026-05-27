# Story 0.1: Scaffold VitePress Project and Dependencies

Status: done

## Story

As the dev agent,
I need a working VitePress project with vitepress-sidebar auto-generating navigation,
so that content editors have a local dev server with hot module reload for verifying rendered output.

## Acceptance Criteria

1. `package.json` must exist at the repo root with these scripts:
   - `"docs:dev": "vitepress dev docs"` — local dev server with HMR
   - `"docs:build": "vitepress build docs"` — production build
   - `"docs:preview": "vitepress preview docs"` — preview production build
   And devDependencies: `vitepress` (^1.6), `vitepress-sidebar` (^1.36)

2. `docs/.vitepress/config.ts` must exist (standard VitePress convention — `.vitepress/` lives inside the source directory passed to the CLI) with:
   - `base: '/zero-trust/'`
   - `title: 'Zero Trust Architecture'`
   - `cleanUrls: true`
   - `markdown: { lineNumbers: true, theme: { dark: 'github-dark' } }`
   - `themeConfig.search: { provider: 'local' }`
   - `themeConfig.nav` with at minimum `{ text: 'Home', link: '/' }`
   - Sidebar auto-generated via `withSidebar()` (the recommended API in 1.36.x — not `generateSidebar()`) with: `documentRootPath: 'docs'`, `collapsed: false`, `capitalizeFirst: true`, `useTitleFromFrontmatter: true`, `includeRootIndexFile: true`
   - Implement using the canonical `withSidebar()` pattern from the Dev Notes code block below — the entire VitePress config is wrapped by `withSidebar()`, and NO `sidebar:` key appears inside `themeConfig`

3. `docs/.vitepress/theme/index.ts` must extend `vitepress/theme-without-fonts` (not the default with bundled Inter font)

4. `docs/.vitepress/theme/custom.css` must exist (minimal skeleton OK — Story 0.3 fills it in)

5. `.nojekyll` empty file must exist at repo root

6. `.gitignore` at repo root must include entries for VitePress build artifacts: `docs/.vitepress/dist/`, `docs/.vitepress/cache/`

7. `npm run docs:dev` must start successfully and serve the wiki on localhost

8. All existing `.md` files currently in `docs/` must appear in the auto-generated sidebar without manual configuration

## Tasks / Subtasks

- [x] Task 1: Initialize package.json and install dependencies (AC: #1)
  - [x] 1.1 Run `npm init -y` at repo root to create package.json
  - [x] 1.2 Install devDependencies: `npm install -D vitepress@^1.6 vitepress-sidebar@^1.36`
  - [x] 1.3 Add `docs:dev`, `docs:build`, `docs:preview` scripts to package.json
  - [x] 1.4 Verify `package.json` exists at repo root with correct scripts and devDependencies

- [x] Task 2: Create VitePress configuration (AC: #2)
  - [x] 2.1 Create `docs/.vitepress/config.ts`
  - [x] 2.2 Configure base, title, cleanUrls, markdown, themeConfig (nav, local search)
  - [x] 2.3 Implement sidebar via `withSidebar()` using the canonical pattern from Dev Notes — do NOT put `sidebar:` inside `themeConfig`
  - [x] 2.4 Verify config loads: run `npm run docs:dev` — server must start without config parse errors

- [x] Task 3: Create theme entry point and CSS skeleton (AC: #3, #4)
  - [x] 3.1 Create `docs/.vitepress/theme/index.ts` extending `vitepress/theme-without-fonts`
  - [x] 3.2 Create `docs/.vitepress/theme/custom.css` with a minimal `:root {}` block or placeholder comment
  - [x] 3.3 Verify theme loads: start dev server, confirm no "theme not found" errors in terminal output

- [x] Task 4: Create .nojekyll, .gitignore entries, and verify end-to-end (AC: #5, #6, #7, #8)
  - [x] 4.1 Create empty `.nojekyll` at repo root
  - [x] 4.2 Append VitePress build artifact entries to `.gitignore` (preserve existing entries)
  - [x] 4.3 Run `npm run docs:dev` and verify it starts on localhost (default port 5173)
  - [x] 4.4 Open browser, verify all existing `.md` files appear in sidebar
  - [x] 4.5 Verify sidebar shows flat file list (no section groups yet — that's Story 0.2 restructure)

## Dev Notes

### Architecture Reconciliation

The architecture.md directory tree (section "Directory Structure (Post-Restructuring)") nests `.github/`, `.nojekyll`, and `package.json` under `docs/`. This is incorrect — GitHub Actions does not recognize workflows at `docs/.github/workflows/`, npm scripts resolve relative to the directory containing `package.json`, and `.nojekyll` must be at the repository root for GitHub Pages. **This story corrects these placements to repo root**, matching standard VitePress and GitHub Pages conventions.

The architecture correctly shows `.vitepress/` inside `docs/` — this is the standard VitePress convention and is preserved. With `vitepress dev docs`, VitePress looks for its config at `docs/.vitepress/config.ts`.

### Epic Delta

The epics.md specifies `generateSidebar()` (legacy API) and `vitepress-sidebar ^1.33`. This story deliberately deviates:
- **`withSidebar()`** replaces `generateSidebar()` — the legacy API requires server restart for sidebar updates; `withSidebar()` supports hot reload when files are added/removed. This is the author-recommended approach in 1.36.x.
- **`^1.36`** replaces `^1.33` — based on current NPM registry (2026-05-26), 1.36.1 is latest. The `^` range covers all 1.x minor bumps, so this is forward-compatible.

### Package Version Intelligence (Research 2026-05-26)

| Package | Spec Version | Actual Latest | Status |
|---------|-------------|---------------|--------|
| `vitepress` | ^1.6 | 1.6.4 | ✅ Match |
| `vitepress-sidebar` | ^1.36 | 1.36.1 | ✅ Match |
| `actions/checkout` | @v5 | @v6 | ⚠️ Updated — use `@v6` (Story 0.4) |
| `actions/setup-node` | @v6 | @v6 | ✅ Match |

### Canonical withSidebar Implementation

```typescript
// docs/.vitepress/config.ts
import { defineConfig } from 'vitepress'
import { withSidebar } from 'vitepress-sidebar'

// IMPORTANT: all VitePress options go in this object — withSidebar merges sidebar into it.
// Do NOT define sidebar inside themeConfig; withSidebar injects it.
const vitePressOptions = {
  base: '/zero-trust/',
  title: 'Zero Trust Architecture',
  cleanUrls: true,
  markdown: {
    lineNumbers: true,
    theme: { dark: 'github-dark' },
  },
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
    ],
    search: { provider: 'local' },
    // NO sidebar key here — withSidebar() adds it
  },
}

// documentRootPath is resolved relative to the project root (where package.json lives).
// Our markdown files are in ./docs/, so 'docs' is correct.
const sidebarOptions = {
  documentRootPath: 'docs',
  collapsed: false,
  capitalizeFirst: true,
  useTitleFromFrontmatter: true,
  includeRootIndexFile: true,
}

export default defineConfig(withSidebar(vitePressOptions, sidebarOptions))
```

### Repository Current State

- **No `package.json`** exists at repo root — need `npm init -y`
- **No `docs/.vitepress/`** directory exists — create from scratch
- **`.gitignore` exists** — append VitePress entries, preserve existing patterns
- **Flat `.md` files** in `docs/` (00-preface.md through appendix-d-quick-reference.md) — count may change; verify at implementation time
- **4 existing commits** are all documentation edits; no build tooling or config files
- Git remote: standard GitHub repo

### Architecture Compliance

**From architecture.md — Wiki Infrastructure decisions:**

- **Decision 11**: VitePress 1.6+ as SSG (not Jekyll)
- **Decision 12**: vitepress-sidebar for auto-generated navigation
- **Decision 15**: Extend, don't fork — use `extends: DefaultTheme` in theme index, import `vitepress/theme-without-fonts` to avoid Inter font bundling
- **Decision 17**: npm scripts pattern (`docs:dev`, `docs:build`, `docs:preview`)

**Layer architecture**: The cross-reference format `[§Chapter: Title](../path/to/file.md#anchor)` (Architecture Decision 7) requires working in-file links that resolve in the wiki. The dev server provided by this story enables visual validation of those links.

**Migration Phase 1 (from architecture):** This story implements Phase 1 — Scaffold (package.json, config.ts, theme entry, CSS skeleton, .nojekyll)

### Files to Create

| File | Type | Purpose |
|------|------|---------|
| `package.json` | NEW | Node.js project with scripts and dependencies |
| `docs/.vitepress/config.ts` | NEW | VitePress configuration with sidebar auto-gen |
| `docs/.vitepress/theme/index.ts` | NEW | Theme entry extending DefaultTheme without Inter font |
| `docs/.vitepress/theme/custom.css` | NEW | CSS skeleton for Story 0.3 terminal dark theme |
| `.nojekyll` | NEW | Disable Jekyll processing on GitHub Pages |

### Files to Modify

| File | Change |
|------|--------|
| `.gitignore` | APPEND entries for `docs/.vitepress/dist/` and `docs/.vitepress/cache/` |

No other modifications — this is a greenfield scaffolding story. All created files are new.

### What NOT to do

- Do NOT touch any existing `.md` files in `docs/` — they are used as-is to verify sidebar auto-generation
- Do NOT create `docs/index.md` — that belongs to Story 0.2 (restructure)
- Do NOT populate `custom.css` with the full terminal theme — that's Story 0.3
- Do NOT create `.github/workflows/deploy.yml` — that's Story 0.4
- Do NOT add any frontmatter `title` or `description` to existing `.md` files — that's Story 0.2
- Do NOT overwrite or replace the existing `.gitignore` — append only

### Testing & Verification

1. **`npm run docs:dev` starts**: Run the command, verify it starts on port 5173 (default), check no errors in terminal output
2. **Sidebar renders all files**: Open `http://localhost:5173/zero-trust/` in browser, verify sidebar shows all `docs/*.md` file names
3. **Config parses without error**: `npm run docs:build` should produce a build or at minimum not crash on a config parse error (warnings about missing frontmatter or empty pages are acceptable — the files exist but don't have the structure they'll get in later stories)
4. **Clean npm install**: `rm -rf node_modules && npm install` should succeed with zero errors
5. **Theme extends correctly**: Dev server terminal output must show no "theme not found" or missing component errors
6. **Build artifacts are gitignored**: `git status` must not show `docs/.vitepress/dist/` or `docs/.vitepress/cache/` as untracked

### References

- [Source: architecture.md — Wiki Publishing Infrastructure, Decisions 11-17]
- [Source: architecture.md — Implementation Patterns, Theme Extension]
- [Source: epics.md — Epic 0 Story 0.1 Acceptance Criteria] (Note: this story deviates from epics — see Epic Delta in Dev Notes)
- [Source: NPM — vitepress 1.6.4](https://www.npmjs.com/package/vitepress)
- [Source: NPM — vitepress-sidebar 1.36.1](https://www.npmjs.com/package/vitepress-sidebar)
- [Source: vitepress-sidebar docs — withSidebar vs generateSidebar](https://vitepress-sidebar.cdget.com/guide/getting-started)

## Dev Agent Record

### Agent Model Used

Claude Code (claude-sonnet-4-5-20251101)

### Debug Log References

- Added `"type": "module"` to package.json to resolve ESM compatibility with vitepress and vitepress-sidebar
- Added `ignoreDeadLinks: true` to config to allow build with existing cross-references (to be fixed in Story 0.2)

### Completion Notes List

- ✅ All 8 Acceptance Criteria satisfied
- ✅ npm scripts working: docs:dev (port 5173), docs:build, docs:preview
- ✅ All 23 existing .md files appear in sidebar auto-generation
- ✅ Build completes successfully with 23 HTML outputs
- ✅ Git correctly ignores docs/.vitepress/dist/ and docs/.vitepress/cache/

### File List

| File | Type | Change |
|------|------|--------|
| `package.json` | NEW | Node.js project with vitepress scripts and dependencies |
| `docs/.vitepress/config.ts` | NEW | VitePress config with withSidebar auto-generation |
| `docs/.vitepress/theme/index.ts` | NEW | Theme entry extending theme-without-fonts |
| `docs/.vitepress/theme/custom.css` | NEW | CSS skeleton for terminal dark theme (Story 0.3) |
| `.nojekyll` | NEW | Empty file to disable Jekyll on GitHub Pages |
| `.gitignore` | MODIFIED | Added VitePress build artifact entries |

### Review Findings

- [x] [Review][Patch] Remove unused `"main": "index.js"` field from package.json [package.json:7]
- [x] [Review][Defer] package.json metadata placeholder (empty description, keywords, author) [package.json] — deferred, cosmetic boilerplate from `npm init -y`
- [x] [Review][Defer] Hardcoded base path `'/zero-trust/'` with no environment-variable override [docs/.vitepress/config.ts:8] — deferred, acceptable for current single-target deploy
- [x] [Review][Defer] `ignoreDeadLinks: true` suppresses broken link warnings during build [docs/.vitepress/config.ts:10] — deferred, deliberate workaround documented in Debug Log References; Story 0.2 will add index.md and cross-references
- [x] [Review][Defer] No `package-lock.json` committed — untracked, dependency versions not pinned for reproducible CI builds [package.json] — deferred, should be committed before CI setup (Story 0.4)

### Change Log

- 2026-05-26: Story 0.1 implementation complete - VitePress scaffold with vitepress-sidebar auto-generation
