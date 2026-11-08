'use client'

import cn from 'clsx'
import Link from 'next/link'
import { useDecode } from '@/components/decode'
import type { DumpEntry } from '@/lib/dump'

const GRID =
  'grid items-baseline gap-x-5 grid-cols-[minmax(0,1fr)_auto] md:grid-cols-[7rem_minmax(0,1fr)_6.5rem] lg:grid-cols-[7rem_minmax(0,14rem)_minmax(0,1fr)_6.5rem]'

function DumpRow({ entry, delay }: { entry: DumpEntry; delay: number | null }) {
  const title = useDecode(entry.title, { delay, duration: 520 + entry.title.length * 9 })
  const date = useDecode(entry.date, { delay: delay === null ? null : delay + 260, duration: 420 })

  const replay = () => {
    title.replay()
    date.replay()
  }

  return (
    <li>
      <Link
        href={entry.href}
        draggable={false}
        onMouseEnter={replay}
        onFocus={replay}
        className={cn(
          GRID,
          'group px-3 sm:px-4 py-3 border-b border-rurikon-100 transition-colors',
          'hover:bg-rurikon-50 focus-visible:bg-rurikon-50 focus-visible:outline-none'
        )}
      >
        <span className='hidden md:block font-mono text-sm text-rurikon-accent'>{entry.offset}</span>
        <span
          aria-hidden='true'
          className='hidden lg:block font-mono text-sm text-rurikon-ghost whitespace-nowrap overflow-hidden'
        >
          {entry.hex}
        </span>
        <span className='min-w-0 font-display text-[1.06rem] sm:text-lg leading-snug text-rurikon-600 group-hover:text-rurikon-800 truncate'>
          <span className='sr-only'>{entry.title}</span>
          <span aria-hidden='true' className={cn(title.pending && 'decode-pending')}>
            {title.display}
          </span>
        </span>
        <time
          dateTime={entry.date.replace(/\./g, '-')}
          className={cn(
            'font-mono text-sm tabular-nums text-right transition-colors',
            date.progress < 1 ? 'text-rurikon-ghost' : 'text-rurikon-300 group-hover:text-rurikon-signal'
          )}
        >
          <span className={cn(date.pending && 'decode-pending')}>{date.display}</span>
        </time>
      </Link>
    </li>
  )
}

export type DumpItem = DumpEntry | { year: string }

export function DumpList({
  items,
  animateFirst = 12,
  footer,
}: {
  items: DumpItem[]
  /** how many rows play the decode-on-load intro (the rest only on hover) */
  animateFirst?: number
  footer?: React.ReactNode
}) {
  let rowIndex = 0
  return (
    <div className='border border-rurikon-border bg-[color-mix(in_srgb,var(--color-rurikon-50)_45%,transparent)]'>
      <div
        aria-hidden='true'
        className={cn(GRID, 'px-3 sm:px-4 py-2.5 border-b border-rurikon-border font-mono text-[11px] tracking-[0.12em] text-rurikon-300')}
      >
        <span className='hidden md:block'>OFFSET</span>
        <span className='hidden lg:block'>HEX</span>
        <span>DECODED</span>
        <span className='text-right'>WRITTEN</span>
      </div>
      <ul>
        {items.map((item) => {
          if ('year' in item) {
            return (
              <li
                key={`year-${item.year}`}
                className='px-3 sm:px-4 pt-6 pb-2 border-b border-rurikon-100 font-mono text-xs tracking-[0.16em] text-rurikon-signal'
              >
                {'// '}
                {item.year}
              </li>
            )
          }
          const i = rowIndex++
          return (
            <DumpRow
              key={item.slug}
              entry={item}
              delay={i < animateFirst ? 150 + i * 70 : null}
            />
          )
        })}
      </ul>
      {footer && (
        <div className='flex flex-wrap justify-between gap-3 px-3 sm:px-4 py-3 font-mono text-xs text-rurikon-300'>
          {footer}
        </div>
      )}
    </div>
  )
}
