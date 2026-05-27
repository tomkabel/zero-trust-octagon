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
  const raw = page.value.relativePath || ''
  const path = ensureStartingSlash(raw)
  if (!path || path === '/') {
    // Root or empty path: try '/' key, then fall through
    const rootItems = cfg['/'] || []
    return Array.isArray(rootItems) ? rootItems : (rootItems.items || [])
  }
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

function loadSavedWidth(): number {
  try {
    const stored = localStorage.getItem('sidebar-width')
    if (stored) {
      const w = parseInt(stored, 10)
      if (!isNaN(w) && w >= 160 && w <= 420) return w
    }
  } catch {
    // localStorage unavailable (private browsing, iframe, quota)
  }
  return 180
}

function saveWidth(w: number) {
  try {
    localStorage.setItem('sidebar-width', String(w))
  } catch {
    // localStorage unavailable — silently discard
  }
}

const sidebarWidth = ref(loadSavedWidth())
const isDragging = ref(false)
const savedWidth = ref(sidebarWidth.value)

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
  if (isDragging.value) {
    isDragging.value = false
    saveWidth(savedWidth.value)
  }
}

function onKeyDown(e: KeyboardEvent) {
  if (e.key === 'Escape' && isDragging.value) {
    onDragEnd()
  }
}

function onResizeKeydown(e: KeyboardEvent) {
  const step = e.shiftKey ? 20 : 5
  let w = sidebarWidth.value
  if (e.key === 'ArrowRight') {
    w = Math.min(420, w + step)
    e.preventDefault()
  } else if (e.key === 'ArrowLeft') {
    w = Math.max(160, w - step)
    e.preventDefault()
  } else {
    return
  }
  sidebarWidth.value = w
  savedWidth.value = w
  saveWidth(w)
}

