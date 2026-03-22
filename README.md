# Synthesist in the Shell

A blog by Linghao Zhang, built with Next.js 15 and modern web technologies.

## Tech Stack

- **Framework**: Next.js 15 (App Directory, Static Export)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4.0 beta
- **Content**: MDX for rich content
- **Syntax Highlighting**: Shiki
- **Math**: KaTeX
- **Fonts**: Inter Variable, Lora Italic Variable, Iosevka Fixed Curly
- **Deployment**: Cloudflare Pages
- **CI/CD**: GitHub Actions

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
- ⚡ Optimized static site with CDN delivery
- 🚀 Automated deployments

## Getting Started

### Prerequisites

- Node.js 16 or later
- pnpm, yarn, or npm

### Installation

```bash
# Install dependencies
pnpm install
# or
yarn install
# or
npm install
```

### Development

```bash
# Run development server
pnpm dev
# or
yarn dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the blog.

### Build

```bash
# Build for production (includes RSS generation)
npm run build
```

The build outputs to the `dist/` directory and includes:
- Static HTML/CSS/JS files
- Auto-generated RSS feed at `/feed.xml`
- Optimized images and assets

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
│   ├── projects/           # Projects page
│   │   ├── page.tsx        # Projects page
│   │   ├── data.tsx        # Project metadata
│   │   └── logos.tsx       # Project SVG logos
│   └── tags/               # Tag system
│       └── all/            # Tag filtering page
├── components/             # React components
│   ├── navbar.tsx          # Navigation
│   ├── tag.tsx             # Tag component
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

All content is written in MDX format, combining Markdown with React components.

### Adding a New Post

1. Create a new `.mdx` file in `app/posts/_articles/`
2. Add metadata at the top:

```mdx
export const metadata = {
  title: 'Your Post Title',
  description: 'A brief description',
  date: '2025.01.01',
  tags: ['Tag1', 'Tag2'],
  // Optional: OG/social card image (hosted on Cloudflare R2 or any public URL)
  image: 'https://r2.linghao.io/blog-assets/your-image.png',
  // Optional: override default OG image dimensions (defaults to 1200×630)
  imageWidth: 1200,
  imageHeight: 630,
}

Your content here...
```

3. The post will automatically:
   - Appear in the posts index
   - Be included in RSS feed
   - Be filterable by tags
   - Get a URL like `/posts/your-post-title`

### Content Sections

- **Posts** (`app/posts/_articles/`) - Blog posts and reading notes
- **Misc** (`app/misc/_articles/`) - Miscellaneous content

Legacy `/notes/*` URLs are still supported for backward compatibility, but new content should be added under `posts`.

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

- `--sans`: Inter Variable (body text, headings, blockquotes, nav — used everywhere)
- `--serif`: Lora Italic Variable (loaded but not actively applied)
- `--mono`: Iosevka Fixed Curly (code blocks and inline code)

### Navigation

Edit `components/navbar.tsx` to modify navigation links.

## Deployment

The blog uses automated CI/CD with GitHub Actions and Cloudflare Pages.

### Quick Deploy

```bash
# Deploy to preview
npm run deploy

# Deploy to production
npm run deploy:prod
```

### Automatic Deployments

Deployment is currently script-driven (`npm run deploy`, `npm run deploy:prod`).
If CI branch automation is added, document branch mappings here.

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
