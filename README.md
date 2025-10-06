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
- 🌈 Elegant color scheme (rurikon palette)
- 📝 MDX support for rich content
- 🔍 Syntax highlighting for code blocks
- 🧮 Math rendering support
- 🏷️ Tag system with filtering
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
│   ├── notes/              # Reading notes
│   │   ├── page.tsx        # Notes index
│   │   ├── [slug]/         # Dynamic note pages
│   │   └── _articles/      # Note content (MDX)
│   ├── misc/               # Miscellaneous articles
│   │   ├── page.tsx        # Misc index
│   │   ├── [slug]/         # Dynamic misc pages
│   │   └── _articles/      # Misc content (MDX)
│   └── tags/               # Tag system
│       └── all/            # Tag filtering page
├── components/             # React components
│   ├── navbar.tsx          # Navigation
│   ├── tag.tsx             # Tag component
│   └── ...                 # Other components
├── lib/                    # Utilities
│   └── tags.ts             # Tag management
├── scripts/                # Build scripts
│   └── generate-rss.mjs    # RSS generation
├── public/                 # Static assets
├── dist/                   # Build output
├── mdx-components.tsx      # MDX component config
├── next.config.ts          # Next.js config
├── wrangler.toml           # Cloudflare config
└── .github/workflows/      # CI/CD pipelines
    └── deploy.yml          # Deployment workflow
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
}

Your content here...
```

3. The post will automatically:
   - Appear in the posts index
   - Be included in RSS feed
   - Be filterable by tags
   - Get a URL like `/posts/your-post-title`

### Content Sections

- **Posts** (`app/posts/_articles/`) - Blog posts and articles
- **Notes** (`app/notes/_articles/`) - Reading notes and summaries
- **Misc** (`app/misc/_articles/`) - Miscellaneous content

All sections follow the same structure and metadata format.

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

The blog uses the "rurikon" color palette defined in `app/globals.css`. Customize colors by modifying the `@theme` section.

### Fonts

Custom fonts are loaded from `app/_fonts/`. To change fonts, replace the font files and update `app/layout.tsx`.

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

- Push to `v2` branch → Preview deployment
- Push to `main` branch → Production deployment

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
- **Includes**: All posts, notes, and misc articles
- **Updates**: Automatic on deployment
- **Manual generation**: `npm run rss`

## License

MIT

## Acknowledgments

This blog is inspired by [Shu Ding's blog](https://shud.in/).
