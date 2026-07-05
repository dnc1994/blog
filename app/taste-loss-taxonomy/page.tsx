import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Taste Loss Taxonomy',
  description: 'A taxonomy of the losses caused by bad model taste.',
  alternates: {
    canonical: '/taste-loss-taxonomy',
  },
  openGraph: {
    title: 'Taste Loss Taxonomy · Linghao Zhang',
    description: 'A taxonomy of the losses caused by bad model taste.',
    url: 'https://linghao.io/taste-loss-taxonomy',
    type: 'article',
  },
}

export default function TasteLossTaxonomyPage() {
  return (
    <iframe
      src="/taste-loss-taxonomy/index.html"
      className="fixed inset-0 w-screen h-screen border-0 z-50"
      title="Taste Loss Taxonomy"
    />
  )
}
