import { promises as fs } from 'fs'
import path from 'path'
import cn from 'clsx'
import { Tag } from '@/components/tag'
import { getAllArticles } from '@/lib/articles'
import { resolveSocialImage } from '@/lib/seo'
import Link from 'next/link'

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

  return (
    <div
      className={cn(metadata.chinese && 'text-justify font-zh')}
      lang={metadata.chinese ? 'zh-Hans' : 'en'}
    >
      <h1 className='text-2xl font-semibold mb-4 text-rurikon-600 text-balance'>
        {metadata.title}
      </h1>

      {/* Meta row: date · tags · language switcher */}
      {(metadata.date || (metadata.tags?.length > 0) || articlesInGroup.length > 1) && (
        <div className='flex flex-wrap items-center gap-x-2 gap-y-1 mb-7 text-sm'>
          {metadata.date && (
            <time className='font-mono text-rurikon-300 tabular-nums tracking-tighter'>
              {metadata.date}
            </time>
          )}
          {metadata.date && metadata.tags?.length > 0 && (
            <span className='text-rurikon-200'>·</span>
          )}
          {metadata.tags?.map((tag: string) => (
            <Tag key={tag} tag={tag} href={`/posts?tag=${tag}`} />
          ))}
          {articlesInGroup.length > 1 && (
            <>
              <span className='text-rurikon-200'>·</span>
              {articlesInGroup
                .sort((a, b) => (a.language || '').localeCompare(b.language || ''))
                .map((article) => {
                  const isCurrent = article.slug === params.slug
                  const lang = article.language || 'en'
                  const langNames: Record<string, string> = { en: 'English', zh: '中文' }
                  const baseClass = 'inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-sm border transition-colors'
                  return isCurrent ? (
                    <span key={article.slug} className={cn(baseClass, 'bg-rurikon-800 text-white border-rurikon-800')}>
                      {langNames[lang] || lang}
                    </span>
                  ) : (
                    <Link key={article.slug} href={`/posts/${article.slug}`} className={cn(baseClass, 'bg-rurikon-50 text-rurikon-400 border-rurikon-200 hover:border-rurikon-accent hover:text-rurikon-accent')}>
                      {langNames[lang] || lang}
                    </Link>
                  )
                })}
            </>
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
