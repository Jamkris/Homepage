import type { MetadataRoute } from 'next'

import { getPayloadClient } from '@/lib/payload'
import { SERVER_URL } from '@/lib/seo'

// Rendered at request time — keeps Payload out of the build and the sitemap fresh
export const dynamic = 'force-dynamic'

const entry = (path: string, lastModified?: string): MetadataRoute.Sitemap[number] => ({
  url: `${SERVER_URL}/ko${path}`,
  lastModified,
  alternates: {
    languages: {
      ko: `${SERVER_URL}/ko${path}`,
      en: `${SERVER_URL}/en${path}`,
    },
  },
})

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayloadClient()

  const [posts, projects] = await Promise.all([
    payload.find({
      collection: 'posts',
      limit: 1000,
      select: { slug: true, updatedAt: true },
      where: { _status: { equals: 'published' } },
    }),
    payload.find({
      collection: 'projects',
      limit: 1000,
      select: { slug: true, updatedAt: true },
      where: { _status: { equals: 'published' } },
    }),
  ])

  return [
    entry(''),
    entry('/blog'),
    entry('/about'),
    entry('/portfolio'),
    ...posts.docs.map((post) => entry(`/blog/${post.slug}`, post.updatedAt)),
    ...projects.docs.map((project) => entry(`/portfolio/${project.slug}`, project.updatedAt)),
  ]
}
