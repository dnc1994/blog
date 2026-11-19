import type { CSSProperties, ReactNode } from 'react'
import styles from './book-cover.module.css'

/*
 * Generative book covers. Everything is derived from the post slug, so a
 * post always gets the same cover on the server and the client.
 *
 * Cover palettes are artwork, not site UI, so they are fixed (Flexoki-derived)
 * colours rather than the theme-aware rurikon scale.
 */

export type Palette = { bg: string; ink: string; accent: string }

const PALETTES: Palette[] = [
  { bg: '#F2F0E5', ink: '#100F0F', accent: '#DA702C' },
  { bg: '#161514', ink: '#F2F0E5', accent: '#D0A215' },
  { bg: '#DA702C', ink: '#100F0F', accent: '#FFFCF0' },
  { bg: '#D0A215', ink: '#100F0F', accent: '#AF3029' },
  { bg: '#2C4A3A', ink: '#F6E2A0', accent: '#F6E2A0' },
  { bg: '#C6DDE8', ink: '#12253B', accent: '#D14D41' },
  { bg: '#1A2A4F', ink: '#FFFCF0', accent: '#8FB8DE' },
  { bg: '#D9CFEA', ink: '#261C4A', accent: '#DA702C' },
  { bg: '#3A2C63', ink: '#FFFCF0', accent: '#DA702C' },
  { bg: '#F0CFC6', ink: '#5A1422', accent: '#AF3029' },
  { bg: '#A6AB80', ink: '#1C1B1A', accent: '#5E409D' },
  { bg: '#BFE8D9', ink: '#122F2C', accent: '#205EA6' },
  { bg: '#D14D41', ink: '#100F0F', accent: '#FFFCF0' },
]

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

const r2 = (n: number) => Math.round(n * 100) / 100

type Art = (rand: () => number, p: Palette, title: string) => ReactNode

/* All motifs draw into a 100 x 100 viewBox. */

// The site's own motif: the title's UTF-8 bytes, one byte per row, as bits.
const hexdump: Art = (rand, p, title) => {
  const bytes = Array.from(new TextEncoder().encode(title)).slice(0, 10)
  while (bytes.length < 10) bytes.push(Math.floor(rand() * 256))
  const hot = Math.floor(rand() * 10)
  return bytes.flatMap((b, row) =>
    Array.from({ length: 8 }, (_, col) => {
      const on = (b >> (7 - col)) & 1
      const x = 14 + col * 9.4
      const y = 4 + row * 9.4
      return on ? (
        <rect key={`${row}-${col}`} x={x} y={y} width={6.6} height={6.6} fill={row === hot ? p.accent : p.ink} />
      ) : (
        <rect key={`${row}-${col}`} x={x + 0.3} y={y + 0.3} width={6} height={6} fill='none' stroke={p.ink} strokeWidth={0.5} opacity={0.55} />
      )
    })
  )
}

const ripples: Art = (rand, p) => {
  const cx = 12 + rand() * 30
  const cy = 45 + rand() * 35
  const out: ReactNode[] = []
  let r = 2
  for (let i = 0; i < 16; i++) {
    out.push(<circle key={i} cx={cx} cy={cy} r={r2(r)} fill='none' stroke={i < 6 ? p.accent : p.ink} strokeWidth={0.6} />)
    r = r * 1.24 + 1.2
  }
  return out
}

const waves: Art = (rand, p) => {
  const hot = 5 + Math.floor(rand() * 5)
  const f1 = 0.05 + rand() * 0.04
  const f2 = 0.11 + rand() * 0.06
  const ph = rand() * 6
  return Array.from({ length: 15 }, (_, i) => {
    const amp = 2 + 7 * Math.sin((i / 14) * Math.PI)
    let d = ''
    for (let x = 0; x <= 100; x += 2) {
      const y = 8 + i * 6 + amp * Math.sin(x * f1 + ph + i * 0.35) + amp * 0.4 * Math.sin(x * f2 + i)
      d += `${x === 0 ? 'M' : 'L'}${x} ${r2(y)}`
    }
    return (
      <path key={i} d={d} fill='none' stroke={i === hot ? p.accent : p.ink} strokeWidth={i === hot ? 3.2 : 0.5} strokeLinecap='round' />
    )
  })
}

