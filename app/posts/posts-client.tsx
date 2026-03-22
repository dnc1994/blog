'use client'

import { useState, useEffect, useRef } from 'react'
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

function TagFilterPanel({
  defaultExpanded,
  tags,
  selectedTags,
  onToggleTag,
  onClear,
}: {
  defaultExpanded: boolean
  tags: Record<string, number>
  selectedTags: Set<string>
  onToggleTag: (tag: string) => void
  onClear: () => void
}) {
  const [expanded, setExpanded] = useState(defaultExpanded)

  return (
    <div>
      <div className='flex items-center gap-1.5 mb-3'>
        <button
          onClick={() => setExpanded((v) => !v)}
          className='flex items-center gap-1.5 text-sm text-rurikon-400 hover:text-rurikon-600 transition-colors'
        >
          <span className='text-xs opacity-60'>{expanded ? '▲' : '▼'}</span>
          Filter by tags{selectedTags.size > 0 ? `: ${selectedTags.size} selected` : ''}
        </button>
        {selectedTags.size > 0 && (
          <button
            onClick={onClear}
            className='text-sm text-rurikon-300 hover:text-rurikon-accent transition-colors'
          >
            (clear)
          </button>
        )}
      </div>
      {expanded && (
        <div className='flex flex-wrap gap-2'>
          {Object.entries(tags).map(([tag, count]) => (
            <button
              key={tag}
              onClick={() => onToggleTag(tag)}
              className='focus:outline-none focus-visible:ring-2 focus-visible:ring-rurikon-400 focus-visible:ring-offset-2 rounded-sm'
            >
              <Tag tag={tag} count={count} active={selectedTags.has(tag)} interactive />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export function PostsClient({ posts, tags }: PostsClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set())
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [panelLeft, setPanelLeft] = useState<number | null>(null)

  useEffect(() => {
    const update = () => {
      if (wrapperRef.current) {
        const rect = wrapperRef.current.getBoundingClientRect()
        setPanelLeft(rect.right + 56)
      }
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

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

  const clearTags = () => {
    setSelectedTags(new Set())
    router.push('/posts', { scroll: false })
  }

  const filteredPosts =
    selectedTags.size === 0
      ? posts
      : posts.filter((p) => p.tags.some((t) => selectedTags.has(t)))

  return (
    <div ref={wrapperRef}>
      {/* Collapsible tag filter — mobile and non-xl screens */}
      <div className='xl:hidden mb-6'>
        <TagFilterPanel
          defaultExpanded={false}
          tags={tags}
          selectedTags={selectedTags}
          onToggleTag={toggleTag}
          onClear={clearTags}
        />
      </div>

      {/* Post list — full width */}
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
              <time className='block font-mono text-sm text-rurikon-200 tabular-nums font-normal tracking-tighter group-hover:text-rurikon-500 transition-colors group-hover:transition-none self-start'>
                {post.date}
              </time>
            </Link>
          </li>
        ))}
      </ul>

      {/* Fixed tag panel — xl screens only, positioned just right of article content */}
      <div
        className='hidden xl:block fixed top-14 w-72 max-h-[calc(100vh-7rem)] overflow-y-auto'
        style={{ left: panelLeft !== null ? `${panelLeft}px` : undefined }}
      >
        <TagFilterPanel
          defaultExpanded={true}
          tags={tags}
          selectedTags={selectedTags}
          onToggleTag={toggleTag}
          onClear={clearTags}
        />
      </div>
    </div>
  )
}
