import { defineConfig } from 'vitepress'
import { withSidebar } from 'vitepress-sidebar'
import { postHeaderPlugin } from './plugins/post-header.mjs'

const SITE_BASE = '/zero-trust-octagon/'

// IMPORTANT: all VitePress options go in this object — withSidebar merges sidebar into it.
// Do NOT define sidebar inside themeConfig; withSidebar injects it.
const vitePressOptions = {
  base: SITE_BASE,
  title: 'Zero-Trust Octagon',
  cleanUrls: true,
  ignoreDeadLinks: true,
  markdown: {
    lineNumbers: true,
    theme: { dark: 'github-dark' },
    // Editorial page headers (kicker / cover illustration / meta) for pages
    // that declare `cover` in frontmatter — see plugins/post-header.mjs
    config: (md: any) => {
      md.use(postHeaderPlugin)
    },
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
  useTitleFromFileHeading: true,
  // Home stays reachable from the top nav; the sidebar lists the book only.
  includeRootIndexFile: false,
  useFolderTitleFromIndexFile: true,
  useFolderLinkFromIndexFile: true,
  // Internal notes are not part of the book navigation
  excludeByGlobPattern: ['project-context.md', 'node_modules/**'],
  // Keep the book's own order: start page first, then the parts in order
  manualSortFileNameByPriority: [
    'index.md',
    '01-foundations',
    '02-methodology',
    '03-archetypes',
    '04-synthesis',
    'appendix',
    'engineering',
  ],
}

// withSidebar emits folder links as "/<dir>/index.md"; rewrite them to the
// clean folder URLs used by the site (e.g. "/01-foundations/").
function cleanFolderLinks(items: any[]): any[] {
  if (!Array.isArray(items)) return items
  for (const item of items) {
    if (typeof item.link === 'string' && item.link.endsWith('/index.md')) {
      item.link = item.link.replace(/\/index\.md$/, '/')
    }
    if (item.items) cleanFolderLinks(item.items)
  }
  return items
}

const config: any = withSidebar(vitePressOptions as any, sidebarOptions as any)
if (config.themeConfig?.sidebar) cleanFolderLinks(config.themeConfig.sidebar)

export default defineConfig(config)
