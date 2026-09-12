/**
 * Blog-style page headers for the Zero-Trust Octagon book.
 *
 * Pages that declare a `cover` in frontmatter get an editorial opening:
 *
 *     [kicker]        part / section label          (before the H1)
 *     [cover figure]  the page illustration          (before the H1)
 *     # Title         the page H1 (untouched)
 *     [meta]          chapter label + reading time   (after the H1)
 *
 * Runs as a markdown-it core rule, after VitePress's frontmatter plugin,
 * so `env.frontmatter` and `env.relativePath` are already populated.
 * Registered from docs/.vitepress/config.ts via `markdown.config`.
 */

import { existsSync } from 'node:fs'
import { join } from 'node:path'

const PART_LABELS = [
  [/^01-foundations\//, 'Part I — Foundations'],
  [/^02-methodology\//, 'Part II — Architecture'],
  [/^03-archetypes\//, 'Part III — Reality'],
  [/^04-synthesis\//, 'Part IV — Action'],
  [/^appendix\//, 'Appendices'],
  [/^engineering\//, 'Engineering — Reference Implementation'],
]

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function kickerFor(relativePath, frontmatter) {
  if (typeof frontmatter.kicker === 'string' && frontmatter.kicker) {
    return frontmatter.kicker
  }
  for (const [re, label] of PART_LABELS) {
    if (re.test(relativePath)) return label
  }
  return ''
}

function chapterFor(title, relativePath) {
  const trimmed = title.trim()
  const numbered = /^(\d+)\.\s/.exec(trimmed)
  if (numbered) return `Chapter ${numbered[1]}`
  const appendix = /^Appendix\s+([A-Z])\b/.exec(trimmed)
  if (appendix) return `Appendix ${appendix[1]}`
  if (relativePath.startsWith('engineering/')) return 'Spec'
  return ''
}

function countWords(tokens) {
  let words = 0
  for (const token of tokens) {
    if (token.type !== 'inline' || !token.children) continue
    for (const child of token.children) {
      if (child.type === 'text' || child.type === 'code_inline') {
        const text = child.content.trim()
        if (text) words += text.split(/\s+/).length
      }
    }
  }
  return words
}

/**
 * Cover assets live in `<srcDir>/public/...` and are served from the site
 * root. During a build the asset pipeline resolves `/images/...` imports
 * against that public dir — if the file is missing, the rollup build FAILS.
 * Skip the figure (with a warning) instead, so frontmatter referencing an
 * asset can land before/independently of the asset file itself.
 *
 * srcDir is derived from `env.path` (absolute) minus `env.relativePath`,
 * and the check fails open: if anything is off we keep the figure.
 */
function coverFileExists(env, coverPath) {
  try {
    const abs = String(env.path || '')
    const rel = String(env.relativePath || '')
    if (!abs || !rel || !abs.endsWith(rel)) return true
    const srcDir = abs.slice(0, abs.length - rel.length).replace(/[\\/]+$/, '')
    return existsSync(join(srcDir, 'public', coverPath.replace(/^\/+/, '')))
  } catch {
    return true
  }
}

export function postHeaderPlugin(md) {
  md.core.ruler.push('zt_post_header', (state) => {
    const env = state.env || {}
    const frontmatter = env.frontmatter || {}
    if (!frontmatter.cover) return

    const tokens = state.tokens
    let h1Index = -1
    for (let i = 0; i < tokens.length; i++) {
      if (tokens[i].type === 'heading_open' && tokens[i].tag === 'h1') {
        h1Index = i
        break
      }
    }
    if (h1Index < 0) return
    if (tokens[h1Index + 1]?.type !== 'inline') return
    if (tokens[h1Index + 2]?.type !== 'heading_close') return

    const title = tokens[h1Index + 1].content || ''
    const relativePath = String(env.relativePath || '')

    // ---- cover + kicker (before the H1) ---------------------------------
    // Order: cover illustration first (the page "begins" with it), then the
    // kicker label directly above the title so the two read as a unit.
    const kicker = kickerFor(relativePath, frontmatter)
    const alt = frontmatter.coverAlt || ''
    const caption = frontmatter.coverCaption
      ? `<figcaption>${escapeHtml(frontmatter.coverCaption)}</figcaption>`
      : ''
    const coverAvailable = coverFileExists(env, frontmatter.cover)
    if (!coverAvailable) {
      console.warn(
        `[zt-post-header] cover asset missing, skipping figure: ${frontmatter.cover} (${relativePath})`,
      )
    }
    const headHtml =
      (coverAvailable
        ? `<figure class="zt-post-cover">` +
          // NOTE: keep the public-dir path without the site base — VitePress's
          // asset pipeline resolves `/images/...` against the public dir and
          // prepends the base itself. Including the base here breaks the build.
          `<img src="${escapeHtml(frontmatter.cover)}"` +
          ` alt="${escapeHtml(alt)}" loading="eager" decoding="async">` +
          caption +
          `</figure>`
        : '') +
      (kicker ? `<p class="zt-post-kicker">${escapeHtml(kicker)}</p>` : '')

    // ---- meta line (after the H1) ---------------------------------------
    let metaHtml = ''
    if (frontmatter.meta !== false) {
      const items = []
      if (typeof frontmatter.meta === 'string' && frontmatter.meta) {
        items.push(frontmatter.meta)
      } else {
        const chapter = chapterFor(title, relativePath)
        if (chapter) items.push(chapter)
        items.push(`${Math.max(1, Math.round(countWords(tokens) / 230))} min read`)
      }
      metaHtml = `<p class="zt-post-meta">${items
        .map(escapeHtml)
        .join('<span class="zt-post-meta-sep" aria-hidden="true">·</span>')}</p>`
    }

    const head = new state.Token('html_block', '', 0)
    head.content = headHtml + '\n'
    tokens.splice(h1Index, 0, head)

    if (metaHtml) {
      const meta = new state.Token('html_block', '', 0)
      meta.content = metaHtml + '\n'
      // heading_open is now at h1Index + 1, heading_close at h1Index + 3
      tokens.splice(h1Index + 4, 0, meta)
    }
  })
}
