import { Suspense } from 'react'
import { getAllPostsWithTags, getAllTags } from '@/lib/tags'
import { TagsClient } from './tags-client'

export const metadata = {
  title: 'Tags',
}

export default async function AllTagsPage() {
  const allPosts = await getAllPostsWithTags()
  const tagsMap = await getAllTags()
  const allTags = Object.fromEntries(tagsMap)

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TagsClient initialPosts={allPosts} initialTags={allTags} />
    </Suspense>
  )
}

