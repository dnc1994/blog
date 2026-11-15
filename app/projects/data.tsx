import type { ReactNode, SVGProps } from 'react'
import {
  BurningChariotLogo,
  BwCalendarLogo,
  FirecrackersLogo,
  GlassBrainLogo,
  HermesSidebarLogo,
  MagiLogo,
  PostSummarizerBotLogo,
  RedactleZhLogo,
  StillwaterLogo,
  TasteLossTaxonomyLogo,
  XumingLogo,
} from './logos'

export type ProjectLogo = (props: SVGProps<SVGSVGElement>) => JSX.Element

export interface Project {
  id: string
  name: string
  description: ReactNode
  repoUrl: string
  logo: ProjectLogo
}

// To override a logo, swap the `logo` component for a project below.
export const projects: Project[] = [
  {
    id: 'stillwater',
    name: '止水 Stillwater',
    description:
      'Be a duck and drift through one slow day on a river in Jiangnan: fly under stone bridges, dive for snails, beg for bread and gather lost ducklings, all generated in the browser.',
    repoUrl: 'https://stillwater.linghao.io/',
    logo: StillwaterLogo,
  },
  {
    id: 'firecrackers',
    name: '满地红 Firecrackers',
    description:
      'A first-person sandbox set on Chinese New Year\'s Eve in a southern village: pockets full of firecrackers, no quests, and everything in the yard, the lanes and the fields is fair game.',
    repoUrl: 'https://mandihong.linghao.io/',
    logo: FirecrackersLogo,
  },
  {
    id: 'xuming',
    name: '续命工坊 Xuming Workshop',
    description:
      'A Chinese meme-culture idle clicker: every click buys one more second of life, and the long-term goal is to extend the whole universe by one second.',
    repoUrl: 'https://xuming.linghao.io/',
    logo: XumingLogo,
  },
  {
    id: 'glass-brain',
    name: 'Glass Brain',
    description:
      "An interactive replay of an AI assistant's memory forming over a simulated year of one user's chats.",
    repoUrl: 'https://dnc1994.github.io/glass-brain/',
    logo: GlassBrainLogo,
  },
  {
    id: 'burning-chariot',
    name: '燃烧战车 Burning Chariot',
    description:
      'A browser remake of the classic turn-based tank artillery game, with wind and destructible terrain.',
    repoUrl: 'https://burning-chariot.linghao.io/',
    logo: BurningChariotLogo,
  },
  {
    id: 'taste-loss-taxonomy',
    name: 'Taste Loss Taxonomy',
    description:
      'A taxonomy of the losses caused by bad model taste.',
    repoUrl: 'https://linghao.io/taste-loss-taxonomy',
    logo: TasteLossTaxonomyLogo,
  },
  {
    id: 'redactle-zh',
    name: 'Redactle 中文版',
    description: (
      <>
        A daily Chinese word-guessing game based on{' '}
        <a
          href='https://redactle.net/'
          target='_blank'
          rel='noopener noreferrer'
          className='underline decoration-rurikon-200 hover:decoration-rurikon-accent hover:text-rurikon-accent transition-colors'
        >
          Redactle
        </a>
        . Each day, a Chinese Wikipedia article is presented with most characters redacted. Guess words to reveal them - your goal is to uncover the article title.
      </>
    ),
    repoUrl: 'https://redactle-zh.linghao.io/',
    logo: RedactleZhLogo,
  },
  {
    id: 'magi',
    name: 'MAGI',
    description:
      'A terminal GUI simulating the MAGI supercomputer voting system from Neon Genesis Evangelion. Three subsystems — MELCHIOR-1, BALTHASAR-2, and CASPAR-3 — deliberate via LLM calls to reach a consensus.',
    repoUrl: 'https://github.com/dnc1994/magi',
    logo: MagiLogo,
  },
  {
    id: 'obsidian-hermes-sidebar',
    name: 'Obsidian Hermes Sidebar',
    description:
      'An Obsidian plugin that brings the Hermes agent into a right-sidebar panel, letting you ask questions about the active note.',
    repoUrl: 'https://github.com/dnc1994/obsidian-hermes-sidebar',
    logo: HermesSidebarLogo,
  },
  {
    id: 'post-summarizer-bot',
    name: 'Post Summarizer Bot',
    description:
      'A Telegram bot that summarizes long-form posts for faster reading, with a high personalized offline eval workflow that lets you systematically hill-climb the prompt using collected user feedback.',
    repoUrl: 'https://github.com/dnc1994/post_summarizer_bot',
    logo: PostSummarizerBotLogo,
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
