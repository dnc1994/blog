# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server with Turbopack
npm run build     # Build static site to dist/ + generate RSS feed
npm run lint      # Run ESLint
npm run rss       # Generate RSS feed only (dist/feed.xml)
npm run deploy    # Build + deploy to Cloudflare Pages preview
npm run deploy:prod  # Build + deploy to Cloudflare Pages production
```

There is no test suite.

## Architecture

This is a **Next.js 15 App Router static site** (`output: 'export'` to `dist/`) deployed on Cloudflare Pages. Content is written in MDX.

### Content System

Articles live in `app/[section]/_articles/*.mdx` where section is `posts`, `notes`, or `misc`. Each MDX file exports a `metadata` object:

```typescript
export const metadata = {
  title: 'Title',
  description: 'Brief description',  // used for OG/Twitter meta
  date: 'YYYY.MM.DD',
  tags: ['Tag1', 'Tag2'],
  // Optional multilingual fields:
  language: 'en' | 'zh',
  translationId: 'shared-slug',  // links translations together
  canonical: true,               // marks the canonical version shown in index
  image: 'https://r2.linghao.io/...',  // OG image
  chinese: true,                 // applies Chinese typography (font-zh, text-justify)
}
```

**Multilingual support**: Articles sharing a `translationId` are grouped. Only the `canonical: true` version appears in index pages and tags. The article page shows a language switcher between grouped articles.

`lib/articles.ts` handles all content loading — it reads `.mdx` files from disk, dynamically imports them, and exposes `getArticlesFromSection()`, `getDedupedArticlesFromSection()`, and `getAllArticles()`. Due to webpack static analysis requirements, dynamic imports use explicit string literals per section (not template literals with variable section names).

### MDX Components

`mdx-components.tsx` defines all HTML element mappings (h1–h4, p, a, code, img, etc.) and exports two components available in MDX:
- `<Card>` — link preview card (from `components/tweet-card.tsx`)
- `<BlockSideTitle title="...">` — content with a side annotation
- `<InlineMath>` / `<BlockMath>` — KaTeX math rendering

Syntax highlighting uses Shiki with a CSS variables theme (colors defined in `globals.css`). Images with a `title` attribute in MDX get wrapped in `<BlockSideTitle>`.

### Styling

Tailwind CSS v4 (beta) — no `tailwind.config.ts`; configuration is in `app/globals.css` under `@theme`. The custom color palette is `rurikon` (50–950 scale). Custom breakpoints: `mobile` (420px), `text` (1220px). Three font CSS variables: `--sans` (Inter Variable), `--serif` (Lora Italic), `--mono` (Iosevka Fixed Curly).

### Gallery

Photos are stored as data in `app/gallery/data.ts` and hosted on Cloudflare R2 at `r2.linghao.io`. The gallery uses a lightbox component at `app/gallery/gallery-grid.tsx`.

### Path Alias

`@/*` maps to the repo root (configured in `tsconfig.json`).

## Style TODOs

1. **Hardcoded colors bypassing `rurikon` palette** — `globals.css`, `tweet-card.tsx`
   - `.content-fade-out` gradient uses `#fcfcfc` instead of `var(--background)` (line 225)
   - `pre` background is `#f7f7f7` instead of a `rurikon-*` token (line 135)
   - `.framed` and `iframe` backgrounds use raw `#fff` (lines 198, 204)
   - `::selection` colors don't correspond to any palette stop (lines 229–230)
   - Shiki token colors mix `hsl()`, named hex, and bare hex formats (lines 164–172)
   - Replace with `var(--background)`, `var(--color-rurikon-50)`, and palette-derived values

2. **404 page styling gaps** — `not-found.tsx`
   - `h1` missing `text-balance`
   - Link missing `underline-offset-2`, `decoration-from-font`, `break-words`, and `focus-visible` ring styles
   - Match MDX link and heading styles exactly

3. **Non-interactive tags have hover styles** — `tag.tsx:20`
   - `<span>` tags still apply `hover:border-rurikon-400 hover:text-rurikon-600`
   - Only apply hover styles when the tag is a link or interactive button

4. **Card link URL contrast too low** — `tweet-card.tsx:28`
   - `text-rurikon-200` is ~2.2:1 contrast, below WCAG AA (4.5:1)
   - Bump to `text-rurikon-300` at rest, `text-rurikon-400` on hover

5. **Gallery grid items not keyboard-accessible** — `gallery-grid.tsx:43-47`
   - `<div onClick>` with no `tabIndex`, `role`, or `onKeyDown`
   - Use `<button>` or add `tabIndex={0}`, `role="button"`, and keyboard handler

6. **Gallery lightbox nav hidden on mobile** — `gallery-grid.tsx:74-87`
   - Chevron buttons are `hidden sm:block`; no swipe or visible mobile nav
   - Show nav buttons on mobile or add touch swipe support

7. **Duplicate `:root` blocks** — `globals.css:63-71`
   - Two adjacent `:root` blocks; merge into one

8. **Dead/unreachable CSS classes**
   - `layout.tsx:77` — fade div has `sm:h-10 md:h-14` but is `sm:hidden`
   - `navbar.tsx:23` — `hover:transform-none` has no corresponding transform
   - Remove dead classes

9. **Blockquote media query hardcodes `420px`** — `globals.css:117`
   - Should use the `--breakpoint-mobile` token or `@screen mobile`

10. **Commented-out code in `pre`/`code` styles** — `globals.css:137-162`
    - ~10 commented-out CSS declarations; remove (git preserves history)

11. **View transition timing inconsistency** — `globals.css:248-253`
    - Old-content: `0.4s cubic-bezier(...)`, new-content: `.6s ease 0.2s`
    - At minimum, make leading-zero formatting consistent

12. **Body font fallback stack diverges from theme token** — `globals.css:75-77` vs `globals.css:49-51`
    - Body rule has a longer fallback stack than `--font-family-sans`
    - Align to one source of truth
