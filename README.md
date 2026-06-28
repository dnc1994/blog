# Synthesist in the Shell

A blog by Linghao Zhang, built with Next.js 15 and modern web technologies.

## Tech Stack

- **Framework**: Next.js 15 (App Directory, Static Export)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Content**: MDX for rich content
- **Syntax Highlighting**: Shiki
- **Math**: KaTeX
- **Fonts**: Inter Variable, Lora Italic Variable, Iosevka Fixed Curly
- **Deployment**: Cloudflare Pages

## Features

- ✨ Modern, clean design with smooth view transitions
- 📱 Fully responsive layout
- 🎨 Custom typography with variable fonts
- 🌈 Flexoki-inspired color scheme (warm cream, near-black text, teal accents)
- 📝 MDX support for rich content
- 🔍 Syntax highlighting for code blocks
- 🧮 Math rendering support
- 🏷️ Tag system with filtering
- 🧩 Projects page with SVG logos
- 📸 Photography gallery with lightbox
- 📡 Auto-generated RSS feed
- 🗂️ Toggleable table of contents sidebar for long posts
- ⚓ Anchor links on all headings
- 🌐 Multilingual article support with language switcher
- ⚡ Optimized static site with CDN delivery

## Getting Started

### Prerequisites

- Node.js 18.18 or later
- npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the blog.

### Build

```bash
npm run build
```

The build outputs to the `dist/` directory and includes:
- Static HTML/CSS/JS files
- Auto-generated RSS feed at `/feed.xml`

### Additional Commands

```bash
# Generate RSS feed only
npm run rss

# Deploy to Cloudflare Pages (preview)
npm run deploy

# Deploy to Cloudflare Pages (production)
npm run deploy:prod

# Lint code
npm run lint
```

## Project Structure

```
.
├── app/                     # Next.js app directory
│   ├── _fonts/             # Custom font files
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   ├── page.mdx            # Home page
│   ├── posts/              # Blog posts
│   │   ├── page.tsx        # Posts index
│   │   ├── [slug]/         # Dynamic post pages
│   │   └── _articles/      # Post content (MDX)
│   ├── notes/              # Legacy URL compatibility routes (redirect/alias to posts)
│   │   ├── page.tsx        # Legacy notes index
│   │   └── [slug]/         # Legacy note URLs
│   ├── misc/               # Miscellaneous articles
│   │   ├── page.tsx        # Misc index
│   │   ├── [slug]/         # Dynamic misc pages
│   │   └── _articles/      # Misc content (MDX)
│   ├── gallery/            # Photography gallery
│   │   ├── page.tsx        # Gallery page
│   │   ├── gallery-grid.tsx # Lightbox component
│   │   └── data.ts         # Photo data
│   ├── lists/              # Curation lists
│   │   ├── page.tsx        # Lists hub
│   │   └── [slug]/         # Individual list pages
│   ├── projects/           # Projects page
│   │   ├── page.tsx        # Projects page
│   │   ├── data.tsx        # Project metadata
│   │   └── logos.tsx       # Project SVG logos
│   ├── resume/             # Public resume at /resume
│   │   ├── source.ts       # Resume content source of truth
│   │   └── page.tsx        # Resume HTML renderer
│   └── tags/               # Tag system
│       └── all/            # Tag filtering page
├── components/             # React components
│   ├── navbar.tsx          # Navigation
│   ├── tag.tsx             # Tag component
│   ├── toc-sidebar.tsx     # Table of contents sidebar
│   └── ...                 # Other components
├── lib/                    # Utilities
│   ├── articles.ts         # Content loading
│   ├── seo.ts              # OG/social image resolution
│   └── tags.ts             # Tag management
├── scripts/                # Build scripts
│   └── generate-rss.mjs    # RSS generation
├── public/                 # Static assets
├── dist/                   # Build output
├── mdx-components.tsx      # MDX component config
├── next.config.ts          # Next.js config
├── wrangler.toml           # Cloudflare config
```

## Content Management

### Adding a New Post

1. Create a new `.mdx` file in `app/posts/_articles/`
2. Add metadata at the top:

