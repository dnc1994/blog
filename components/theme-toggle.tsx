'use client'

import { useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

// Shared state so two mounted instances stay in sync
const subscribers = new Set<(t: Theme) => void>()

function notifyAll(theme: Theme) {
  subscribers.forEach((fn) => fn(theme))
}

function getStoredTheme(): Theme {
  try {
    const stored = localStorage.getItem('theme')
    if (stored === 'light' || stored === 'dark') return stored
  } catch {}
  return 'light'
}

function applyTheme(theme: Theme) {
  const html = document.documentElement
  html.classList.toggle('theme-dark', theme === 'dark')
  html.classList.toggle('theme-light', theme === 'light')
  try {
    localStorage.setItem('theme', theme)
  } catch {}
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null)

  useEffect(() => {
    const initial = getStoredTheme()
    setTheme(initial)
    subscribers.add(setTheme)
    return () => { subscribers.delete(setTheme) }
  }, [])

  function toggle() {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    applyTheme(next)
    notifyAll(next)
  }

  if (theme === null) return null

  const isDark = theme === 'dark'

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className='flex items-center leading-none text-rurikon-300 hover:text-rurikon-500 transition-colors'
    >
      {isDark ? (
        // Sun — shown in dark mode to switch to light
        <svg width='16' height='16' viewBox='0 0 16 16' fill='none' aria-hidden='true'>
          <circle cx='8' cy='8' r='3' stroke='currentColor' strokeWidth='1.25' />
          <line x1='8' y1='1' x2='8' y2='2.5' stroke='currentColor' strokeWidth='1.25' strokeLinecap='round' />
          <line x1='8' y1='13.5' x2='8' y2='15' stroke='currentColor' strokeWidth='1.25' strokeLinecap='round' />
          <line x1='1' y1='8' x2='2.5' y2='8' stroke='currentColor' strokeWidth='1.25' strokeLinecap='round' />
          <line x1='13.5' y1='8' x2='15' y2='8' stroke='currentColor' strokeWidth='1.25' strokeLinecap='round' />
          <line x1='2.929' y1='2.929' x2='3.99' y2='3.99' stroke='currentColor' strokeWidth='1.25' strokeLinecap='round' />
          <line x1='12.01' y1='12.01' x2='13.071' y2='13.071' stroke='currentColor' strokeWidth='1.25' strokeLinecap='round' />
          <line x1='13.071' y1='2.929' x2='12.01' y2='3.99' stroke='currentColor' strokeWidth='1.25' strokeLinecap='round' />
          <line x1='3.99' y1='12.01' x2='2.929' y2='13.071' stroke='currentColor' strokeWidth='1.25' strokeLinecap='round' />
        </svg>
      ) : (
        // Moon — shown in light mode to switch to dark
        <svg width='16' height='16' viewBox='0 0 16 16' fill='none' aria-hidden='true'>
          <path
            d='M13.5 9.5A6 6 0 0 1 6.5 2.5a6 6 0 1 0 7 7z'
            stroke='currentColor'
            strokeWidth='1.25'
            strokeLinejoin='round'
          />
        </svg>
      )}
    </button>
  )
}
