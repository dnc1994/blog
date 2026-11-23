import type { ReactNode } from 'react'

/*
 * One hand-drawn cover per post, keyed by slug.
 *
 * House style: flat shapes on a 100 x 100 canvas, three colours only
 * (--ink, --accent, --bg, set by the cover), geometric rather than
 * illustrative, and exactly one idea from the post per cover.
 *
 * To add a cover for a new post, add an entry to COVERS. Posts without an
 * entry fall back to a generic cover (see book-cover.tsx).
 */

export type Palette = { bg: string; ink: string; accent: string }
export type Layout = 'framed' | 'bleed' | 'inset'
export type Cover = { palette: Palette; layout: Layout; art: ReactNode }

/* Cover palettes are artwork, not site UI: fixed Flexoki-derived colours. */
export const P = {
  paper: { bg: '#F2F0E5', ink: '#100F0F', accent: '#DA702C' },
  ink: { bg: '#161514', ink: '#F2F0E5', accent: '#D0A215' },
  orange: { bg: '#DA702C', ink: '#100F0F', accent: '#FFFCF0' },
  yellow: { bg: '#D0A215', ink: '#100F0F', accent: '#AF3029' },
  forest: { bg: '#2C4A3A', ink: '#F6E2A0', accent: '#DA702C' },
  sky: { bg: '#C6DDE8', ink: '#12253B', accent: '#D14D41' },
  navy: { bg: '#1A2A4F', ink: '#FFFCF0', accent: '#8FB8DE' },
  lilac: { bg: '#D9CFEA', ink: '#261C4A', accent: '#DA702C' },
  plum: { bg: '#3A2C63', ink: '#FFFCF0', accent: '#DA702C' },
  blush: { bg: '#F0CFC6', ink: '#5A1422', accent: '#AF3029' },
  sage: { bg: '#A6AB80', ink: '#1C1B1A', accent: '#5E409D' },
  mint: { bg: '#BFE8D9', ink: '#122F2C', accent: '#205EA6' },
  red: { bg: '#D14D41', ink: '#100F0F', accent: '#FFFCF0' },
  teal: { bg: '#1F5F5B', ink: '#FFFCF0', accent: '#F6E2A0' },
} satisfies Record<string, Palette>

const I = 'var(--ink)'
const A = 'var(--accent)'
const B = 'var(--bg)'

const R = (n: number) => Array.from({ length: n }, (_, i) => i)
const f = (n: number) => Math.round(n * 100) / 100
const line = (pts: [number, number][]) => pts.map(([x, y], i) => `${i ? 'L' : 'M'}${f(x)} ${f(y)}`).join('')

/** A leaf growing from (x, y), pointing left (-1) or right (1). */
function Leaf({ x, y, dir, s = 12, fill = I }: { x: number; y: number; dir: 1 | -1; s?: number; fill?: string }) {
  return <path d={`M${x} ${y}q${dir * s * 0.25} ${-s * 0.75} ${dir * s} ${-s * 0.7}q${-dir * s * 0.2} ${s * 0.75} ${-dir * s} ${s * 0.7}Z`} fill={fill} />
}

/* ---------- 2026 ---------- */

// Five talks: five spotlights on a stage, the first pick lit.
const talks = (
  <>
    {R(5).map((i) => {
      const x = 14 + i * 18
      const hot = i === 0
      return (
        <g key={i}>
          <path d={`M${x} 6L${x - 7.5} 78L${x + 7.5} 78Z`} fill={hot ? A : I} opacity={hot ? 1 : 0.2} />
          <circle cx={x} cy={6} r={2.4} fill={I} />
          <rect x={x - 0.8} y={62} width={1.6} height={16} fill={hot ? B : I} />
          <circle cx={x} cy={60} r={3} fill={hot ? B : I} />
        </g>
      )
    })}
    <rect x={3} y={78} width={94} height={2} fill={I} />
    {R(3).flatMap((r) =>
      R(12 - r).map((c) => <circle key={`${r}-${c}`} cx={f(9.3 + c * 7.4 + r * 3.7)} cy={86 + r * 4.6} r={1.6} fill={I} />)
    )}
  </>
)

// One set of things, two ways of cutting it: the tree sorts by shape, the dashed arcs by fill.
const taxonomy = (() => {
  const elbow = (px: number, py: number, cx: number, cy: number) => `M${px} ${py}V${(py + cy) / 2}H${cx}V${cy}`
  const leafX = (i: number) => 8 + i * 12
  const shape = (i: number) => {
    const x = leafX(i)
    const y = 70
    const solid = i % 2 === 0
    const props = { fill: solid ? I : 'none', stroke: I, strokeWidth: 1 }
    const kind = Math.floor(i / 2)
    if (kind === 0) return <circle key={i} cx={x} cy={y} r={4} {...props} />
    if (kind === 1) return <rect key={i} x={x - 3.6} y={y - 3.6} width={7.2} height={7.2} {...props} />
    if (kind === 2) return <path key={i} d={`M${x} ${y - 4.4}L${x + 4.4} ${y + 3.6}H${x - 4.4}Z`} {...props} />
    return <path key={i} d={`M${x} ${y - 4.8}L${x + 4.8} ${y}L${x} ${y + 4.8}L${x - 4.8} ${y}Z`} {...props} />
  }
  return (
    <>
      <g fill='none' stroke={I} strokeWidth={0.9}>
        <path d={elbow(50, 6, 26, 26) + elbow(50, 6, 74, 26)} />
        {[26, 74].map((p, k) => (
          <path key={k} d={elbow(p, 26, p - 12, 46) + elbow(p, 26, p + 12, 46)} />
        ))}
        {R(4).map((k) => (
          <path key={k} d={elbow(14 + k * 24, 46, leafX(k * 2), 63) + elbow(14 + k * 24, 46, leafX(k * 2 + 1), 63)} />
        ))}
      </g>
      <circle cx={50} cy={6} r={2.4} fill={I} />
      {R(8).map(shape)}
      {R(3).map((k) => (
        <path key={k} d={`M${leafX(k * 2)} 78Q${leafX(k * 2 + 1)} ${96} ${leafX(k * 2 + 2)} 78`} fill='none' stroke={A} strokeWidth={1.3} strokeDasharray='2.4 1.8' />
      ))}
    </>
  )
})()

