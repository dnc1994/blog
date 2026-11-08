// Build-time layout for /dive: places every post in 3D so that posts about
// similar things sit near each other. Runs once during `next build`
// (static export), so visitors only download the resulting coordinates.
//
// Pipeline: MDX text -> tokens (English words + CJK bigrams, title and tags
// boosted) -> TF-IDF -> cosine similarity -> classical MDS to 3D.

import { promises as fs } from 'fs'
import path from 'path'
import { getDedupedArticlesFromSection } from '@/lib/articles'

export type DiveGroup = { id: string; label: string; color: string }

export type DiveNode = {
  slug: string
  title: string
  date: string
  group: string
  x: number
  y: number
  z: number
  size: number
}

export type DiveMap = {
  nodes: DiveNode[]
  edges: [number, number, number][]
  groups: DiveGroup[]
}

export const GROUPS: DiveGroup[] = [
  { id: 'ai', label: 'AI & memory', color: '#3AA99F' },
  { id: 'ideas', label: 'Ideas', color: '#8B7EC8' },
  { id: 'career', label: 'Career & engineering', color: '#4385BE' },
  { id: 'books', label: 'Books', color: '#879A39' },
  { id: 'life', label: 'Life & play', color: '#DA702C' },
]

const TAG_GROUP: Record<string, string> = {
  AI: 'ai', Memory: 'ai', Product: 'ai',
  Philosophy: 'ideas', Writing: 'ideas', 'Personal Growth': 'ideas',
  Career: 'career', 'Staff+': 'career', 'Software Engineering': 'career',
  Books: 'books',
  'Life Abroad': 'life', Language: 'life', Productivity: 'life', Gaming: 'life',
}

const STOP = new Set(
  ('the and for are but not you all any can her was one our out day get has him his how man new now old see two way who boy did its let put say she too use that with have this will your from they know want been good much some time very when come here just like long make many more only over such take than them well were what into also most other could would there their about which these those then being does should after because through where while each between both same again still even every never really thing things want need make made going like just also using used one two lot get got way may might much many much its it\'s i\'m don\'t can\'t you\'re that\'s there\'s what\'s https http www com')
    .split(/\s+/)
)

function clean(mdx: string) {
  return mdx
    .replace(/^export\s+const\s+metadata[\s\S]*?^}\s*$/m, '')
    .replace(/^import\s.*$/gm, '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/https?:\/\/\S+/g, ' ')
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, ' ')
}

const CJK = /[一-鿿㐀-䶿]/

function tokenize(text: string): string[] {
  const tokens: string[] = []
  for (const w of text.toLowerCase().match(/[a-z][a-z'+-]{2,}/g) ?? []) {
    const word = w.replace(/'s$/, '').replace(/^-+|-+$/g, '')
    if (word.length > 2 && !STOP.has(word)) tokens.push(word.replace(/s$/, ''))
  }
  const cjk = Array.from(text).filter((ch) => CJK.test(ch) || ch === '\n')
  for (let i = 0; i < cjk.length - 1; i++) {
    if (cjk[i] !== '\n' && cjk[i + 1] !== '\n') tokens.push(cjk[i] + cjk[i + 1])
  }
  return tokens
}

// Classical MDS: top-k eigenvectors of the double-centred squared-distance matrix
function mds(dist: number[][], k = 3): number[][] {
  const n = dist.length
  const d2 = dist.map((row) => row.map((v) => v * v))
  const rowMean = d2.map((r) => r.reduce((a, b) => a + b, 0) / n)
  const total = rowMean.reduce((a, b) => a + b, 0) / n
  const B = d2.map((r, i) => r.map((v, j) => -0.5 * (v - rowMean[i] - rowMean[j] + total)))

  const coords: number[][] = Array.from({ length: n }, () => [])
  const M = B.map((r) => [...r])
  for (let c = 0; c < k; c++) {
    // deterministic start vector so builds are reproducible
    let v = Array.from({ length: n }, (_, i) => Math.sin(i * 12.9898 + c * 78.233))
    let lambda = 0
    for (let iter = 0; iter < 300; iter++) {
      const w = M.map((r) => r.reduce((s, x, j) => s + x * v[j], 0))
      const norm = Math.sqrt(w.reduce((s, x) => s + x * x, 0)) || 1
      v = w.map((x) => x / norm)
      lambda = norm
    }
    const scale = Math.sqrt(Math.max(lambda, 1e-9))
    v.forEach((x, i) => coords[i].push(x * scale))
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) M[i][j] -= lambda * v[i] * v[j]
  }
  return coords
}

// Force-directed refinement seeded by MDS: similar posts attract (springs to
// their 3 nearest neighbours), everything repels, a weak pull keeps the
// islands (e.g. the Chinese posts) from drifting off. Deterministic.
function relax(p: number[][], sim: number[][], iters = 600) {
  const n = p.length
  const springs: [number, number, number][] = []
  sim.forEach((row, i) =>
    row
      .map((s, j) => [j, s] as const)
      .filter(([j]) => j !== i)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .forEach(([j, s]) => springs.push([i, j, s]))
  )
  for (let it = 0; it < iters; it++) {
    const f = p.map(() => [0, 0, 0])
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const d = [p[i][0] - p[j][0], p[i][1] - p[j][1], p[i][2] - p[j][2]]
        const dist2 = Math.max(0.25, d[0] ** 2 + d[1] ** 2 + d[2] ** 2)
        const k = 26 / dist2 / Math.sqrt(dist2)
        for (let a = 0; a < 3; a++) {
          f[i][a] += d[a] * k
          f[j][a] -= d[a] * k
        }
      }
    }
    for (const [i, j, s] of springs) {
      const d = [p[j][0] - p[i][0], p[j][1] - p[i][1], p[j][2] - p[i][2]]
      const dist = Math.sqrt(d[0] ** 2 + d[1] ** 2 + d[2] ** 2) || 1e-6
      const rest = 2.5 + 5 * (1 - Math.min(1, s * 2))
      const k = (0.12 * (dist - rest) * (0.5 + s)) / dist
      for (let a = 0; a < 3; a++) {
        f[i][a] += d[a] * k
        f[j][a] -= d[a] * k
      }
    }
    const lr = 0.4 * (1 - it / iters) + 0.02
    for (let i = 0; i < n; i++) {
      for (let a = 0; a < 3; a++) f[i][a] -= 0.03 * p[i][a]
      const m = Math.sqrt(f[i][0] ** 2 + f[i][1] ** 2 + f[i][2] ** 2)
      const step = Math.min(1.2, m * lr) / (m || 1)
      for (let a = 0; a < 3; a++) p[i][a] += f[i][a] * step
    }
  }
  // recentre and scale so the farthest node sits at radius 12
  for (let a = 0; a < 3; a++) {
    const mean = p.reduce((s, c) => s + c[a], 0) / n
    p.forEach((c) => (c[a] -= mean))
  }
  const r = Math.max(...p.map((c) => Math.hypot(c[0], c[1], c[2]))) || 1
  p.forEach((c) => c.forEach((_, a) => (c[a] = (c[a] / r) * 12)))
}

