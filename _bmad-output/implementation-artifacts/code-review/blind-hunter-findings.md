# Blind Hunter Findings — Adversarial Review

## 1. Sidebar width not persisted on drag end
- **File:** `Layout.vue`, `onDragEnd` function (around line 80-85)
- **Evidence:** `savedWidth` is updated on every `onDragMove` call, but `localStorage.setItem` only fires in `onUnmounted`. In a VitePress SPA, navigating between pages does not unmount the Layout component — only a full page refresh does. If a user resizes the sidebar and navigates within the site, then refreshes later, the width is restored to the value from the last `onUnmounted` (previous session), not the latest drag position.
- **Category:** Bug

## 2. Missing try-catch for localStorage access
- **File:** `Layout.vue`, lines 107-113 (`getItem`), line 131 (`setItem`)
- **Evidence:** `localStorage.getItem('sidebar-width')` and `localStorage.setItem(...)` can throw `SecurityError` (browser privacy settings, third-party iframe context) or `QuotaExceededError` (storage full). No try-catch means an exception during either call propagates unhandled — during `onMounted`, this would crash the entire Layout component on page load.
- **Category:** Error Handling

## 3. Accessibility: sidebar resize handle not keyboard-accessible
- **File:** `Layout.vue` template, `.zt-sidebar-resize` div
- **Evidence:** The resize handle has only `@mousedown` with no `tabindex`, `role`, `aria-label`, or `@keydown` handler. Keyboard-only users cannot resize the sidebar. No `role="separator"` or `aria-valuenow`/`aria-valuemin`/`aria-valuemax` attributes expose the current width to assistive technology.
- **Category:** Accessibility

## 4. v-for key uses `item.text || item.link` risking duplicate keys
- **File:** `Layout.vue` template, `<template v-for="item in sidebar" :key="item.text || item.link">`
- **Evidence:** If two sidebar items share the same text (e.g., two sections each with an "Overview" entry), `item.text` is identical and the fallback to `item.link` only applies when `item.text` is falsy. Vue uses duplicate keys to reuse DOM nodes incorrectly, causing stale rendering or transition glitches on sidebar interactions.
- **Category:** Bug

## 5. No print media query for dark background
- **File:** `custom.css`
- **Evidence:** Entire page is `#0a0a0f` background. Printing a page will consume excessive toner/ink on the black background, and white-on-black printed text is difficult to read on paper. No `@media print` rule switches to a light color scheme.
- **Category:** UX / Maintainability

## 6. color-mix() provides no fallback border in older browsers
- **File:** `custom.css`, `div[class*='language-']` rule
- **Evidence:** Code block border uses `border: 1px solid color-mix(in srgb, var(--vp-c-brand-1) 15%, transparent)`. In browsers that don't support `color-mix()` (Chrome <111, Firefox <113, Safari <16.2 — approximately 3+ years old), the entire `border` declaration is invalid and no border renders. A `border: 1px solid` with a transparent fallback or `@supports` guard is missing.
- **Category:** Compatibility

## 7. --vp-c-brand-3 (#B967FF) contrast on #0A0A0F fails WCAG AA for normal text
- **File:** `custom.css`, brand accent section
- **Evidence:** Purple accent `#B967FF` on `#0A0A0F` background has contrast ratio ~4.25:1, below the 4.5:1 WCAG AA threshold for normal-size text. If this variable is used for body text or links (e.g., via `var(--vp-c-brand-3)` on `--vp-c-text-1`), affected text fails accessibility requirements.
- **Category:** Accessibility

## 8. No Escape-key handling during sidebar drag
- **File:** `Layout.vue`, `onDragMove`/`onDragEnd` functions
- **Evidence:** If the user presses Escape during a sidebar resize drag, `isDragging` stays `true` because no Escape handler exists. The `.zt-layout.is-dragging * { pointer-events: none }` CSS makes all page elements unclickable until the user clicks somewhere to fire `mouseup`. Creates a confusing 1-click-delay recovery UX.
- **Category:** UX

## 9. Sidebar link text ellipsis without title attribute
- **File:** `Layout.vue` template, sidebar link anchors
- **Evidence:** Sidebar links use `white-space: nowrap; overflow: hidden; text-overflow: ellipsis` (in `<style>` block) but the `<a>` element has no `:title="sub.text"` attribute. Users cannot see the full link text when it overflows — no tooltip, no way to read truncated content.
- **Category:** UX / Accessibility

## 10. Global ::-webkit-scrollbar rules conflict with sidebar-specific scrollbar rules
- **File:** `custom.css` (global webkit-scrollbar) vs `Layout.vue` (sidebar webkit-scrollbar)
- **Evidence:** `custom.css` sets `::-webkit-scrollbar { width: 8px }` globally with green thumb. `Layout.vue` sets `::-webkit-scrollbar { width: 4px }` for `.zt-sidebar-nav`. Because both have equal specificity and Layout.vue styles load after custom.css, the sidebar gets width 4px but thumb/background properties cascade from custom.css. This implicit coupling is fragile — changing custom.css scrollbar properties affects the sidebar in unexpected ways.
- **Category:** Maintainability
