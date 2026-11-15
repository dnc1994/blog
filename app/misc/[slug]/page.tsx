import { promises as fs } from 'fs'
import path from 'path'
import cn from 'clsx'
import { Tag } from '@/components/tag'
import { resolveAlternates, resolveSocialImage } from '@/lib/seo'
import { getAllArticles, isHiddenDraft } from '@/lib/articles'
import { DecodeText } from '@/components/decode'

export default async function Page(props: {
  params: Promise<{
    slug: string
  }>
}) {
  const params = await props.params
  const { default: MDXContent, metadata } = await import(
    '../_articles/' + `${params.slug}.mdx`
  )

  return (
    <div
      className={cn(metadata.chinese && 'text-justify font-zh')}
      lang={metadata.chinese ? 'zh-Hans' : 'en'}
    >
      <DecodeText
        as='h1'
        text={metadata.title}
        delay={80}
        hover
        className='mb-8 font-display font-bold text-[2.1rem] sm:text-5xl leading-[1.05] tracking-[-0.025em] text-rurikon-600 text-balance'
      />
      
      {/* Tags */}
      {metadata.tags && metadata.tags.length > 0 && (
        <div className='flex flex-wrap gap-2 mb-7'>
          {metadata.tags.map((tag: string) => (
            <Tag key={tag} tag={tag} href={`/posts?tag=${tag}`} />
          ))}
        </div>
      )}
      
      <div className='[&>*:first-child]:mt-0'>
        <MDXContent />
      </div>
    </div>
  )
}

export async function generateStaticParams() {
  const articles = await fs.readdir(
    path.join(process.cwd(), 'app', 'misc', '_articles')
  )

  const params = []
  for (const name of articles) {
    if (!name.endsWith('.mdx')) continue
    const module = await import('../_articles/' + name)
    if (isHiddenDraft(module.metadata)) continue
    params.push({ slug: name.replace(/\.mdx$/, '') })
  }
  return params
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
  
  const group = metadata.translationId
    ? (await getAllArticles()).filter(
        (a) => a.section === 'misc' && a.translationId === metadata.translationId
      )
    : []

  return {
    title: metadata.title,
    description: metadata.description,
    alternates: resolveAlternates('misc', params.slug, group),
    openGraph: {
      title: metadata.title,
      description: metadata.description,
      type: 'article',
      url: `https://linghao.io/misc/${params.slug}`,
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