const network: Art = (rand, p) => {
  const hub = { x: 40 + rand() * 20, y: 40 + rand() * 20 }
  const nodes = Array.from({ length: 13 }, (_, i) => {
    const a = (i / 13) * Math.PI * 2 + rand() * 0.4
    const d = 14 + rand() * 30
    return { x: hub.x + Math.cos(a) * d, y: hub.y + Math.sin(a) * d, solid: rand() < 0.4 }
  })
  return (
    <>
      {Array.from({ length: 40 }, (_, i) => (
        <circle key={`s${i}`} cx={r2(rand() * 100)} cy={r2(rand() * 100)} r={0.45} fill={p.ink} opacity={0.6} />
      ))}
      {nodes.map((n, i) => (
        <line key={`l${i}`} x1={r2(hub.x)} y1={r2(hub.y)} x2={r2(n.x)} y2={r2(n.y)} stroke={p.ink} strokeWidth={n.solid ? 0.8 : 0.4} strokeDasharray={n.solid ? undefined : '1 1.4'} />
      ))}
      {nodes.map((n, i) => (
        <circle key={`n${i}`} cx={r2(n.x)} cy={r2(n.y)} r={n.solid ? 2 : 1.5} fill={n.solid ? p.ink : p.bg} stroke={p.ink} strokeWidth={0.5} />
      ))}
      <circle cx={r2(hub.x)} cy={r2(hub.y)} r={3.6} fill={p.accent} />
    </>
  )
}

const seedhead: Art = (rand, p) => {
  const core = 60 + Math.floor(rand() * 90)
  const ox = 50 + (rand() - 0.5) * 8
  const oy = 50 + (rand() - 0.5) * 8
  return Array.from({ length: 420 }, (_, i) => {
    const a = i * 2.39996323
    const d = 2.25 * Math.sqrt(i)
    return (
      <circle key={i} cx={r2(ox + Math.cos(a) * d)} cy={r2(oy + Math.sin(a) * d)} r={r2(Math.max(0.35, 1.35 - i / 420))} fill={i < core ? p.accent : p.ink} />
    )
  })
}

const specimens: Art = (rand, p) => {
  const out: ReactNode[] = []
  const cols = 5
  for (let row = 0; row < cols; row++)
    for (let col = 0; col < cols; col++) {
      const cx = 14 + col * 18
      const cy = 14 + row * 18
      const open = 0.15 + ((row * cols + col) / 24) * 0.6 * (0.6 + rand() * 0.6)
      const a0 = rand() * Math.PI * 2
      const a1 = a0 + Math.PI * 2 * (1 - Math.min(open, 0.85))
      const large = a1 - a0 > Math.PI ? 1 : 0
      const rr = 6
      out.push(
        <path
          key={`${row}-${col}`}
          d={`M${r2(cx + rr * Math.cos(a0))} ${r2(cy + rr * Math.sin(a0))}A${rr} ${rr} 0 ${large} 1 ${r2(cx + rr * Math.cos(a1))} ${r2(cy + rr * Math.sin(a1))}`}
          fill='none'
          stroke={rand() < 0.3 ? p.accent : p.ink}
          strokeWidth={1.5}
          strokeLinecap='round'
        />
      )
    }
  return out
}

