import type { SVGProps } from 'react'
import {
  BwCalendarLogo,
  PostSummarizerBotLogo,
  RedactleZhLogo,
} from './logos'

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
      'A Telegram bot that summarizes long-form posts for faster reading, with a high personalized offline eval workflow that lets you systematically hill-climb the prompt using collected user feedback.',
    repoUrl: 'https://github.com/dnc1994/post_summarizer_bot',
    logo: PostSummarizerBotLogo,
  },
  {
    id: 'redactle-zh',
    name: 'Redactle 中文版',
    description:
      'A daily Chinese word-guessing game based on Redactle (https://redactle.net/). Each day, a Chinese Wikipedia article is presented with most characters redacted. Guess words to reveal them - your goal is to uncover the article title.',
    repoUrl: 'https://redactle-zh.linghao.io/',
    logo: RedactleZhLogo,
  },
  {
    id: 'bw-calendar',
    name: 'BW Calendar',
    description:
      'A privacy-first and minimalist Obsidian plugin for viewing personal event logs.',
    repoUrl: 'https://github.com/dnc1994/bw-calendar',
    logo: BwCalendarLogo,
  },
]
