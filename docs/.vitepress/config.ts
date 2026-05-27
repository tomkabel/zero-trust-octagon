import { defineConfig } from 'vitepress'
import { withSidebar } from 'vitepress-sidebar'

// IMPORTANT: all VitePress options go in this object — withSidebar merges sidebar into it.
// Do NOT define sidebar inside themeConfig; withSidebar injects it.
const vitePressOptions = {
  base: '/zero-trust/',
  title: 'Zero Trust Architecture',
  cleanUrls: true,
  ignoreDeadLinks: true,
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
