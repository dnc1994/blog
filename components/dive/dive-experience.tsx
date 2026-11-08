'use client'

import cn from 'clsx'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { DecodeText } from '@/components/decode'
import type { DiveMap } from '@/lib/dive-map'
import type { AudioRef, DiveApi, Hover, Phase } from './dive-scene'
import { createDiveAudio } from './dive-audio'

// three.js only loads when someone actually dives
const DiveScene = dynamic(() => import('./dive-scene'), { ssr: false })

function BootLines({ count }: { count: number }) {
  const lines = [
    'LINGHAO.IO // NET TERMINAL',
    '> handshake ................. ok',
    '> authenticating guest ...... ok',
    `> mapping ${count} memory nodes ... ok`,
    '> releasing tether',
  ]
  const [shown, setShown] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setShown((n) => Math.min(lines.length, n + 1)), 290)
    return () => clearInterval(id)
  }, [lines.length])
  return (
    <div className='text-[13px] sm:text-sm leading-7 text-[#5ED3C6]'>
      {lines.slice(0, shown).map((l, i) => (
        <div key={i} className={i === 0 ? 'text-[#E8F4F1] tracking-[0.2em] mb-2' : ''}>
          {l}
        </div>
      ))}
      <span className='cursor-blink'>█</span>
    </div>
  )
}

