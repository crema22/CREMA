'use client'

import { useState, useRef, useCallback } from 'react'

interface ProductGalleryProps {
  images: string[]
  productName: string
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [index, setIndex] = useState(0)
  const touchStartX = useRef<number | null>(null)

  const count = images.length
  const hasMultiple = count > 1

  const go = useCallback(
    (next: number) => {
      if (count === 0) return
      // wraps around in both directions
      setIndex(((next % count) + count) % count)
    },
    [count]
  )

  const prev = useCallback(() => go(index - 1), [go, index])
  const next = useCallback(() => go(index + 1), [go, index])

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!hasMultiple) return
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      prev()
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      next()
    }
  }

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || !hasMultiple) return
    const delta = e.changedTouches[0].clientX - touchStartX.current
    // ignore small drags so taps don't trigger a slide
    if (Math.abs(delta) > 50) {
      delta > 0 ? prev() : next()
    }
    touchStartX.current = null
  }

  if (count === 0) {
    return (
      <div className="w-full aspect-square bg-cream-100 rounded-lg flex items-center justify-center">
        <p className="text-sm text-slate-600">Product image coming soon</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Main image */}
      <div
        role="group"
        aria-roledescription="carousel"
        aria-label={`${productName} images`}
        tabIndex={0}
        onKeyDown={onKeyDown}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        className="relative w-full aspect-square bg-cream-100 rounded-lg overflow-hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-espresso"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[index]}
          alt={
            hasMultiple
              ? `${productName} — image ${index + 1} of ${count}`
              : productName
          }
          className="w-full h-full object-cover"
        />

        {hasMultiple && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 hover:bg-white shadow flex items-center justify-center text-slate-900 text-xl transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-espresso"
            >
              &#8249;
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 hover:bg-white shadow flex items-center justify-center text-slate-900 text-xl transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-espresso"
            >
              &#8250;
            </button>

            {/* Position indicator */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => go(i)}
                  aria-label={`Go to image ${i + 1}`}
                  aria-current={i === index}
                  className={`w-2 h-2 rounded-full transition ${
                    i === index ? 'bg-espresso' : 'bg-white/70 hover:bg-white'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {hasMultiple && (
        <div className="grid grid-cols-5 gap-2">
          {images.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => go(i)}
              aria-label={`View image ${i + 1} of ${count}`}
              aria-current={i === index}
              className={`relative aspect-square rounded overflow-hidden border-2 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-espresso ${
                i === index
                  ? 'border-espresso'
                  : 'border-cream-900 opacity-70 hover:opacity-100'
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Announce slide changes to screen readers */}
      <p className="sr-only" aria-live="polite">
        {hasMultiple ? `Image ${index + 1} of ${count}` : ''}
      </p>
    </div>
  )
}