// Generations of candidate systems; each round one survives and seeds the next.
const evolve = (() => {
  const win = [3, 1, 4, 2, 5, 3]
  const x = (i: number) => 10 + i * 13.33
  const y = (g: number) => 9 + g * 16.4
  return (
    <>
      {R(5).flatMap((g) =>
        R(7).map((i) => <line key={`${g}-${i}`} x1={f(x(win[g]))} y1={y(g)} x2={f(x(i))} y2={y(g + 1)} stroke={I} strokeWidth={0.4} opacity={0.7} />)
      )}
      {R(6).flatMap((g) =>
        R(7).map((i) =>
          i === win[g] ? (
            <rect key={`${g}-${i}`} x={f(x(i) - 3.6)} y={y(g) - 3.6} width={7.2} height={7.2} fill={A} />
          ) : (
            <rect key={`${g}-${i}`} x={f(x(i) - 2.8)} y={y(g) - 2.8} width={5.6} height={5.6} fill={B} stroke={I} strokeWidth={0.8} />
          )
        )
      )}
    </>
  )
})()

// The identical binary (top row) drifting into bespoke organisms.
const speciation = (
  <>
    {R(5).flatMap((r) =>
      R(5).map((c) => {
        const cx = 14 + c * 18
        const cy = 14 + r * 18
        const m = r / 4
        const w = 11 * (1 + m * (c - 2) * 0.22)
        const h = 11 * (1 - m * (c - 2) * 0.16)
        const mutant = r === 4 && (c === 1 || c === 4)
        return (
          <rect
            key={`${r}-${c}`}
            x={f(cx - w / 2)}
            y={f(cy - h / 2)}
            width={f(w)}
            height={f(h)}
            rx={f(m * c * 1.35)}
            fill={mutant ? A : r === 0 ? I : 'none'}
            stroke={mutant ? A : I}
            strokeWidth={1.2}
            transform={`rotate(${f(m * (c * 17 - 20))} ${cx} ${cy})`}
          />
        )
      })
    )}
  </>
)

// A flywheel, already spinning.
const flywheel = (
  <>
    <circle cx={50} cy={54} r={36} fill='none' stroke={I} strokeWidth={7} />
    {R(8).map((i) => (
      <line key={i} x1={50} y1={54} x2={f(50 + 34 * Math.cos((i * Math.PI) / 4 + 0.2))} y2={f(54 + 34 * Math.sin((i * Math.PI) / 4 + 0.2))} stroke={I} strokeWidth={2} />
    ))}
    {R(24).map((i) => {
      const a = (i * Math.PI) / 12
      return <line key={i} x1={f(50 + 30 * Math.cos(a))} y1={f(54 + 30 * Math.sin(a))} x2={f(50 + 27 * Math.cos(a))} y2={f(54 + 27 * Math.sin(a))} stroke={I} strokeWidth={0.8} />
    })}
    <circle cx={50} cy={54} r={9} fill={A} />
    <circle cx={50} cy={54} r={2.5} fill={I} />
    {[45, 50].map((r, k) => {
      const a0 = -2.3 + k * 0.35
      const a1 = -0.75 + k * 0.2
      return (
        <path key={k} d={`M${f(50 + r * Math.cos(a0))} ${f(54 + r * Math.sin(a0))}A${r} ${r} 0 0 1 ${f(50 + r * Math.cos(a1))} ${f(54 + r * Math.sin(a1))}`} fill='none' stroke={A} strokeWidth={1.6} strokeLinecap='round' />
      )
    })}
  </>
)

// Everything that was said, and the outline of what was never done.
const negativeSpace = (
  <>
    {R(13).flatMap((r) =>
      R(13).map((c) => {
        const x = 8 + c * 7
        const y = 8 + r * 7
        return Math.hypot(x - 57, y - 45) < 21 ? null : <circle key={`${r}-${c}`} cx={x} cy={y} r={1.5} fill={I} />
      })
    )}
    <circle cx={57} cy={45} r={19} fill='none' stroke={A} strokeWidth={1.2} strokeDasharray='2.5 2' />
  </>
)

/* ---------- 2025 ---------- */

// A controller and a top ten.
const games = (
  <>
    <rect x={7} y={16} width={86} height={50} rx={25} fill='none' stroke={I} strokeWidth={2} />
    <path d='M25 30h9v6.5h6.5v9H34V52h-9v-6.5h-6.5v-9H25Z' fill={I} />
    {[
      [70, 31],
      [61, 41],
      [79, 41],
      [70, 51],
    ].map(([x, y], i) => (
      <circle key={i} cx={x} cy={y} r={4.4} fill={i === 2 ? A : 'none'} stroke={i === 2 ? A : I} strokeWidth={1.4} />
    ))}
    <rect x={44} y={39} width={5} height={2.4} rx={1.2} fill={I} />
    <rect x={51} y={39} width={5} height={2.4} rx={1.2} fill={I} />
    {R(10).map((i) => (
      <rect key={i} x={7 + i * 8.8} y={80} width={6.8} height={6.8} fill={i % 3 === 0 ? A : I} />
    ))}
  </>
)

// One deterministic line fanning out into a distribution of outcomes.
const nondeterminism = (
  <>
    <line x1={0} y1={50} x2={34} y2={50} stroke={I} strokeWidth={2.4} />
    {R(11).map((i) => {
      const y = 6 + i * 8.8
      const hot = i === 3
      return (
        <g key={i}>
          <path d={`M34 50C62 50 66 ${y} 94 ${y}`} fill='none' stroke={hot ? A : I} strokeWidth={hot ? 2.4 : 0.7} />
          <circle cx={95} cy={y} r={hot ? 3 : 1.6} fill={hot ? A : I} />
        </g>
      )
    })}
    <rect x={30} y={46} width={8} height={8} fill={I} />
  </>
)

