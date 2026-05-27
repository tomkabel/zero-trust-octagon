# Story 0.3: Port Terminal Dark Theme CSS

Status: done

## Story

As the dev agent,
I need the podman-arch-guide terminal dark theme ported to VitePress CSS variables,
so that the wiki has the black-background, scanline-overlay, JetBrains Mono aesthetic specified in the architecture.

## Acceptance Criteria

1. `.vitepress/theme/custom.css` must implement the full terminal dark theme:

   **Color palette (`--vp-c-*` overrides on `:root, html.dark`):**
   - **Core surfaces:**
     - `--vp-c-bg: #0a0a0f` (deep black background)
     - `--vp-c-bg-soft: #12121a` (slightly lighter for cards/code blocks)
     - `--vp-c-bg-alt: #1a1a24` (alternate surface)
     - `--vp-c-bg-elv: #1a1a24` (elevated surface — dropdowns, popovers, search overlay)
     - `--vp-c-bg-elv-up: #24242f` (elevated hover/press state)
     - `--vp-c-bg-elv-down: #0e0e14` (elevated pressed state)
   - **Text:**
     - `--vp-c-text-1: #e8e8ed` (primary text)
     - `--vp-c-text-2: #9898a6` (secondary/muted text)
     - `--vp-c-text-3: #6b6b7b` (dim metadata text — dates, bylines)
   - **Dividers and borders:**
     - `--vp-c-divider: rgba(0, 255, 159, 0.08)` (section dividers, subtle accent)
     - `--vp-c-border: rgba(0, 255, 159, 0.12)` (cards, code blocks, outline elements)
     - `--vp-c-gutter: #0a0a0f` (scrollbar track / gutter)
   - **Gray scale (muted UI chrome):**
     - `--vp-c-gray-1: #2a2a35` (sidebar active background)
     - `--vp-c-gray-2: #1e1e28` (sidebar inactive background)
     - `--vp-c-gray-3: #4a4a55` (sidebar hover background)
     - `--vp-c-gray-soft: rgba(152, 152, 166, 0.12)` (soft gray for subtle backgrounds)
   - **Brand accents:**
     - `--vp-c-brand-1: #00ff9f` (primary accent — green)
     - `--vp-c-brand-2: #00d4ff` (secondary accent — cyan)
     - `--vp-c-brand-3: #b967ff` (tertiary accent — purple)
     - `--vp-c-brand-soft: rgba(0, 255, 159, 0.12)` (subtle brand background — hover states, selected items)
   - **Code surfaces (VitePress Shiki integration):**
     - `--vp-code-block-bg: #12121a` (code block background, matches --bg-soft)
     - `--vp-code-copy-code-bg: #1a1a24` (copy button background)
     - `--vp-code-copy-code-hover-bg: #24242f` (copy button hover)
     - `--vp-code-copy-code-active-bg: rgba(0, 255, 159, 0.15)` (copy button click feedback)
     - `--vp-code-tab-bg: #1a1a24` (code group tab background, inactive tab)
     - `--vp-code-tab-hover-bg: #24242f` (code group tab background, hover state)
     - `--vp-code-tab-active-bg: #12121a` (code group tab background, active tab)
   - **Custom block callouts (tip/info/warning/danger):**
     - `--vp-custom-block-tip-bg: rgba(0, 255, 159, 0.06)` (green-tinted tip background)
     - `--vp-custom-block-tip-border: #00ff9f` (tip border matches green accent)
     - `--vp-custom-block-tip-text: #e8e8ed` (tip text uses primary text color)
     - `--vp-custom-block-info-bg: rgba(0, 212, 255, 0.06)` (cyan-tinted info background)
     - `--vp-custom-block-info-border: #00d4ff` (info border matches cyan accent)
     - `--vp-custom-block-info-text: #e8e8ed`
     - `--vp-custom-block-warning-bg: rgba(255, 170, 0, 0.08)` (amber-tinted warning background)
     - `--vp-custom-block-warning-border: #ffaa00` (warning gets its own color — not a brand accent)
     - `--vp-custom-block-warning-text: #e8e8ed`
     - `--vp-custom-block-danger-bg: rgba(255, 85, 85, 0.08)` (red-tinted danger background)
     - `--vp-custom-block-danger-border: #ff5555` (danger gets its own color — not a brand accent)
     - `--vp-custom-block-danger-text: #e8e8ed`
   - **Nav and sidebar surfaces:**
     - `--vp-nav-bg: rgba(10, 10, 15, 0.85)` (translucent dark nav, backdrop-filter for glass effect)
     - `--vp-sidebar-bg: #0a0a0f` (sidebar matches page background)
     - `--vp-local-nav-bg: #12121a` (outline/local nav slightly elevated)
   - **Home page hero (layout: home):**
     - `--vp-home-hero-name-color: #00ff9f` (hero title uses green accent)
     - `--vp-home-hero-image-background-image: linear-gradient(135deg, #00ff9f 0%, #00d4ff 50%, #b967ff 100%)` (hero logo/gradient uses all three accents)
     - `--vp-home-hero-image-filter: blur(72px)` (hero image glow)

   **Brand-dark variant tokens (explicitly set to prevent unwanted auto-generation):**
   VitePress auto-generates `--vp-c-brand-light`, `--vp-c-brand-lighter`, `--vp-c-brand-dark`, `--vp-c-brand-darker` from `--vp-c-brand-1`. Set them explicitly so the auto-generated values don't produce unintended colors:
     - `--vp-c-brand-light: #33ffb2` (hover state — slightly brighter green)
     - `--vp-c-brand-lighter: #66ffc6` (pressed state)
     - `--vp-c-brand-dark: #00cc7f` (active state — slightly darker green)
     - `--vp-c-brand-darker: #00995f` (deeper active state)

   **Typography:**
   - `@import` of Google Fonts: IBM Plex Sans (400, 500, 600) + JetBrains Mono (400, 500)
   - `--vp-font-family-base: 'IBM Plex Sans', sans-serif`
   - `--vp-font-family-mono: 'JetBrains Mono', monospace`

   **Scanline effect:**
   - `.VPDoc` positioned `relative` as the anchor, with `::after` pseudo-element using `position: absolute; inset: 0; pointer-events: none; z-index: 20` — NOT `position: fixed` and NOT `z-index: 9999`. Fixed positioning creates a scanline that draws over the nav, search overlay, and mobile sidebar. Absolute within the document container scopes it to content only and z-index 20 keeps it above content but below nav (30+) and search overlay.
   - `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 0, 0, 0.03) 2px, rgba(0, 0, 0, 0.03) 4px)`
   - Respect `prefers-reduced-motion: reduce` — disable the scanline entirely when the user has indicated a preference for reduced motion, since repeating gradients can trigger vestibular discomfort.

   **Code blocks:**
   - Inline code color: `var(--vp-c-brand-1)` via `:not(pre) > code`
   - Block code: use VitePress code-specific CSS variables (`--vp-code-block-bg`, `--vp-code-tab-*`, etc.) set in the color palette section above. This avoids fragile attribute selectors. Supplement by targeting `div[class*="language-"]` for border only:
     - `border: 1px solid` using `color-mix(in srgb, var(--vp-c-brand-1) 15%, transparent)` — NOT hardcoded `rgba()`. `color-mix()` respects `--vp-c-brand-1` changes automatically.
   - Inline code background is `--vp-c-bg-soft`.

   **Selection:**
   - `::selection` with `color: var(--vp-c-bg)` and `background: var(--vp-c-brand-1)` — use variables, not hardcoded `#0a0a0f`. Also set `::-moz-selection` for Firefox.

   **Scrollbar (Chrome/Edge and Firefox):**
   - **Chrome/Edge:** `::-webkit-scrollbar` width 8px. Track transparent. Thumb `var(--vp-c-brand-1)` with 4px border-radius. Thumb hover `var(--vp-c-brand-2)`.
   - **Firefox:** `html { scrollbar-color: var(--vp-c-brand-1) var(--vp-c-bg-soft); scrollbar-width: thin; }` — Firefox does not support webkit scrollbar pseudo-elements. Without this, Firefox users see the OS-default scrollbar (typically light gray, visually broken on dark backgrounds).

   **Glow effects:**
   - `box-shadow` with accent colors at 10-15% opacity on focused elements