```mdx
export const metadata = {
  title: 'Your Post Title',
  description: 'A brief description',
  date: '2025.01.01',
  tags: ['Tag1', 'Tag2'],

  // Optional: show a table of contents sidebar (default open)
  toc: true,

  // Optional: OG/social card image (hosted on Cloudflare R2 or any public URL)
  image: 'https://r2.linghao.io/blog-assets/your-image.png',
  imageWidth: 1200,
  imageHeight: 630,

  // Optional: multilingual linking (see Multilingual Support below)
  language: 'en',
  translationId: 'shared-slug',
  canonical: true,
}

Your content here...
```

3. The post will automatically:
   - Appear in the posts index
   - Be included in RSS feed
   - Be filterable by tags
   - Get a URL like `/posts/your-post-title`
   - Have anchor links on all headings (`#heading-slug`)

### Table of Contents

Any post with two or more headings gets a toggleable TOC sidebar. A small icon button appears on the right side of the viewport; clicking it opens a panel listing all headings (h2–h4) with hierarchical numbering and active-heading highlighting as you scroll.

By default the sidebar is **closed**. Set `toc: true` in the article metadata to have it open automatically — useful for long reference posts.

### Multilingual Support

Articles sharing a `translationId` are grouped as translations of each other. The article page shows a language switcher between them. Only the `canonical: true` version appears in index pages and tag pages.

```mdx
export const metadata = {
  title: 'My Post',
  language: 'en',
  translationId: 'my-post',
  canonical: true,
}
```

### Content Sections

- **Posts** (`app/posts/_articles/`) - Blog posts and reading notes
- **Misc** (`app/misc/_articles/`) - Miscellaneous content

Legacy `/notes/*` URLs are still supported for backward compatibility, but new content should be added under `posts`.

### Resume Page

The public resume is available at `/resume`. Its content source is `app/resume/source.ts`, and the rendered HTML page is `app/resume/page.tsx`. Update content in `source.ts`; only edit `page.tsx` for layout/styling changes. See `docs/resume.md` for the full update workflow.

### Gallery

The gallery feature displays a collection of photography. Photos are managed in `app/gallery/data.ts`.

To add a new photo:
1. Upload the image to a hosting service (e.g., Cloudflare R2).
2. Add a new object to the `photos` array in `app/gallery/data.ts`:

```typescript
{
  id: 'unique-id',
  src: 'https://your-image-url.jpg',
  alt: 'Description for accessibility',
  caption: 'Optional caption text',
  metadata: {
    'Location': 'Kyoto, Japan',
    'Date': '2024-10-28',
    'Camera': 'Sony α7C II',
  }
}
```

### Using Components

MDX files can use React components:

```mdx
<Card
  image="https://example.com/image.jpg"
  title="Card Title"
  desc="Description"
  link="https://example.com"
/>

<BlockSideTitle title="Side note text">
  Main content here
</BlockSideTitle>
```

## Customization

### Colors

The blog uses the "rurikon" color palette defined in `app/globals.css`, mapped to [Flexoki](https://stephango.com/flexoki) values. Customize colors by modifying the `@theme` section. See [`docs/visual-style.md`](./docs/visual-style.md) for the full palette reference.

### Fonts

Fonts are loaded locally via `next/font/local` in `app/layout.tsx` and exposed as CSS variables:

- `--sans`: Inter Variable (body text, headings, UI elements — used everywhere)
- `--serif`: Lora Italic Variable (navigation elements via global `nav {}` rule)
- `--mono`: Iosevka Fixed Curly (code blocks and inline code)

### Navigation

Edit `components/navbar.tsx` to modify navigation links.

## Deployment

```bash
# Deploy to preview
npm run deploy

# Deploy to production
npm run deploy:prod
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed setup instructions.

## Tag System

### Using Tags

Add tags to any article's metadata:

```mdx
export const metadata = {
  title: 'My Post',
  tags: ['JavaScript', 'React', 'Web Development'],
}
```

### Viewing Tags

- Browse all tags: `/tags/all`
- Filter by tags: `/tags/all?tag=JavaScript`
- Click tags on articles to filter

## RSS Feed

The RSS feed is automatically generated on every build:

- **Feed URL**: `https://linghao.io/feed.xml`
- **Includes**: All posts and misc articles
- **Updates**: Automatic on deployment
- **Manual generation**: `npm run rss`

## License

MIT

## Acknowledgments

This blog is inspired by [Shu Ding's blog](https://shud.in/).
