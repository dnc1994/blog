import type { SVGProps } from 'react'
import { BwCalendarLogo, PostSummarizerBotLogo } from './logos'

export type ProjectLogo = (props: SVGProps<SVGSVGElement>) => JSX.Element

export interface Project {
  id: string
  name: string
  description: string
  repoUrl: string
  logo: ProjectLogo
}

// To override a logo, swap the `logo` component for a project below.
export const projects: Project[] = [
  {
    id: 'post-summarizer-bot',
    name: 'Post Summarizer Bot',
    description:
      'A Telegram bot that summarizes forwarded posts and long-form content for faster reading.',
    repoUrl: 'https://github.com/dnc1994/post_summarizer_bot',
    logo: PostSummarizerBotLogo,
  },
  {
    id: 'bw-calendar',
    name: 'BW Calendar',
    description:
      'A focused calendar utility for tracking and organizing personal schedules with a clean workflow.',
    repoUrl: 'https://github.com/dnc1994/bw-calendar',
    logo: BwCalendarLogo,
  },
]
