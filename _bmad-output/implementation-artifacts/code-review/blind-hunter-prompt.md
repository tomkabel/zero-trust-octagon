# Blind Hunter — Adversarial Code Review

You are a Blind Hunter. You receive ONLY the diff below — no spec, no project context, no acceptance criteria. Your job is to find bugs, security issues, logic errors, and anti-patterns purely from the code diff.

Review all changes. Output findings as a Markdown list. Each finding: one-line title, the file and line(s) affected, evidence from the diff, and the category (bug, security, logic, anti-pattern, performance, maintainability).

---

## Diff Output

The diff below is from a VitePress wiki project implementing a terminal dark theme. It includes:
1. A `custom.css` file with 166 lines of CSS variable overrides and styling
2. A `Layout.vue` file with 343 lines implementing a custom Vue 3 sidebar component
3. A `theme/index.ts` file wiring the custom Layout

---

### custom.css

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

  /* Brand variant tokens */
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

/* Scanline overlay */
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

/* --- Custom sidebar replaces VitePress native sidebar --- */
.VPSidebar,
.VPLocalNav {
  display: none !important;
}

.VPDoc.has-aside .aside {
  display: none !important;
}
```

### Layout.vue

```vue
<script setup lang="ts">
import { useData, withBase, useRoute } from 'vitepress'
import DefaultTheme from 'vitepress/theme-without-fonts'
import { computed, ref, onMounted, onUnmounted, watch } from 'vue'

const { theme, frontmatter, page } = useData()
const route = useRoute()

const isHome = computed(() => frontmatter.value.layout === 'home')

const sidebarOpen = ref(false)

function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value
}

function closeSidebar() {
  sidebarOpen.value = false
}

watch(() => route.path, () => {
  sidebarOpen.value = false
})

const sidebar = computed(() => {
  const cfg = theme.value.sidebar
  if (!cfg) return []
  if (Array.isArray(cfg)) return cfg
  const path = ensureStartingSlash(page.value.relativePath)
  const dir = Object.keys(cfg)
    .sort((a, b) => b.split('/').length - a.split('/').length)
    .find((d) => path.startsWith(ensureStartingSlash(d)))
  const items = dir ? cfg[dir] : (cfg['/'] || [])
  return Array.isArray(items) ? items : (items.items || [])
})

function ensureStartingSlash(p: string) {
  return p.startsWith('/') ? p : '/' + p
}

const showSidebar = computed(() => {
  return frontmatter.value.sidebar !== false && sidebar.value.length > 0
})

const sidebarWidth = ref(180)
const isDragging = ref(false)
const savedWidth = ref(180)

function onDragStart(e: MouseEvent) {
  isDragging.value = true
  e.preventDefault()
}

function onDragMove(e: MouseEvent) {
  if (!isDragging.value) return
  const w = Math.max(160, Math.min(420, e.clientX))
  sidebarWidth.value = w
  savedWidth.value = w
}

function onDragEnd() {
  isDragging.value = false
}

onMounted(() => {
  window.addEventListener('mousemove', onDragMove)
  window.addEventListener('mouseup', onDragEnd)
  const stored = localStorage.getItem('sidebar-width')
  if (stored) {
    const w = parseInt(stored, 10)
    if (w >= 160 && w <= 420) {
      sidebarWidth.value = w
      savedWidth.value = w
    }
  }
})

onUnmounted(() => {
  window.removeEventListener('mousemove', onDragMove)
  window.removeEventListener('mouseup', onDragEnd)
  localStorage.setItem('sidebar-width', String(savedWidth.value))
})
</script>

<template>
  <div
    class="zt-layout"
    :class="{
      'has-sidebar': showSidebar,
      'is-home': isHome,
      'is-dragging': isDragging,
      'sidebar-open': sidebarOpen,
    }"
    :style="{ '--zt-sidebar-width': sidebarWidth + 'px' }"
  >
    <button class="zt-mobile-menu-btn" @click="toggleSidebar" aria-label="Toggle sidebar">
      <span class="zt-hamburger-line" />
      <span class="zt-hamburger-line" />
      <span class="zt-hamburger-line" />
    </button>

    <div v-if="sidebarOpen" class="zt-sidebar-overlay" @click="closeSidebar" />

    <aside
      v-if="showSidebar"
      class="zt-sidebar"
      :class="{ open: sidebarOpen }"
      :style="{ width: sidebarWidth + 'px' }"
      aria-label="Sidebar navigation"
    >
      <nav class="zt-sidebar-nav">
        <template v-for="item in sidebar" :key="item.text || item.link">
          <div v-if="item.items" class="zt-sidebar-group">
            <div v-if="item.text" class="zt-sidebar-group-title">{{ item.text }}</div>
            <a
              v-for="sub in item.items"
              :key="sub.link"
              :href="withBase(sub.link)"
              class="zt-sidebar-link"
            >{{ sub.text }}</a>
          </div>
          <a v-else-if="item.link" :href="withBase(item.link)" class="zt-sidebar-link top-level">{{ item.text }}</a>
        </template>
      </nav>
      <div class="zt-sidebar-resize" @mousedown="onDragStart" />
    </aside>

    <div class="zt-main">
      <DefaultTheme.Layout />
    </div>
  </div>
</template>

<style>
/* ... (styles inline in the component) */
</style>
```

### theme/index.ts

```ts
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme-without-fonts'
import Layout from './Layout.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout,
} satisfies Theme
```
