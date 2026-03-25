export interface Tool {
  id: string
  name: string
  description: string
  url: string
}

export const tools: Tool[] = [
  {
    id: 'rtk',
    name: 'rtk',
    description: 'Token-optimized CLI proxy for Claude Code — 60–90% token savings on dev operations.',
    url: 'https://github.com/rtk-ai/rtk',
  },
  {
    id: 'codelens-ai',
    name: 'Codelens AI',
    description: 'Correlates Claude Code token usage with git commits to measure AI coding productivity and ROI.',
    url: 'https://github.com/Akshat2634/Codelens-AI',
  },
]
