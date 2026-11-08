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
  {
    id: 'calculus-of-interfaces',
    name: 'The Calculus of Interfaces',
    description: 'Shu Ding’s Vercel Labs prototype that compiles a React page into a single function from inputs to layout, so a design can be analyzed with calculus.',
    url: 'https://calculus-of-interfaces.vercel.app/',
  },
]
