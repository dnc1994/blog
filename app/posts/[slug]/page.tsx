import { promises as fs } from 'fs'
import path from 'path'
import cn from 'clsx'
import { Tag } from '@/components/tag'
import { getAllArticles } from '@/lib/articles'
import { resolveSocialImage } from '@/lib/seo'
import Link from 'next/link'

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

  return (
    <div
      className={cn(metadata.chinese && 'text-justify font-zh')}
      lang={metadata.chinese ? 'zh-Hans' : 'en'}
    >
      <h1 className='text-2xl font-semibold mb-4 text-rurikon-600 text-balance'>
        {metadata.title}
      </h1>

      {/* Meta block: date/time · languages · tags */}
      {(metadata.date || articlesInGroup.length > 1 || metadata.tags?.length > 0) && (
        <div className='mb-7 flex flex-col gap-y-2 text-sm'>
          {/* Line 1: date · reading time · languages */}
          {(metadata.date || articlesInGroup.length > 1) && (
            <div className='flex flex-wrap items-center gap-x-2'>
              {metadata.date && (
                <>
                  <time className='text-rurikon-300'>
                    {new Date(metadata.date.replace(/\./g, '-')).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </time>
                  <span className='text-rurikon-200'>·</span>
                  <span className='text-rurikon-300'>{readingTime} min read</span>
                </>
              )}
              {articlesInGroup.length > 1 && (
                <>
                  {metadata.date && <span className='text-rurikon-200'>·</span>}
                  <span className='text-rurikon-300'>Available in:</span>
                  {articlesInGroup
                    .sort((a, b) => (a.language || '').localeCompare(b.language || ''))
                    .map((article) => {
                      const isCurrent = article.slug === params.slug
                      const lang = article.language || 'en'
                      const langNames: Record<string, string> = { en: 'English', zh: '中文' }
                      const baseClass = 'inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-sm border transition-colors'
                      const label = langNames[lang] || lang
                      const star = article.canonical
                        ? <span className='mr-1 text-[0.65rem]'>★</span>
                        : null
                      return isCurrent ? (
                        <span key={article.slug} className={cn(baseClass, 'bg-rurikon-800 text-white border-rurikon-800')}>
                          {star}{label}
                        </span>
                      ) : (
                        <Link key={article.slug} href={`/posts/${article.slug}`} className={cn(baseClass, 'bg-rurikon-50 text-rurikon-400 border-rurikon-200 hover:border-rurikon-accent hover:text-rurikon-accent')}>
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
              <span className='text-rurikon-300'>Tags:</span>
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
