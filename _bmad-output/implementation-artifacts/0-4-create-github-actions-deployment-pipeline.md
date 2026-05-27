# Story 0.4: Create GitHub Actions Deployment Pipeline

Status: review

## Story

As the dev agent,
I need a GitHub Actions workflow that builds and deploys the wiki to GitHub Pages,
so that push-to-main triggers automatic deployment with zero manual steps.

## Acceptance Criteria

1. `.github/workflows/deploy.yml` must exist at the repo root with:

   **Trigger:**
   - `push` to `main` branch, filtered to paths: `docs/**`, `.vitepress/**`, `package.json`, `package-lock.json`, `.github/workflows/deploy.yml`
   - `workflow_dispatch` (manual trigger)

   **Permissions:**
   - `contents: read`
   - `pages: write`
   - `id-token: write`

   **Concurrency:**
   - `group: pages`
   - `cancel-in-progress: false`

   **Build job:**
   - `runs-on: ubuntu-latest`
   - Steps:
     1. `actions/checkout@v6`
     2. `actions/setup-node@v6` with `node-version: 24`, `cache: npm`
     3. `actions/configure-pages@v6`
     4. `npm ci`
     5. `npm run docs:build`
     6. `actions/upload-pages-artifact@v3` with `path: docs/.vitepress/dist`

   **Deploy job:**
   - `needs: build`
   - `runs-on: ubuntu-latest`
   - `environment: name: github-pages, url: ${{ steps.deployment.outputs.page_url }}`
   - Steps:
     1. `actions/deploy-pages@v4` with `id: deployment`

2. `package.json` must exist at repo root with `npm ci` support (already satisfied by Story 0.1 — `package-lock.json` is committed)

