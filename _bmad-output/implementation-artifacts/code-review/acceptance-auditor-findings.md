# Acceptance Auditor Findings

## 1. Layout.vue created outside spec scope (exceeds CSS-only constraint)
- **AC Violation:** AC #6 — "No other monkey-patching of VitePress internal classes, no modification of config.ts, no JavaScript or Vue components"
- **Evidence:** The story spec's "What NOT to do" section states explicitly: "Do NOT fork or replace VitePress default theme components — use CSS variables only" and "Do NOT add JavaScript or Vue components — this is pure CSS." The implementation creates `Layout.vue` (a new Vue component) and modifies `theme/index.ts` to register it. This is a fundamental scope violation — the story was scoped to "CSS-only" and the dev agent created a full Vue component replacement.
- **Files:** `docs/.vitepress/theme/Layout.vue` (created), `docs/.vitepress/theme/index.ts` (modified to register Layout)

## 2. VitePress native sidebar suppressed instead of left untouched
- **AC Violation:** AC #6 — CSS must use VitePress's `--vp-c-*` CSS variable API with only three narrow exceptions
- **Evidence:** `custom.css` contains `.VPSidebar, .VPLocalNav { display: none !important; }` and `.VPDoc.has-aside .aside { display: none !important; }`. The three permitted exceptions (scanline overlay, focus glow, appearance toggle suppression) do not include suppressing the native VitePress sidebar or aside. The spec's "What NOT to do" says "Do NOT replace or modify VitePress default theme components." Suppressing them via display:none is a form of modification. The custom Layout.vue then provides a full re-implementation of the sidebar.

## 3. VitePress theme index.ts modified (should remain untouched)
- **AC Violation:** Story Dev Notes state: "Do NOT modify `docs/.vitepress/theme/index.ts` — it already extends DefaultTheme correctly" and "Do NOT modify `docs/.vitepress/config.ts`"
- **Evidence:** `theme/index.ts` was modified from the story 0.1 scaffold to import and register the custom `Layout` component. The original index.ts (from Story 0.1 scaffold) registered the theme with `{ extends: DefaultTheme }` which did NOT include a custom `Layout` property. The current file registers `{ extends: DefaultTheme, Layout }`.

## 4. Missing color `--vp-c-brand-soft` on `.VPSwitchAppearance` suppression rule
- **AC Violation:** AC #5 specifies dark-only enforcement — the switch should be hidden
- **Evidence:** While `.VPSwitchAppearance { display: none !important; }` is present, this is the permitted cosmetic exception. This finding is specific to the VitePress version compatibility: the `.VPSwitchAppearance` class name could have changed in VitePress 1.6.x minor releases. Actual AC #5 is satisfied.

## 5. All `:root, html.dark` variables match spec
- **AC #1:** ✓ All 50+ variables present. Compound selector `:root, html.dark` used. All color values match AC #1 color palette. Typography set with IBM Plex Sans and JetBrains Mono. Google Fonts `@import` is first line.
- **AC #2:** ✓ Google Fonts `@import` is at the top of the file.
- **AC #3 (scanline):** ✓ `.VPDoc { position: relative }` anchor, `::after` with `position: absolute; inset: 0; z-index: 20; pointer-events: none`. `prefers-reduced-motion: reduce` present.
- **AC #4:** ✓ Scanline `pointer-events: none` prevents interaction blocking.
- **AC #5:** ✓ `:root, html.dark` compound selector. `.VPSwitchAppearance` suppressed. Dark only enforcement satisfied.
- **AC #6:** ✓ No `config.ts` modifications. CSS variable API used for all styling. Three narrow exceptions within scope. However, Layout.vue and theme/index.ts modifications violate the CSS-only constraint.
- **AC #7:** Cannot verify build output from static review alone.

## 6. Scanline uses correct positioning
- **AC #1 (scanline section):** ✓ `position: absolute` (not `position: fixed`). ✓ `z-index: 20` (not 9999). ✓ `prefers-reduced-motion: reduce` disables scanline.
- **Evidence:** Matches the "What NOT to do" guidance exactly.

## 7. Code block border uses color-mix() not hardcoded rgba()
- **AC #1 (code blocks):** ✓ `color-mix(in srgb, var(--vp-c-brand-1) 15%, transparent)` used instead of hardcoded `rgba(0, 255, 159, 0.15)`. Matches "What NOT to do" guidance.
- **Evidence:** Matches Dev Notes's `color-mix()` vs Hardcoded `rgba()` rationale.

## 8. Selection uses variables not hardcoded values
- **AC #1 (selection):** ✓ `::selection { color: var(--vp-c-bg); background: var(--vp-c-brand-1); }` — uses variables. ✓ `::-moz-selection` present for Firefox.
- **Evidence:** Matches "What NOT to do" — "Do NOT use hardcoded `color: #0a0a0f` in `::selection` — use `var(--vp-c-bg)`."

## 9. Firefox scrollbar styled
- **AC #1 (scrollbar):** ✓ `html { scrollbar-color: var(--vp-c-brand-1) var(--vp-c-bg-soft); scrollbar-width: thin; }` present alongside webkit rules.
- **Evidence:** Matches "What NOT to do" — "Do NOT skip Firefox scrollbar."

## 10. Sidebar width default is 180px not 160px minimum
- **AC / Spec Ambiguity:** The spec does not specify sidebar width defaults, but the architecture taste from taste.md says "default to minimal width." The Layout.vue sets `sidebarWidth = ref(180)` as default, and the minimum is 160px. This is reasonable for a "minimal" default.
- **Evidence:** Taste preference: "Sidebar should appear on all pages (including home), be resizable, and default to minimal width." Layout.vue includes the sidebar on all pages via `showSidebar` computed property (respects `frontmatter.sidebar !== false`). Default width 180px is near-minimal.
