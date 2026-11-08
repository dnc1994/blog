'use client'

import cn from 'clsx'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useCallback, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { DecodeText } from '@/components/decode'
import type { DiveMap } from '@/lib/dive-map'
import type { Hover } from './dive-scene'

// three.js only loads when someone actually dives
const DiveScene = dynamic(() => import('./dive-scene'), { ssr: false })

export default function DiveExperience({ map }: { map: DiveMap }) {
  const router = useRouter()
  const [hover, setHover] = useState<Hover>(null)
  const [depth, setDepth] = useState(4800)
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)
  const last = useRef<string>('')

  const onHover = useCallback((h: Hover) => {
    const key = h ? `${h.index}:${Math.round(h.x / 2)}:${Math.round(h.y / 2)}:${h.pinned}` : ''
    if (key !== last.current) {
      last.current = key
      setHover(h)
    }
  }, [])

  const open = useCallback((slug: string) => router.push(`/posts/${slug}`), [router])

  const node = hover ? map.nodes[hover.index] : null
  const group = node ? map.groups.find((g) => g.id === node.group) : null
  const countByGroup = (id: string) => map.nodes.filter((n) => n.group === id).length

  return (
    <div className='fixed inset-0 z-50 overflow-hidden bg-[#050707] text-[#B5CFC9] font-mono'>
      {!failed && (
        <DiveScene
          map={map}
          onHover={onHover}
          onOpen={open}
          onDepth={setDepth}
          onReady={() => setReady(true)}
          onFail={() => setFailed(true)}
        />
      )}

      {/* Boot overlay while three.js loads */}
      <div
        aria-hidden='true'
        className={cn(
          'pointer-events-none absolute inset-0 grid place-items-center text-xs tracking-[0.3em] text-[#3AA99F] transition-opacity duration-700',
          ready || failed ? 'opacity-0' : 'opacity-100'
        )}
      >
        ESTABLISHING GHOST LINK<span className='cursor-blink'>_</span>
      </div>

      {/* Hover / tap label */}
      {node && hover && (
        <div
          className='pointer-events-none absolute z-10 -translate-x-1/2 w-max max-w-[min(22rem,80vw)]'
          style={{ left: hover.x, top: hover.y + 22 }}
        >
          <div className='border border-[#2A4A46] bg-[#050707]/90 backdrop-blur px-3 py-2'>
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
            {hover.pinned && (
              <Link
                href={`/posts/${node.slug}`}
                className='pointer-events-auto mt-2 inline-block text-xs text-[#5ED3C6]'
              >
                tap again or open →
              </Link>
            )}
          </div>
        </div>
      )}

      {/* HUD */}
      <div className='pointer-events-none absolute inset-0 p-4 sm:p-7 flex flex-col justify-between text-[11px] sm:text-xs tracking-[0.12em]'>
        <div className='flex items-start justify-between gap-4'>
          <div>
            <div className='flex items-center gap-2 font-bold text-[#E8F4F1]'>
              <span className='pulse-dot inline-block h-2 w-2 rounded-full bg-[#3AA99F]' />
              DIVE · {map.nodes.length} NODES · {map.edges.length} LINKS
            </div>
            <div className='mt-1 text-[#6E8F89]'>DEPTH {String(depth).padStart(4, '0')}</div>
          </div>
          <Link
            href='/'
            className='pointer-events-auto border border-[#2A4A46] px-3 py-2 text-[#B5CFC9] hover:border-[#3AA99F] hover:text-[#5ED3C6] transition-colors'
          >
            SURFACE ↑
          </Link>
        </div>

        <div className='flex flex-wrap items-end justify-between gap-4'>
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
            <span className='hidden sm:inline'>drag to orbit · scroll to zoom · click a node to decode it</span>
            <span className='sm:hidden'>drag to orbit · pinch to zoom · tap a node</span>
            <br />
            nearby posts share ideas, not just tags
          </p>
        </div>
      </div>

      {/* No WebGL: still useful */}
      {failed && (
        <div className='absolute inset-0 overflow-y-auto px-5 pt-28 pb-16 sm:px-10'>
          <p className='mb-6 text-xs tracking-[0.16em] text-[#DA702C]'>
            NO WEBGL ON THIS DEVICE · SHOWING THE MAP AS TEXT
          </p>
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