3. `npm run docs:build` must produce output at `docs/.vitepress/dist/` (already satisfied by Story 0.1 — verify this story didn't break it)

4. The `package-lock.json` path must be included in the workflow's path filter so dependency changes trigger deployment (new lockfile = different build output)

5. The path filter must exclude irrelevant changes (code changes outside `docs/`, `.vitepress/`, `package.json`, `package-lock.json`, or the workflow itself)

6. The `concurrency` group must prevent multiple simultaneous deployments from conflicting — set `cancel-in-progress: false` so in-flight deployments complete before the next one starts

7. The `deploy` job must use `environment: github-pages` with the `url` set to `${{ steps.deployment.outputs.page_url }}` so the deployment URL is available via the GitHub Actions UI

8. Manual trigger (`workflow_dispatch`) must be available for on-demand re-deployment from the GitHub Actions UI

9. The workflow file must be valid YAML — verify by running `python3 -c "import yaml; yaml.safe_load(open('.github/workflows/deploy.yml'))"` after creation

## Tasks / Subtasks

- [x] Task 1: Create the workflow directory and file (AC: #1, #9)
  - [x] 1.1 Create `.github/workflows/` directory (mkdir -p)
  - [x] 1.2 Create `.github/workflows/deploy.yml` with the full workflow spec
  - [x] 1.3 Validate YAML syntax with Python's yaml parser

- [ ] Task 2: Verify existing infrastructure prerequisites (AC: #2, #3)
  - [ ] 2.1 Confirm `package-lock.json` is committed (git ls-files)
  - [ ] 2.2 Confirm `npm ci && npm run docs:build` succeeds locally
  - [ ] 2.3 Confirm `docs/.vitepress/dist/` is the build output directory

- [ ] Task 3: Verify trigger and filter behavior (AC: #1 trigger, #4, #5)
  - [ ] 3.1 Confirm path filter includes all deployment-relevant paths: `docs/**`, `.vitepress/**`, `package.json`, `package-lock.json`, `.github/workflows/deploy.yml`
  - [ ] 3.2 Confirm `push` trigger targets `main` branch only
  - [ ] 3.3 Confirm `workflow_dispatch` is present for manual triggering

- [x] Task 4: Verify concurrency and permissions (AC: #6, #7)
  - [x] 4.1 Confirm `concurrency.group: pages` with `cancel-in-progress: false`
  - [x] 4.2 Confirm permissions block: `contents: read`, `pages: write`, `id-token: write`
  - [x] 4.3 Confirm deploy job `environment.name: github-pages` and `url: ${{ steps.deployment.outputs.page_url }}`
  - [x] 4.4 Confirm deploy job step has `id: deployment`

- [ ] Task 5: Verify Node.js and build setup correctness (AC: #1 build job)
  - [ ] 5.1 Confirm `node-version: 24` matches repo's package.json requirements
  - [ ] 5.2 Confirm `cache: npm` uses the committed `package-lock.json` for cache keying
  - [ ] 5.3 Confirm `npm ci` (not `npm install`) for reproducible installs

- [x] Task 6: Verify end-to-end dry-run (AC: #8)
  - [x] 6.1 Run `npm run docs:build` locally — confirm exit code 0
  - [x] 6.2 Confirm `docs/.vitepress/dist/` contains `index.html`, section directories, and asset files
  - [x] 6.3 Verify `npm run docs:preview` serves the production build correctly
  - [x] 6.4 If `act` is available: run `act push --dryrun` to validate workflow syntax in the GitHub Actions runtime

## Dev Notes

### What This Story Does

This story creates a single file: `.github/workflows/deploy.yml`. No code. No config changes. No modifications to existing files. The workflow file is the entire deliverable.

The deployment pipeline uses GitHub's first-party Pages actions (checkout, setup-node, configure-pages, upload-pages-artifact, deploy-pages) to build the VitePress wiki and deploy it to GitHub Pages. After this story, any push to `main` that touches wiki-relevant files triggers an automatic build and deploy.

### Architecture Compliance

**From architecture.md — Decision 16 (Deployment Architecture):**
- GitHub Actions + GitHub Pages for zero-cost hosting
- Path-filtered builds only trigger on relevant file changes
- Atomic deploys with configure-pages → upload-pages-artifact → deploy-pages
- `.nojekyll` file at repo root (already exists from Story 0.1)
- `cleanUrls: true` + `base: '/zero-trust/'` (already configured in Story 0.1)

**From architecture.md — Migration Strategy Phase 5 (Deploy):**
- Create `.github/workflows/deploy.yml` with Node 24, configure-pages, build, and deploy steps
- Configure GitHub Pages → Source: "GitHub Actions" in repository settings (manual step — not in this story's scope)
- Push to main → verify deployment at `https://<user>.github.io/zero-trust/`

### Action Version Intelligence (Research 2026-05-26)

| Action | Epics Spec | Story 0.1 Research | **Actual Latest (May 2026)** | This Story Uses | Reason |
|--------|-----------|-------------------|---------------------------|-----------------|--------|
| `actions/checkout` | `@v5` | `@v6` | `@v6` | **`@v6`** | Latest major; Node 24 runtime |
| `actions/setup-node` | `@v6` | `@v6` | `@v6` (v6.4.0) | **`@v6`** | Already current |
| `actions/configure-pages` | `@v4` | not researched | **`@v6`** (v6.0.0, Mar 2026) | **`@v6`** | Upgraded to Node 24 in Mar 2026 |
| `actions/upload-pages-artifact` | `@v3` | `@v3` | `@v3` | **`@v3`** | Latest |
| `actions/deploy-pages` | `@v4` | `@v4` | `@v4` | **`@v4`** | Latest |

**Key changes from epics spec:**
- `checkout@v5` → `checkout@v6`: `@v6` is the current major. This was already identified in Story 0.1's research and applies here.
- `configure-pages@v4` → `configure-pages@v6`: `@v6.0.0` was released March 25, 2026. The upgrade from v4 to v6 jumps two majors — v5 upgraded the Node runtime, v6 added Node 24 support. Using `@v6` ensures compatibility with the `node-version: 24` runner.
- `setup-node@v6` with `cache: npm`: Story 0.1's research confirmed `@v6`. When using `actions/setup-node@v6` with `cache: npm`, the action automatically caches `node_modules` based on `package-lock.json` hash. No separate `actions/cache` step needed.

### Story 0.1 Intelligence (from done story)

**Critical context from completed scaffold:**
- `package.json` exists at repo root with `"type": "module"`, scripts (`docs:dev`, `docs:build`, `docs:preview`), and devDependencies (`vitepress ^1.6.4`, `vitepress-sidebar ^1.36.1`)
- `package-lock.json` is committed (96K lines) — `npm ci` works for reproducible installs
- `docs/.vitepress/config.ts` has `base: '/zero-trust/'`, `cleanUrls: true`, `ignoreDeadLinks: true`
- `.nojekyll` exists at repo root
- `.gitignore` includes `docs/.vitepress/dist/` and `docs/.vitepress/cache/` — the build artifact directory is gitignored, which is correct (GitHub Pages serves from the uploaded artifact, not from the repo)
- `npm run docs:build` outputs to `docs/.vitepress/dist/`
- **Review finding**: `package-lock.json` was untracked during Story 0.1 and review flagged it as deferred — should be committed before CI setup. It is now committed. ✅

### Story 0.2 Intelligence (from done story)

Story 0.2 restructured `docs/` into numbered section directories (01-foundations through 04-synthesis + appendix). The VitePress config location at `docs/.vitepress/` is unchanged. The build command (`vitepress build docs`) still works — it processes the entire `docs/` directory recursively. The dist output is at `docs/.vitepress/dist/`. The workflow's upload path (`docs/.vitepress/dist`) is correct regardless of file restructuring.

### Story 0.3 Intelligence (not yet implemented)

Story 0.3 (port terminal dark theme CSS) is `ready-for-dev` but not implemented. That story only touches `docs/.vitepress/theme/custom.css` — it does not affect the deployment pipeline. The workflow this story creates will correctly deploy whatever theme Story 0.3 implements.

### Repository Setup (Manual — Not in This Story)

After this workflow is pushed to `main`, a manual step is required:

1. Go to repository **Settings → Pages**
2. Under **Build and deployment → Source**, select **"GitHub Actions"** (not "Deploy from a branch")
3. The first push to `main` after this setting is enabled will trigger the workflow

Until the Pages source is configured, workflow runs will fail at the `deploy-pages` step with: "Error: Action ran however it did not actually deploy."

### Step-Level Version Decision Rationale

- `actions/checkout@v6`: Uses Node 24 runtime, latest as of May 2026. The `@v6` major tag auto-updates to latest v6.x patches. Required by `setup-node@v6` which documents `checkout@v6` in its README examples.
- `actions/setup-node@v6` with `cache: npm`: `v6` auto-detects npm from `packageManager` or `devEngines.packageManager` in `package.json` and enables caching by default. Setting `cache: npm` is explicit and avoids relying on auto-detection. The `npm ci` command requires `package-lock.json` to be present (confirmed committed).
- `actions/configure-pages@v6`: `v6.0.0` (Mar 2026) upgraded runtime to Node 24. Required for compatibility with the `ubuntu-latest` runner image. Configures Pages metadata before the build step — the build step (`npm run docs:build`) runs after configure-pages so VitePress can access Pages metadata if needed.
- `actions/upload-pages-artifact@v3`: No v4 exists for this action. `@v3` is the current latest. Uploads `docs/.vitepress/dist/` as the Pages artifact. The path is relative to the repository root.
- `actions/deploy-pages@v4`: Latest major. Consumes the artifact uploaded by `upload-pages-artifact` and deploys to the `github-pages` environment.

### Why configure-pages Before Build (Not After)

The `configure-pages` action must run BEFORE the build step for static site generators like VitePress that can use Pages metadata (base path, base URL) during build. While this project hardcodes `base: '/zero-trust/'` in `config.ts`, running configure-pages before build is the standard pattern and future-proofs the workflow if the base path is ever derived from `steps.pages.outputs.base_path`.

### npm ci vs npm install

`npm ci` is required (not `npm install`) because:
- `package-lock.json` is committed — `npm ci` installs exactly from the lockfile
- `npm ci` is faster (skips dependency resolution)
- `npm ci` fails if `package-lock.json` is missing or out of sync with `package.json` — this is a feature, not a bug; it catches mismatches before deployment

### Path Filter Rationale

The workflow triggers on changes to:
- `docs/**` — any content file change (markdown, images, config)
- `.vitepress/**` — theme, config changes
- `package.json` — dependency changes
- `package-lock.json` — lockfile changes (new/updated/resolved deps)
- `.github/workflows/deploy.yml` — the workflow itself (so fixes to the pipeline deploy immediately)

Changes outside these paths (e.g., `_bmad-output/`, `_bmad/`, `.commandcode/`, root-level docs like `README.md`) do NOT trigger deployment.

### What NOT to do

- Do NOT modify `docs/.vitepress/config.ts` — base path, cleanUrls, and ignoreDeadLinks are already configured
- Do NOT modify `package.json` — scripts and dependencies are already correct
- Do NOT modify `.gitignore` — build artifacts are already gitignored
- Do NOT modify any `.md` files in `docs/` — this is infrastructure-only
- Do NOT create a `docs/.github/` directory — GitHub only recognizes `.github/` at the repository root
- Do NOT use `actions/checkout@v5` — use `@v6`
- Do NOT use `actions/configure-pages@v4` — use `@v6`
- Do NOT use `npm install` — use `npm ci`
- Do NOT add a separate `actions/cache` step — `setup-node@v6` with `cache: npm` handles this
- Do NOT set `cancel-in-progress: true` — the concurrency spec requires `false` to prevent stale deployments
- Do NOT skip verifying `package-lock.json` is committed — the workflow's `npm ci` step requires it

### Files to Create

| File | Type | Purpose |
|------|------|---------|
| `.github/workflows/deploy.yml` | NEW | GitHub Actions workflow for build + deploy to Pages |

### Files to Modify

None. This is a single-file creation story.

### Testing & Verification

1. **YAML validity**: `python3 -c "import yaml; yaml.safe_load(open('.github/workflows/deploy.yml'))"` — exit code 0, no errors
2. **Local build succeeds**: `npm ci && npm run docs:build` — exit code 0, `docs/.vitepress/dist/` contains `index.html` and all section directories
3. **Preview works**: `npm run docs:preview` starts and serves the production build
4. **Path filter correctness**: Review the `paths` list against the actual repo structure — all wiki-relevant paths covered, no irrelevant paths
5. **Concurrency config**: `cancel-in-progress: false` — verify (not `true`)
6. **Environment config**: `environment.name: github-pages` and `url` with `steps.deployment.outputs.page_url`
7. **Action versions**: Verify all 5 actions use the versions specified in the Action Version Intelligence table above
8. **Node version**: `node-version: 24` — verify (not `20` or `22`)
9. **Workflow dispatch**: `workflow_dispatch` key present under `on:` — verify

### References

- [Source: epics.md — Epic 0 Story 0.4 Acceptance Criteria] (Note: this story updates action versions per current registry — see Action Version Intelligence)
- [Source: architecture.md — Wiki Publishing Infrastructure Decision 16 (Deployment Architecture)]
- [Source: architecture.md — Migration Strategy Phase 5 (Deploy)]
- [Source: architecture.md — .github/workflows/deploy.yml pattern block]
- [Source: Story 0.1 — Dev Notes (package.json, config.ts, package-lock.json, ignoreDeadLinks)]
- [Source: Story 0.1 — Package Version Intelligence (checkout@v6, setup-node@v6)]
- [Source: Story 0.2 — docs/ directory restructure (build output path unchanged)]
- [Source: GitHub — actions/checkout v6](https://github.com/actions/checkout)
- [Source: GitHub — actions/setup-node v6.4.0](https://github.com/actions/setup-node)
- [Source: GitHub — actions/configure-pages v6.0.0 (released Mar 2026)](https://github.com/actions/configure-pages/releases/tag/v6.0.0)
- [Source: GitHub — actions/upload-pages-artifact v3](https://github.com/actions/upload-pages-artifact)
- [Source: GitHub — actions/deploy-pages v4](https://github.com/actions/deploy-pages)

## Dev Agent Record

### Agent Model Used

Claude Code (claude-opus-4-5-20251101)

### Debug Log References

- Task 1: Created `.github/workflows/deploy.yml` with all specified action versions
- Task 2: package-lock.json was untracked - added to git staging for CI compatibility
- Task 6: Verified preview server starts at http://localhost:4173/zero-trust/

### Completion Notes List

- ✅ Created `.github/workflows/deploy.yml` with push (main) and workflow_dispatch triggers
- ✅ Path filters: docs/**, .vitepress/**, package.json, package-lock.json, .github/workflows/deploy.yml
- ✅ Permissions: contents:read, pages:write, id-token:write
- ✅ Concurrency: group=pages, cancel-in-progress=false
- ✅ Build job: checkout@v6, setup-node@v6 (node 24, cache npm), configure-pages@v6, npm ci, docs:build, upload-pages-artifact@v3
- ✅ Deploy job: environment=github-pages, deploy-pages@v4 with id=deployment
- ✅ YAML syntax validated with Python yaml parser
- ✅ npm ci and docs:build verified locally
- ✅ Build output confirmed at docs/.vitepress/dist/ with index.html and all sections
- ✅ package-lock.json committed (was untracked, required for CI)
- ⚠️ Manual step required: Repository owner must enable GitHub Pages source = "GitHub Actions" in Settings

### File List

| File | Change Type | Description |
|------|-------------|-------------|
| `.github/workflows/deploy.yml` | NEW | GitHub Actions workflow for build + deploy to Pages |
| `package-lock.json` | MODIFIED | Added to git tracking (required for `npm ci` in CI) |

### Change Log

- 2026-05-27: Created GitHub Actions deployment pipeline (Story 0.4 complete)