// A whiteboard system design, with the coach's speech bubble.
const systemDesign = (
  <>
    <g fill='none' stroke={I} strokeWidth={1}>
      <path d='M24 58H36M48 58L60 30M48 58H60M48 58L60 86M72 30H82M72 58H82M72 86L82 64' />
    </g>
    <rect x={8} y={50} width={16} height={16} fill='none' stroke={I} strokeWidth={1.4} />
    <circle cx={42} cy={58} r={6} fill={I} />
    {[30, 58, 86].map((y) => (
      <rect key={y} x={60} y={y - 6} width={12} height={12} fill={B} stroke={I} strokeWidth={1.4} />
    ))}
    <path d='M82 22v44a6 3 0 0 0 12 0V22' fill={B} stroke={I} strokeWidth={1.4} />
    <ellipse cx={88} cy={22} rx={6} ry={3} fill={B} stroke={I} strokeWidth={1.4} />
    <path d='M82 36a6 3 0 0 0 12 0M82 50a6 3 0 0 0 12 0' fill='none' stroke={I} strokeWidth={1} />
    <path d='M6 8h34v20H18l-6 7v-7H6Z' fill={A} />
    {[15, 23, 31].map((x) => (
      <circle key={x} cx={x} cy={18} r={1.8} fill={B} />
    ))}
  </>
)

// A striped sun over the 101, and a palm you can never quite leave.
const hotelCalifornia = (
  <>
    <circle cx={56} cy={40} r={27} fill={A} />
    {R(6).map((i) => (
      <rect key={i} x={24} y={f(38 + i * 5.2 - i * 0.2)} width={64} height={f(1 + i * 0.55)} fill={B} />
    ))}
    <rect x={0} y={67} width={100} height={33} fill={I} />
    <path d='M52 67L26 100H86L60 67Z' fill={B} opacity={0.18} />
    {R(4).map((i) => (
      <rect key={i} x={f(55.4 - i * 0.5)} y={f(69 + i * 8.5)} width={f(1.2 + i * 1)} height={f(3 + i * 1.6)} fill={B} />
    ))}
    <path d='M17 100C16 80 18 58 23 40' fill='none' stroke={I} strokeWidth={2.6} strokeLinecap='round' />
    {[
      [-22, -6],
      [-17, 8],
      [-6, -17],
      [10, -15],
      [20, -3],
      [16, 11],
    ].map(([dx, dy], i) => (
      <path key={i} d={`M23 40Q${23 + dx * 0.55} ${40 + dy * 0.55 - 8} ${23 + dx} ${40 + dy}`} fill='none' stroke={I} strokeWidth={2.6} strokeLinecap='round' />
    ))}
  </>
)

/* ---------- 2024 ---------- */

// Good, repeatably: the same move again and again, compounding.
const great = (() => {
  const pt = (t: number): [number, number] => [8 + t * 82, 90 - 76 * Math.pow(t, 2.4)]
  return (
    <>
      <line x1={4} y1={92} x2={96} y2={92} stroke={I} strokeWidth={0.8} strokeDasharray='1.5 2' />
      <path d={line(R(41).map((i) => pt(i / 40)))} fill='none' stroke={I} strokeWidth={0.9} />
      {R(8).map((i) => {
        const [x, y] = pt(i / 7)
        return <circle key={i} cx={f(x)} cy={f(y)} r={f(2 + i * 0.75)} fill={i === 7 ? A : I} />
      })}
    </>
  )
})()

// The demo is the tip. The product is everything under the waterline.
const iceberg = (
  <>
    <path d='M38 30L50 8L58 20L64 30Z' fill={A} />
    <path d='M22 36H82L90 54L76 70L68 92L46 96L30 80L14 58Z' fill={I} />
    <path d='M46 36L52 58L40 76M66 36L70 56' fill='none' stroke={B} strokeWidth={0.8} />
    {[33, 47, 61].map((y, k) => (
      <path key={y} d={line(R(26).map((i) => [i * 4, y + 1.2 * Math.sin(i * 0.9 + k)]))} fill='none' stroke={k === 0 ? I : A} strokeWidth={k === 0 ? 1.2 : 0.5} opacity={k === 0 ? 1 : 0.7} />
    ))}
  </>
)

// A stack where every layer has to line up, and one doesn't.
const infraStack = (
  <>
    {[84, 69, 54, 39, 24].map((cy, i) => {
      const off = i === 2
      const dx = off ? 9 : 0
      const w = 38 - i * 2
      return (
        <g key={cy}>
          <path d={`M${50 + dx} ${cy - 10}L${50 + w + dx} ${cy}V${cy + 5}L${50 + dx} ${cy + 15}L${50 - w + dx} ${cy + 5}V${cy}Z`} fill={off ? A : I} stroke={B} strokeWidth={1.2} strokeLinejoin='round' />
          <path d={`M${50 - w + dx} ${cy}L${50 + dx} ${cy + 10}L${50 + w + dx} ${cy}M${50 + dx} ${cy + 10}V${cy + 15}`} fill='none' stroke={B} strokeWidth={0.8} />
        </g>
      )
    })}
  </>
)

// Many teams, many stakeholders, one directly responsible individual.
const dri = (
  <>
    {R(12).map((i) => {
      const a = (i * Math.PI) / 6
      const x = 50 + 40 * Math.cos(a)
      const y = 50 + 40 * Math.sin(a)
      return (
        <g key={i}>
          <line x1={f(x)} y1={f(y)} x2={50} y2={50} stroke={I} strokeWidth={0.7} />
          <circle cx={f(x)} cy={f(y)} r={i % 3 === 0 ? 6.5 : 4.5} fill={B} stroke={I} strokeWidth={1.4} />
        </g>
      )
    })}
    <circle cx={50} cy={50} r={9} fill={A} />
    <circle cx={50} cy={50} r={3} fill={I} />
  </>
)

// Be the bridge.
const bridge = (
  <>
    <path d='M0 62H20L24 100H0ZM100 62H80L76 100H100Z' fill={I} />
    <path d='M0 28Q17 34 34 22Q50 66 66 22Q83 34 100 28' fill='none' stroke={I} strokeWidth={1.2} />
    {R(9).map((i) => {
      const x = 38 + i * 3
      const t = (x - 34) / 32
      const y = 22 + 44 * 2 * t * (1 - t) * 1 // quadratic sag between the towers
      return <line key={i} x1={x} y1={f(y)} x2={x} y2={62} stroke={I} strokeWidth={0.6} />
    })}
    <rect x={32.5} y={18} width={3} height={82} fill={I} />
    <rect x={64.5} y={18} width={3} height={82} fill={I} />
    <rect x={0} y={60} width={100} height={3.6} fill={A} />
    {[82, 88, 94].map((y, k) => (
      <path key={y} d={line(R(13).map((i) => [26 + i * 4, y + Math.sin(i * 1.1 + k)]))} fill='none' stroke={I} strokeWidth={0.6} />
    ))}
  </>
)