onMounted(() => {
  window.addEventListener('mousemove', onDragMove)
  window.addEventListener('mouseup', onDragEnd)
  window.addEventListener('keydown', onKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', onDragMove)
  window.removeEventListener('mouseup', onDragEnd)
  window.removeEventListener('keydown', onKeyDown)
  saveWidth(savedWidth.value)
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
        <template v-for="(item, idx) in sidebar" :key="(item.text || '') + '-' + (item.link || '') + '-' + idx">
          <div v-if="item.items" class="zt-sidebar-group">
            <div v-if="item.text" class="zt-sidebar-group-title">{{ item.text }}</div>
            <template v-for="(sub, sIdx) in item.items" :key="(sub.text || '') + '-' + (sub.link || '') + '-' + sIdx">
              <a
                v-if="sub.link"
                :href="withBase(sub.link)"
                :title="sub.text"
                class="zt-sidebar-link"
              >{{ sub.text }}</a>
              <span v-else class="zt-sidebar-link no-link">{{ sub.text }}</span>
            </template>
          </div>
          <a
            v-else-if="item.link"
            :href="withBase(item.link)"
            :title="item.text"
            class="zt-sidebar-link top-level"
          >{{ item.text }}</a>
        </template>
      </nav>
      <div
        class="zt-sidebar-resize"
        role="separator"
        tabindex="0"
        aria-label="Resize sidebar"
        aria-valuemin="160"
        aria-valuemax="420"
        :aria-valuenow="sidebarWidth"
        @mousedown="onDragStart"
        @keydown="onResizeKeydown"
      />
    </aside>

    <div class="zt-main">
      <DefaultTheme.Layout />
    </div>
  </div>
</template>

<style>
.zt-layout {
  --zt-sidebar-width: 220px;
  display: flex;
  min-height: 100vh;
}

.zt-layout.is-dragging {
  user-select: none;
  cursor: col-resize;
}

.zt-layout.is-dragging * {
  pointer-events: none;
}

.zt-mobile-menu-btn {
  display: none;
  position: fixed;
  top: 10px;
  left: 10px;
  z-index: 60;
  width: 36px;
  height: 32px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  border-radius: 4px;
  padding: 6px;
  cursor: pointer;
}

.zt-mobile-menu-btn:hover {
  border-color: var(--vp-c-brand-1);
}

.zt-hamburger-line {
  display: block;
  width: 100%;
  height: 2px;
  background: var(--vp-c-text-1);
  margin-bottom: 4px;
  border-radius: 1px;
}

.zt-hamburger-line:last-child {
  margin-bottom: 0;
}

.zt-sidebar-overlay {
  display: none;
  position: fixed;
  inset: 0;
  z-index: 50;
  background: rgba(0, 0, 0, 0.5);
}

.zt-layout.sidebar-open .zt-sidebar-overlay {
  display: block;
}

.zt-sidebar {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 25;
  background: var(--vp-sidebar-bg);
  border-right: 1px solid var(--vp-c-border);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex-shrink: 0;
}

.zt-sidebar-nav {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 80px 12px 32px 16px;
  scrollbar-width: thin;
  scrollbar-color: var(--vp-c-text-3) transparent;
}

.zt-sidebar-nav::-webkit-scrollbar {
  width: 4px;
}

.zt-sidebar-nav::-webkit-scrollbar-thumb {
  background: var(--vp-c-text-3);
  border-radius: 2px;
}

.zt-sidebar-group {
  margin-bottom: 14px;
}

.zt-sidebar-group-title {
  font-size: 11px;
  font-weight: 600;
  color: var(--vp-c-text-3);
  padding: 2px 8px 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.zt-sidebar-link {
  display: block;
  padding: 3px 8px;
  font-size: 12px;
  line-height: 1.5;
  color: var(--vp-c-text-2);
  text-decoration: none;
  border-radius: 3px;
  transition: color 0.15s, background 0.15s;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.zt-sidebar-link:hover {
  color: var(--vp-c-brand-1);
  background: var(--vp-c-gray-soft);
}

.zt-sidebar-link.top-level {
  font-size: 13px;
  font-weight: 500;
  padding: 4px 8px;
  margin-bottom: 4px;
}

.zt-sidebar-link.no-link {
  cursor: default;
  opacity: 0.7;
}

.zt-sidebar-link.no-link:hover {
  color: var(--vp-c-text-2);
  background: transparent;
}

.zt-sidebar-resize {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 5px;
  cursor: col-resize;
  background: transparent;
  transition: background 0.2s;
  z-index: 1;
}

.zt-sidebar-resize:focus-visible {
  outline: 1px solid var(--vp-c-brand-1);
  background: var(--vp-c-brand-2);
}

.zt-sidebar-resize:hover,
.zt-layout.is-dragging .zt-sidebar-resize {
  background: var(--vp-c-brand-1);
}

.zt-main {
  flex: 1;
  min-width: 0;
}

/* Push content and nav to the right when sidebar is visible */
.zt-layout.has-sidebar .VPNav {
  padding-left: var(--zt-sidebar-width);
}

.zt-layout.has-sidebar .VPContent {
  padding-left: var(--zt-sidebar-width) !important;
}

/* Ensure the home page content area respects sidebar padding */
.zt-layout.has-sidebar.is-home .VPContent.is-home {
  padding-left: var(--zt-sidebar-width) !important;
  max-width: 100%;
}

/* Skip link - make it visible on focus, positioned above sidebar */
.VPSkipLink:focus {
  left: calc(var(--zt-sidebar-width) + 16px) !important;
  z-index: 100 !important;
}

/* Under 960px: sidebar as overlay, not fixed */
@media (max-width: 959px) {
  .zt-mobile-menu-btn {
    display: block;
  }

  .zt-layout.has-sidebar .VPNav {
    padding-left: 0;
  }

  .zt-layout.has-sidebar .VPContent,
  .zt-layout.has-sidebar.is-home .VPContent.is-home {
    padding-left: 0 !important;
  }

  .zt-sidebar {
    transform: translateX(-100%);
    transition: transform 0.25s ease;
    z-index: 55;
    width: 220px !important;
    max-width: 85vw;
  }

  .zt-layout.sidebar-open .zt-sidebar {
    transform: translateX(0);
  }

  .VPSkipLink:focus {
    left: 16px !important;
  }
}
</style>
