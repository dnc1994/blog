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
]