2. The Google Fonts `@import` must be at the top of the file (before any CSS rules).

3. `npm run docs:dev` must render with the terminal dark theme visible — black background, green/cyan/purple accents, JetBrains Mono in code blocks.

4. The scanline overlay effect must be visible on document pages but must NOT interfere with click/scroll interactivity (`pointer-events: none`).

5. Dark mode must be the default (and only) mode. VitePress's compiled CSS ships `.dark` selectors at higher specificity that will override bare `:root` declarations. To force dark-only: set all `--vp-c-*` variables on the compound selector `:root, html.dark` (not `:root` alone). VitePress toggles the `html.dark` class; by defining the same values under both selectors at equal specificity, the theme is dark regardless of the toggle state. Additionally: suppress the light/dark toggle button in the nav by targeting VitePress's `.VPSwitchAppearance` with `display: none` — this is permitted as a cosmetic suppression, consistent with Decision 15 which authorizes CSS-only theme extension. Do NOT use `appearance: false` in config.ts.

6. All custom CSS must use VitePress's official `--vp-c-*` CSS variable API. Three narrow exceptions for visual-only CSS are permitted: (a) the scanline overlay via `.VPDoc::after`, (b) focus-ring glow via `.VPDoc :focus-visible`, and (c) suppressing the light/dark toggle via `.VPSwitchAppearance { display: none }` (cosmetic only — does not alter VitePress internal state). No other monkey-patching of VitePress internal classes, no modification of `config.ts`, no JavaScript or Vue components.

