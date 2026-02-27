# Project Context: Linghao's Blog

## Overview
This is a personal blog built with **Next.js 15 (App Router)**, **TypeScript**, and **Tailwind CSS**. It is a static site (`output: 'export'`) deployed to **Cloudflare Pages**. Content is authored in **MDX**.

## Tech Stack
- **Framework**: Next.js 15.0+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4.0 (Beta) + CSS Variables
- **Content**: MDX (`@next/mdx`, `next-mdx-remote`)
- **Syntax Highlighting**: Shiki
- **Math Support**: KaTeX
- **Deployment**: Cloudflare Pages (via `wrangler`)
- **Package Manager**: NPM

## Project Structure

### Key Directories
- **`app/`**: Application source code (App Router).
  - **`layout.tsx`**: Root layout with global styles and font loading.
  - **`[section]/`**: Sections of the blog (e.g., `posts`, `misc`). Legacy `/notes/*` routes are compatibility aliases.
    - **`_articles/`**: Contains `.mdx` content files for that section.
    - **`[slug]/`**: Dynamic route for rendering individual articles.
  - **`_fonts/`**: Local font files (Inter, Iosevka, Lora).
- **`components/`**: Reusable UI components (`navbar.tsx`, `view-transition.tsx`, etc.).
- **`lib/`**: Utility functions.
  - **`articles.ts`**: Logic for fetching, parsing, and deduping MDX articles.
- **`scripts/`**: Build scripts (e.g., `generate-rss.mjs`).
- **`public/`**: Static assets.

### Content Convention
- Articles are stored in `app/[section]/_articles/` as `.mdx` files.
- Metadata is exported from the MDX file:
  ```typescript
  export const metadata = {
    title: 'Title',
    date: 'YYYY-MM-DD',
    tags: ['tag1', 'tag2'],
    // ...other fields
  }
  ```
- Dynamic imports are used in `lib/articles.ts` to load content based on the section.

## Development Workflow

### Scripts
- **`npm run dev`**: Start development server (`next dev --turbo`).
- **`npm run build`**: Build the static site and generate RSS (`next build && npm run rss`).
- **`npm run rss`**: Generate `feed.xml`.
- **`npm run deploy`**: Deploy to Cloudflare Pages (Preview).
- **`npm run deploy:prod`**: Deploy to Cloudflare Pages (Production).

### Adding Content
1. Choose the appropriate section (`posts` or `misc`).
2. Create a new `.mdx` file in `app/[section]/_articles/`.
3. Export the required `metadata` object.

## Deployment
- **Platform**: Cloudflare Pages.
- **Build Output**: `dist` directory.
- **Configuration**: `wrangler.toml` and `DEPLOYMENT.md`.
- **CI/CD**: GitHub Actions (`.github/workflows/deploy.yml`) handles auto-deployment on push.

## Key Configuration
- **`next.config.ts`**: Configured for static export (`output: 'export'`), MDX support, and image optimization settings.
- **`tailwind.config.ts`**: Not present (Tailwind v4 uses CSS detection/config). See `app/globals.css`.
- **`tsconfig.json`**: TypeScript configuration with path aliases (e.g., `@/*`).
