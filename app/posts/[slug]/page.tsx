import { promises as fs } from 'fs'
import path from 'path'
import cn from 'clsx'
import { Tag } from '@/components/tag'
import { getAllArticles } from '@/lib/articles'
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
      <h1 className='text-2xl font-semibold mb-7 text-rurikon-600 text-balance'>
        {metadata.title}
      </h1>
      
      {/* Tags */}
      {metadata.tags && metadata.tags.length > 0 && (
        <div className='flex flex-wrap gap-2 mb-7'>
          <span className="text-sm text-rurikon-400">Tags:</span>
          {metadata.tags.map((tag: string) => (
            <Tag key={tag} tag={tag} href={`/tags/all?tag=${tag}`} />
          ))}
        </div>
      )}

      {/* Language Switcher */}
      {articlesInGroup.length > 1 &&
        (() => {
          const langNames: { [key: string]: string } = {
            en: 'English',
            zh: '中文',
          }
          const tagBaseClass =
            'inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium rounded-sm border transition-colors'
          const activeTagClass = 'bg-rurikon-800 text-white border-rurikon-800'
          const inactiveTagClass =
            'bg-white text-rurikon-400 border-rurikon-200 hover:border-rurikon-400 hover:text-rurikon-600'

          return (
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-7">
              <span className="text-sm text-rurikon-400">Read in:</span>
              {articlesInGroup
                .sort((a, b) => (a.language || '').localeCompare(b.language || ''))
                .map((article) => {
                  const isCurrent = article.slug === params.slug
                  const lang = article.language || 'en'
                  if (isCurrent) {
                    return (
                      <span
                        key={article.slug}
                        className={cn(tagBaseClass, activeTagClass)}
                      >
                        {langNames[lang] || lang}
                      </span>
                    )
                  } else {
                    return (
                      <Link
                        key={article.slug}
                        href={`/posts/${article.slug}`}
                        className={cn(tagBaseClass, inactiveTagClass)}
                      >
                        {langNames[lang] || lang}
                      </Link>
                    )
                  }
                })}
            </div>
          )
        })()}

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
  return {
    title: metadata.title,
    description: metadata.description,
  }
}

