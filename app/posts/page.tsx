import { Suspense } from 'react'
import { getDedupedArticlesFromSection } from '@/lib/articles'
import { PostsClient } from './posts-client'

export const metadata = {
  title: 'Posts',
}

export default async function Page() {
  const posts = (await getDedupedArticlesFromSection('posts'))
    .map((item) => ({
      slug: item.slug,
      title: item.title ?? '',
      date: item.date ?? '',
      tags: item.tags ?? [],
    }))
    .sort((a, b) => {
      const da = Number(a.date.replaceAll('.', '').replaceAll('-', '') || 0)
      const db = Number(b.date.replaceAll('.', '').replaceAll('-', '') || 0)
      return db - da
    })

  const tagCounts: Record<string, number> = {}
  for (const post of posts) {
    for (const tag of post.tags) {
      tagCounts[tag] = (tagCounts[tag] ?? 0) + 1
    }
  }
  const tags = Object.fromEntries(
    Object.entries(tagCounts).sort(([a], [b]) => a.localeCompare(b))
  )

  return (
    <Suspense fallback={null}>
      <PostsClient posts={posts} tags={tags} />
    </Suspense>
  )
}