/* ---------- 2023 - 2022 ---------- */

// One role, two halves, and the "M" half is larger than you think.
const tlm = (
  <>
    <path d='M42 14.9A36 36 0 1 1 42 85.1Z' fill={I} />
    {R(17).map((i) => {
      const y = 18 + i * 4
      const ext = Math.sqrt(36 * 36 - (y - 50) * (y - 50))
      const x0 = 50 - ext
      return x0 < 37 ? <line key={i} x1={f(x0)} y1={y} x2={38} y2={y} stroke={A} strokeWidth={1.6} /> : null
    })}
    <line x1={40} y1={6} x2={40} y2={94} stroke={I} strokeWidth={0.7} strokeDasharray='1.5 2' />
  </>
)

// Lead by example, and leave room in the formation for everyone else.
const formation = (
  <>
    {R(5).flatMap((k) =>
      (k === 0 ? [0] : [-1, 1]).map((s) => {
        const x = 50 + s * k * 10.5
        const y = 16 + k * 15
        return (
          <g key={`${k}${s}`}>
            <line x1={x} y1={y + 6} x2={x} y2={100} stroke={I} strokeWidth={0.4} strokeDasharray='1 2.4' />
            <path d={`M${x} ${y - 6}L${x + 5.5} ${y + 5}L${x} ${y + 2}L${x - 5.5} ${y + 5}Z`} fill={k === 0 ? A : I} />
          </g>
        )
      })
    )}
  </>
)

// Will Larson's four archetypes: tech lead, architect, solver, right hand.
const archetypes = (
  <>
    <path d='M50 2V98M2 50H98' stroke={I} strokeWidth={0.8} />
    {/* tech lead: one out front, the team behind */}
    <path d='M34 12L41 26H27Z' fill={A} />
    {[16, 25, 34, 43].map((x, i) => (
      <circle key={i} cx={x - 4} cy={36} r={2.6} fill={I} />
    ))}
    {/* architect: nested plans */}
    {[17, 11, 5].map((s) => (
      <rect key={s} x={74 - s} y={25 - s} width={s * 2} height={s * 2} fill='none' stroke={I} strokeWidth={1.2} />
    ))}
    {/* solver: straight to the hard problem */}
    <circle cx={26} cy={75} r={15} fill='none' stroke={I} strokeWidth={1.2} />
    <circle cx={26} cy={75} r={8} fill='none' stroke={I} strokeWidth={1.2} />
    <circle cx={26} cy={75} r={2.6} fill={I} />
    <path d='M26 56V63M26 87V94M7 75H14M38 75H45' stroke={I} strokeWidth={1.2} />
    {/* right hand: two that overlap */}
    <circle cx={68} cy={75} r={12} fill='none' stroke={I} strokeWidth={1.2} />
    <circle cx={80} cy={75} r={12} fill={I} />
  </>
)

// A wearable that notices the spike before you do.
const wearable = (
  <>
    <rect x={38} y={0} width={24} height={30} fill={I} />
    <rect x={38} y={70} width={24} height={30} fill={I} />
    <rect x={26} y={24} width={48} height={52} rx={10} fill={B} stroke={I} strokeWidth={2.4} />
    <path d='M0 52H34L39 44L45 68L52 30L58 60L62 52H100' fill='none' stroke={A} strokeWidth={2} strokeLinejoin='round' />
    <rect x={74} y={44} width={4} height={10} rx={1.5} fill={I} />
  </>
)

// A page that was one small edit away.
const editing = (
  <>
    {[78, 84, 60, 82, 70, 84, 76, 48].map((w, i) => (
      <rect key={i} x={8} y={8 + i * 11.4} width={w} height={3.4} fill={I} opacity={i === 2 ? 0.45 : 1} />
    ))}
    <line x1={5} y1={32.5} x2={72} y2={32.5} stroke={A} strokeWidth={1.6} />
    <path d='M52 60L56 52L60 60' fill='none' stroke={A} strokeWidth={1.6} />
    <rect x={46} y={46.5} width={22} height={3.4} fill={A} />
    <ellipse cx={24} cy={78.1} rx={15} ry={5.4} fill='none' stroke={A} strokeWidth={1.4} />
    <path d='M39 78Q52 96 70 92' fill='none' stroke={A} strokeWidth={1.2} />
  </>
)

// Knowledge has no outer edge: a spiral that keeps opening.
const spiral = (
  <>
    <path d={line(R(361).map((i) => {
      const t = i * 0.085
      return [38 + 2.35 * t * Math.cos(t), 60 + 2.35 * t * Math.sin(t)]
    }))} fill='none' stroke={I} strokeWidth={1.1} />
    <circle cx={38} cy={60} r={3.4} fill={A} />
    {[
      [84, 10],
      [70, 22],
      [92, 30],
      [78, 6],
      [60, 8],
    ].map(([x, y], i) => (
      <circle key={i} cx={x} cy={y} r={0.9} fill={A} />
    ))}
  </>
)

// Same outline, different insides.
const similarity = (() => {
  const chord = (d: number) => Math.sqrt(19 * 19 - d * d)
  return (
    <>
      {[5, 10, 15].map((r) => (
        <circle key={r} cx={50} cy={25} r={r} fill='none' stroke={I} strokeWidth={0.8} />
      ))}
      {R(9).map((i) => {
        const d = -16 + i * 4
        return <line key={i} x1={50 + d} y1={f(75 - chord(d))} x2={50 + d} y2={f(75 + chord(d))} stroke={I} strokeWidth={0.8} />
      })}
      <circle cx={50} cy={25} r={19} fill='none' stroke={I} strokeWidth={2.4} />
      <circle cx={50} cy={75} r={19} fill='none' stroke={I} strokeWidth={2.4} />
      <path d='M40 48q5-4 10 0t10 0M40 53q5-4 10 0t10 0' fill='none' stroke={A} strokeWidth={1.8} strokeLinecap='round' />
    </>
  )
})()

/* ---------- 2021 - 2019 ---------- */

