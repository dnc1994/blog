'use client'

import cn from 'clsx'
import { usePathname } from 'next/navigation'

// Index-style pages use the full 1280px canvas; everything else gets a
// centered reading column.
const WIDE_ROUTES = ['/', '/posts']

export default function ContentFrame({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const wide = WIDE_ROUTES.includes(pathname.replace(/\/$/, '') || '/')

  return (
    <article className={cn(!wide && 'mx-auto max-w-[44rem]')}>
      {children}
    </article>
  )
}
