import { Suspense } from 'react'
import { getDedupedArticlesFromSection } from '@/lib/articles'
import { getBooks } from '@/lib/books'
import { toDumpEntries } from '@/lib/dump'
import { PostsClient } from './posts-client'

export const metadata = {
  title: 'Posts',
}

export default async function Page() {
  const posts = toDumpEntries(await getDedupedArticlesFromSection('posts'))
  // Post lengths, for the book-cover view.
  const words = Object.fromEntries((await getBooks()).map((b) => [b.slug, b.words]))

  const tagCounts: Record<string, number> = {}
  for (const post of posts) {
    for (const tag of post.tags) {
      tagCounts[tag] = (tagCounts[tag] ?? 0) + 1
    }
  }
  const tags = Object.fromEntries(
    Object.entries(tagCounts).sort(([, a], [, b]) => b - a)
  )

  return (
    <Suspense fallback={null}>
      <PostsClient posts={posts} tags={tags} words={words} />
    </Suspense>
  )
}
