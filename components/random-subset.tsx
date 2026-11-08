'use client'

import { Children, useEffect, useState, type ReactNode } from 'react'

// Shows `count` randomly chosen children, re-picked on every page load.
// The site is statically exported, so the pick has to happen in the browser.
// The list stays transparent until the pick is made, so visitors don't see
// the first few items flash and then swap out.
export function RandomSubset({
  children,
  count,
  className,
}: {
  children: ReactNode
  count: number
  className?: string
}) {
  const items = Children.toArray(children)
  const [picked, setPicked] = useState<number[] | null>(null)

  useEffect(() => {
    const idx = items.map((_, i) => i)
    for (let i = idx.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[idx[i], idx[j]] = [idx[j], idx[i]]
    }
    setPicked(idx.slice(0, count))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length, count])

  const shown = (picked ?? items.map((_, i) => i).slice(0, count)).map((i) => items[i])

  return (
    <ul
      data-random-subset
      className={`${className ?? ''} transition-opacity duration-300 ${picked ? 'opacity-100' : 'opacity-0'}`}
    >
      {shown}
    </ul>
  )
}
