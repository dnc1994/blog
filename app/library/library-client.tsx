'use client'

import cn from 'clsx'
import Link from 'next/link'
import { useState, type CSSProperties } from 'react'
import { BookCover, bookPalette } from '@/components/book-cover'
import type { Book } from '@/lib/books'
import styles from './library.module.css'

const MODES = [
  { id: 'same', label: 'SAME SIZE' },
  { id: 'scaled', label: 'SCALED TO LENGTH' },
  { id: 'thick', label: 'THICKNESS' },
  { id: 'shelf', label: 'SHELF' },
] as const
type Mode = (typeof MODES)[number]['id']

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n))

/** A stack of page edges, drawn as stepped shadows down and to the right. */
function pages(words: number): { depth: number; shadow: string } {
  const depth = Math.round(clamp(words / 170, 3, 36))
  const layers: string[] = []
  for (let i = 1; i <= depth; i++) {
    layers.push(`${i}px ${i}px 0 ${i % 3 === 0 ? '#A8A290' : '#EFEADB'}`)
  }
  layers.push(`${depth + 1}px ${depth + 1}px 0 #100F0F`)
  return { depth, shadow: layers.join(',') }
}

export function LibraryClient({ books }: { books: Book[] }) {
  const [mode, setMode] = useState<Mode>('same')
  const total = books.reduce((n, b) => n + b.words, 0)
  const sorted = [...books].map((b) => b.words).sort((a, b) => a - b)
  const median = sorted[Math.floor(sorted.length / 2)] || 1

  return (
    <div>
      <p className='font-mono text-xs sm:text-[13px] tracking-[0.24em] text-rurikon-signal'>
        STACKS · {books.length} VOLUMES · {total.toLocaleString('en-US')} WORDS
      </p>
      <h1 className='mt-3 font-display font-bold text-5xl sm:text-6xl tracking-[-0.03em] text-rurikon-600'>
        Library
      </h1>

      <div className='mt-8 mb-10'>
        <p className='mb-3 font-mono text-[13px] text-rurikon-300'>
          $ ls ~/writing --bind={mode}{' '}
          <Link href='/posts' className='text-rurikon-400 underline underline-offset-4 hover:text-rurikon-accent'>
            (or view as dump)
          </Link>
        </p>
        <div className='flex flex-wrap gap-2' role='group' aria-label='Display mode'>
          {MODES.map((m) => (
            <button
              key={m.id}
              type='button'
              onClick={() => setMode(m.id)}
              aria-pressed={mode === m.id}
              className={cn(
                'px-2.5 py-1.5 font-mono text-xs border transition-colors',
                mode === m.id
                  ? 'bg-rurikon-accent border-rurikon-accent text-[var(--background)]'
                  : 'border-rurikon-200 text-rurikon-400 hover:border-rurikon-accent hover:text-rurikon-accent'
              )}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {mode === 'shelf' ? (
        <ul className={styles.shelf}>
          {books.map((b) => {
            const p = bookPalette(b.slug)
            const width = Math.round(clamp(b.words / 85, 20, 84))
            // Stable pseudo-random height so the row has a skyline.
            const height = 80 + ((b.slug.length * 7 + b.words) % 20)
            return (
              <li key={b.slug} style={{ width }}>
                <Link
                  href={b.href}
                  draggable={false}
                  title={`${b.title} · ${b.words.toLocaleString('en-US')} words`}
                  className={styles.spine}
                  style={{ '--bg': p.bg, '--ink': p.ink, '--accent': p.accent, height: `${height}%` } as CSSProperties}
                >
                  <span className={styles.spineTitle} style={{ fontSize: width < 28 ? 10 : width < 44 ? 12 : 14 }}>
                    {b.title}
                  </span>
                  <span className={styles.spineYear}>{b.year.slice(2)}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      ) : (
        <ul className={cn(styles.grid, mode === 'scaled' && styles.scaled, mode === 'thick' && styles.thick)}>
          {books.map((b) => {
            const scale = mode === 'scaled' ? clamp(Math.sqrt(b.words / median), 0.5, 1.8) : 1
            const stack = mode === 'thick' ? pages(b.words) : null
            return (
              <li
                key={b.slug}
                style={
                  mode === 'scaled'
                    ? ({ '--scale': scale } as CSSProperties)
                    : stack
                      ? { paddingRight: stack.depth, paddingBottom: stack.depth }
                      : undefined
                }
              >
                <Link
                  href={b.href}
                  draggable={false}
                  aria-label={`${b.title}, ${b.year}, ${b.words} words`}
                  className={styles.book}
                  style={stack ? { boxShadow: stack.shadow } : undefined}
                >
                  <BookCover slug={b.slug} title={b.title} year={b.year} words={b.words} />
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
