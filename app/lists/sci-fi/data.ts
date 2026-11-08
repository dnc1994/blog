export interface SciFiResource {
  id: string
  name: string
  description: string
  url: string
}

export const resources: SciFiResource[] = [
  {
    id: 'valuable-humans-in-transit',
    name: 'Valuable Humans in Transit',
    description: 'qntm. A short story told by a superintelligent machine racing to preserve humanity through a sudden planetary catastrophe.',
    url: 'https://qntm.org/transi',
  },
  {
    id: 'fine-structure',
    name: 'Fine Structure',
    description: 'qntm. A serial novel that starts with a physicist stumbling onto a hidden store of advanced science, in a universe that keeps rewriting its own rules.',
    url: 'https://qntm.org/structure',
  },
  {
    id: 'learning-to-be-me',
    name: 'Learning to Be Me',
    description: 'Greg Egan, 1990. A jewel implanted at birth learns to mirror your mind perfectly, which raises the question of which of you is really you.',
    url: 'https://en.wikipedia.org/wiki/Learning_to_Be_Me',
  },
  {
    id: 'diaspora',
    name: 'Diaspora',
    description: 'Greg Egan, 1997. Humanity’s descendants, most of them software minds, set out across the universe in a novel about uploaded consciousness, mathematics, and deep time.',
    url: 'https://en.wikipedia.org/wiki/Diaspora_(novel)?useskin=vector',
  },
  {
    id: 'blindsight',
    name: 'Blindsight',
    description: 'Peter Watts, 2006. First contact with an intelligence that may not be conscious at all, and a hard look at whether intelligence needs consciousness.',
    url: 'https://en.wikipedia.org/wiki/Blindsight_(Watts_novel)',
  },
]
