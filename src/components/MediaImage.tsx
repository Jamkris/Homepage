import Image from 'next/image'
import React from 'react'

import type { Media } from '@/payload-types'

interface MediaImageProps {
  media: Media | number | null | undefined
  className?: string
  sizes?: string
  priority?: boolean
}

// Renders a Payload media doc via next/image; returns null when depth wasn't populated
export function MediaImage({ media, className, sizes, priority }: MediaImageProps) {
  if (!media || typeof media === 'number' || !media.url) {
    return null
  }

  return (
    <Image
      src={media.url}
      alt={media.alt}
      width={media.width ?? 1200}
      height={media.height ?? 630}
      className={className}
      sizes={sizes}
      priority={priority}
    />
  )
}
