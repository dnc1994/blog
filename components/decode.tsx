'use client'

import cn from 'clsx'
import { useCallback, useEffect, useRef, useState } from 'react'

const GLYPHS = '01#$%&*+<>/\\|=?@ABCDEF░▒▓'

function scramble(chars: string[], progress: number): string {
  const revealed = Math.floor(progress * chars.length)
  let out = ''
  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i]
    out +=
      i < revealed || ch === ' '
        ? ch
        : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
  }
  return out
}

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

type Options = {
  /** ms before the first decode on mount; null = don't autoplay */
  delay?: number | null
  /** total ms for a full decode */
  duration?: number
}

/**
 * Returns the string to display while it "decodes" from noise, plus a
 * `replay` function. Server render and first client render show the real
 * text, so markup is identical and crawlers see real content.
 */
export function useDecode(text: string, { delay = 0, duration = 700 }: Options = {}) {
  const chars = useRef(Array.from(text))
  const [display, setDisplay] = useState(text)
  const [progress, setProgress] = useState(1)
  const [pending, setPending] = useState(delay !== null)
  const frame = useRef<number | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    chars.current = Array.from(text)
    setDisplay(text)
  }, [text])

  const stop = () => {
    if (frame.current !== null) cancelAnimationFrame(frame.current)
    if (timer.current !== null) clearTimeout(timer.current)
    frame.current = null
    timer.current = null
  }

  const replay = useCallback(() => {
    if (prefersReducedMotion()) return
    stop()
    const start = performance.now()
    let last = 0
    setPending(false)
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration)
      // Re-roll the noise ~30 times a second, not every frame
      if (now - last > 33 || p === 1) {
        last = now
        setProgress(p)
        setDisplay(p === 1 ? text : scramble(chars.current, p))
      }
      if (p < 1) frame.current = requestAnimationFrame(tick)
      else frame.current = null
    }
    setDisplay(scramble(chars.current, 0))
    setProgress(0)
    frame.current = requestAnimationFrame(tick)
  }, [text, duration])

  useEffect(() => {
    if (delay === null) return
    if (prefersReducedMotion()) {
      setPending(false)
      return
    }
    // Show noise immediately, start resolving after the stagger delay
    setDisplay(scramble(chars.current, 0))
    setProgress(0)
    setPending(false)
    timer.current = setTimeout(replay, delay)
    return stop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { display, progress, pending, replay }
}

/** Text that decodes from noise on mount (and on hover if `hover`). */
export function DecodeText({
  text,
  as: Tag = 'span',
  className,
  delay = 0,
  duration,
  hover = false,
}: {
  text: string
  as?: 'span' | 'h1' | 'h2' | 'div' | 'p'
  className?: string
  delay?: number | null
  duration?: number
  hover?: boolean
}) {
  const { display, pending, replay } = useDecode(text, { delay, duration })
  return (
    <Tag
      className={className}
      onMouseEnter={hover ? replay : undefined}
    >
      <span className='sr-only'>{text}</span>
      <span aria-hidden='true' className={cn(pending && 'decode-pending')}>
        {display}
      </span>
    </Tag>
  )
}