// Grow @ Google 03: write it down, and grow the next one.
const growMentor = (
  <>
    <line x1={2} y1={86} x2={98} y2={86} stroke={I} strokeWidth={1.4} />
    <line x1={34} y1={86} x2={34} y2={16} stroke={I} strokeWidth={1.8} />
    {[70, 52, 34].map((y, i) => (
      <g key={y}>
        <Leaf x={34} y={y} dir={-1} s={16 - i * 2} />
        <Leaf x={34} y={y - 8} dir={1} s={16 - i * 2} />
      </g>
    ))}
    <circle cx={34} cy={14} r={3} fill={I} />
    <line x1={74} y1={86} x2={74} y2={64} stroke={A} strokeWidth={1.8} />
    <Leaf x={74} y={72} dir={-1} s={9} fill={A} />
    <Leaf x={74} y={68} dir={1} s={9} fill={A} />
    <path d='M42 22Q68 22 74 56' fill='none' stroke={I} strokeWidth={0.8} strokeDasharray='1.6 2' />
    {[91, 95].map((y) => (
      <line key={y} x1={12} y1={y} x2={y === 91 ? 88 : 60} y2={y} stroke={I} strokeWidth={0.6} />
    ))}
  </>
)

// One list, always within reach; one box of time for the thing that matters.
const todo = (
  <>
    {R(6).map((i) => {
      const y = 9 + i * 15
      const done = i < 3
      const now = i === 3
      return (
        <g key={i}>
          <rect x={7} y={y} width={9} height={9} fill={now ? A : 'none'} stroke={now ? A : I} strokeWidth={1.3} />
          {done && <path d={`M9 ${y + 4.6}L11.6 ${y + 7}L15 ${y + 2}`} fill='none' stroke={I} strokeWidth={1.4} />}
          <rect x={23} y={y + 2.8} width={[58, 44, 66, 52, 62, 38][i]} height={3.4} fill={now ? A : I} opacity={done ? 0.4 : 1} />
          {done && <line x1={21} y1={y + 4.5} x2={25 + [58, 44, 66, 52, 62, 38][i]} y2={y + 4.5} stroke={I} strokeWidth={0.7} />}
        </g>
      )
    })}
    <rect x={3.5} y={50.5} width={93} height={16} fill='none' stroke={A} strokeWidth={0.8} strokeDasharray='2 1.6' />
  </>
)

// Deep modules: a small interface over a lot of hidden depth, next to the opposite.
const deepModule = (
  <>
    <rect x={12} y={10} width={26} height={4} fill={A} />
    <rect x={12} y={17} width={26} height={71} fill={I} />
    <rect x={50} y={10} width={40} height={4} fill={A} />
    <rect x={50} y={17} width={40} height={13} fill={I} />
    {R(6).map((i) => (
      <line key={i} x1={16} y1={28 + i * 10} x2={34} y2={28 + i * 10} stroke={B} strokeWidth={0.6} />
    ))}
    <line x1={6} y1={91} x2={94} y2={91} stroke={I} strokeWidth={0.8} />
    <path d='M50 36V88H90V36' fill='none' stroke={I} strokeWidth={0.6} strokeDasharray='1.5 2' />
  </>
)

// Programming lays a brick. Engineering is the wall, over time.
const wall = (
  <>
    {R(8).flatMap((r) => {
      const y = 88 - r * 11.5
      const off = r % 2 ? -10 : 0
      const count = r < 5 ? 7 : 7 - (r - 4) * 2
      return R(count).map((c) => {
        const hot = r === 5 && c === 2
        return <rect key={`${r}-${c}`} x={off + c * 20 - 1} y={y} width={18} height={9.5} fill={hot ? A : I} />
      })
    })}
    <rect x={66} y={3} width={18} height={9.5} fill='none' stroke={I} strokeWidth={1.2} strokeDasharray='2 1.6' transform='rotate(-10 75 8)' />
  </>
)

// Grow @ Google 02: "it works" is the part above ground.
const growRoots = (
  <>
    <line x1={2} y1={36} x2={98} y2={36} stroke={I} strokeWidth={1.4} />
    <line x1={50} y1={36} x2={50} y2={12} stroke={I} strokeWidth={1.8} />
    <Leaf x={50} y={26} dir={-1} s={12} />
    <Leaf x={50} y={20} dir={1} s={12} />
    <g fill='none' stroke={A} strokeWidth={1.4} strokeLinecap='round'>
      <path d='M50 36V94' />
      <path d='M50 44Q36 50 28 66Q24 76 14 82M50 44Q64 50 72 66Q76 76 86 82' />
      <path d='M50 58Q42 66 40 80Q39 88 34 94M50 58Q58 66 60 80Q61 88 66 94' />
      <path d='M28 66Q22 66 12 62M72 66Q78 66 88 62M40 80Q34 82 26 92M60 80Q66 82 74 92' />
    </g>
  </>
)

// The permanent record is watching.
const record = (
  <>
    {R(20).map((i) => (
      <line key={i} x1={0} y1={2.5 + i * 5} x2={100} y2={2.5 + i * 5} stroke={I} strokeWidth={0.3} opacity={0.5} />
    ))}
    <path d='M4 50Q50 8 96 50Q50 92 4 50Z' fill={B} stroke={I} strokeWidth={1.8} />
    <circle cx={50} cy={50} r={19} fill={I} />
    <circle cx={50} cy={50} r={9} fill={B} />
    <circle cx={50} cy={50} r={3.6} fill={A} />
    <path d='M6 14V6H14M86 6H94V14M94 86V94H86M14 94H6V86' fill='none' stroke={A} strokeWidth={1.4} />
  </>
)

// A nib that broadcasts.
const nib = (
  <>
    <path d='M50 34L62 66L57 96H43L38 66Z' fill={I} />
    <line x1={50} y1={36} x2={50} y2={66} stroke={B} strokeWidth={1} />
    <circle cx={50} cy={68} r={3.4} fill={B} />
    <rect x={41} y={86} width={18} height={1.4} fill={B} />
    {[12, 21, 30].map((r) => (
      <path key={r} d={`M${f(50 + r * Math.cos(-2.5))} ${f(32 + r * Math.sin(-2.5))}A${r} ${r} 0 0 1 ${f(50 + r * Math.cos(-0.64))} ${f(32 + r * Math.sin(-0.64))}`} fill='none' stroke={A} strokeWidth={2} strokeLinecap='round' />
    ))}
  </>
)