export async function buildDiveMap(): Promise<DiveMap> {
  const posts = await getDedupedArticlesFromSection('posts')
  const docs = await Promise.all(
    posts.map(async (p) => {
      const raw = await fs.readFile(path.join(process.cwd(), 'app/posts/_articles', `${p.slug}.mdx`), 'utf-8')
      const body = clean(raw)
      const title = p.title ?? ''
      const tokens = [
        ...tokenize(body),
        ...Array(3).fill(tokenize(title)).flat(),
        ...(p.tags ?? []).flatMap((t) => Array(4).fill('tag:' + t.toLowerCase())),
      ]
      return { post: p, tokens, words: body.split(/\s+/).length + Array.from(body).filter((c) => CJK.test(c)).length }
    })
  )

  // TF-IDF (sublinear tf), L2-normalised
  const df = new Map<string, number>()
  for (const d of docs) for (const t of new Set(d.tokens)) df.set(t, (df.get(t) ?? 0) + 1)
  const N = docs.length
  const vecs = docs.map((d) => {
    const tf = new Map<string, number>()
    for (const t of d.tokens) tf.set(t, (tf.get(t) ?? 0) + 1)
    const v = new Map<string, number>()
    let norm = 0
    for (const [t, f] of tf) {
      const docFreq = df.get(t) ?? 1
      if (docFreq < 2 && !t.startsWith('tag:')) continue // drop hapax terms
      const w = (1 + Math.log(f)) * Math.log(1 + N / docFreq)
      v.set(t, w)
      norm += w * w
    }
    norm = Math.sqrt(norm) || 1
    for (const [t, w] of v) v.set(t, w / norm)
    return v
  })

  const sim = vecs.map((a) =>
    vecs.map((b) => {
      let s = 0
      const [small, big] = a.size < b.size ? [a, b] : [b, a]
      for (const [t, w] of small) s += w * (big.get(t) ?? 0)
      return s
    })
  )

  const coords = mds(sim.map((r) => r.map((s) => Math.sqrt(Math.max(0, 2 - 2 * s)))))

  // Normalise each axis to the same spread to seed the force layout
  for (let axis = 0; axis < 3; axis++) {
    const vals = coords.map((c) => c[axis])
    const mean = vals.reduce((a, b) => a + b, 0) / N
    const sd = Math.sqrt(vals.reduce((a, b) => a + (b - mean) ** 2, 0) / N) || 1
    coords.forEach((c) => (c[axis] = ((c[axis] - mean) / sd) * 6))
  }
  relax(coords, sim)

  const maxWords = Math.max(...docs.map((d) => d.words))
  const nodes: DiveNode[] = docs.map((d, i) => {
    const group = (d.post.tags ?? []).map((t) => TAG_GROUP[t]).find(Boolean) ?? 'life'
    return {
      slug: d.post.slug,
      title: d.post.title ?? d.post.slug,
      date: d.post.date ?? '',
      group,
      x: +coords[i][0].toFixed(3),
      y: +coords[i][1].toFixed(3),
      z: +coords[i][2].toFixed(3),
      size: +(0.55 + 0.75 * Math.sqrt(d.words / maxWords)).toFixed(3),
    }
  })

  // Each post links to its two closest neighbours
  const seen = new Set<string>()
  const edges: [number, number, number][] = []
  sim.forEach((row, i) => {
    row
      .map((s, j) => [j, s] as const)
      .filter(([j]) => j !== i)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)
      .forEach(([j, s]) => {
        const key = i < j ? `${i}-${j}` : `${j}-${i}`
        if (!seen.has(key) && s > 0.05) {
          seen.add(key)
          edges.push([i, j, +s.toFixed(3)])
        }
      })
  })

  return { nodes, edges, groups: GROUPS }
}
