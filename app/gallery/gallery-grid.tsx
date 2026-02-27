'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { Photo } from './data'
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

export default function GalleryGrid({ photos }: { photos: Photo[] }) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  const openLightbox = (index: number) => setSelectedIndex(index)
  const closeLightbox = () => setSelectedIndex(null)

  const showNext = useCallback(() => {
    setSelectedIndex((prev) => (prev === null || prev === photos.length - 1 ? 0 : prev + 1))
  }, [photos.length])

  const showPrev = useCallback(() => {
    setSelectedIndex((prev) => (prev === null || prev === 0 ? photos.length - 1 : prev - 1))
  }, [photos.length])

  // Keyboard navigation
  useEffect(() => {
    if (selectedIndex === null) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowRight') showNext()
      if (e.key === 'ArrowLeft') showPrev()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedIndex, showNext, showPrev])

  const currentPhoto = selectedIndex !== null ? photos[selectedIndex] : null

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {photos.map((photo, index) => (
          <button
            type="button"
            key={photo.id}
            className="group relative aspect-[4/3] cursor-pointer overflow-hidden bg-rurikon-50"
            onClick={() => openLightbox(index)}
            aria-label={`Open photo ${index + 1}: ${photo.alt}`}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              unoptimized
            />
            <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {selectedIndex !== null && currentPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/95 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 p-2 text-rurikon-500 hover:text-rurikon-900 transition-colors"
            aria-label="Close"
          >
            <XMarkIcon className="w-8 h-8" />
          </button>

          {/* Navigation Buttons */}
          <button
            onClick={showPrev}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-2 text-rurikon-300 hover:text-rurikon-800 transition-colors"
            aria-label="Previous"
          >
            <ChevronLeftIcon className="w-8 h-8 sm:w-10 sm:h-10" />
          </button>
          <button
            onClick={showNext}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-2 text-rurikon-300 hover:text-rurikon-800 transition-colors"
            aria-label="Next"
          >
            <ChevronRightIcon className="w-8 h-8 sm:w-10 sm:h-10" />
          </button>

          <div className="flex flex-col md:flex-row w-full max-w-6xl h-full md:h-auto max-h-screen gap-6 items-center justify-center">
            
            {/* Image Container */}
            <div className="relative w-full h-full md:h-[80vh] flex-1 min-h-0">
               <Image
                src={currentPhoto.src}
                alt={currentPhoto.alt}
                fill
                className="object-contain"
                priority
              />
            </div>

            {/* Metadata Sidebar (or bottom on mobile) */}
            {(currentPhoto.caption || currentPhoto.metadata) && (
              <div className="w-full md:w-80 shrink-0 flex flex-col gap-4 text-sm bg-white/50 md:bg-transparent p-4 md:p-0 rounded-lg md:rounded-none overflow-y-auto max-h-[30vh] md:max-h-[80vh]">
                {currentPhoto.caption && (
                  <p className="font-serif text-lg text-rurikon-800 leading-relaxed">
                    {currentPhoto.caption}
                  </p>
                )}
                
                {currentPhoto.metadata && (
                  <div className="flex flex-col gap-2 border-t border-rurikon-200 pt-4 mt-2">
                    {Object.entries(currentPhoto.metadata).map(([key, value]) => (
                      <div key={key} className="flex flex-col">
                        <span className="text-xs text-rurikon-400 uppercase tracking-wider font-medium">{key}</span>
                        <span className="text-rurikon-700">{value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
