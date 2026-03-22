'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Tag } from '@/components/tag'

type Post = {
  slug: string
  title: string
  date: string
  tags: string[]
}

type PostsClientProps = {
  posts: Post[]
  tags: Record<string, number>
}

export function PostsClient({ posts, tags }: PostsClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set())

  useEffect(() => {
    const tagParam = searchParams.get('tag')
    if (tagParam) {
      setSelectedTags(new Set(tagParam.split(',').filter(Boolean)))
    } else {
      setSelectedTags(new Set())
    }
  }, [searchParams])

  const toggleTag = (tag: string) => {
    const next = new Set(selectedTags)
    if (next.has(tag)) {
      next.delete(tag)
    } else {
      next.add(tag)
    }
    setSelectedTags(next)
    if (next.size === 0) {
      router.push('/posts', { scroll: false })
    } else {
      router.push(`/posts?tag=${encodeURIComponent(Array.from(next).join(','))}`, { scroll: false })
    }
  }

  const filteredPosts =
    selectedTags.size === 0
      ? posts
      : posts.filter((p) => p.tags.some((t) => selectedTags.has(t)))

  return (
    <div>
      <div className='flex flex-wrap gap-2 mb-7 items-center'>
        {Object.entries(tags).map(([tag, count]) => (
          <button
            key={tag}
            onClick={() => toggleTag(tag)}
            className='focus:outline-none focus-visible:ring-2 focus-visible:ring-rurikon-400 focus-visible:ring-offset-2 rounded-sm'
          >
            <Tag tag={tag} count={count} active={selectedTags.has(tag)} interactive />
          </button>
        ))}
        {selectedTags.size > 0 && (
          <button
            onClick={() => { setSelectedTags(new Set()); router.push('/posts', { scroll: false }) }}
            className='text-xs text-rurikon-400 hover:text-rurikon-accent transition-colors'
          >
            clear
          </button>
        )}
      </div>

      <ul>
        {filteredPosts.map((post) => (
          <li key={post.slug} className='font-medium'>
            <Link
              href={`/posts/${post.slug}`}
              className='group flex gap-1 justify-between items-center'
              draggable={false}
            >
              <span className='block text-rurikon-500 group-hover:text-rurikon-700'>
                {post.title}
              </span>
              <span className='text-sm dot-leaders flex-1 text-rurikon-100 font-normal group-hover:text-rurikon-500 transition-colors group-hover:transition-none leading-none' />
              <time className='block font-mono text-rurikon-200 tabular-nums font-normal tracking-tighter group-hover:text-rurikon-500 transition-colors group-hover:transition-none self-start'>
                {post.date}
              </time>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
