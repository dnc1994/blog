'use client'

import cn from 'clsx'
import Link from 'next/link'
import type { CSSProperties } from 'react'
import { BookCover, bookPalette } from '@/components/book-cover'
import styles from './books-view.module.css'

/** What a cover needs to know about a post. */
export type BookItem = {
  slug: string
  href: string
  title: string
  date: string
  words: number
}

export const BOOK_MODES = [
  { id: 'same', label: 'SAME SIZE' },
  { id: 'scaled', label: 'SCALED TO LENGTH' },
  { id: 'thick', label: 'THICKNESS' },
  { id: 'shelf', label: 'SHELF' },
] as const
export type BookMode = (typeof BOOK_MODES)[number]['id']

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n))
const year = (b: BookItem) => b.date.slice(0, 4)

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

/** One cover that links to its post. */
export function BookLink({ book, style }: { book: BookItem; style?: CSSProperties }) {
  return (
    <Link
      href={book.href}
      draggable={false}
      aria-label={`${book.title}, ${year(book)}, ${book.words} words`}
      className={styles.book}
      style={style}
    >
      <BookCover slug={book.slug} title={book.title} year={year(book)} words={book.words} />
    </Link>
  )
}

/** Posts as book covers. `median` is the typical length, used by the scaled mode. */
export function BooksView({ books, mode, median }: { books: BookItem[]; mode: BookMode; median: number }) {
  if (mode === 'shelf') {
    return (
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
                <span className={styles.spineYear}>{year(b).slice(2)}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    )
  }

  return (
    <ul className={cn(styles.grid, mode === 'scaled' && styles.scaled, mode === 'thick' && styles.thick)}>
      {books.map((b) => {
        const stack = mode === 'thick' ? pages(b.words) : null
        return (
          <li
            key={b.slug}
            style={
              mode === 'scaled'
                ? ({ '--scale': clamp(Math.sqrt(b.words / (median || 1)), 0.5, 1.8) } as CSSProperties)
                : stack
                  ? { paddingRight: stack.depth, paddingBottom: stack.depth }
                  : undefined
            }
          >
            <BookLink book={b} style={stack ? { boxShadow: stack.shadow } : undefined} />
          </li>
        )
      })}
    </ul>
  )
}
