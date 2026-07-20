import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import React from 'react'

import { PostCard } from '@/components/PostCard'
import { ProjectCard } from '@/components/ProjectCard'
import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'
import { getPayloadClient } from '@/lib/payload'
import { localeAlternates } from '@/lib/seo'
import type { Project } from '@/payload-types'

export const dynamic = 'force-dynamic'

interface HomePageProps {
  params: Promise<{ locale: Locale }>
}

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { locale } = await params

  return {
    alternates: localeAlternates(locale, ''),
  }
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations('home')
  const tCommon = await getTranslations('common')
  const payload = await getPayloadClient()

  const home = await payload.findGlobal({ slug: 'home', locale, depth: 1 })

  const featuredProjects = (home.featuredProjects ?? []).filter(
    (project): project is Project =>
      typeof project === 'object' && project._status === 'published',
  )

  const recentPostsLimit = home.recentPostsLimit ?? 3
  const { docs: recentPosts } =
    recentPostsLimit > 0
      ? await payload.find({
          collection: 'posts',
          locale,
          limit: recentPostsLimit,
          sort: '-publishedAt',
          where: { _status: { equals: 'published' } },
        })
      : { docs: [] }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6">
      <section className="py-24 sm:py-32">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          {home.heroTitle || t('greeting')}
        </h1>
        <p className="text-muted mt-4 max-w-xl text-lg">{home.heroSubtitle || t('tagline')}</p>
      </section>

      {featuredProjects.length > 0 && (
        <section className="pb-16">
          <div className="mb-6 flex items-baseline justify-between">
            <h2 className="text-xl font-semibold tracking-tight">{t('featured')}</h2>
            <Link href="/portfolio" className="text-muted hover:text-foreground text-sm transition-colors">
              {tCommon('viewAll')} →
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>
      )}

      {recentPosts.length > 0 && (
        <section className="pb-24">
          <div className="mb-2 flex items-baseline justify-between">
            <h2 className="text-xl font-semibold tracking-tight">{t('recentPosts')}</h2>
            <Link href="/blog" className="text-muted hover:text-foreground text-sm transition-colors">
              {tCommon('viewAll')} →
            </Link>
          </div>
          <div className="divide-border/60 divide-y">
            {recentPosts.map((post) => (
              <PostCard key={post.id} post={post} locale={locale} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
