import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import React from 'react'

import { MediaImage } from '@/components/MediaImage'
import { RichText } from '@/components/RichText'
import type { Locale } from '@/i18n/routing'
import { formatDate } from '@/lib/format'
import { getPayloadClient } from '@/lib/payload'
import { localeAlternates, mediaImageUrl } from '@/lib/seo'
import type { Post } from '@/payload-types'

export const dynamic = 'force-dynamic'

interface PostPageProps {
  params: Promise<{ locale: Locale; slug: string }>
}

const findPost = async (locale: Locale, slug: string): Promise<Post | null> => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'posts',
    locale,
    limit: 1,
    depth: 1,
    where: {
      slug: { equals: slug },
      _status: { equals: 'published' },
    },
  })

  return docs[0] ?? null
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { locale, slug } = await params
  const post = await findPost(locale, slug)

  if (!post) {
    return {}
  }

  const title = post.meta?.title || post.title
  const description = post.meta?.description || post.excerpt || undefined
  const image = mediaImageUrl(post.meta?.image) ?? mediaImageUrl(post.coverImage)

  return {
    title,
    description,
    alternates: localeAlternates(locale, `/blog/${slug}`),
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime: post.publishedAt ?? undefined,
      images: image ? [{ url: image }] : undefined,
    },
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  const post = await findPost(locale, slug)

  if (!post) {
    notFound()
  }

  return (
    <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      <header>
        <h1 className="font-display text-3xl font-bold tracking-tighter text-balance sm:text-5xl">
          {post.title}
        </h1>
        <div className="text-muted mt-3 flex items-center gap-3 text-sm">
          <time dateTime={post.publishedAt ?? undefined}>
            {formatDate(locale, post.publishedAt)}
          </time>
          {post.tags && post.tags.length > 0 && (
            <ul className="flex flex-wrap gap-1.5">
              {post.tags.map((tag) => (
                <li key={tag} className="bg-surface rounded px-2 py-0.5 text-xs">
                  {tag}
                </li>
              ))}
            </ul>
          )}
        </div>
      </header>
      {post.coverImage && typeof post.coverImage === 'object' && (
        <MediaImage
          media={post.coverImage}
          className="mt-8 w-full rounded-lg"
          sizes="(max-width: 768px) 100vw, 768px"
          priority
        />
      )}
      <div className="mt-10">
        <RichText data={post.content} />
      </div>
    </article>
  )
}
