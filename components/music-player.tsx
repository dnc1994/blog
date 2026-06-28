'use client'

import { useEffect, useRef, useState } from 'react'
import cn from 'clsx'

declare global {
  interface Window {
    YT: {
      Player: new (el: HTMLElement, opts: object) => YTPlayer
      PlayerState: { PLAYING: number }
    }
    onYouTubeIframeAPIReady?: () => void
  }
}

interface YTPlayer {
  playVideo(): void
  pauseVideo(): void
  destroy(): void
}

export function MusicPlayer({
  videoId,
  title,
  artist,
}: {
  videoId: string
  title: string
  artist: string
}) {
  const [playing, setPlaying] = useState(false)
  const [ready, setReady] = useState(false)
  const mountRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<YTPlayer | null>(null)

  useEffect(() => {
    const init = () => {
      if (!mountRef.current) return
      playerRef.current = new window.YT.Player(mountRef.current, {
        videoId,
        playerVars: { autoplay: 0, controls: 0, rel: 0 },
        events: {
          onReady: () => setReady(true),
          onStateChange: (e: { data: number }) => {
            setPlaying(e.data === window.YT.PlayerState.PLAYING)
          },
        },
      })
    }

    if (window.YT?.Player) {
      init()
    } else {
      window.onYouTubeIframeAPIReady = init
      if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
        const tag = document.createElement('script')
        tag.src = 'https://www.youtube.com/iframe_api'
        document.head.appendChild(tag)
      }
    }

    return () => {
      playerRef.current?.destroy()
      playerRef.current = null
    }
  }, [videoId])

  const toggle = () => {
    if (!ready || !playerRef.current) return
    if (playing) {
      playerRef.current.pauseVideo()
    } else {
      playerRef.current.playVideo()
    }
  }

  return (
    <>
      {/* Hidden YouTube iframe — positioned off-screen so the iframe loads and audio works */}
      <div
        aria-hidden='true'
        style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden', opacity: 0 }}
      >
        <div ref={mountRef} />
      </div>

      {/* Player pill — fixed at bottom center */}
      <div
        className={cn(
          'fixed bottom-6 left-1/2 -translate-x-1/2 z-50',
          'flex items-center gap-3 px-4 py-2',
          'border border-rurikon-border bg-[var(--background)]',
          'rounded-sm font-sans not-italic'
        )}
      >
        <button
          onClick={toggle}
          disabled={!ready}
          aria-label={playing ? 'Pause music' : 'Play music'}
          className='flex items-center justify-center text-rurikon-300 hover:text-rurikon-500 disabled:opacity-30 transition-colors cursor-pointer'
        >
          {playing ? (
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className='w-4 h-4'>
              <path fillRule='evenodd' d='M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7 0a.75.75 0 01.75-.75h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75h-1.5a.75.75 0 01-.75-.75V5.25z' clipRule='evenodd' />
            </svg>
          ) : (
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className='w-4 h-4'>
              <path fillRule='evenodd' d='M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z' clipRule='evenodd' />
            </svg>
          )}
        </button>

        <span className='text-sm text-rurikon-300 whitespace-nowrap'>
          {title}
          <span className='text-rurikon-200 mx-1.5'>—</span>
          {artist}
        </span>
      </div>
    </>
  )
}
