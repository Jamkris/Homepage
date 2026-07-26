import type { MetadataRoute } from 'next'

import { SERVER_URL } from '@/lib/seo'

// Read SERVER_URL at request time, not build time (so the deployed domain wins)
export const dynamic = 'force-dynamic'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api'],
    },
    sitemap: `${SERVER_URL}/sitemap.xml`,
  }
}
