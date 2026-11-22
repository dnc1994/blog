import type { CSSProperties, ReactNode } from 'react'
import cn from 'clsx'
import styles from './book-cover.module.css'

import { COVERS, P, type Cover, type Palette } from './book-cover-art'

/*
 * Renders a post as a book cover. The artwork, palette and layout for each
 * post live in book-cover-art.tsx; this file owns the shared typography and
 * the fallback for posts that don't have a custom cover yet.
 */

const FALLBACK_PALETTES = Object.values(P)

function hash(text: string): number {
  let h = 2166136261
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function rng(seed: number) {
  let a = seed
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Generic cover for posts without a custom one: the title's UTF-8 bytes as bits. */
function fallbackArt(title: string, seed: number): ReactNode {
  const rand = rng(seed)
  const bytes = Array.from(new TextEncoder().encode(title)).slice(0, 10)
  while (bytes.length < 10) bytes.push(Math.floor(rand() * 256))
  const hot = Math.floor(rand() * 10)
  return bytes.flatMap((b, row) =>
    Array.from({ length: 8 }, (_, col) => {
      const x = 14 + col * 9.4
      const y = 4 + row * 9.4
      return (b >> (7 - col)) & 1 ? (
        <rect key={`${row}-${col}`} x={x} y={y} width={6.6} height={6.6} fill={row === hot ? 'var(--accent)' : 'var(--ink)'} />
      ) : (
        <rect key={`${row}-${col}`} x={x + 0.3} y={y + 0.3} width={6} height={6} fill='none' stroke='var(--ink)' strokeWidth={0.5} opacity={0.55} />
      )
    })
  )
}

function coverFor(slug: string, title: string): Cover {
  const h = hash(slug)
  return (
    COVERS[slug] ?? {
      palette: FALLBACK_PALETTES[h % FALLBACK_PALETTES.length],
      layout: 'framed',
      art: fallbackArt(title, h),
    }
  )
}

const CJK = /[㐀-鿿぀-ヿ]/

/** "Lead: rest" becomes a bold line plus a quieter line; "Notes: X" keeps X bold. */
function splitTitle(title: string): { label?: string; main: string; sub?: string } {
  const m = title.match(/^(.+?)[:：]\s*(.+)$/)
  if (!m) return { main: title }
  const [, lead, rest] = m
  return /^\S+$/.test(lead) && !CJK.test(lead) ? { label: lead, main: rest } : { main: lead, sub: rest }
}

/** Keep short CJK runs in mixed-script titles on one line ("如何备考" / "TOEFL/GRE"). */
function runs(text: string): ReactNode {
  const words = text.split(' ')
  if (words.length < 2) return text
  return words.map((w, i) => (
    <span key={i}>
      {i > 0 && ' '}
      {CJK.test(w) && Array.from(w).length <= 10 ? <span className={styles.keep}>{w}</span> : w}
    </span>
  ))
}

export function bookPalette(slug: string): Palette {
  return coverFor(slug, '').palette
}

export function BookCover({
  slug,
  title,
  year,
  words,
}: {
  slug: string
  title: string
  year: string
  words: number
}) {
  const { palette: p, layout, art } = coverFor(slug, title)
  const { label, main, sub } = splitTitle(title)

  // CJK glyphs are roughly twice as wide as Latin ones.
  const weight = Array.from(main).reduce((n, c) => n + (CJK.test(c) ? 2 : 1), 0)
  const size = weight <= 12 ? 11.5 : weight <= 22 ? 9.6 : weight <= 34 ? 8.2 : 7

  const titleBlock = (
    <div className={styles.title}>
      {label && <div className={styles.sub}>{label}</div>}
      <div className={styles.main} style={{ fontSize: `${size}cqw` }}>
        {runs(main)}
      </div>
      {sub && <div className={cn(styles.sub, CJK.test(sub) && styles.upright)}>{sub}</div>}
    </div>
  )

  const artBlock = (
    <svg className={styles.art} viewBox='0 0 100 100' aria-hidden='true' data-layout={layout}>
      {art}
    </svg>
  )

  return (
    <div
      className={styles.cover}
      data-layout={layout}
      style={{ '--bg': p.bg, '--ink': p.ink, '--accent': p.accent } as CSSProperties}
    >
      {layout === 'framed' ? (
        <>
          {titleBlock}
          {artBlock}
        </>
      ) : (
        <>
          {artBlock}
          {titleBlock}
        </>
      )}
      <div className={styles.meta}>
        <span>Linghao Zhang · {year}</span>
        <span>{words.toLocaleString('en-US')} words</span>
      </div>
    </div>
  )
}
