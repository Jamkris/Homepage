import type { Metadata } from 'next'

import type { Media } from '@/payload-types'

export const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

// hreflang alternates + canonical for a locale-prefixed path ('' for home)
export const localeAlternates = (locale: string, path: string): Metadata['alternates'] => ({
  canonical: `/${locale}${path}`,
  languages: {
    ko: `/ko${path}`,
    en: `/en${path}`,
    'x-default': `/ko${path}`,
  },
})

export const mediaImageUrl = (image: Media | number | null | undefined): string | undefined =>
  image && typeof image === 'object' && image.url ? image.url : undefined