// Grow @ Google 01: a seedling inside a fast feedback loop.
const growLoop = (
  <>
    <line x1={2} y1={78} x2={98} y2={78} stroke={I} strokeWidth={1.4} />
    <line x1={50} y1={78} x2={50} y2={50} stroke={I} strokeWidth={1.8} />
    <Leaf x={50} y={60} dir={-1} s={11} />
    <Leaf x={50} y={55} dir={1} s={11} />
    <path d='M22 78V84M36 78V88M50 78V92M64 78V88M78 78V84' stroke={I} strokeWidth={0.8} />
    <path d='M77 36A32 32 0 0 0 20 42' fill='none' stroke={A} strokeWidth={1.8} strokeLinecap='round' />
    <path d='M23 64A32 32 0 0 0 80 58' fill='none' stroke={A} strokeWidth={1.8} strokeLinecap='round' />
    <path d='M15 37L20 44L27 39M85 63L80 56L73 61' fill='none' stroke={A} strokeWidth={1.8} strokeLinecap='round' strokeLinejoin='round' />
  </>
)

// Blindsight: something between us and the light.
const eclipse = (
  <>
    {R(48).map((i) => {
      const a = (i * Math.PI) / 24
      const len = 6 + ((i * 7) % 11) * 1.7 + (i % 6 === 0 ? 10 : 0)
      return <line key={i} x1={f(50 + 25 * Math.cos(a))} y1={f(48 + 25 * Math.sin(a))} x2={f(50 + (25 + len) * Math.cos(a))} y2={f(48 + (25 + len) * Math.sin(a))} stroke={I} strokeWidth={0.6} />
    })}
    <circle cx={50} cy={48} r={22} fill={B} stroke={I} strokeWidth={1.2} />
    <circle cx={66.5} cy={33.5} r={3} fill={A} />
    {[
      [8, 10],
      [90, 16],
      [14, 84],
      [84, 90],
      [6, 50],
      [94, 62],
      [30, 96],
      [68, 4],
    ].map(([x, y], i) => (
      <circle key={i} cx={x} cy={y} r={0.8} fill={I} />
    ))}
  </>
)

/* ---------- 2018 and earlier ---------- */

// Set the goal, then execute.
const target = (
  <>
    {[36, 27, 18, 9].map((r, i) => (
      <circle key={r} cx={44} cy={56} r={r} fill={i % 2 ? B : I} />
    ))}
    <line x1={44} y1={56} x2={90} y2={10} stroke={A} strokeWidth={2.2} />
    <path d='M90 10L80 12M90 10L88 20M84 16L76 17M84 16L83 24' stroke={A} strokeWidth={1.6} strokeLinecap='round' />
    <circle cx={44} cy={56} r={2.6} fill={A} />
  </>
)

// A maker's tools: the keyboard.
const keyboard = (
  <>
    {R(4).flatMap((r) =>
      R(r === 3 ? 0 : 7 - (r === 2 ? 1 : 0)).map((c) => {
        const x = 5 + r * 3.5 + c * 12.6
        const y = 18 + r * 15
        const hot = r === 1 && c === 4
        return <rect key={`${r}-${c}`} x={f(x)} y={y} width={10.6} height={12} rx={2} fill={hot ? A : 'none'} stroke={hot ? A : I} strokeWidth={1.3} />
      })
    )}
    <rect x={8.5} y={63} width={14} height={12} rx={2} fill='none' stroke={I} strokeWidth={1.3} />
    <rect x={25.5} y={63} width={48} height={12} rx={2} fill={I} />
    <rect x={76.5} y={63} width={14} height={12} rx={2} fill='none' stroke={I} strokeWidth={1.3} />
    <path d='M50 86V96' stroke={I} strokeWidth={1} strokeDasharray='1.5 1.8' />
  </>
)

// Leverage.
const lever = (
  <>
    <line x1={2} y1={88} x2={98} y2={88} stroke={I} strokeWidth={1.2} />
    <path d='M66 66L78 88H54Z' fill={I} />
    <g transform='rotate(15 66 66)'>
      <rect x={-4} y={64} width={96} height={3.2} fill={I} />
      <rect x={70} y={40} width={24} height={24} fill={I} />
    </g>
    <circle cx={9} cy={36} r={5} fill={A} />
    <path d='M9 14V26M5 22L9 27L13 22' fill='none' stroke={A} strokeWidth={1.4} strokeLinecap='round' strokeLinejoin='round' />
  </>
)

// Five years, one winding road.
const fiveYears = (() => {
  const pt = (t: number): [number, number] => [50 + 32 * Math.sin(t * Math.PI * 2.5), 94 - 88 * t]
  return (
    <>
      <path d={line(R(81).map((i) => pt(i / 80)))} fill='none' stroke={I} strokeWidth={7} strokeLinecap='round' />
      <path d={line(R(81).map((i) => pt(i / 80)))} fill='none' stroke={B} strokeWidth={0.8} strokeDasharray='2.4 2.4' />
      {R(5).map((i) => {
        const [x, y] = pt(0.1 + i * 0.2)
        return (
          <g key={i}>
            <circle cx={f(x)} cy={f(y)} r={6.4} fill={i === 4 ? A : B} stroke={I} strokeWidth={1.6} />
            {R(i + 1).map((k) => (
              <circle key={k} cx={f(x - i * 1.1 + k * 2.2)} cy={f(y)} r={0.8} fill={i === 4 ? B : I} />
            ))}
          </g>
        )
      })}
    </>
  )
})()

// Academese in, classic style out.
const untangle = (
  <>
    <path d={line(R(241).map((i) => {
      const t = (i / 240) * Math.PI * 2
      return [27 + 19 * Math.sin(5 * t + 0.6), 50 + 34 * Math.sin(4 * t)]
    }))} fill='none' stroke={I} strokeWidth={0.8} />
    <path d='M48 50H56M53 46.5L57 50L53 53.5' fill='none' stroke={A} strokeWidth={1.6} strokeLinecap='round' strokeLinejoin='round' />
    {[34, 28, 32, 22, 30].map((w, i) => (
      <rect key={i} x={62} y={28 + i * 10} width={w} height={3} fill={i === 0 ? A : I} />
    ))}
  </>
)

