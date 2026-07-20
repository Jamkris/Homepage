'use client'

import { useEffect, useRef } from 'react'

// Custom cursor: instant dot + lerped ring that grows over interactive elements
export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) {
      return
    }

    document.body.setAttribute('data-custom-cursor', '')

    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) {
      return
    }

    let targetX = -100
    let targetY = -100
    let ringX = -100
    let ringY = -100
    let hovering = false
    let rafId = 0

    const onMove = (e: MouseEvent) => {
      targetX = e.clientX
      targetY = e.clientY
      dot.style.transform = `translate(${targetX}px, ${targetY}px)`
      const interactive = (e.target as Element | null)?.closest?.(
        'a, button, input, textarea, select, [data-cursor]',
      )
      hovering = Boolean(interactive)
    }

    const loop = () => {
      ringX += (targetX - ringX) * 0.16
      ringY += (targetY - ringY) * 0.16
      const scale = hovering ? 2.4 : 1
      ring.style.transform = `translate(${ringX}px, ${ringY}px) scale(${scale})`
      rafId = requestAnimationFrame(loop)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    rafId = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafId)
      document.body.removeAttribute('data-custom-cursor')
    }
  }, [])

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[95] hidden [@media(pointer:fine)]:block"
    >
      <div
        ref={dotRef}
        className="bg-accent absolute top-0 left-0 size-2 rounded-full"
        style={{ marginLeft: '-4px', marginTop: '-4px' }}
      />
      <div
        ref={ringRef}
        className="border-accent/40 absolute top-0 left-0 size-9 rounded-full border transition-[border-color]"
        style={{ marginLeft: '-18px', marginTop: '-18px' }}
      />
    </div>
  )
}
