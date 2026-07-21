import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import React from 'react'

import { PostCard } from '@/components/PostCard'
import type { Locale } from '@/i18n/routing'
import { getPayloadClient } from '@/lib/payload'
import { localeAlternates } from '@/lib/seo'

export const dynamic = 'force-dynamic'

interface BlogPageProps {
  params: Promise<{ locale: Locale }>
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'blog' })

  return {
    title: t('title'),
    description: t('description'),
    alternates: localeAlternates(locale, '/blog'),
  }
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations('blog')
  const payload = await getPayloadClient()

  const { docs: posts } = await payload.find({
    collection: 'posts',
    locale,
    limit: 100,
    sort: '-publishedAt',
    where: { _status: { equals: 'published' } },
  })

  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-20">
      <p className="eyebrow">Blog</p>
      <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-6xl">{t('title')}</h1>
      <p className="text-muted mt-4 max-w-xl text-lg">{t('description')}</p>

      {posts.length === 0 ? (
        <p className="text-muted mt-20 text-center">{t('empty')}</p>
      ) : (
        <div className="mt-12">
          {posts.map((post, i) => (
            <PostCard key={post.id} post={post} locale={locale} index={i} />
          ))}
          <div className="border-border border-t" />
        </div>
      )}
    </div>
  )
}
