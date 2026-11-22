'use client'

import cn from 'clsx'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { DumpList, type DumpItem } from '@/components/dump-list'
import { BOOK_MODES, BooksView, type BookMode } from '@/components/books-view'
import type { DumpEntry } from '@/lib/dump'

type PostsClientProps = {
  posts: DumpEntry[]
  tags: Record<string, number>
  /** Post length by slug, for the book-cover view. */
  words: Record<string, number>
}

type View = 'dump' | 'books'

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

const chip = (active: boolean) =>
  cn(
    'px-2.5 py-1.5 font-mono text-xs border transition-colors',
    active
      ? 'bg-rurikon-accent border-rurikon-accent text-[var(--background)]'
      : 'border-rurikon-200 text-rurikon-400 hover:border-rurikon-accent hover:text-rurikon-accent'
  )

export function PostsClient({ posts, tags, words }: PostsClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set())
  const [view, setView] = useState<View>('dump')
  const [mode, setMode] = useState<BookMode>('same')

  // The URL is the source of truth for the tag filter and the view.
  useEffect(() => {
    const tagParam = searchParams.get('tag')
    setSelectedTags(new Set(tagParam ? tagParam.split(',').filter(Boolean) : []))
    setView(searchParams.get('view') === 'books' ? 'books' : 'dump')
  }, [searchParams])

  const update = (nextTags: Set<string>, nextView: View) => {
    setSelectedTags(nextTags)
    setView(nextView)
    const params = new URLSearchParams()
    if (nextView === 'books') params.set('view', 'books')
    if (nextTags.size > 0) params.set('tag', Array.from(nextTags).join(','))
    const query = params.toString()
    router.push(query ? `/posts?${query}` : '/posts', { scroll: false })
  }

  const toggleTag = (tag: string) => {
    const next = new Set(selectedTags)
    if (next.has(tag)) next.delete(tag)
    else next.add(tag)
    update(next, view)
  }

  const filtered =
    selectedTags.size === 0
      ? posts
      : posts.filter((p) => p.tags.some((t) => selectedTags.has(t)))

  const grep =
    selectedTags.size === 0
      ? ''
      : ` | grep -E "${Array.from(selectedTags).join('|')}"`

  const lengths = Object.values(words).sort((a, b) => a - b)
  const median = lengths[Math.floor(lengths.length / 2)] ?? 1

  const count = (
    <span>
      -- {filtered.length} of {posts.length} entries --
      <span aria-hidden='true' className='cursor-blink text-rurikon-accent'> █</span>
    </span>
  )

  return (
    <div>
      <p className='font-mono text-xs sm:text-[13px] tracking-[0.24em] text-rurikon-signal'>
        FULL DUMP · {posts.length} ENTRIES
      </p>
      <h1 className='mt-3 font-display font-bold text-5xl sm:text-6xl tracking-[-0.03em] text-rurikon-600'>
        Posts
      </h1>

      <div className='mt-8 mb-6'>
        <div className='mb-3 flex flex-wrap items-center justify-between gap-x-6 gap-y-3'>
          <p className='font-mono text-[13px] text-rurikon-300 break-all'>
            $ {view === 'books' ? `ls ~/writing --bind=${mode}` : 'xxd ~/writing'}
            {grep}
          </p>
          <div className='flex gap-2' role='group' aria-label='View'>
            <button type='button' onClick={() => update(selectedTags, 'dump')} aria-pressed={view === 'dump'} className={chip(view === 'dump')}>
              DUMP
            </button>
            <button type='button' onClick={() => update(selectedTags, 'books')} aria-pressed={view === 'books'} className={chip(view === 'books')}>
              BOOKS
            </button>
          </div>
        </div>
        <div className='flex flex-wrap gap-2' role='group' aria-label='Filter by tag'>
          <button
            type='button'
            onClick={() => update(new Set(), view)}
            aria-pressed={selectedTags.size === 0}
            className={chip(selectedTags.size === 0)}
          >
            ALL · {posts.length}
          </button>
          {Object.entries(tags).map(([tag, n]) => (
            <button
              key={tag}
              type='button'
              onClick={() => toggleTag(tag)}
              aria-pressed={selectedTags.has(tag)}
              className={chip(selectedTags.has(tag))}
            >
              {tag.toUpperCase()} · {n}
            </button>
          ))}
        </div>
      </div>

      {view === 'books' ? (
        <>
          <div className='mb-8 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-rurikon-border pt-4 font-mono text-xs' role='group' aria-label='Cover display'>
            <span className='text-rurikon-300'>--bind</span>
            {BOOK_MODES.map((m) => (
              <button
                key={m.id}
                type='button'
                onClick={() => setMode(m.id)}
                aria-pressed={mode === m.id}
                className={cn(
                  'py-1 underline-offset-4 transition-colors',
                  mode === m.id ? 'text-rurikon-accent underline' : 'text-rurikon-400 hover:text-rurikon-accent'
                )}
              >
                {m.label}
              </button>
            ))}
          </div>
          <BooksView
            books={filtered.map((p) => ({ ...p, words: words[p.slug] ?? 0 }))}
            mode={mode}
            median={median}
          />
          <p className='mt-10 px-3 sm:px-4 font-mono text-xs text-rurikon-300'>{count}</p>
        </>
      ) : (
        <DumpList
          key={Array.from(selectedTags).join(',')}
          items={withYearMarkers(filtered)}
          animateFirst={14}
          footer={count}
        />
      )}
    </div>
  )
}
