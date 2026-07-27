import type { Metadata } from 'next'

import { getPayloadClient } from '@/lib/payload'
import type { Media } from '@/payload-types'

export const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

// Site-wide default OG image (from Site Settings > SEO), for pages/posts without a cover
export const getDefaultOgImage = async (): Promise<string | undefined> => {
  const payload = await getPayloadClient()
  const settings = await payload.findGlobal({ slug: 'site-settings', depth: 1 })
  const img = settings.seo?.defaultImage
  return img && typeof img === 'object' ? (img.url ?? undefined) : undefined
}

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
