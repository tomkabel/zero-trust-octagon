## Deferred from: code review (2026-05-24)

- Graft atomicity weakened for concurrent requests (WebSocket, SSE, HTTP/2 multiplexing, buffer capacity exhaustion) — architectural design gap, not a documentation error
- LLM garden data detectable by APT attackers — text explicitly acknowledges this limitation
- De-grafting "no indication" claim contradicts detectable data artifacts — operational coordination scope, not fixable in text
- TTP extraction in garden measures attacker behavior against synthetic data, not real TTPs — methodological limitation documented as design parameter
- D9 D=2 "Small Rotation" is not real redundancy — metric design choice, acceptable as starting point
- SPIFFE identity for CI/CD doesn't close the TOFU asymmetry — identity vs code integrity distinction, documented at design level
- ZTA-PQC "coordination gap" minimizes structural risk (compliance deadlock, international divergence, TPM hardware limits, dual-stack cost) — architectural constraints beyond current scope
- Cross-session garden identity consistency not specified — implementation detail deferred to engineering
- Intelligence satiation threshold can be gamed by attacker — incentive consideration, acceptable as documented

## Deferred from: code review of 0-1-scaffold-vitepress-project-and-dependencies (2026-05-26)

- package.json metadata placeholder (empty description, keywords, author) — cosmetic boilerplate from `npm init -y`, not specified in AC1
- Hardcoded base path `'/zero-trust/'` with no environment-variable override — acceptable for current single-target deploy; global search-and-replace suffices if base changes
- `ignoreDeadLinks: true` suppresses broken link warnings during build — deliberate workaround documented in Debug Log References; Story 0.2 will add index.md and cross-references
- No `package-lock.json` committed — untracked, dependency versions not pinned for reproducible CI builds; should be committed before CI setup (Story 0.4)

## Deferred from: code review of 0-2-restructure-docs-into-numbered-section-directories (2026-05-26)

- Implementation note in `docs/04-synthesis/17-the-aspirants-gate.md` about same-directory paths — not a regression, clarifies path structure for future maintainers
- Content additions in `docs/02-methodology/06-dimensions-response-to-human.md` (~60+ lines) — valid architectural content, out of scope for file-restructure story; belongs in Epic 1-4
- Content additions in `docs/appendix/appendix-a-quantum-ai-threats.md` (4 new ZTA-PQC structural risks) — valid content, out of scope for file-restructure story; belongs in Epic 4
- SPIFFE/SPIRE identity vs. integrity distinction in `docs/03-archetypes/10-archetype-c-startup.md` — valid content, out of scope for file-restructure story; belongs in Epic 2-3

## Deferred from: code review re-review of 0-2-restructure-docs-into-numbered-section-directories (2026-05-27)

- Duplicate "Synthesis 5" headings in `docs/03-archetypes/12-cross-trace-synthesis.md` (lines 96, 111) — breaks heading anchor chain; pre-existing content issue
- MTTR→TTR rename incomplete — 8 files + glossary still use MTTR; rename was only applied to one formula notation in Df2
- "2/6" should be "2/8" in Archetype B Quick Reference (`docs/appendix/appendix-d-quick-reference.md` L54) — inconsistency with all other chapter references
- EBK (Epistemic Binding Key) missing from glossary (`docs/appendix/appendix-c-glossary.md`) — ~37 references across planning docs and Chapter 6 with no glossary entry
- "abort-and-graft" term introduced in `docs/02-methodology/06-dimensions-response-to-human.md` without glossary entry
- External cross-references outside `docs/` (README, CI configs, GitHub templates) may still link to old flat paths
- `00-preface.md` numbering convention in `01-foundations/` directory creates zero-index vs one-index dissonance
- FR-23/FR-24 added to PRD with no corresponding content in `docs/` yet — forward references in planning artifacts

## Deferred from: code review of 0-3-port-terminal-dark-theme-css (2026-05-27)

- No print media query — pre-existing project-level concern; custom.css has black background with no @media print override
- Purple accent #B967FF (~4.25:1 contrast on #0A0A0F) fails WCAG AA for normal text on brand-3 — design-level choice affecting entire accent palette
- Global webkit-scrollbar rules (8px width, green thumb in custom.css) implicitly cascade into sidebar's 4px scrollbar — maintainability coupling, cosmetic only
