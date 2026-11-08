'use client'

import cn from 'clsx'
import { useCallback, useEffect, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { setSiteTheme } from '@/components/theme-toggle'
import { complete, run, type Line, type ShellPost, type ShellProject } from './commands'

const TONE: Record<Line['tone'], string> = {
  out: 'text-rurikon-500',
  dim: 'text-rurikon-400',
  hi: 'text-rurikon-700',
  warn: 'text-rurikon-signal',
  ok: 'text-rurikon-accent',
}

const BANNER: Line[] = [
  { text: 'ghost link established · linghao.io', tone: 'ok' },
  { text: "you found the shell. type `help`, or try `dive`.", tone: 'dim' },
]

export const OPEN_SHELL_EVENT = 'open-shell'

function isTypingTarget(el: EventTarget | null) {
  if (!(el instanceof HTMLElement)) return false
  return el.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName)
}

type Entry = { prompt?: string; lines: Line[] }

export function Terminal({ posts, projects }: { posts: ShellPost[]; projects: ShellProject[] }) {
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [entries, setEntries] = useState<Entry[]>([{ lines: BANNER }])
  const [history, setHistory] = useState<string[]>([])
  const [cursor, setCursor] = useState<number | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const returnFocus = useRef<HTMLElement | null>(null)

  const show = useCallback(() => {
    returnFocus.current = document.activeElement as HTMLElement | null
    setOpen(true)
  }, [])

  const hide = useCallback(() => {
    setOpen(false)
    returnFocus.current?.focus?.()
  }, [])

  // ` toggles from anywhere; Esc closes
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === '`' && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const inShell = e.target === inputRef.current
        if (!inShell && isTypingTarget(e.target)) return
        e.preventDefault()
        if (open) hide()
        else show()
      } else if (e.key === 'Escape' && open) {
        hide()
      }
    }
    const onOpen = () => show()
    window.addEventListener('keydown', onKey)
    window.addEventListener(OPEN_SHELL_EVENT, onOpen)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener(OPEN_SHELL_EVENT, onOpen)
    }
  }, [open, show, hide])

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
  }, [entries, open])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const raw = input
    const nextHistory = raw.trim() ? [...history, raw.trim()] : history
    const result = run(raw, { posts, projects, history: nextHistory, pathname })
    setHistory(nextHistory)
    setCursor(null)
    setInput('')

    if (result.action?.type === 'clear') {
      setEntries([])
      return
    }
    setEntries((prev) => [...prev, { prompt: raw, lines: result.lines }].slice(-60))

    const action = result.action
    if (!action) return
    if (action.type === 'close') hide()
    if (action.type === 'theme') setSiteTheme(action.theme)
    if (action.type === 'navigate') {
      setTimeout(() => {
        if (action.external) {
          window.open(action.href, '_blank', 'noopener,noreferrer')
        } else {
          setOpen(false)
          router.push(action.href)
        }
      }, 380)
    }
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      setInput((v) => complete(v))
    } else if (e.key === 'ArrowUp' && history.length) {
      e.preventDefault()
      const i = cursor === null ? history.length - 1 : Math.max(0, cursor - 1)
      setCursor(i)
      setInput(history[i])
    } else if (e.key === 'ArrowDown' && cursor !== null) {
      e.preventDefault()
      const i = cursor + 1
      if (i >= history.length) {
        setCursor(null)
        setInput('')
      } else {
        setCursor(i)
        setInput(history[i])
      }
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault()
      setEntries([])
    }
  }

  return (
    <div
      role='dialog'
      aria-modal='true'
      aria-label='Shell'
      aria-hidden={!open}
      className={cn(
        'fixed inset-x-0 top-0 z-[55] transition-transform duration-300 ease-out',
        open ? 'translate-y-0' : '-translate-y-[105%] pointer-events-none'
      )}
    >
      <div
        className='mx-auto max-w-[1280px] h-[72vh] sm:h-[58vh] flex flex-col font-mono text-[13px] sm:text-sm leading-relaxed border-x border-b border-rurikon-accent shadow-[0_24px_60px_rgba(0,0,0,0.55)] backdrop-blur-md'
        style={{ background: 'color-mix(in srgb, var(--background) 94%, transparent)' }}
        onClick={() => inputRef.current?.focus()}
      >
        <div className='flex items-center justify-between px-4 py-2 border-b border-rurikon-border text-xs text-rurikon-300'>
          <span>~/linghao — zsh</span>
          <span className='flex items-center gap-4'>
            <span className='hidden sm:inline'>` or esc to close</span>
            <button
              type='button'
              onClick={(e) => {
                e.stopPropagation()
                hide()
              }}
              className='px-2 py-1 text-rurikon-400 hover:text-rurikon-accent'
              aria-label='Close shell'
              tabIndex={open ? 0 : -1}
            >
              ✕
            </button>
          </span>
        </div>

        <div ref={scrollRef} className='flex-1 min-h-0 overflow-y-auto px-4 py-3' aria-live='polite'>
          {entries.map((entry, i) => (
            <div key={i} className='mb-1.5'>
              {entry.prompt !== undefined && (
                <div className='text-rurikon-accent whitespace-pre-wrap break-words'>
                  <span className='text-rurikon-300'>linghao@shell ~ %</span> {entry.prompt}
                </div>
              )}
              {entry.lines.map((l, j) => (
                <div key={j} className={cn('whitespace-pre-wrap break-words', TONE[l.tone])}>
                  {l.text}
                </div>
              ))}
            </div>
          ))}
        </div>

        <form onSubmit={submit} className='flex items-center gap-2 px-4 py-3 border-t border-rurikon-border'>
          <label htmlFor='shell-input' className='shrink-0 text-rurikon-accent'>
            linghao@shell ~ %
          </label>
          <input
            id='shell-input'
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            autoComplete='off'
            autoCapitalize='off'
            autoCorrect='off'
            spellCheck={false}
            enterKeyHint='go'
            tabIndex={open ? 0 : -1}
            className='flex-1 min-w-0 bg-transparent outline-none text-rurikon-700 caret-[var(--color-rurikon-accent)]'
          />
        </form>
      </div>
    </div>
  )
}

/** A visible way in for touch devices (no backtick key). */
export function ShellButton({ className }: { className?: string }) {
  return (
    <button
      type='button'
      onClick={() => window.dispatchEvent(new Event(OPEN_SHELL_EVENT))}
      className={cn('hover:text-rurikon-accent transition-colors', className)}
    >
      &gt;_ shell
    </button>
  )
}
