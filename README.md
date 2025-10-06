# Synthesist in the Shell

A blog by Linghao Zhang, built with Next.js 15 and modern web technologies.

## Tech Stack

- **Framework**: Next.js 15 (App Directory)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4.0 beta
- **Content**: MDX for rich content
- **Syntax Highlighting**: Shiki
- **Math**: KaTeX
- **Fonts**: Inter Variable, Lora Italic Variable, Iosevka Fixed Curly
- **Analytics**: Vercel Analytics

## Features

- ✨ Modern, clean design with smooth view transitions
- 📱 Fully responsive layout
- 🎨 Custom typography with variable fonts
- 🌈 Elegant color scheme (rurikon palette)
- 📝 MDX support for rich content
- 🔍 Syntax highlighting for code blocks
- 🧮 Math rendering support
- ⚡ Optimized performance with Next.js 15

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
# Build for production
pnpm build
# or
yarn build
# or
npm run build
```

### Start Production Server

```bash
# Start production server
pnpm start
# or
yarn start
# or
npm start
```

## Project Structure

```
.
├── app/                    # Next.js app directory
│   ├── _fonts/            # Custom font files
│   ├── layout.tsx         # Root layout with navigation
│   ├── page.mdx           # Home page
│   ├── posts/             # Blog posts
│   ├── notes/             # Reading notes
│   ├── misc/              # Miscellaneous articles
│   └── tags/              # Tag pages
├── components/            # React components
│   ├── navbar.tsx         # Navigation component
│   ├── block-sidetitle.tsx # Side note component
│   └── tweet-card.tsx     # Card component
├── public/                # Static assets
├── mdx-components.tsx     # MDX component mappings
└── next.config.ts         # Next.js configuration
```

## Content

All content is written in MDX format, combining Markdown with React components.

### Adding a New Post

1. Create a new `.mdx` file in `app/posts/`
2. Add metadata at the top:

```mdx
export const metadata = {
  title: 'Your Post Title',
  description: 'A brief description',
}

# Your Post Title

Your content here...
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

The blog uses the "rurikon" color palette defined in `app/globals.css`. Customize colors by modifying the `@theme` section.

### Fonts

Custom fonts are loaded from `app/_fonts/`. To change fonts, replace the font files and update `app/layout.tsx`.

### Navigation

Edit `components/navbar.tsx` to modify navigation links.

## License

MIT

## Acknowledgments

This blog is based on a [template](https://github.com/shuding/blog-template) by [Shu Ding](https://shud.in/).