// The practice is the tower; the judgement is knowing which block is load-bearing.
const tower = (
  <>
    {R(7).flatMap((r) =>
      R(3).map((c) => {
        const y = 82 - r * 11
        const pulled = r === 2 && c === 2
        if (pulled)
          return (
            <g key={`${r}-${c}`}>
              <rect x={60} y={y} width={17} height={9.4} fill='none' stroke={I} strokeWidth={0.8} strokeDasharray='1.6 1.6' />
              <rect x={80} y={y} width={17} height={9.4} fill={A} />
            </g>
          )
        return <rect key={`${r}-${c}`} x={22 + c * 19 + (r % 2 ? 1.5 : 0)} y={y} width={17} height={9.4} fill={I} />
      })
    )}
    <line x1={10} y1={93} x2={96} y2={93} stroke={I} strokeWidth={1.2} />
  </>
)

// Input and output.
const inputOutput = (
  <>
    <path d='M6 8H62V46H22L12 56V46H6Z' fill={B} stroke={I} strokeWidth={1.6} strokeLinejoin='round' />
    {[40, 44, 30].map((w, i) => (
      <rect key={i} x={14} y={17 + i * 8.5} width={w} height={3} fill={I} />
    ))}
    <path d='M38 40H94V78H88V90L76 78H38Z' fill={A} />
    {[42, 34, 40].map((w, i) => (
      <rect key={i} x={46} y={49 + i * 8.5} width={w} height={3} fill={B} />
    ))}
  </>
)

// Nineteen applications, sent off by hand.
const paperPlane = (
  <>
    <path d='M94 10L36 36L56 44Z' fill={I} />
    <path d='M94 10L56 44L64 66Z' fill={I} opacity={0.75} />
    <path d='M56 44L64 66L70 49Z' fill={A} />
    <path d='M4 96C30 96 46 84 38 72S20 68 28 82S56 80 60 62' fill='none' stroke={I} strokeWidth={1} strokeDasharray='2 2.4' />
    {R(19).map((i) => (
      <rect key={i} x={62 + (i % 5) * 7} y={74 + Math.floor(i / 5) * 6} width={5} height={3.6} fill={i === 18 ? A : 'none'} stroke={i === 18 ? A : I} strokeWidth={0.7} />
    ))}
  </>
)

// The funnel, and the one metric that matters at the bottom of it.
const funnel = (
  <>
    {[88, 72, 57, 43, 30, 16].map((w, i) => (
      <rect key={i} x={50 - w / 2} y={7 + i * 15} width={w} height={10} fill={i === 5 ? A : I} />
    ))}
    {R(5).map((i) => (
      <path key={i} d={`M50 ${18.5 + i * 15}V${21.5 + i * 15}`} stroke={I} strokeWidth={0.8} />
    ))}
  </>
)

// 初心: the first ring is still at the centre of all the later ones.
const core = (
  <>
    {R(9).map((k) => {
      const base = 6 + k * 4.8
      return (
        <path
          key={k}
          d={line(R(73).map((i) => {
            const a = (i / 72) * Math.PI * 2
            const r = base + 0.28 * k * Math.sin(3 * a + k * 0.9) + 0.18 * k * Math.sin(5 * a + k * 2)
            return [50 + r * Math.cos(a), 50 + r * Math.sin(a)]
          })) + 'Z'}
          fill='none'
          stroke={I}
          strokeWidth={0.7 + (k % 3 === 2 ? 0.7 : 0)}
        />
      )
    })}
    <circle cx={50} cy={50} r={3.6} fill={A} />
  </>
)

// A slot machine in your pocket.
const hijack = (
  <>
    <rect x={27} y={4} width={46} height={92} rx={7} fill='none' stroke={I} strokeWidth={2.2} />
    <rect x={44} y={8.5} width={12} height={2} rx={1} fill={I} />
    <path d={line(R(221).map((i) => {
      const t = i * 0.1
      return [50 + 0.86 * t * Math.cos(t), 52 + 0.86 * t * Math.sin(t)]
    }))} fill='none' stroke={I} strokeWidth={1.3} />
    <circle cx={50} cy={52} r={2.4} fill={A} />
    <circle cx={73} cy={10} r={8} fill={A} />
    <rect x={72} y={5.5} width={2} height={6} fill={B} />
    <rect x={72} y={13} width={2} height={2} fill={B} />
    <path d='M8 30H20M6 52H20M8 74H20M80 30H92M80 52H94M80 74H92' stroke={I} strokeWidth={0.8} strokeDasharray='1.5 2' />
  </>
)

// The answer sheet.
const answerSheet = (() => {
  const pick = [1, 3, 0, 2, 2, 4, 1, 0, 3]
  return (
    <>
      {R(9).flatMap((r) => [
        <rect key={`n${r}`} x={5} y={7.6 + r * 10.4} width={7} height={2.4} fill={I} />,
        ...R(5).map((c) => {
          const on = pick[r] === c
          const hot = on && r === 5
          return <ellipse key={`${r}-${c}`} cx={24 + c * 16.5} cy={8.8 + r * 10.4} rx={5.6} ry={3.2} fill={hot ? A : on ? I : 'none'} stroke={hot ? A : I} strokeWidth={0.9} />
        }),
      ])}
    </>
  )
})()

// Chunking: loose facts gathered into chunks, chunks linked into understanding.
const chunks = (() => {
  const groups: [number, number, number, number][] = [
    [30, 30, 19, 6],
    [70, 44, 16, 5],
    [40, 74, 20, 7],
  ]
  return (
    <>
      {groups.map(([cx, cy, r, n], g) => {
        const pts = R(n).map((i): [number, number] => {
          const a = (i / n) * Math.PI * 2 + g
          const d = r * (0.45 + 0.3 * ((i * 3 + g) % 2))
          return [cx + d * Math.cos(a), cy + d * Math.sin(a)]
        })
        return (
          <g key={g}>
            <circle cx={cx} cy={cy} r={r} fill={B} stroke={I} strokeWidth={1.2} />
            <path d={line(pts) + 'Z'} fill='none' stroke={I} strokeWidth={0.6} />
            {pts.map(([x, y], i) => (
              <circle key={i} cx={f(x)} cy={f(y)} r={1.9} fill={I} />
            ))}
          </g>
        )
      })}
      <path d='M30 30L70 44L40 74Z' fill='none' stroke={A} strokeWidth={1.4} />
      {groups.map(([cx, cy], g) => (
        <circle key={g} cx={cx} cy={cy} r={3} fill={A} />
      ))}
      {[
        [84, 12],
        [92, 76],
        [78, 88],
        [8, 56],
        [62, 14],
        [90, 26],
        [10, 92],
        [70, 68],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={1.5} fill='none' stroke={I} strokeWidth={0.7} />
      ))}
    </>
  )
})()