const truchet: Art = (rand, p) => {
  const n = 8
  const s = 100 / n
  const out: ReactNode[] = []
  for (let row = 0; row < n; row++)
    for (let col = 0; col < n; col++) {
      const x = col * s
      const y = row * s
      const h = s / 2
      const d =
        rand() < 0.5
          ? `M${x + h} ${y}A${h} ${h} 0 0 1 ${x} ${y + h}M${x + s} ${y + h}A${h} ${h} 0 0 0 ${x + h} ${y + s}`
          : `M${x + h} ${y}A${h} ${h} 0 0 0 ${x + s} ${y + h}M${x} ${y + h}A${h} ${h} 0 0 1 ${x + h} ${y + s}`
      out.push(<path key={`${row}-${col}`} d={d} fill='none' stroke={rand() < 0.12 ? p.accent : p.ink} strokeWidth={1.6} />)
    }
  return out
}

const skyline: Art = (rand, p) => {
  const n = 9
  const hot = Math.floor(rand() * n)
  const peak = 2 + rand() * (n - 4)
  return (
    <>
      {Array.from({ length: n }, (_, i) => {
        const h = 22 + 60 * Math.exp(-((i - peak) ** 2) / 9) * (0.7 + rand() * 0.3) + rand() * 8
        const x = 8 + i * 9.6
        return (
          <g key={i}>
            <rect x={x} y={r2(90 - h)} width={7} height={r2(h)} fill={i === hot ? p.accent : p.ink} />
            <rect x={x - 1} y={r2(90 - h - 2.4)} width={9} height={1.6} fill={i === hot ? p.accent : p.ink} />
          </g>
        )
      })}
      <rect x={4} y={91.5} width={92} height={1} fill={p.ink} />
    </>
  )
}

const rosette: Art = (rand, p) => {
  const n = 9 + Math.floor(rand() * 8)
  const ry = 9 + rand() * 14
  const hot = Math.floor(rand() * n)
  return (
    <>
      {Array.from({ length: n }, (_, i) => (
        <ellipse key={i} cx={50} cy={50} rx={44} ry={r2(ry)} fill='none' stroke={i === hot ? p.accent : p.ink} strokeWidth={i === hot ? 1.4 : 0.55} transform={`rotate(${r2((i * 180) / n)} 50 50)`} />
      ))}
      <circle cx={50} cy={50} r={2.4} fill={p.accent} />
    </>
  )
}

const ARTS: Art[] = [hexdump, ripples, waves, network, seedhead, specimens, truchet, skyline, rosette]
const LAYOUTS = ['framed', 'bleed', 'inset'] as const

const CJK = /[㐀-鿿぀-ヿ]/

/** "Lead: rest" becomes a bold line plus a quieter line; "Notes: X" keeps X bold. */
function splitTitle(title: string): { label?: string; main: string; sub?: string } {
  const m = title.match(/^(.+?)[:：]\s*(.+)$/)
  if (!m) return { main: title }
  const [, lead, rest] = m
  return /^\S+$/.test(lead) && !CJK.test(lead) ? { label: lead, main: rest } : { main: lead, sub: rest }
}

export function bookPalette(slug: string): Palette {
  return PALETTES[hash(slug) % PALETTES.length]
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
  const h = hash(slug)
  const p = PALETTES[h % PALETTES.length]
  const art = ARTS[(h >>> 8) % ARTS.length]
  const layout = LAYOUTS[(h >>> 16) % LAYOUTS.length]
  const { label, main, sub } = splitTitle(title)

  // CJK glyphs are roughly twice as wide as Latin ones.
  const weight = Array.from(main).reduce((n, c) => n + (CJK.test(c) ? 2 : 1), 0)
  const size = weight <= 12 ? 11.5 : weight <= 22 ? 9.6 : weight <= 34 ? 8.2 : 7

  const titleBlock = (
    <div className={styles.title}>
      {label && <div className={styles.sub}>{label}</div>}
      <div className={styles.main} style={{ fontSize: `${size}cqw` }}>
        {main}
      </div>
      {sub && <div className={styles.sub}>{sub}</div>}
    </div>
  )

  const artBlock = (
    <svg className={styles.art} viewBox='0 0 100 100' aria-hidden='true' data-layout={layout}>
      {art(rng(h), p, title)}
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
