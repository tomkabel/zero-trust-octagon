# Triage Results

## Normalized + Deduplicated Findings

### F1 — localStorage try-catch missing
- **Sources:** blind+edge (merged Blind #2, Edge #1, Edge #2)
- **Title:** localStorage reads/writes lack try-catch
- **Detail:** `getItem` in onMounted (L107) and `setItem` in onUnmounted (L131) can throw SecurityError (private browsing, iframe) or QuotaExceededError. Edge also notes that `parseInt` on corrupted values is handled (NaN >= 160 is false). Fix: wrap both in try-catch.
- **Location:** Layout.vue:107-113, Layout.vue:131
- **Classification:** **patch**

### F2 — Sidebar width persistence only on unmount
- **Sources:** blind (Blind #1)
- **Title:** localStorage.setItem only fires on component unmount, not on drag end
- **Detail:** In an SPA, navigating between pages does not unmount Layout. User resizes sidebar → navigates → refreshes later → width restored to previous unmount value, not latest drag. localStorage.setItem should fire on drag end as well.
- **Location:** Layout.vue:80-85 (onDragEnd)
- **Classification:** **patch**

### F3 — No Escape-key handling during sidebar drag
- **Sources:** blind+edge (merged Blind #8, Edge #3)
- **Title:** Escape press during resize drag leaves isDragging=true
- **Detail:** No Escape key listener during drag. `.is-dragging * { pointer-events: none }` makes entire page unclickable until mouseup fires, creating 1-click recovery UX trap.
- **Location:** Layout.vue:80-83
- **Classification:** **patch**

### F4 — Sidebar resize handle not keyboard-accessible
- **Sources:** blind (Blind #3)
- **Title:** Resize handle missing tabindex, role, keydown handler
- **Detail:** `.zt-sidebar-resize` div has only `@mousedown`. No `tabindex`, `role="separator"`, `aria-valuenow`/`aria-valuemin`/`aria-valuemax`, or keyboard event handler. Keyboard-only users cannot resize.
- **Location:** Layout.vue template (zt-sidebar-resize)
- **Classification:** **patch**

### F5 — v-for key collision risk
- **Sources:** blind (Blind #4)
- **Title:** v-for key uses `item.text || item.link` risking duplicate keys
- **Detail:** If two sidebar items share identical text (e.g., two sections with "Overview"), Vue reuses DOM incorrectly. Should use a composite key or unique identifier.
- **Location:** Layout.vue template, `<template v-for="item in sidebar" :key="item.text || item.link">`
- **Classification:** **patch**

### F6 — Sidebar link ellipsis without title attribute
- **Sources:** blind (Blind #9)
- **Title:** Truncated sidebar link text not exposed via title attribute
- **Detail:** Sidebar `<a>` uses `text-overflow: ellipsis` but lacks `:title="sub.text"`. Overflowing text is invisible. Add `:title` for tooltip and accessibility.
- **Location:** Layout.vue template (sidebar link anchors)
- **Classification:** **patch**

### F7 — Category items with undefined link render broken href
- **Sources:** edge (Edge #5)
- **Title:** vitepress-sidebar category items without links produce href="undefined"
- **Detail:** vitepress-sidebar generates category-level items with no `.link` property. The template renders `<a :href="withBase(undefined)">` → `href="undefined"`. Should render as `<span>` or non-link element when link is absent.
- **Location:** Layout.vue template, sidebar items `v-else-if="item.link"`
- **Classification:** **patch**

### F8 — Empty relativePath on root/index page returns empty sidebar
- **Sources:** edge (Edge #4)
- **Title:** Root page (/) with empty relativePath may produce empty sidebar
- **Detail:** `page.relativePath` could be empty string for `docs/index.md`. `ensureStartingSlash('')` returns `/`, but vitepress-sidebar doesn't generate a `'/'` key — cfg['/'] is undefined, resulting in empty sidebar array. Home page with `layout: home` may not need sidebar, but this edge case applies to any page where relativePath is empty.
- **Location:** Layout.vue:44-52
- **Classification:** **patch**

### F9 — color-mix() has no browser fallback
- **Sources:** blind (Blind #6)
- **Title:** Code block border invisible in browsers without color-mix() support
- **Detail:** `border: 1px solid color-mix(...)` — when color-mix() is unsupported (Chrome <111, FF <113, Safari <16.2), the entire `border` declaration is invalid and no border renders.
- **Location:** custom.css, `div[class*='language-']`
- **Classification:** **patch**

### F10 — Layout.vue violates CSS-only spec constraint (decision needed)
- **Sources:** auditor (AA #1, AA #2, AA #3)
- **Title:** Layout.vue creation and theme/index.ts modification exceed CSS-only scope
- **Detail:** AC #6 specifies "No JavaScript or Vue components — this is pure CSS." The implementation creates a full Vue Layout component replacing VitePress's default, modifies theme/index.ts, and suppresses native VPSidebar/VPLocalNav via display:none. The three permitted CSS-only exceptions do not include sidebar replacement. However, the story's own completion notes ("File List") document these changes, suggesting they may have been intentional scope extension. User needs to decide whether to accept or revert.
- **Location:** Layout.vue (new), theme/index.ts (modified), custom.css (sidebar suppressions)
- **Classification:** **decision_needed**

### F11 — Pre-existing: print media query absent
- **Sources:** blind (Blind #5)
- **Title:** No print stylesheet — black background wastes ink on print
- **Detail:** Print media query should switch to light background for paper output. Pre-existing project-level concern, not specific to this change.
- **Location:** custom.css
- **Classification:** **defer**

### F12 — Pre-existing: brand-3 contrast on dark background
- **Sources:** blind (Blind #7)
- **Title:** Purple accent #B967FF fails WCAG AA contrast on #0A0A0F (~4.25:1)
- **Detail:** Design choice, not implementation bug. If resolved, would affect the entire accent palette.
- **Location:** custom.css (--vp-c-brand-3)
- **Classification:** **defer**

### F13 — Pre-existing: scrollbar style coupling
- **Sources:** blind (Blind #10)
- **Title:** Global webkit-scrollbar rules implicitly override sidebar scrollbar
- **Detail:** custom.css global `::-webkit-scrollbar` rules cascade into sidebar because equal specificity. Sidebar has narrower scrollbar (4px vs 8px) but inherits thumb/background. Maintainability concern.
- **Location:** custom.css + Layout.vue style block
- **Classification:** **defer**

## Summary

| Category | Count | IDs |
|----------|-------|-----|
| **decision_needed** | 1 | F10 |
| **patch** | 9 | F1-F9 |
| **defer** | 3 | F11-F13 |
| **dismiss** | 4 | AA #4-9 (positive confirmations), AA #10 (observation) |
| **Total findings** | 13 | F1-F13 |
