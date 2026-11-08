import Link from 'next/link'
import { DecodeText } from '@/components/decode'
import { DumpList } from '@/components/dump-list'
import { getDedupedArticlesFromSection } from '@/lib/articles'
import { toDumpEntries } from '@/lib/dump'
import { projects } from '@/app/projects/data'
import { RandomSubset } from '@/components/random-subset'

export function SectionLabel({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <h2
      id={id}
      className='mb-4 font-mono text-[13px] font-medium tracking-[0.14em] text-rurikon-300'
    >
      {children}
    </h2>
  )
}

export async function HomeHero() {
  const posts = await getDedupedArticlesFromSection('posts')
  const total = posts.length
  return (
    <section className='pb-12 sm:pb-16'>
      <p className='font-mono text-xs sm:text-[13px] tracking-[0.24em] text-rurikon-signal'>
        CORE DUMP · PID 2016 · SIGNAL: CURIOSITY
      </p>
      <h1 className='glitch glitch-jitter mt-4 font-display font-bold text-[clamp(3.4rem,10vw,8.75rem)] leading-[0.88] tracking-[-0.04em] text-rurikon-600'>
        <DecodeText text='Synthesist' delay={60} duration={650} />
        <br />
        <DecodeText text='in the Shell' delay={260} duration={750} />
      </h1>
      <div className='mt-8 flex flex-wrap items-end justify-between gap-6'>
        <p className='max-w-xl font-display text-lg sm:text-xl leading-relaxed text-rurikon-500'>
          Hey, I&apos;m Linghao. My mission is to synthesize knowledge and share
          it freely with all. Everything I&apos;ve written is dumped below, raw
          from memory.
        </p>
        <p className='font-mono text-xs leading-relaxed text-rurikon-300 sm:text-right'>
          {total} entries · 0x{total.toString(16).toUpperCase()}
          <br />
          en / 中文 · utf-8
        </p>
      </div>
    </section>
  )
}

export async function RecentDump({ count = 8 }: { count?: number }) {
  const posts = await getDedupedArticlesFromSection('posts')
  const entries = toDumpEntries(posts)
  return (
    <section aria-labelledby='recent' className='pb-14'>
      <SectionLabel id='recent'>$ xxd ~/writing | head -{count}</SectionLabel>
      <DumpList
        items={entries.slice(0, count)}
        footer={
          <>
            <span>
              -- {Math.min(count, entries.length)} of {entries.length} entries --
              <span aria-hidden='true' className='cursor-blink text-rurikon-accent'> █</span>
            </span>
            <Link href='/posts' className='text-rurikon-accent hover:text-rurikon-800 transition-colors'>
              dump all →
            </Link>
          </>
        }
      />
    </section>
  )
}

export function ProjectsPs({ count = 3 }: { count?: number }) {
  return (
    <section aria-labelledby='ps' className='pb-14'>
      <SectionLabel id='ps'>$ ps aux | grep projects</SectionLabel>
      {/* Without JS the list would stay transparent; show the first few instead. */}
      <noscript>
        <style>{'[data-random-subset]{opacity:1!important}'}</style>
      </noscript>
      <RandomSubset count={count} className='grid gap-3 grid-cols-[repeat(auto-fit,minmax(16rem,1fr))]'>
        {projects.map((p) => (
          <li
            key={p.id}
            className='group relative h-full p-5 border border-rurikon-border hover:border-rurikon-accent transition-colors'
          >
            <span className='font-mono text-xs text-rurikon-signal'>RUN</span>{' '}
            {/* Stretched link: descriptions may contain their own links */}
            <Link
              href={p.repoUrl}
              target='_blank'
              rel='noopener noreferrer'
              className='ml-1 font-display text-xl text-rurikon-600 group-hover:text-rurikon-800 after:absolute after:inset-0'
            >
              {p.name}
            </Link>
            <div className='relative z-10 mt-2 w-fit text-[0.95rem] leading-relaxed text-rurikon-400 [&_a]:underline [&_a]:decoration-rurikon-200 [&_a:hover]:text-rurikon-accent'>
              {p.description}
            </div>
          </li>
        ))}
      </RandomSubset>
      <Link
        href='/projects'
        className='inline-block mt-4 font-mono text-xs text-rurikon-accent hover:text-rurikon-800 transition-colors'
      >
        all {projects.length} processes →
      </Link>
    </section>
  )
}
