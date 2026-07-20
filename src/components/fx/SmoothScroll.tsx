'use client'

import Lenis from 'lenis'
import { useEffect } from 'react'

export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.12,
    })

    return () => lenis.destroy()
  }, [])

  return null
}
