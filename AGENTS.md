# AGENTS.md

Guidance for AI coding agents (Claude, Gemini, Codex, …) working in this repository. This is the single source of truth; `CLAUDE.md` and `GEMINI.md` only import it.

## Commands

```bash
npm run dev          # Dev server (Turbopack). Drafts are visible here.
npm run build        # Static export to dist/ + RSS feed. The definitive check.
npm run rss          # Regenerate dist/feed.xml only
npm run og-image     # Compress an image to an OG JPEG and upload to R2 (see script header)
npm run blog:image   # Prepare a post banner + OG image (see script header)
npm run deploy       # Manual Wrangler preview deploy (normally not needed)
npm run deploy:prod  # Manual Wrangler production deploy (normally not needed)
```

There is no test suite, and ESLint is not configured (`npm run lint` would start Next's interactive ESLint setup), so don't rely on it.

## Verification

After any TypeScript, component or MDX change, run `npm run build`; a failed build is the signal. For visual changes, serve `dist/` (e.g. `python3 -m http.server -d dist`) and check pages in a browser, in both themes and at phone width.

## Deploying and branches

Cloudflare Pages builds straight from GitHub (no GitHub Actions). **A push to `master` goes live on linghao.io immediately.** Every other branch gets a preview at `<branch-slug>.blog-29f.pages.dev` (e.g. `docs/foo` → `docs-foo.blog-29f.pages.dev`).

- Do work on a branch, build locally, push, and share the preview URL. Merge to `master` only when asked.
- Prefer `--no-ff` merges so a whole feature can be rolled back with one `git revert -m 1 <merge>`.
- The pre-redesign design is preserved on branch `design-v1`.

See `DEPLOYMENT.md` for details.

## Architecture

Next.js 15 App Router, static export (`output: 'export'` → `dist/`), Tailwind CSS v4 (beta, configured in CSS), MDX content. `@/*` maps to the repo root.

### Content

Articles live in `app/[section]/_articles/*.mdx`, where section is `posts` or `misc`. Legacy `/notes/*` URLs are compatibility routes onto posts (`lib/legacy-notes.ts`). Each MDX file exports `metadata`:

```typescript
export const metadata = {
  title: 'Title',
  description: 'Brief description',    // OG/Twitter meta
  date: 'YYYY.MM.DD',
  tags: ['Tag1', 'Tag2'],
  // optional
  language: 'en' | 'zh',
  translationId: 'shared-slug',         // groups translations
  canonical: true,                      // the version shown in listings
  chinese: true,                        // Chinese typography
  image: 'https://r2.linghao.io/...',   // OG image (+ imageWidth / imageHeight)
  toc: true,                            // open the TOC sidebar by default
  music: { youtube: 'id', title: '…', artist: '…' },  // floating player
  draft: true,                          // unpublished (see below)
}
```

- **Translations**: posts sharing a `translationId` get a language switcher; only `canonical: true` appears in listings, tags, the home dump and the dive map.
- **Drafts**: `draft: true` posts are excluded from `lib/articles.ts` listings (index pages, tags, RSS, home, `/dive`) and from `generateStaticParams`, so they have no page in the build even if committed. They remain routable in `next dev`. Treat them as non-existent in production counts.
- `lib/articles.ts` loads content: `getArticlesFromSection()`, `getDedupedArticlesFromSection()`, `getAllArticles()`. Dynamic imports use explicit string literals per section (webpack static analysis); don't refactor them into template literals.

### MDX components

`mdx-components.tsx` maps HTML elements (headings get `##`/`###` terminal-style prefixes and anchor links) and provides `<Card>`, `<BlockSideTitle title="…">`, `<InlineMath>` / `<BlockMath>` (KaTeX). Code blocks use Shiki with a CSS-variables theme; token colors live in `app/globals.css` for both themes.

### Design system ("Memory Dump")

Full reference: `docs/visual-style.md`. Essentials:

- **Theme**: dark by default; `html.theme-light` switches to a cream "paper" variant (Flexoki-based). The theme class is set before paint by an inline script in `app/layout.tsx`; `components/theme-toggle.tsx` exposes `setSiteTheme()`.
- **Palette**: always use the `rurikon-*` Tailwind colors, never raw hex, in site UI. 50 = surface, 100/200 = lines, 300/400 = muted text, 500 = body, 600 = headings, 800 = strongest; plus `rurikon-border`, `rurikon-accent` (teal), `rurikon-signal` (orange) and `rurikon-ghost` (decorative only, fails contrast). Both themes redefine the same variables, so components theme automatically.
- **Fonts** (self-hosted in `app/_fonts`): `font-sans` Inter (body), `font-display` Space Grotesk (headings, titles), `font-mono` JetBrains Mono (UI chrome, meta, code).
- **Layout**: `components/navbar.tsx` (top bar, hex-indexed links), `components/site-footer.tsx`, `components/content-frame.tsx` (`/` and `/posts` are full width; every other route gets a centered `max-w-[44rem]` reading column).
- **Decode effect**: `components/decode.tsx` (`useDecode`, `<DecodeText>`) renders the real text on the server, then scrambles it to noise and resolves it on mount/hover. The `.decode-pending` CSS hides it until JS runs, with a fallback if hydration fails. Respects `prefers-reduced-motion`.
- **Dump lists**: `components/dump-list.tsx` + `lib/dump.ts` render article lists as hex dumps (offset, hex bytes of the title, decoded title, date). Used by the home page (`components/home.tsx`) and `/posts`.
- **CSS utilities** in `globals.css`: `.glitch` / `.glitch-jitter` (chromatic headline), `.cursor-blink`, `.pulse-dot`, scanline overlay on `body::after`.

### Easter eggs

- **Hidden shell**: press `` ` `` anywhere (or the footer's `>_ shell`). UI in `components/shell/terminal.tsx`, mounted via `components/shell/shell-mount.tsx` in the layout. Commands are a pure function in `components/shell/commands.ts`: to add one, add a `case` to `run()` and a line to `HELP`.
- **`/dive`**: a net-dive into a 3D map of all posts. `lib/dive-map.ts` computes the layout at build time (TF-IDF over post text → classical MDS → force-directed relax) and edges between nearest neighbours. The client side in `components/dive/`:
  - `dive-experience.tsx`: gate, boot lines, HUD and fallbacks.
  - `dive-scene.tsx`: Three.js scene and phases `ready → boot → descent → explore → diving`.
  - `glyph-rain.ts`: instanced glyph shader.
  - `crt-pass.ts`: post-processing pass.
  - `dive-audio.ts`: synthesized WebAudio sound.

  Three.js is only loaded on this route. Append `?timescale=0.15` to slow the sequence for inspecting frames.

### Other pages

- `/projects`: data in `app/projects/data.tsx` (logos in `logos.tsx`). The home page shows 3 random projects.
- `/gallery`: photos in `app/gallery/data.ts`, hosted on R2 (`r2.linghao.io`), lightbox in `gallery-grid.tsx`.
- `/lists`: curation hub (`app/lists/page.tsx`) with one folder per list (`ai-research`, `design`, `sci-fi`, `working-with-ai`), each with its own `data.ts`. Lists and their items are sorted alphabetically at render time, so data files can be in any order.
- `/resume`: content in `app/resume/source.ts`, rendering in `page.tsx`. The recruiter PDF's `resume-pdf/main.tex` is generated from the same source: after editing `source.ts`, run `npm run resume:tex` and commit `main.tex` too. See `docs/resume.md`.
- `/tags/all`: tag browser. Standalone pages: `/the-best-things`, `/hyperbola`, `/my-subscriptions`, `/taste-loss-taxonomy`.
- RSS: `scripts/generate-rss.mjs` runs after every build (posts + misc, drafts excluded).

## Conventions

- Keep colors on the `rurikon-*` scale and check both themes; keep text contrast ≥ 4.5:1 (don't use `rurikon-ghost` for readable text).
- Animations must respect `prefers-reduced-motion`.
- Content (MDX, data files) and design are separate: design changes shouldn't require touching posts.
- Don't bump Tailwind or Next major versions casually; Tailwind is a v4 beta pinned in `package.json`.
