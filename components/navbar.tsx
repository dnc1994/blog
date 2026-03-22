'use client'

import cn from 'clsx'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import ThemeToggle from '@/components/theme-toggle'

function Item(props: React.ComponentProps<typeof Link>) {
  const pathname = usePathname()
  const href = props.href

  if (typeof href !== 'string') {
    throw new Error('`href` must be a string')
  }

  const isActive = pathname === href || pathname.startsWith(href + '/')

  return (
    <li
      className={cn(
        isActive
          ? 'text-rurikon-800'
          : 'text-rurikon-300 hover:text-rurikon-600',
        'transition-colors',
        '-mx-2'
      )}
    >
      <Link {...props} className='inline-block w-full px-2' draggable={false} />
    </li>
  )
}

export default function Navbar() {
  return (
    <nav className='mobile:mr-6 sm:mr-10 md:mr-14 w-full mobile:w-auto mobile:shrink-0'>
      <div className='mobile:sticky top-6 sm:top-10 md:top-14 mb-6 mobile:mb-0'>
        <div className='flex items-center justify-end gap-3 mb-3 mobile:mb-5'>
          <Link
            href='/'
            className='text-right text-rurikon-700 font-semibold text-lg leading-snug not-italic font-sans whitespace-nowrap'
            draggable={false}
          >
            Synthesist in the Shell
          </Link>
          <div className='mobile:hidden shrink-0'><ThemeToggle /></div>
        </div>
        <ul className='lowercase text-right flex flex-wrap gap-x-3 gap-y-1 justify-end mobile:block'>
          <Item href='/'>About</Item>
          <Item href='/posts'>Posts</Item>
          <Item href='/projects'>Projects</Item>
          <Item href='/gallery'>Gallery</Item>
          <Item href='/lists'>Curation</Item>
        </ul>
        <div className='hidden mobile:flex justify-end mt-5'><ThemeToggle /></div>
      </div>
    </nav>
  )
}
