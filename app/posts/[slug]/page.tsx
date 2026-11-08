import { promises as fs } from 'fs'
import path from 'path'
import cn from 'clsx'
import { Tag } from '@/components/tag'
import { getAllArticles } from '@/lib/articles'
import { resolveSocialImage } from '@/lib/seo'
import Link from 'next/link'
import { TocSidebar, type TocHeading } from '@/components/toc-sidebar'
import { MusicPlayer } from '@/components/music-player'
import { DecodeText } from '@/components/decode'
import { toHex } from '@/lib/dump'

function extractHeadings(mdxContent: string): TocHeading[] {
  const headings: TocHeading[] = []
  for (const line of mdxContent.split('\n')) {
    const match = line.match(/^(#{2,4}) (.+)$/)
    if (!match) continue
    const level = match[1].length
    const raw = match[2].trim()
    // Strip markdown formatting
    const text = raw
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/[*_`]/g, '')
      .trim()
    // Replicate github-slugger (used by rehype-slug)
    const id = text
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .trim()
      .replace(/\s+/g, '-')
    headings.push({ id, text, level })
  }
  return headings
}

function estimateReadingTime(mdxContent: string): number {
  const text = mdxContent
    .replace(/^export\s+[\s\S]*?^}/gm, '') // export blocks (metadata)
    .replace(/^import\s+.*$/gm, '')         // import statements
    .replace(/```[\s\S]*?```/g, '')          // fenced code blocks
    .replace(/`[^`]+`/g, '')                // inline code
    .replace(/<[^>]+>/g, '')                // JSX/HTML tags
    .replace(/!\[.*?\]\(.*?\)/g, '')        // images
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // links → text
    .replace(/[#*_~]/g, '')                 // markdown syntax chars
  // CJK characters are counted individually (~300 chars/min)
  const cjkChars = (text.match(/[\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff]/g) || []).length
  // Latin words (~200 words/min)
  const latinWords = text.replace(/[\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff]/g, '').split(/\s+/).filter((w) => w.length > 0).length
  const minutes = cjkChars / 300 + latinWords / 200
  return Math.max(1, Math.round(minutes))
}

export default async function Page(props: {
  params: Promise<{
    slug: string
  }>
}) {
  const params = await props.params
  const { default: MDXContent, metadata } = await import(
    '../_articles/' + `${params.slug}.mdx`
  )

  const allArticles = await getAllArticles()
  const articlesInGroup = metadata.translationId
    ? allArticles.filter((p) => p.translationId === metadata.translationId)
    : []
  const translations = articlesInGroup.filter((p) => p.slug !== params.slug)

  const mdxRaw = await fs.readFile(
    path.join(process.cwd(), 'app/posts/_articles', `${params.slug}.mdx`),
    'utf-8'
  )
  const readingTime = estimateReadingTime(mdxRaw)
  const headings = extractHeadings(mdxRaw)

  return (
    <div
      className={cn(metadata.chinese && 'text-justify font-zh')}
      lang={metadata.chinese ? 'zh-Hans' : 'en'}
    >
      <p className='mb-4 font-mono text-xs tracking-[0.2em] text-rurikon-signal uppercase'>
        {metadata.date ? `Entry · ${metadata.date}` : 'Entry'}
        {' · '}
        {readingTime} min read
      </p>
      <DecodeText
        as='h1'
        text={metadata.title}
        delay={80}
        duration={600 + metadata.title.length * 10}
        hover
        className='font-display font-bold text-[2.1rem] sm:text-5xl leading-[1.05] tracking-[-0.025em] text-rurikon-600 text-balance'
      />
      <p aria-hidden='true' className='mt-3 mb-6 font-mono text-xs text-rurikon-ghost truncate'>
        {toHex(metadata.title, 24)}
      </p>

      {/* Meta block: date/time · languages · tags */}
      {(articlesInGroup.length > 1 || metadata.tags?.length > 0) && (
        <div className='mb-10 pb-6 border-b border-rurikon-border flex flex-col gap-y-3 font-mono text-xs'>
          {/* Line 1: date · reading time · languages */}
          {articlesInGroup.length > 1 && (
            <div className='flex flex-wrap items-center gap-x-2'>
              {articlesInGroup.length > 1 && (
                <>
                  <span className='text-rurikon-300'>lang:</span>
                  {articlesInGroup
                    .sort((a, b) => (a.language || '').localeCompare(b.language || ''))
                    .map((article) => {
                      const isCurrent = article.slug === params.slug
                      const lang = article.language || 'en'
                      const langNames: Record<string, string> = { en: 'English', zh: '中文' }
                      const baseClass = 'inline-flex items-center px-2 py-0.5 font-mono text-xs border transition-colors'
                      const label = langNames[lang] || lang
                      const star = article.canonical
                        ? <span className='mr-1 text-[0.65rem]'>★</span>
                        : null
                      return isCurrent ? (
                        <span key={article.slug} className={cn(baseClass, 'bg-rurikon-accent text-[var(--background)] border-rurikon-accent')}>
                          {star}{label}
                        </span>
                      ) : (
                        <Link key={article.slug} href={`/posts/${article.slug}`} className={cn(baseClass, 'text-rurikon-400 border-rurikon-200 hover:border-rurikon-accent hover:text-rurikon-accent')}>
                          {star}{label}
                        </Link>
                      )
                    })}
                </>
              )}
            </div>
          )}

          {/* Line 2: tags */}
          {metadata.tags?.length > 0 && (
            <div className='flex flex-wrap items-center gap-x-2'>
              <span className='text-rurikon-300'>tags:</span>
              {metadata.tags.map((tag: string) => (
                <Tag key={tag} tag={tag} href={`/posts?tag=${tag}`} />
              ))}
            </div>
          )}
        </div>
      )}

      <div className='[&>*:first-child]:mt-0'>
        <MDXContent />
      </div>

      <TocSidebar headings={headings} defaultOpen={!!metadata.toc} />

      {metadata.music?.youtube && (
        <MusicPlayer
          videoId={metadata.music.youtube}
          title={metadata.music.title}
          artist={metadata.music.artist}
        />
      )}
    </div>
  )
}

export async function generateStaticParams() {
  const allArticles = await getAllArticles()
  const postArticles = allArticles.filter(article => article.section === 'posts');

  return postArticles.map((article) => ({
    slug: article.slug,
  }))
}

export async function generateMetadata(props: {
  params: Promise<{
    slug: string
  }>
}) {
  const params = await props.params
  const metadata = (await import('../_articles/' + `${params.slug}.mdx`))
    .metadata
  
  const socialImage = resolveSocialImage(metadata.image, metadata.imageWidth, metadata.imageHeight)
  
  return {
    title: metadata.title,
    description: metadata.description,
    openGraph: {
      title: metadata.title,
      description: metadata.description,
      type: 'article',
      url: `https://linghao.io/posts/${params.slug}`,
      images: socialImage ? [socialImage] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: metadata.title,
      description: metadata.description,
      images: socialImage ? [socialImage.url] : undefined,
    },
  }
}
