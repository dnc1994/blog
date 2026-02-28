import cn from 'clsx'
import { Tag } from '@/components/tag'
import { resolveSocialImage } from '@/lib/seo'
import { notFound } from 'next/navigation'
import { LEGACY_NOTE_SLUGS } from '@/lib/legacy-notes'

export default async function Page(props: {
  params: Promise<{
    slug: string
  }>
}) {
  const params = await props.params
  let articleModule
  try {
    articleModule = await import('@/app/posts/_articles/' + `${params.slug}.mdx`)
  } catch {
    notFound()
  }
  const { default: MDXContent, metadata } = articleModule

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
          {metadata.tags.map((tag: string) => (
            <Tag key={tag} tag={tag} href={`/tags/all?tag=${tag}`} />
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
  return LEGACY_NOTE_SLUGS.map((slug) => ({ slug }))
}

export async function generateMetadata(props: {
  params: Promise<{
    slug: string
  }>
}) {
  const params = await props.params
  let metadata
  try {
    metadata = (await import('@/app/posts/_articles/' + `${params.slug}.mdx`))
      .metadata
  } catch {
    return {}
  }
  
  const socialImage = resolveSocialImage(metadata.image, metadata.imageWidth, metadata.imageHeight)
  
  return {
    title: metadata.title,
    description: metadata.description,
    alternates: {
      canonical: `https://linghao.io/posts/${params.slug}`,
    },
    openGraph: {
      title: metadata.title,
      description: metadata.description,
      type: 'article',
      url: `https://linghao.io/notes/${params.slug}`,
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
