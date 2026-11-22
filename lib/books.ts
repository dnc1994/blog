import { promises as fs } from 'fs'
import path from 'path'
import { getDedupedArticlesFromSection } from '@/lib/articles'

export type Book = {
  slug: string
  href: string
  title: string
  date: string
  tags: string[]
  /** Latin words + CJK characters in the post body. */
  words: number
}

const CJK = /[㐀-鿿豈-﫿぀-ヿ]/g

/** Rough reading length of an MDX file: prose only, no metadata/code/markup. */
function countWords(source: string): number {
  const body = source
    .replace(/export const metadata = \{[\s\S]*?\n\}\n/, '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/^(import|export) .*$/gm, ' ')
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, ' ')
  const cjk = body.match(CJK)?.length ?? 0
  const latin = body.replace(CJK, ' ').match(/[A-Za-z0-9][A-Za-z0-9'’-]*/g)?.length ?? 0
  return cjk + latin
}

/** Every listed post (drafts and non-canonical translations excluded), newest first. */
export async function getBooks(): Promise<Book[]> {
  const posts = await getDedupedArticlesFromSection('posts')
  const dir = path.join(process.cwd(), 'app', 'posts', '_articles')
  const books = await Promise.all(
    posts.map(async (p) => ({
      slug: p.slug,
      href: `/posts/${p.slug}`,
      title: p.title,
      date: p.date,
      tags: p.tags,
      words: countWords(await fs.readFile(path.join(dir, `${p.slug}.mdx`), 'utf8')),
    }))
  )
  const key = (d: string) => Number(d.replace(/[.-]/g, '') || 0)
  return books.sort((a, b) => key(b.date) - key(a.date))
}