export default function DiveExperience({ map }: { map: DiveMap }) {
  const router = useRouter()
  const [hover, setHover] = useState<Hover>(null)
  const [depth, setDepth] = useState(0)
  const [phase, setPhase] = useState<Phase>('loading')
  const [failed, setFailed] = useState(false)
  const [sound, setSound] = useState(false)
  const api = useRef<DiveApi | null>(null)
  const audio = useRef<AudioRef>({ current: null })
  const last = useRef('')

  const onHover = useCallback((h: Hover) => {
    const key = h ? `${h.index}:${Math.round(h.x / 2)}:${Math.round(h.y / 2)}:${h.pinned}` : ''
    if (key !== last.current) {
      last.current = key
      setHover(h)
    }
  }, [])

  const open = useCallback((slug: string) => router.push(`/posts/${slug}`), [router])

  const ensureAudio = () => {
    if (!audio.current.current) audio.current.current = createDiveAudio()
    return audio.current.current
  }

  const jackIn = useCallback(
    (withSound: boolean) => {
      if (!api.current) return
      if (withSound) {
        ensureAudio()?.setEnabled(true)
        setSound(true)
      }
      api.current.jackIn(audio.current)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const toggleSound = () => {
    const next = !sound
    const a = next ? ensureAudio() : audio.current.current
    a?.setEnabled(next)
    if (next) a?.drone()
    setSound(next)
  }

  // Enter jacks in from the gate
  useEffect(() => {
    if (phase !== 'ready') return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter') jackIn(true)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [phase, jackIn])

  useEffect(() => () => audio.current.current?.dispose(), [])

  const gate = phase === 'loading' || phase === 'ready'
  const exploring = phase === 'explore' || phase === 'diving'
  const node = hover ? map.nodes[hover.index] : null
  const group = node ? map.groups.find((g) => g.id === node.group) : null
  const countByGroup = (id: string) => map.nodes.filter((n) => n.group === id).length

  return (
    <div className='fixed inset-0 z-50 overflow-hidden bg-[#030505] text-[#B5CFC9] font-mono'>
      {!failed && (
        <DiveScene
          map={map}
          onHover={onHover}
          onOpen={open}
          onDepth={setDepth}
          onPhase={setPhase}
          onReady={(a) => (api.current = a)}
          onFail={() => setFailed(true)}
        />
      )}

      {/* Gate */}
      {!failed && (
        <div
          className={cn(
            'absolute inset-0 z-20 flex items-center justify-center px-6 transition-opacity duration-700',
            gate ? 'opacity-100' : 'opacity-0 pointer-events-none'
          )}
          style={{ background: 'radial-gradient(ellipse at center, rgba(3,5,5,0.55) 0%, rgba(3,5,5,0.92) 70%)' }}
        >
          <div className='max-w-xl text-center'>
            <p className='text-[11px] sm:text-xs tracking-[0.3em] text-[#DA702C]'>NET DIVE · LINGHAO.IO</p>
            <h1 className='glitch glitch-jitter mt-5 font-display font-bold text-[clamp(3rem,11vw,6.5rem)] leading-[0.9] tracking-[-0.04em] text-[#E8F4F1]'>
              Into the net
            </h1>
            <p className='mt-6 font-display text-base sm:text-lg leading-relaxed text-[#B5CFC9]'>
              Fall through {map.nodes.length} memories, mapped by what they say.
              Every light down there is a post.
            </p>
            <div className='mt-10 flex flex-col sm:flex-row items-center justify-center gap-3'>
              <button
                type='button'
                disabled={phase !== 'ready'}
                onClick={() => jackIn(true)}
                className='min-w-48 px-6 py-3.5 bg-[#3AA99F] text-[#030505] font-bold tracking-[0.18em] text-sm hover:bg-[#5ED3C6] disabled:opacity-50 disabled:cursor-wait transition-colors'
              >
                {phase === 'ready' ? 'JACK IN ↵' : 'CALIBRATING…'}
              </button>
              <button
                type='button'
                disabled={phase !== 'ready'}
                onClick={() => jackIn(false)}
                className='px-4 py-3.5 text-xs tracking-[0.12em] text-[#8FB3AC] hover:text-[#5ED3C6] disabled:opacity-50 transition-colors'
              >
                jack in silently
              </button>
            </div>
            <p className='mt-6 text-[11px] text-[#6E8F89]'>sound on · headphones recommended</p>
          </div>
          <Link
            href='/'
            className='absolute top-4 right-4 sm:top-7 sm:right-7 border border-[#2A4A46] px-3 py-2 text-xs tracking-[0.12em] hover:border-[#3AA99F] hover:text-[#5ED3C6] transition-colors'
          >
            SURFACE ↑
          </Link>
        </div>
      )}

      {/* Boot sequence */}
      {phase === 'boot' && (
        <div className='absolute inset-0 z-10 flex items-center justify-center px-6 pointer-events-none'>
          <BootLines count={map.nodes.length} />
        </div>
      )}

      {/* Descent readout */}
      <div
        aria-hidden='true'
        className={cn(
          'pointer-events-none absolute inset-x-0 bottom-[12%] z-10 text-center transition-opacity duration-500',
          phase === 'descent' ? 'opacity-100' : 'opacity-0'
        )}
      >
        <div className='text-[11px] tracking-[0.4em] text-[#DA702C]'>DESCENDING</div>
        <div className='mt-1 font-display text-5xl sm:text-7xl font-bold tabular-nums tracking-tight text-[#E8F4F1] glitch'>
          {String(depth).padStart(4, '0')}
        </div>
      </div>

      {/* Hover / tap label */}
      {exploring && node && hover && (
        <div
          className='pointer-events-none absolute z-10 -translate-x-1/2 w-max max-w-[min(22rem,80vw)]'
          style={{ left: hover.x, top: hover.y + 24 }}
        >
          <div className='border border-[#2A4A46] bg-[#030505]/85 backdrop-blur px-3 py-2'>
            <div className='text-[10px] tracking-[0.16em]' style={{ color: group?.color }}>
              {group?.label.toUpperCase()} · {node.date}
            </div>
            <DecodeText
              key={node.slug}
              text={node.title}
              delay={0}
              duration={380 + node.title.length * 8}
              className='block mt-1 font-display text-base leading-snug text-[#E8F4F1]'
            />
            {hover.pinned && <div className='mt-2 text-xs text-[#5ED3C6]'>tap again to dive in ↓</div>}
          </div>
        </div>
      )}

      {/* HUD */}
      <div
        className={cn(
          'pointer-events-none absolute inset-0 z-10 p-4 sm:p-7 flex flex-col justify-between text-[11px] sm:text-xs tracking-[0.12em] transition-opacity duration-700',
          gate || phase === 'boot' ? 'opacity-0' : 'opacity-100'
        )}
      >
        <div className='flex items-start justify-between gap-4'>
          <div>
            <div className='flex items-center gap-2 font-bold text-[#E8F4F1]'>
              <span className='pulse-dot inline-block h-2 w-2 rounded-full bg-[#3AA99F]' />
              {phase === 'descent' ? 'LINK ACTIVE · FREE FALL' : `NET · ${map.nodes.length} NODES · ${map.edges.length} LINKS`}
            </div>
            <div className='mt-1 text-[#6E8F89]'>DEPTH {String(depth).padStart(4, '0')}</div>
          </div>
          <div className='flex gap-2'>
            <button
              type='button'
              onClick={toggleSound}
              aria-pressed={sound}
              className='pointer-events-auto border border-[#2A4A46] px-3 py-2 text-[#B5CFC9] hover:border-[#3AA99F] hover:text-[#5ED3C6] transition-colors'
            >
              ♪ {sound ? 'ON' : 'OFF'}
            </button>
            <Link
              href='/'
              className='pointer-events-auto border border-[#2A4A46] px-3 py-2 text-[#B5CFC9] hover:border-[#3AA99F] hover:text-[#5ED3C6] transition-colors'
            >
              SURFACE ↑
            </Link>
          </div>
        </div>

        <div className={cn('flex flex-wrap items-end justify-between gap-4 transition-opacity duration-700', exploring ? 'opacity-100' : 'opacity-0')}>
          <ul className='space-y-1'>
            {map.groups.map((g) => (
              <li key={g.id} className='flex items-center gap-2'>
                <span className='inline-block h-2 w-2 rounded-full' style={{ background: g.color }} />
                <span>{g.label}</span>
                <span className='text-[#6E8F89]'>{countByGroup(g.id)}</span>
              </li>
            ))}
          </ul>
          <p className='max-w-xs text-right text-[#6E8F89] normal-case tracking-normal'>
            <span className='hidden sm:inline'>drag to orbit · scroll to zoom · click a node to dive in</span>
            <span className='sm:hidden'>drag to orbit · pinch to zoom · tap a node</span>
            <br />
            nearby posts share ideas, not just tags
          </p>
        </div>
      </div>

      {/* No WebGL: still useful */}
      {failed && (
        <div className='absolute inset-0 overflow-y-auto px-5 pt-28 pb-16 sm:px-10'>
          <p className='mb-6 text-xs tracking-[0.16em] text-[#DA702C]'>NO WEBGL ON THIS DEVICE · SHOWING THE MAP AS TEXT</p>
          <div className='grid gap-8 sm:grid-cols-2 lg:grid-cols-3'>
            {map.groups.map((g) => (
              <section key={g.id}>
                <h2 className='mb-2 text-xs tracking-[0.14em]' style={{ color: g.color }}>
                  {g.label.toUpperCase()}
                </h2>
                <ul className='space-y-1 font-sans text-sm'>
                  {map.nodes.filter((n) => n.group === g.id).map((n) => (
                    <li key={n.slug}>
                      <Link href={`/posts/${n.slug}`} className='hover:text-[#5ED3C6]'>
                        {n.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>
      )}

      {/* Screen readers get the map as a list */}
      {!failed && (
        <nav aria-label='All posts on the map' className='sr-only'>
          <ul>
            {map.nodes.map((n) => (
              <li key={n.slug}>
                <Link href={`/posts/${n.slug}`}>{n.title}</Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  )
}
