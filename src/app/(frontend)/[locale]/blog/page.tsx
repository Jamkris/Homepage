import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import React from 'react'

import { PostCard } from '@/components/PostCard'
import { Reveal } from '@/components/fx/Reveal'
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
      <p className="text-accent text-sm font-medium tracking-wider uppercase">Blog</p>
      <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">{t('title')}</h1>
      <p className="text-muted mt-4 text-lg">{t('description')}</p>

      {posts.length === 0 ? (
        <p className="text-muted mt-20 text-center">{t('empty')}</p>
      ) : (
        <div className="mt-12">
          {posts.map((post, i) => (
            <Reveal key={post.id} delay={Math.min(i * 0.04, 0.3)}>
              <PostCard post={post} locale={locale} index={i} />
            </Reveal>
          ))}
          <div className="border-border border-t" />
        </div>
      )}
    </div>
  )
}
