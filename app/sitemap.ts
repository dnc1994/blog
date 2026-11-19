import type { MetadataRoute } from 'next'
import { getAllArticles } from '@/lib/articles'
import { SITE_URL } from '@/lib/seo'

export const dynamic = 'force-static'

// Static routes worth indexing. Legacy /notes/* routes are omitted: they
// canonicalize to /posts/*.
const STATIC_ROUTES = [
  '',
  '/posts',
  '/library',
  '/projects',
  '/gallery',
  '/lists',
  '/lists/ai-research',
  '/lists/design',
  '/lists/sci-fi',
  '/lists/working-with-ai',
  '/misc',
  '/resume',
  '/tags/all',
  '/the-best-things',
  '/hyperbola',
  '/my-subscriptions',
  '/taste-loss-taxonomy',
  '/dive',
]

function toDate(date: string): Date | undefined {
  const m = date.match(/^(\d{4})[.-](\d{2})[.-](\d{2})$/)
  return m ? new Date(Date.UTC(+m[1], +m[2] - 1, +m[3])) : undefined
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // getAllArticles() already excludes drafts outside local dev.
  const articles = await getAllArticles()
  return [
    ...STATIC_ROUTES.map((route) => ({ url: `${SITE_URL}${route}` })),
    ...articles.map((a) => ({
      url: `${SITE_URL}/${a.section}/${a.slug}`,
      lastModified: toDate(a.date),
    })),
  ]
}
