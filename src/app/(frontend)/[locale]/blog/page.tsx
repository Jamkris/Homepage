import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import React from 'react'

import { PostCard } from '@/components/PostCard'
import type { Locale } from '@/i18n/routing'
import { getPayloadClient } from '@/lib/payload'

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
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
      <p className="text-muted mt-2">{t('description')}</p>

      {posts.length === 0 ? (
        <p className="text-muted mt-16 text-center">{t('empty')}</p>
      ) : (
        <div className="divide-border/60 mt-8 divide-y">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} locale={locale} />
          ))}
        </div>
      )}
    </div>
  )
}