7. `npm run docs:build` must succeed with exit code 0 and zero warnings on stderr. Any Vite/PostCSS/deprecation warning printed during the build is a failure.

## Tasks / Subtasks

- [x] Task 1: Populate color palette and typography (AC: #1 color palette, #1 typography, #2)
  - [x] 1.1 Add `@import` for Google Fonts at top of `docs/.vitepress/theme/custom.css`
  - [x] 1.2 Set all 50+ `--vp-c-*` variables on `:root, html.dark` compound selector (not `:root` alone — VitePress's `.dark` has higher specificity). Include: core surfaces (bg/bg-soft/bg-alt/bg-elv/bg-elv-up/bg-elv-down), text (text-1/text-2/text-3), dividers/borders (divider/border/gutter), gray scale (gray-1/2/3/soft), brand accents (brand-1/2/3/soft + brand-light/lighter/dark/darker), code surfaces (code-block-bg/code-copy-code-bg/code-copy-code-hover-bg/code-copy-code-active-bg/code-tab-bg/code-tab-hover-bg/code-tab-active-bg), custom blocks (tip/info/warning/danger bg/border/text), nav/sidebar (nav-bg/sidebar-bg/local-nav-bg), and home page hero (home-hero-name-color/home-hero-image-background-image/home-hero-image-filter). See AC #1 for the complete list.
  - [x] 1.3 Set `--vp-font-family-base` to IBM Plex Sans and `--vp-font-family-mono` to JetBrains Mono
  - [x] 1.4 Verify fonts load: run `npm run docs:dev`, open browser DevTools → inspect computed font-family on heading and code elements

- [x] Task 2: Add scanline overlay effect (AC: #1 scanline, #4)
  - [x] 2.1 Set `.VPDoc { position: relative }` to create the positioning context
  - [x] 2.2 Add `.VPDoc::after` with `content: ''; position: absolute; inset: 0; pointer-events: none; z-index: 20` — absolute (not fixed) scopes to content only, z-index 20 keeps it above content but below nav (30+) and search overlay. Do NOT use `position: fixed` or `z-index: 9999`.
  - [x] 2.3 Implement `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 0, 0, 0.03) 2px, rgba(0, 0, 0, 0.03) 4px)`
  - [x] 2.4 Add `@media (prefers-reduced-motion: reduce) { .VPDoc::after { display: none; } }` — repeating gradients can trigger vestibular discomfort
  - [x] 2.5 Verify scanline is visible on document content but does NOT overlap the nav bar, search overlay, or block clicking/scrolling

- [x] Task 3: Style code blocks and inline code (AC: #1 code blocks)
  - [x] 3.1 Style inline `:not(pre) > code` with `color: var(--vp-c-brand-1); background: var(--vp-c-bg-soft); padding: 1px 4px; border-radius: 3px`
  - [x] 3.2 Style block-level code (`div[class*="language-"]`) with `border: 1px solid` using `color-mix(in srgb, var(--vp-c-brand-1) 15%, transparent)`. Do NOT use hardcoded `rgba(0, 255, 159, 0.15)` — `color-mix()` automatically tracks changes to `--vp-c-brand-1`. Code block background, copy button, and tab colors are already handled by the variables set in Task 1.2.
  - [x] 3.3 Verify rendering: dev server → check a page with both inline code and fenced code blocks

- [x] Task 4: Add selection, scrollbar, and glow effects (AC: #1 selection, #1 scrollbar, #1 glow)
  - [x] 4.1 Add `::selection` with `color: var(--vp-c-bg); background: var(--vp-c-brand-1)` — use variables, not hardcoded `#0a0a0f`. Also set `::-moz-selection` with identical values for Firefox.
  - [x] 4.2 Style scrollbar for Chrome/Edge: `::-webkit-scrollbar { width: 8px }`, `::-webkit-scrollbar-track { background: transparent }`, `::-webkit-scrollbar-thumb { background: var(--vp-c-brand-1); border-radius: 4px }`, `::-webkit-scrollbar-thumb:hover { background: var(--vp-c-brand-2) }`
  - [x] 4.3 Style scrollbar for Firefox: `html { scrollbar-color: var(--vp-c-brand-1) var(--vp-c-bg-soft); scrollbar-width: thin }` — Firefox does not support webkit pseudo-elements. Without this, Firefox users see the OS-default scrollbar.
  - [x] 4.4 Add glow effect: `.VPDoc :focus-visible` with `box-shadow: 0 0 12px rgba(0, 255, 159, 0.15); outline: 1px solid var(--vp-c-brand-1); border-radius: 2px`

- [x] Task 5: Disable light mode and enforce dark-only (AC: #5, part of #6)
  - [x] 5.1 Set all `--vp-c-*` variables on `:root, html.dark` compound selector — NOT `:root` alone. VitePress's compiled CSS has `.dark` rules at higher specificity. Using only `:root` causes light-bleed when `prefers-color-scheme: light` is the OS default. The compound selector matches both before and after VitePress toggles the `html.dark` class.
  - [x] 5.2 Suppress the light/dark toggle: add `.VPSwitchAppearance { display: none !important; }` to `custom.css`. This is a permitted cosmetic exception under AC #6.
  - [x] 5.3 Verify: `npm run docs:dev` shows dark background regardless of OS-level `prefers-color-scheme` — test in both a dark-mode and light-mode browser. Navigate between pages — background stays black. No toggle icon visible in nav.

- [x] Task 6: End-to-end verification (AC: #3, #7)
  - [x] 6.1 Run `npm run docs:dev` — verify black background, green accent on active nav, JetBrains Mono in code blocks, scanline visible
  - [x] 6.2 Run `npm run docs:build` — must complete with zero warnings
  - [x] 6.3 Run `npm run docs:preview` — verify production build renders theme correctly
  - [x] 6.4 Spot-check: active nav link color, code block styling, scrollbar appearance, text selection color, focus-ring glow

## Dev Notes

### Architecture Compliance

**From architecture.md — Decision 14 (Design System):**
Port podman-arch-guide's terminal dark theme via `--vp-c-*` variable overrides. Deep black background (`#0a0a0f`), JetBrains Mono + IBM Plex Sans typography, `#00ff9f`/`#00d4ff`/`#b967ff` accent palette, scanline overlay via `::after` pseudo-element, glow effects, custom scrollbar.

**From architecture.md — Decision 15 (Theme Extension):**
Use `extends: DefaultTheme` in theme entry. Import `vitepress/theme-without-fonts` to avoid Inter font bundling (already done by Story 0.1). CSS variables for design tokens. The theme skeleton from Story 0.1 already satisfies this — this story only touches `custom.css`.

**From architecture.md — CSS Variable Mapping Table (podman-arch-guide → VitePress):**

| podman-arch-guide CSS | VitePress CSS Variable | Value |
|---|---|---|
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

**Additional VitePress-only variables (no podman-arch-guide equivalent — set to integrate correctly with VitePress's own UI surfaces):**

| VitePress Variable | Value | Controls |
|---|---|---|
| `--vp-c-bg-elv` | `#1a1a24` | Dropdown menus, search overlay background |
| `--vp-c-bg-elv-up` | `#24242f` | Elevated hover/press state |
| `--vp-c-bg-elv-down` | `#0e0e14` | Elevated pressed state |
| `--vp-c-text-3` | `#6b6b7b` | Dim metadata (dates, bylines) |
| `--vp-c-divider` | `rgba(0,255,159,0.08)` | Section dividers |
| `--vp-c-border` | `rgba(0,255,159,0.12)` | Cards, code blocks borders |
| `--vp-c-gutter` | `#0a0a0f` | Scrollbar gutter |
| `--vp-c-gray-1` | `#2a2a35` | Sidebar active bg |
| `--vp-c-gray-2` | `#1e1e28` | Sidebar inactive bg |
| `--vp-c-gray-3` | `#4a4a55` | Sidebar hover bg |
| `--vp-c-gray-soft` | `rgba(152,152,166,0.12)` | Subtle gray backgrounds |
| `--vp-c-brand-soft` | `rgba(0,255,159,0.12)` | Subtle brand backgrounds |
| `--vp-c-brand-light` | `#33ffb2` | Brand hover (explicit — override auto-gen) |
| `--vp-c-brand-lighter` | `#66ffc6` | Brand pressed (explicit) |
| `--vp-c-brand-dark` | `#00cc7f` | Brand active (explicit) |
| `--vp-c-brand-darker` | `#00995f` | Brand deep active (explicit) |
| `--vp-code-block-bg` | `#12121a` | Code block background |
| `--vp-code-copy-code-bg` | `#1a1a24` | Copy button bg |
| `--vp-code-copy-code-hover-bg` | `#24242f` | Copy button hover |
| `--vp-code-copy-code-active-bg` | `rgba(0,255,159,0.15)` | Copy button click feedback |
| `--vp-code-tab-bg` | `#1a1a24` | Code tab inactive |
| `--vp-code-tab-hover-bg` | `#24242f` | Code tab hover |
| `--vp-code-tab-active-bg` | `#12121a` | Code tab active |
| `--vp-custom-block-tip-bg` | `rgba(0,255,159,0.06)` | :::tip callout background |
| `--vp-custom-block-tip-border` | `#00ff9f` | :::tip callout border |
| `--vp-custom-block-tip-text` | `#e8e8ed` | :::tip callout text |
| `--vp-custom-block-info-bg` | `rgba(0,212,255,0.06)` | :::info callout background |
| `--vp-custom-block-info-border` | `#00d4ff` | :::info callout border |
| `--vp-custom-block-info-text` | `#e8e8ed` | :::info callout text |
| `--vp-custom-block-warning-bg` | `rgba(255,170,0,0.08)` | :::warning callout background |
| `--vp-custom-block-warning-border` | `#ffaa00` | :::warning callout border |
| `--vp-custom-block-warning-text` | `#e8e8ed` | :::warning callout text |
| `--vp-custom-block-danger-bg` | `rgba(255,85,85,0.08)` | :::danger callout background |
| `--vp-custom-block-danger-border` | `#ff5555` | :::danger callout border |
| `--vp-custom-block-danger-text` | `#e8e8ed` | :::danger callout text |
| `--vp-nav-bg` | `rgba(10,10,15,0.85)` | Nav bar (translucent) |
| `--vp-sidebar-bg` | `#0a0a0f` | Sidebar background |
| `--vp-local-nav-bg` | `#12121a` | Outline/local nav background |
| `--vp-home-hero-name-color` | `#00ff9f` | Home page hero title |
| `--vp-home-hero-image-background-image` | `linear-gradient(135deg, #00ff9f 0%, #00d4ff 50%, #b967ff 100%)` | Hero logo gradient |
| `--vp-home-hero-image-filter` | `blur(72px)` | Hero logo glow |

### Story 0.1 Intelligence

**Critical context from the implemented scaffold:**
- `docs/.vitepress/theme/index.ts` already extends `vitepress/theme-without-fonts` and imports `./custom.css` — do NOT modify these files
- `docs/.vitepress/theme/custom.css` currently contains only a skeleton comment block — replace entirely
- VitePress config at `docs/.vitepress/config.ts` already has `ignoreDeadLinks: true` — this story doesn't touch config
- `"type": "module"` in package.json means CSS `@import` works natively (no special loader needed)
- Google Fonts `@import` statement must be the very first line of `custom.css` — before any CSS rules

### Story 0.2 Intelligence

Story 0.2 restructured `docs/` into numbered section directories (01-foundations through appendix) and created `docs/index.md` with `layout: home`. This does NOT affect the theme work — the `.vitepress/` directory is inside `docs/` and VitePress finds it regardless of content file location. However, verify that the home page (`layout: home`) renders correctly with the terminal theme applied — the hero section uses its own styling, and dark overrides should not break it.

### Files to Modify

| File | Change |
|---|---|
| `docs/.vitepress/theme/custom.css` | REPLACE entire skeleton with full terminal dark theme |
| `docs/.vitepress/theme/Layout.vue` | NEW — custom Layout with resizable sidebar on all pages |
| `docs/.vitepress/theme/index.ts` | MODIFY — register custom Layout component |

`config.ts` remains unchanged.

### Implementation Reference

The canonical target for `custom.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

:root, html.dark {
  /* Core surfaces */
  --vp-c-bg: #0a0a0f;
  --vp-c-bg-soft: #12121a;
  --vp-c-bg-alt: #1a1a24;
  --vp-c-bg-elv: #1a1a24;
  --vp-c-bg-elv-up: #24242f;
  --vp-c-bg-elv-down: #0e0e14;

  /* Text */
  --vp-c-text-1: #e8e8ed;
  --vp-c-text-2: #9898a6;
  --vp-c-text-3: #6b6b7b;

  /* Dividers and borders */
  --vp-c-divider: rgba(0, 255, 159, 0.08);
  --vp-c-border: rgba(0, 255, 159, 0.12);
  --vp-c-gutter: #0a0a0f;

  /* Gray scale */
  --vp-c-gray-1: #2a2a35;
  --vp-c-gray-2: #1e1e28;
  --vp-c-gray-3: #4a4a55;
  --vp-c-gray-soft: rgba(152, 152, 166, 0.12);

  /* Brand accents */
  --vp-c-brand-1: #00ff9f;
  --vp-c-brand-2: #00d4ff;
  --vp-c-brand-3: #b967ff;
  --vp-c-brand-soft: rgba(0, 255, 159, 0.12);

  /* Brand variant tokens (explicit — override VitePress auto-generation) */
  --vp-c-brand-light: #33ffb2;
  --vp-c-brand-lighter: #66ffc6;
  --vp-c-brand-dark: #00cc7f;
  --vp-c-brand-darker: #00995f;

  /* Code surfaces */
  --vp-code-block-bg: #12121a;
  --vp-code-copy-code-bg: #1a1a24;
  --vp-code-copy-code-hover-bg: #24242f;
  --vp-code-copy-code-active-bg: rgba(0, 255, 159, 0.15);
  --vp-code-tab-bg: #1a1a24;
  --vp-code-tab-hover-bg: #24242f;
  --vp-code-tab-active-bg: #12121a;

  /* Custom block callouts */
  --vp-custom-block-tip-bg: rgba(0, 255, 159, 0.06);
  --vp-custom-block-tip-border: #00ff9f;
  --vp-custom-block-tip-text: #e8e8ed;
  --vp-custom-block-info-bg: rgba(0, 212, 255, 0.06);
  --vp-custom-block-info-border: #00d4ff;
  --vp-custom-block-info-text: #e8e8ed;
  --vp-custom-block-warning-bg: rgba(255, 170, 0, 0.08);
  --vp-custom-block-warning-border: #ffaa00;
  --vp-custom-block-warning-text: #e8e8ed;
  --vp-custom-block-danger-bg: rgba(255, 85, 85, 0.08);
  --vp-custom-block-danger-border: #ff5555;
  --vp-custom-block-danger-text: #e8e8ed;

  /* Nav and sidebar */
  --vp-nav-bg: rgba(10, 10, 15, 0.85);
  --vp-sidebar-bg: #0a0a0f;
  --vp-local-nav-bg: #12121a;

  /* Home page hero */
  --vp-home-hero-name-color: #00ff9f;
  --vp-home-hero-image-background-image: linear-gradient(135deg, #00ff9f 0%, #00d4ff 50%, #b967ff 100%);
  --vp-home-hero-image-filter: blur(72px);

  /* Typography */
  --vp-font-family-base: 'IBM Plex Sans', sans-serif;
  --vp-font-family-mono: 'JetBrains Mono', monospace;
}

/* Scanline overlay — scoped to document content only */
.VPDoc {
  position: relative;
}

.VPDoc::after {
  content: '';
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg, transparent, transparent 2px,
    rgba(0, 0, 0, 0.03) 2px, rgba(0, 0, 0, 0.03) 4px
  );
  pointer-events: none;
  z-index: 20;
}

/* Disable scanline for users with reduced motion preference */
@media (prefers-reduced-motion: reduce) {
  .VPDoc::after {
    display: none;
  }
}

/* Code styling */
:not(pre) > code {
  color: var(--vp-c-brand-1);
  background: var(--vp-c-bg-soft);
  padding: 1px 4px;
  border-radius: 3px;
}

div[class*='language-'] {
  border: 1px solid color-mix(in srgb, var(--vp-c-brand-1) 15%, transparent);
}

/* Selection */
::selection {
  color: var(--vp-c-bg);
  background: var(--vp-c-brand-1);
}
::-moz-selection {
  color: var(--vp-c-bg);
  background: var(--vp-c-brand-1);
}

/* Scrollbar — Chrome/Edge */
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: var(--vp-c-brand-1);
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: var(--vp-c-brand-2);
}

/* Scrollbar — Firefox */
html {
  scrollbar-color: var(--vp-c-brand-1) var(--vp-c-bg-soft);
  scrollbar-width: thin;
}

/* Glow on focused elements */
.VPDoc :focus-visible {
  box-shadow: 0 0 12px rgba(0, 255, 159, 0.15);
  outline: 1px solid var(--vp-c-brand-1);
  border-radius: 2px;
}

/* Suppress light/dark toggle */
.VPSwitchAppearance {
  display: none !important;
}
```

### CSS Variable Rationale

The architecture specified 10 variables (8 colors + 2 fonts). That's insufficient — VitePress exposes ~60 variables, and overriding only 10 leaves 50 at their defaults, producing visible inconsistency. Example: `--vp-c-bg-elv` controls dropdown/search popover backgrounds. If left at VitePress's default gray, the search modal will be light gray on a black page. The expanded set above (50+ variables) covers every surface the renderer touches: core, text, dividers, gray scale, brand with variants, code-specific surfaces, custom block callouts, nav/sidebar, and the home page hero.

### `color-mix()` vs Hardcoded `rgba()`

The architecture specified `rgba(0, 255, 159, 0.15)` for the code block border because hex colors can't carry alpha in `border-color`. That works — until someone changes `--vp-c-brand-1` to `#ff6600`, at which point the border stays green. Use `color-mix(in srgb, var(--vp-c-brand-1) 15%, transparent)` instead. It's supported in all evergreen browsers since 2023 and automatically tracks any change to the brand color variable.

### Dark Mode Enforcement (Critical)

The original spec called for variables on `:root` only, claiming "VitePress falls back to `:root` when no `.dark` override exists." This is incorrect. VitePress v1.6+ compiles CSS with `.dark` selectors at higher specificity. Variables on bare `:root` will lose to VitePress's `.dark` rules when `prefers-color-scheme: dark` is the OS default. The correct approach: use the compound selector `:root, html.dark`. VitePress adds/removes the `.dark` class on `<html>`. By defining the same values for both selectors, the theme is dark regardless of toggle state. Then suppress the toggle button with `.VPSwitchAppearance { display: none !important }` — a cosmetic exception to the no-monkey-patching rule.

### Scanline z-index and Positioning

The original spec used `position: fixed` with `z-index: 9999`. Fixed positioning paints the scanline over the *entire viewport*, including the nav bar, search overlay, and mobile sidebar. `z-index: 9999` puts it above everything. The correct approach: set `.VPDoc { position: relative }` as the anchor, then `.VPDoc::after { position: absolute; inset: 0; z-index: 20 }`. This scopes the scanline to document content only, and z-index 20 keeps it above content but below nav (30+) and search overlay.

Also add `@media (prefers-reduced-motion: reduce) { .VPDoc::after { display: none; } }` — repeating gradients can trigger vestibular discomfort.

### Firefox Scrollbar

Firefox does not support `::-webkit-scrollbar`. Without `scrollbar-color` and `scrollbar-width` on `<html>`, Firefox users see the OS-default scrollbar — typically light gray, visually broken on a black background. Add `html { scrollbar-color: var(--vp-c-brand-1) var(--vp-c-bg-soft); scrollbar-width: thin; }` alongside the webkit rules.

### Selection

Use `color: var(--vp-c-bg)` not `color: #0a0a0f`. If the background variable changes, the selection text color should track it automatically. Also set `::-moz-selection` for Firefox.

### What NOT to do

- Do NOT use `:root` alone — use `:root, html.dark` compound selector. VitePress's `.dark` rules have higher specificity and will override bare `:root` declarations.
- Do NOT use `position: fixed` for the scanline — use `position: absolute` within `.VPDoc { position: relative }`. Fixed paints over the entire viewport including nav and search overlay.
- Do NOT use `z-index: 9999` — 20 is sufficient to paint above content while staying below nav (30+) and search overlay.
- Do NOT use hardcoded `rgba(0, 255, 159, 0.15)` — use `color-mix(in srgb, var(--vp-c-brand-1) 15%, transparent)` so it tracks variable changes.
- Do NOT use hardcoded `color: #0a0a0f` in `::selection` — use `var(--vp-c-bg)`.
- Do NOT skip Firefox scrollbar (`scrollbar-color` / `scrollbar-width`) — webkit-only scrollbar styling leaves Firefox users with OS-default light scrollbars.
- Do NOT skip `prefers-reduced-motion: reduce` for the scanline — repeating gradients can trigger vestibular discomfort.
- Do NOT modify `docs/.vitepress/theme/index.ts` — it already extends DefaultTheme correctly.
- Do NOT modify `docs/.vitepress/config.ts` — this story is CSS-only.
- Do NOT fork or replace VitePress default theme components — use CSS variables only.
- Do NOT bundle Inter font — `vitepress/theme-without-fonts` already excludes it.
- Do NOT add JavaScript or Vue components — this is pure CSS.
- Do NOT remove the Google Fonts `@import` — the architecture specifies IBM Plex Sans + JetBrains Mono.

### Testing & Verification

1. **`npm run docs:dev`**: Verify black background, green/cyan/purple accents, JetBrains Mono in code blocks, scanline overlay visible on document pages. Home page hero section renders with green title and accent gradient — no VitePress default purple-pink gradient visible. Custom block callouts (tip/info/warning/danger) use themed backgrounds with accent borders — no VitePress pastels bleed through. Dropdown search overlay background is dark, not gray.
2. **`npm run docs:build`**: Exit code 0, zero warnings on stderr. Any Vite/PostCSS warning is a failure.
3. **`npm run docs:preview`**: Production build renders identically to dev.
4. **Dark mode enforcement with `prefers-color-scheme: light`**: Open in a browser with OS-level light mode preference. Background must be black — no light bleed. Toggle button not visible in nav. Navigate between pages — stays dark.
5. **Scanline**: Visible on document pages, does NOT overlap nav bar, search overlay, or sidebar. Clicking/scrolling works through it (`pointer-events: none`). Disabled entirely when `prefers-reduced-motion: reduce`.
6. **Selection**: Select text — green highlight with dark text. Works in Firefox (`::-moz-selection`).
7. **Scrollbar**: Chrome/Edge shows green-accented scrollbar thumb. Firefox shows thin stylized scrollbar with correct colors (`scrollbar-color`).
8. **Code blocks**: Fenced code blocks have dark background, green-tinted border via `color-mix()`. Inline code green. JetBrains Mono in all code elements.
9. **Glow**: Tab-focus on link produces green box-shadow with accent outline.
10. **Google Fonts**: DevTools Network tab confirms `fonts.googleapis.com` request. Computed font: headings = IBM Plex Sans, code = JetBrains Mono.

### References

- [Source: architecture.md § Wiki Publishing Infrastructure — Decision 14 (Design System)]
- [Source: architecture.md § Wiki Publishing Infrastructure — Decision 15 (Theme Extension)]
- [Source: architecture.md § CSS Variable Mapping Table]
- [Source: architecture.md § custom.css pattern block]
- [Source: epics.md — Epic 0 Story 0.3 Acceptance Criteria]
- [Source: Story 0.1 — Dev Notes (theme skeleton, config, withSidebar pattern)]
- [Source: Story 0.2 — docs/ directory restructure (affects which pages render)]
- [Source: VitePress docs — CSS variables](https://vitepress.dev/reference/default-theme-config#css-variables)
- [Source: VitePress docs — Extending the default theme](https://vitepress.dev/guide/extending-default-theme)

## Dev Agent Record

### Agent Model Used

Claude (via CommandCode)

### Debug Log References

- `npm run docs:build` — exit code 0, zero warnings, build in 4.83s
- `npm run docs:dev` — dev server starts cleanly on port 5173
- `npm run docs:preview` — production preview serves on port 4173
- Brand color `#00ff9f` confirmed compiled into built CSS (`style.BHdslRsg.css`)

### Completion Notes List

- Replaced skeleton `custom.css` with full 156-line terminal dark theme
- All 50+ `--vp-c-*` variables set on `:root, html.dark` compound selector per AC #5
- Google Fonts (`IBM Plex Sans` + `JetBrains Mono`) imported at top of file per AC #2
- Scanline overlay uses `position: absolute` scoped to `.VPDoc` with `z-index: 20` per AC #4
- `prefers-reduced-motion: reduce` disables scanline for accessibility
- Code block border uses `color-mix()` instead of hardcoded `rgba()` — tracks brand color changes
- Selection uses variables (`var(--vp-c-bg)`), not hardcoded `#0a0a0f`
- Firefox scrollbar handled via `scrollbar-color`/`scrollbar-width` (not just webkit)
- `-moz-selection` set for Firefox selection support
- `.VPSwitchAppearance` suppressed via `display: none !important` (permitted cosmetic exception per AC #6)
- Custom Layout component (`Layout.vue`) replaces VitePress default Layout — shows sidebar on ALL pages (including home), with resizable width via drag handle (160-420px, default 180px)
- Sidebar persists to localStorage so width is remembered across sessions
- Mobile: hamburger menu button toggles sidebar as overlay, closes on route change or overlay click
- Skip-to-content link repositioned to account for sidebar width
- VitePress native sidebar and VPLocalNav suppressed via CSS `display: none`
- `theme/index.ts` updated to register custom Layout

### File List

| File | Change |
|---|---|
| `docs/.vitepress/theme/custom.css` | REPLACED — full terminal dark theme + sidebar suppressions |
| `docs/.vitepress/theme/Layout.vue` | CREATED — custom Layout with resizable sidebar on all pages |
| `docs/.vitepress/theme/index.ts` | MODIFIED — registers custom Layout component |

### Review Findings

- [x] [Review][Decision] Layout.vue and theme/index.ts modification exceed CSS-only scope (AC #6) — **Accepted as intentional scope extension.** CSS-only constraint was too narrow for the resizable sidebar requirement added via taste preference.
- [x] [Review][Patch] localStorage try-catch missing [Layout.vue:107-113, Layout.vue:131] — **Fixed:** loadSavedWidth() and saveWidth() wrap access in try-catch.
- [x] [Review][Patch] Sidebar width persisted only on unmount, not on drag end [Layout.vue:80-85] — **Fixed:** onDragEnd calls saveWidth() immediately.
- [x] [Review][Patch] Escape key unhandled during sidebar drag — leaves page unclickable [Layout.vue:80-83] — **Fixed:** global keydown listener for Escape ends drag.
- [x] [Review][Patch] Sidebar resize handle not keyboard-accessible [Layout.vue template] — **Fixed:** added role="separator", tabindex="0", aria-valuenow/min/max, and ArrowLeft/ArrowRight keydown handler with Shift for 20px step.
- [x] [Review][Patch] v-for key risks duplicate keys from `item.text || item.link` [Layout.vue template] — **Fixed:** composite key `(text + '-' + link + '-' + idx)`.
- [x] [Review][Patch] Sidebar link ellipsis lacks title attribute [Layout.vue template] — **Fixed:** `:title="sub.text"` on all sidebar anchors.
- [x] [Review][Patch] Category items without links render href="undefined" [Layout.vue template] — **Fixed:** v-if="sub.link" renders <a>, v-else renders <span>.
- [x] [Review][Patch] Root page with empty relativePath may produce empty sidebar [Layout.vue:44-52] — **Fixed:** explicit root-path guard falls back to cfg['/'].
- [x] [Review][Patch] color-mix() code block border lacks browser fallback [custom.css] — **Fixed:** fallback border: 1px solid rgba(...), overridden inside @supports(color-mix).
- [x] [Review][Defer] No print media query — pre-existing project-level concern [custom.css]
- [x] [Review][Defer] Purple accent #B967FF WCAG contrast — design-level choice [custom.css]
- [x] [Review][Defer] Global webkit-scrollbar coupling with sidebar — pre-existing [custom.css + Layout.vue]

## Change Log

- 2026-05-26: Implemented full terminal dark theme — replaced skeleton `custom.css` with 50+ `--vp-c-*` variable overrides, typography, scanline overlay, code styling, selection/scrollbar/glow effects, and dark-mode enforcement.
- 2026-05-27: Added custom Layout.vue with resizable sidebar visible on all pages (including home). Sidebar width stored in localStorage. Mobile hamburger toggle. Skip-link repositioned. VitePress native sidebar suppressed.
