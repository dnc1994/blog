'use client'

import { useState, useEffect } from 'react'
import cn from 'clsx'

export type TocHeading = { id: string; text: string; level: number }

export function TocSidebar({
  headings,
  defaultOpen,
}: {
  headings: TocHeading[]
  defaultOpen: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  const [activeId, setActiveId] = useState('')

  useEffect(() => {
    if (headings.length === 0) return
    const ids = headings.map((h) => h.id)

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = new Set(
          entries.filter((e) => e.isIntersecting).map((e) => e.target.id)
        )
        // Pick the first heading (in document order) that's visible
        const active = ids.find((id) => visible.has(id))
        if (active) setActiveId(active)
      },
      { rootMargin: '-80px 0% -75% 0%', threshold: 0 }
    )

    for (const id of ids) {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    }
    return () => observer.disconnect()
  }, [headings])

  if (headings.length < 2) return null

  return (
    <>
      {/* Toggle button — always fixed on the right */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Close table of contents' : 'Open table of contents'}
        className={cn(
          'fixed right-4 md:right-6 top-1/3 z-50',
          'flex items-center justify-center w-8 h-8 rounded-sm',
          'border border-rurikon-border bg-[var(--background)]',
          'text-rurikon-300 hover:text-rurikon-500 hover:border-rurikon-400',
          'transition-colors cursor-pointer'
        )}
      >
        {open ? (
          // X icon
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth={1.5}
            className='w-4 h-4'
          >
            <path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
          </svg>
        ) : (
          // List icon
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth={1.5}
            className='w-4 h-4'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M8.25 6.75h12M8.25 12h12M8.25 17.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z'
            />
          </svg>
        )}
      </button>

      {/* TOC panel — slides in from the right */}
      <div
        className={cn(
          'fixed right-0 top-0 h-full w-60 z-40',
          'border-l border-rurikon-border bg-[var(--background)]',
          'overflow-y-auto',
          'transition-transform duration-200 ease-in-out',
          open ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className='px-5 pt-8 pb-8'>
          <p className='text-[11px] font-semibold uppercase tracking-widest text-rurikon-300 mb-4'>
            Contents
          </p>
          <nav className='flex flex-col'>
            {headings.map(({ id, text, level }) => (
              <a
                key={id}
                href={`#${id}`}
                className={cn(
                  'py-1 text-sm leading-snug transition-colors',
                  level === 2 && 'pl-0',
                  level === 3 && 'pl-3',
                  level === 4 && 'pl-6',
                  activeId === id
                    ? 'text-rurikon-accent'
                    : 'text-rurikon-300 hover:text-rurikon-500'
                )}
              >
                {text}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </>
  )
}
