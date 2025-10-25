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
  section: 'posts' | 'notes' | 'misc'
}

type TagsClientProps = {
  initialPosts: Post[]
  initialTags: Record<string, number>
}

export function TagsClient({ initialPosts, initialTags }: TagsClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set())

  // Initialize selected tags from URL params
  useEffect(() => {
    const tagParam = searchParams.get('tag')
    if (tagParam) {
      const tags = tagParam.split(',').filter(Boolean)
      setSelectedTags(new Set(tags))
    }
  }, [searchParams])

  const toggleTag = (tag: string) => {
    const newSelected = new Set(selectedTags)
    if (newSelected.has(tag)) {
      newSelected.delete(tag)
    } else {
      newSelected.add(tag)
    }
    setSelectedTags(newSelected)
    
    // Update URL
    updateURL(newSelected)
  }

  const clearTags = () => {
    setSelectedTags(new Set())
    router.push('/tags/all', { scroll: false })
  }

  const updateURL = (tags: Set<string>) => {
    if (tags.size === 0) {
      router.push('/tags/all', { scroll: false })
    } else {
      const tagString = Array.from(tags).join(',')
      router.push(`/tags/all?tag=${encodeURIComponent(tagString)}`, { scroll: false })
    }
  }

  const filteredPosts =
    selectedTags.size === 0
      ? initialPosts
      : initialPosts.filter((post) => post.tags.some((tag) => selectedTags.has(tag)))

  return (
    <div className="space-y-14">
      {/* Tags Filter Section */}
      <div>
        <div className="flex items-baseline justify-between mb-7">
          <h1 className="font-semibold text-rurikon-600">Filter by Tags</h1>
          {selectedTags.size > 0 && (
            <button
              onClick={clearTags}
              className="text-xs text-rurikon-400 hover:text-rurikon-600 transition-colors"
            >
              Clear all ({selectedTags.size})
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {Object.entries(initialTags)
            .sort((a, b) => a[0].localeCompare(b[0]))
            .map(([tag, count]) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className="focus:outline-none focus-visible:ring-2 focus-visible:ring-rurikon-400 focus-visible:ring-offset-2 rounded-sm"
              >
                <Tag tag={tag} count={count} active={selectedTags.has(tag)} interactive />
              </button>
            ))}
        </div>
      </div>

      {/* Posts List */}
      <div>
        <h2 className="font-semibold mb-7 text-rurikon-600">
          {selectedTags.size > 0 ? 'Filtered Posts' : 'All Posts'} ({filteredPosts.length})
        </h2>

        {filteredPosts.length === 0 ? (
          <p className="text-rurikon-400">No posts found with the selected tags.</p>
        ) : (
          <ul>
            {filteredPosts.map((post) => (
              <li key={`${post.section}-${post.slug}`} className="font-medium">
                <Link
                  href={`/${post.section}/${post.slug}`}
                  className="group flex gap-1 justify-between items-center"
                  draggable={false}
                >
                  <span className="block text-rurikon-500 group-hover:text-rurikon-700">
                    {post.title}
                  </span>
                  <span className="text-sm dot-leaders flex-1 text-rurikon-100 font-normal group-hover:text-rurikon-500 transition-colors group-hover:transition-none leading-none" />
                  <time className="block text-rurikon-200 tabular-nums font-normal tracking-tighter group-hover:text-rurikon-500 transition-colors group-hover:transition-none self-start">
                    {post.date}
                  </time>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

