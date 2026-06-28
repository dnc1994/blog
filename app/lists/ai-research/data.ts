export interface AIResearchResource {
  id: string
  name: string
  description: string
  url: string
}

export const resources: AIResearchResource[] = [
  {
    id: 'history-of-llms',
    name: 'A History of Large Language Models',
    description: 'Traces the academic foundations of modern LLMs through key innovations: distributed word representations, sequence-to-sequence models, attention, transformers, and generative pre-training.',
    url: 'https://gregorygundersen.com/blog/2025/10/01/large-language-models/',
  },
]
