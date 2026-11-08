export interface WorkingWithAIResource {
  id: string
  name: string
  description: string
  url: string
}

export const resources: WorkingWithAIResource[] = [
  {
    id: 'how-to-be-more-ambitious',
    name: 'How to Be More Ambitious: A Tutorial for Humans with Models',
    description: 'Felix Rieseberg on why people aim too low with AI models, and a practical way to think bigger about outcomes, depth, and the expertise you can draw on.',
    url: 'https://felixrieseberg.com/how-to-be-more-ambitious-a-tutorial-for-humans-with-models/',
  },
]
