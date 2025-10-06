import { promises as fs } from 'fs'
import path from 'path'
import cn from 'clsx'
import { Tag } from '@/components/tag'

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
      <h1 className='font-semibold mb-7 text-rurikon-600 text-balance'>
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
  const articles = await fs.readdir(
    path.join(process.cwd(), 'app', 'posts', '_articles')
  )

  return articles
    .filter((name) => name.endsWith('.mdx'))
    .map((name) => ({
      slug: name.replace(/\.mdx$/, ''),
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

