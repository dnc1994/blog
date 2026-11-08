'use client'

import cn from 'clsx'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { DumpList, type DumpItem } from '@/components/dump-list'
import type { DumpEntry } from '@/lib/dump'

type PostsClientProps = {
  posts: DumpEntry[]
  tags: Record<string, number>
}

function withYearMarkers(posts: DumpEntry[]): DumpItem[] {
  const out: DumpItem[] = []
  let year = ''
  for (const p of posts) {
    const y = p.date.slice(0, 4)
    if (y && y !== year) {
      year = y
      out.push({ year: y })
    }
    out.push(p)
  }
  return out
}

export function PostsClient({ posts, tags }: PostsClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set())

  useEffect(() => {
    const tagParam = searchParams.get('tag')
    setSelectedTags(new Set(tagParam ? tagParam.split(',').filter(Boolean) : []))
  }, [searchParams])

  const update = (next: Set<string>) => {
    setSelectedTags(next)
    router.push(
      next.size === 0
        ? '/posts'
        : `/posts?tag=${encodeURIComponent(Array.from(next).join(','))}`,
      { scroll: false }
    )
  }

  const toggleTag = (tag: string) => {
    const next = new Set(selectedTags)
    if (next.has(tag)) next.delete(tag)
    else next.add(tag)
    update(next)
  }

  const filtered =
    selectedTags.size === 0
      ? posts
      : posts.filter((p) => p.tags.some((t) => selectedTags.has(t)))

  const grep =
    selectedTags.size === 0
      ? ''
      : ` | grep -E "${Array.from(selectedTags).join('|')}"`

  return (
    <div>
      <p className='font-mono text-xs sm:text-[13px] tracking-[0.24em] text-rurikon-signal'>
        FULL DUMP · {posts.length} ENTRIES
      </p>
      <h1 className='mt-3 font-display font-bold text-5xl sm:text-6xl tracking-[-0.03em] text-rurikon-600'>
        Posts
      </h1>

      <div className='mt-8 mb-6'>
        <p className='mb-3 font-mono text-[13px] text-rurikon-300 break-all'>
          $ xxd ~/writing{grep}
        </p>
        <div className='flex flex-wrap gap-2' role='group' aria-label='Filter by tag'>
          <button
            type='button'
            onClick={() => update(new Set())}
            aria-pressed={selectedTags.size === 0}
            className={cn(
              'px-2.5 py-1.5 font-mono text-xs border transition-colors',
              selectedTags.size === 0
                ? 'bg-rurikon-accent border-rurikon-accent text-[var(--background)]'
                : 'border-rurikon-200 text-rurikon-400 hover:border-rurikon-accent hover:text-rurikon-accent'
            )}
          >
            ALL · {posts.length}
          </button>
          {Object.entries(tags).map(([tag, count]) => {
            const active = selectedTags.has(tag)
            return (
              <button
                key={tag}
                type='button'
                onClick={() => toggleTag(tag)}
                aria-pressed={active}
                className={cn(
                  'px-2.5 py-1.5 font-mono text-xs border transition-colors',
                  active
                    ? 'bg-rurikon-accent border-rurikon-accent text-[var(--background)]'
                    : 'border-rurikon-200 text-rurikon-400 hover:border-rurikon-accent hover:text-rurikon-accent'
                )}
              >
                {tag.toUpperCase()} · {count}
              </button>
            )
          })}
        </div>
      </div>

      <DumpList
        key={Array.from(selectedTags).join(',')}
        items={withYearMarkers(filtered)}
        animateFirst={14}
        footer={
          <span>
            -- {filtered.length} of {posts.length} entries --
            <span aria-hidden='true' className='cursor-blink text-rurikon-accent'> █</span>
          </span>
        }
      />
    </div>
  )
}
