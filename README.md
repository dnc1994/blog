# Synthesist in the Shell

Linghao Zhang's blog at [linghao.io](https://linghao.io): a static Next.js site with a terminal / memory-dump design, deployed on Cloudflare Pages.

## Features

- **Memory Dump design**: dark by default (cream light mode via the toggle), glitch headlines, scanlines, and article lists rendered as hex dumps whose titles decode from noise
- **Hidden shell**: press `` ` `` anywhere (or tap `>_ shell` in the footer) for a working terminal: `ls`, `open 3`, `grep memory`, `tags`, `cd projects`, `theme light`, `magi <question>`, and more
- **`/dive`**: jack in and fall through a shaft of streaming glyphs into a 3D map of every post, laid out by what the posts say; click a node to dive into it
- MDX posts with Shiki syntax highlighting, KaTeX math, side notes and link cards
- Multilingual posts (English / 中文) with a language switcher
- Drafts that are committed but never published
- Tag filtering, TOC sidebar for long posts, anchor links on headings
- Optional per-post soundtrack (YouTube player)
- Projects page, photo gallery with lightbox, curated lists, resume page
- RSS feed generated on every build

## Getting started

Requires Node.js 18.18–22 and npm.

```bash
npm install
npm run dev      # http://localhost:3000 (drafts visible)
npm run build    # static export to dist/ + dist/feed.xml
```

There is no test suite; `npm run build` is the check. ESLint is not configured.

## Writing a post

Create `app/posts/_articles/<slug>.mdx` (or `app/misc/_articles/` for miscellany) and export metadata:

```mdx
export const metadata = {
  title: 'Your Post Title',
  description: 'A brief description',
  date: '2026.01.01',
  tags: ['AI', 'Career'],

  // optional
  draft: true,                 // keep unpublished
  toc: true,                   // open the TOC sidebar by default
  image: 'https://r2.linghao.io/blog-assets/your-image.png',
  imageWidth: 1200,
  imageHeight: 630,
  language: 'en',              // multilingual: posts sharing a translationId
  translationId: 'shared-slug',//   get a language switcher; only the
  canonical: true,             //   canonical one is listed
  chinese: true,               // Chinese typography
  music: { youtube: 'VIDEO_ID', title: 'Song', artist: 'Artist' },
}

Your content here…
```

The post appears on `/posts`, the home page dump, tag pages, the RSS feed and the `/dive` map automatically (unless it's a draft or a non-canonical translation). `npm run blog:image` helps prepare a banner and OG image (see the script header).

MDX can use `<Card>`, `<BlockSideTitle title="…">`, `<InlineMath>` and `<BlockMath>`.

## Other content

- **Projects**: `app/projects/data.tsx` (logos in `logos.tsx`)
- **Gallery**: `app/gallery/data.ts`, images hosted on Cloudflare R2
- **Lists**: `app/lists/<list>/data.ts`
- **Resume**: `app/resume/source.ts` (see `docs/resume.md`)

## Project structure

```
app/
  layout.tsx, globals.css   Root layout, theme script, design tokens
  page.mdx                  Home (hero, recent dump, projects, featured)
  posts/ misc/              Index pages, [slug] pages, _articles/*.mdx
  notes/                    Legacy /notes/* compatibility routes
  dive/                     /dive (3D net dive)
  gallery/ lists/ projects/ resume/ tags/ …
components/
  navbar, site-footer, content-frame   Site shell
  decode, dump-list, home              Decode effect, hex-dump lists, home sections
  shell/                               Hidden terminal (commands.ts = command set)
  dive/                                Three.js scene, glyph rain, CRT pass, audio
lib/
  articles.ts   Content loading (drafts, translations)
  dump.ts       Hex-dump helpers
  dive-map.ts   Build-time 3D layout of posts
  tags.ts, seo.ts, legacy-notes.ts
scripts/        RSS, OG and banner image tooling
docs/           Design reference, resume workflow, historical plans
```

## Docs

- [`AGENTS.md`](./AGENTS.md): architecture and conventions (the guide for AI coding agents, also the best technical overview)
- [`DEPLOYMENT.md`](./DEPLOYMENT.md): branches, preview URLs, rollback
- [`docs/visual-style.md`](./docs/visual-style.md): the design system

## Deployment

Cloudflare Pages builds from GitHub: pushing to `master` deploys to production immediately; any other branch gets a preview URL. See [DEPLOYMENT.md](./DEPLOYMENT.md).

## License

Code: MIT. Writing and photos: CC BY-NC-ND 4.0 unless noted otherwise.

## Acknowledgments

The original layout was inspired by [Shu Ding's blog](https://shud.in/). The current Memory Dump design was designed and built with [Claude](https://claude.ai); light mode uses [Flexoki](https://stephango.com/flexoki) by Steph Ango.
