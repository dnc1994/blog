'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
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
  const [slotEl, setSlotEl] = useState<HTMLElement | null>(null)
  const mountRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<YTPlayer | null>(null)

  // Resolve the navbar slot after mount
  useEffect(() => {
    setSlotEl(document.getElementById('music-player-slot'))
  }, [])

  useEffect(() => {
    const init = () => {
      if (!mountRef.current) return
      playerRef.current = new window.YT.Player(mountRef.current, {
        videoId,
        playerVars: { autoplay: 1, controls: 0, rel: 0 },
        events: {
          onReady: (e: { target: YTPlayer }) => {
            setReady(true)
            e.target.playVideo()
          },
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

  const button = (
    <button
      onClick={toggle}
      disabled={!ready}
      aria-label={playing ? `Pause ${title}` : `Play ${title}`}
      title={`${title} — ${artist}`}
      className={cn(
        'flex items-center gap-2 text-sm',
        'text-rurikon-300 hover:text-rurikon-500 disabled:opacity-30',
        'transition-colors cursor-pointer font-sans not-italic'
      )}
    >
      {playing ? (
        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className='w-4 h-4 shrink-0'>
          <path fillRule='evenodd' d='M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7 0a.75.75 0 01.75-.75h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75h-1.5a.75.75 0 01-.75-.75V5.25z' clipRule='evenodd' />
        </svg>
      ) : (
        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className='w-4 h-4 shrink-0'>
          <path fillRule='evenodd' d='M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z' clipRule='evenodd' />
        </svg>
      )}
      <span className='truncate max-w-[10rem]'>{title}</span>
    </button>
  )

  return (
    <>
      {/* Hidden YouTube iframe — zero-size but in the DOM so audio streams */}
      <div
        aria-hidden='true'
        style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden', opacity: 0 }}
      >
        <div ref={mountRef} />
      </div>

      {/* Render button into the navbar slot via portal */}
      {slotEl && createPortal(button, slotEl)}
    </>
  )
}
