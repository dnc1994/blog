export interface DesignResource {
  id: string
  name: string
  description: string
  url: string
}

export const resources: DesignResource[] = [
  {
    id: 'kami',
    name: 'Kami',
    description: 'A quiet design system for producing professional AI-generated documents, including resumes, one-pagers, portfolios, slides, and landing pages.',
    url: 'https://github.com/tw93/Kami',
  },
]
