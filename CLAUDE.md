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

## Verification

After any TypeScript or component changes, run `npm run build` to catch type errors before considering the work done. `npm run lint` catches most issues faster and can be run first, but a failed build is the definitive signal.

## Architecture

This is a **Next.js 15 App Router static site** (`output: 'export'` to `dist/`) deployed on Cloudflare Pages. Content is written in MDX.

### Content System

Articles live in `app/[section]/_articles/*.mdx` where section is `posts` or `misc`. Legacy `/notes/*` URLs are maintained via compatibility routes that map to posts. Each MDX file exports a `metadata` object:

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

### Lists

A `/lists` curation hub. The landing page at `app/lists/page.tsx` links to individual list pages. Each list lives under `app/lists/[slug]/`.

#### Agentic Coding

A curated list of tools bookmarked for agentic coding. Data lives in `app/lists/agentic-coding/data.ts` as a flat array of `Tool` entries (id, name, description, url). The page at `app/lists/agentic-coding/page.tsx` renders them as a lightweight list.

### Path Alias

`@/*` maps to the repo root (configured in `tsconfig.json`).