// Nobody chases the needle: the reading comes from the generators underneath it.
const signal = (() => {
  const cx = 50
  const cy = 47
  const at = (deg: number, r: number): [number, number] => [f(cx + r * Math.cos((deg * Math.PI) / 180)), f(cy - r * Math.sin((deg * Math.PI) / 180))]
  const [nx, ny] = at(50, 31)
  return (
    <>
      {R(5).map((i) => (
        <line key={i} x1={14 + i * 18} y1={80} x2={cx} y2={cy} stroke={I} strokeWidth={0.8} />
      ))}
      <path d={`M${cx - 36} ${cy}A36 36 0 0 1 ${cx + 36} ${cy}Z`} fill={I} />
      {R(8).map((k) => {
        const [x1, y1] = at(160 - k * 20, 27)
        const [x2, y2] = at(160 - k * 20, 32)
        return <line key={k} x1={x1} y1={y1} x2={x2} y2={y2} stroke={B} strokeWidth={1.4} />
      })}
      <line x1={cx} y1={cy} x2={nx} y2={ny} stroke={A} strokeWidth={2.6} strokeLinecap='round' />
      <circle cx={cx} cy={cy} r={3.4} fill={B} />
      {R(4).map((i) => (
        <circle key={i} cx={14 + i * 18} cy={85} r={5.4} fill={I} />
      ))}
      <circle cx={86} cy={85} r={4.6} fill='none' stroke={I} strokeWidth={1.6} />
    </>
  )
})()

export const COVERS: Record<string, Cover> = {
  'what-to-pursue-instead-of-happiness': { palette: P.yellow, layout: 'inset', art: signal },
  'aie-code-summit-2026-best-talks': { palette: P.ink, layout: 'framed', art: talks },
  'taxonomy-differences-matter': { palette: P.paper, layout: 'inset', art: taxonomy },
  'memory-systems-should-be-evolved': { palette: P.sky, layout: 'bleed', art: evolve },
  'software-speciation': { palette: P.forest, layout: 'framed', art: speciation },
  'bespoke-flywheel': { palette: P.orange, layout: 'bleed', art: flywheel },
  'ai-memory-negative-space': { palette: P.navy, layout: 'framed', art: negativeSpace },
  '2025-games-of-the-year': { palette: P.plum, layout: 'bleed', art: games },
  'why-you-should-work-on-ai-engineering': { palette: P.mint, layout: 'inset', art: nondeterminism },
  'ai-assisted-system-design-interview-prep': { palette: P.lilac, layout: 'framed', art: systemDesign },
  'hotel-california-2025': { palette: P.blush, layout: 'bleed', art: hotelCalifornia },
  'how-to-be-great-101': { palette: P.yellow, layout: 'inset', art: great },
  'building-llm-apps-2024': { palette: P.teal, layout: 'framed', art: iceberg },
  'why-is-ml-runtime-infra-so-hard': { palette: P.sage, layout: 'inset', art: infraStack },
  'dri-vs-owner': { palette: P.red, layout: 'inset', art: dri },
  'staff-eng-learnings-2024': { palette: P.sky, layout: 'bleed', art: bridge },
  'demystifying-tlm': { palette: P.orange, layout: 'inset', art: tlm },
  'tl-learnings-2022': { palette: P.mint, layout: 'bleed', art: formation },
  'staff-engineer': { palette: P.paper, layout: 'framed', art: archetypes },
  'self-awareness-with-tools': { palette: P.blush, layout: 'bleed', art: wearable },
  'edit-tech-direction': { palette: P.yellow, layout: 'framed', art: editing },
  'rethink-pessimism': { palette: P.navy, layout: 'bleed', art: spiral },
  'superficial-similarity': { palette: P.sage, layout: 'inset', art: similarity },
  'grow-at-google-03': { palette: P.forest, layout: 'inset', art: growMentor },
  'my-time-management-system-2020': { palette: P.sky, layout: 'framed', art: todo },
  'a-philosophy-of-software-design': { palette: P.plum, layout: 'framed', art: deepModule },
  'programming-vs-software-engineering': { palette: P.red, layout: 'bleed', art: wall },
  'grow-at-google-02': { palette: P.teal, layout: 'inset', art: growRoots },
  'permanent-record-excerpts': { palette: P.ink, layout: 'bleed', art: record },
  'david-perell-writing-online': { palette: P.orange, layout: 'framed', art: nib },
  'grow-at-google-01': { palette: P.mint, layout: 'inset', art: growLoop },
  'blindsight-excerpts': { palette: P.plum, layout: 'bleed', art: eclipse },
  'five-year-learning-2013-2018': { palette: P.yellow, layout: 'inset', art: target },
  'liqi-interview': { palette: P.lilac, layout: 'framed', art: keyboard },
  'the-effective-engineer': { palette: P.teal, layout: 'inset', art: lever },
  'five-year-summary-2013-2018': { palette: P.blush, layout: 'bleed', art: fiveYears },
  'steven-pinker-linguistics-style-writing': { palette: P.paper, layout: 'framed', art: untangle },
  'programming-beyond-practices': { palette: P.sky, layout: 'inset', art: tower },
  'improve-english': { palette: P.red, layout: 'framed', art: inputOutput },
  'gradapply-diy': { palette: P.navy, layout: 'bleed', art: paperPlane },
  'alistair-croll-lean-analytics-growth-hacking': { palette: P.mint, layout: 'framed', art: funnel },
  'stay-gold': { palette: P.ink, layout: 'inset', art: core },
  'how-technology-is-hijacking-your-mind': { palette: P.plum, layout: 'framed', art: hijack },
  'toefl-gre-prep': { palette: P.sage, layout: 'framed', art: answerSheet },
  'notes-learning-how-to-learn': { palette: P.lilac, layout: 'bleed', art: chunks },
}
