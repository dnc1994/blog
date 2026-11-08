// Helpers for the "memory dump" presentation of article lists.

const encoder = new TextEncoder()

/** First `bytes` bytes of the UTF-8 encoded string, as spaced hex pairs. */
export function toHex(text: string, bytes = 10): string {
  return Array.from(encoder.encode(text).slice(0, bytes))
    .map((b) => b.toString(16).padStart(2, '0').toUpperCase())
    .join(' ')
}

/** Address for the n-th entry counted from the oldest, 0x40 bytes apart. */
export function toOffset(indexFromOldest: number): string {
  return '0x' + (indexFromOldest * 0x40).toString(16).toUpperCase().padStart(6, '0')
}

export type DumpEntry = {
  slug: string
  title: string
  date: string
  tags: string[]
  href: string
  hex: string
  offset: string
}

/** Sort newest first and attach offset/hex. Dates are 'YYYY.MM.DD'. */
export function toDumpEntries(
  items: { slug: string; title?: string; date?: string; tags?: string[] }[],
  hrefFor: (slug: string) => string = (slug) => `/posts/${slug}`
): DumpEntry[] {
  const key = (d?: string) => Number((d ?? '').replace(/[.-]/g, '') || 0)
  const sorted = [...items].sort((a, b) => key(b.date) - key(a.date))
  const total = sorted.length
  return sorted.map((item, i) => ({
    slug: item.slug,
    title: item.title ?? '',
    date: item.date ?? '',
    tags: item.tags ?? [],
    href: hrefFor(item.slug),
    hex: toHex(item.title ?? ''),
    offset: toOffset(total - 1 - i),
  }))
}
