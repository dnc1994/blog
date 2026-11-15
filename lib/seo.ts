export const SITE_URL = 'https://linghao.io'

function toAbsoluteUrl(url: string) {
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }
  return new URL(url, SITE_URL).toString()
}

function getImageType(url: string) {
  const cleanUrl = url.split('?')[0].toLowerCase()
  if (cleanUrl.endsWith('.png')) return 'image/png'
  if (cleanUrl.endsWith('.jpg') || cleanUrl.endsWith('.jpeg')) return 'image/jpeg'
  if (cleanUrl.endsWith('.webp')) return 'image/webp'
  if (cleanUrl.endsWith('.gif')) return 'image/gif'
  return undefined
}

export function resolveSocialImage(
  image?: string,
  width: number = 1200,
  height: number = 630,
) {
  if (!image) return undefined

  const url = toAbsoluteUrl(image)
  return {
    url,
    secureUrl: url,
    type: getImageType(url),
    width,
    height,
    alt: 'Social card image',
  }
}

const HREFLANG: Record<string, string> = { en: 'en', zh: 'zh-Hans' }

/**
 * Canonical URL plus hreflang links for an article. `group` is every article
 * sharing its translationId (including itself); pass [] when untranslated.
 */
export function resolveAlternates(
  section: string,
  slug: string,
  group: { slug: string; language?: string }[] = [],
) {
  const urlFor = (s: string) => `${SITE_URL}/${section}/${s}`
  const languages =
    group.length > 1
      ? Object.fromEntries(
          group.map((a) => [HREFLANG[a.language ?? 'en'] ?? a.language!, urlFor(a.slug)]),
        )
      : undefined
  return { canonical: urlFor(slug), languages }
}
