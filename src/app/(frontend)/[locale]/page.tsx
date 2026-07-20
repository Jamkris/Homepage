import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import React from 'react'

import { PostCard } from '@/components/PostCard'
import { ProjectShowcase, type ShowcaseProject } from '@/components/ProjectShowcase'
import { AnimatedTitle } from '@/components/fx/AnimatedTitle'
import { LocalTime } from '@/components/fx/LocalTime'
import { Marquee } from '@/components/fx/Marquee'
import { Reveal } from '@/components/fx/Reveal'
import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'
import { getPayloadClient } from '@/lib/payload'
import { localeAlternates, mediaImageUrl } from '@/lib/seo'
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

const FALLBACK_MARQUEE = ['Jamkris', 'Developer', 'Portfolio', 'Blog', 'Seoul']

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations('home')
  const tCommon = await getTranslations('common')
  const tPortfolio = await getTranslations('portfolio')
  const payload = await getPayloadClient()

  const [home, about] = await Promise.all([
    payload.findGlobal({ slug: 'home', locale, depth: 1 }),
    payload.findGlobal({ slug: 'about', locale, depth: 0 }),
  ])

  let featured = (home.featuredProjects ?? []).filter(
    (project): project is Project =>
      typeof project === 'object' && project._status === 'published',
  )

  if (featured.length === 0) {
    const { docs } = await payload.find({
      collection: 'projects',
      locale,
      limit: 4,
      depth: 1,
      sort: '-startedAt',
      where: { _status: { equals: 'published' } },
    })
    featured = docs
  }

  const showcase: ShowcaseProject[] = featured.map((project) => {
    const media = typeof project.coverImage === 'object' ? project.coverImage : null
    return {
      id: project.id,
      slug: project.slug,
      title: project.title,
      categoryLabel: tPortfolio(`categories.${project.category}`),
      imageUrl: media?.sizes?.card?.url ?? mediaImageUrl(media),
      imageAlt: media?.alt,
    }
  })

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

  const marqueeItems = (about.skills?.length ? about.skills : FALLBACK_MARQUEE) as string[]

  return (
    <div>
      {/* Hero */}
      <section className="relative flex min-h-[calc(100svh-3.5rem)] flex-col justify-center overflow-hidden sm:min-h-[calc(100svh-4rem)]">
        <div
          className="bg-accent/25 absolute -top-40 right-[-10%] size-[30rem] rounded-full blur-[140px]"
          aria-hidden
        />
        <div className="mx-auto w-full max-w-5xl px-4 sm:px-6">
          <Reveal>
            <p className="font-display text-accent text-xs font-medium tracking-[0.3em] uppercase sm:text-sm">
              {t('role')}
            </p>
          </Reveal>
          <AnimatedTitle
            text={home.heroTitle || t('greeting')}
            delay={0.15}
            className="font-display mt-6 text-[clamp(2.6rem,9vw,7rem)] leading-[1.04] font-bold tracking-tighter text-balance"
          />
          <Reveal delay={0.5}>
            <p className="text-muted mt-8 max-w-xl text-lg sm:text-xl">
              {home.heroSubtitle || t('tagline')}
            </p>
          </Reveal>
        </div>
        <div className="absolute bottom-0 left-0 w-full">
          <div className="font-display text-muted mx-auto flex max-w-5xl items-center justify-between px-4 pb-6 text-[11px] tracking-[0.2em] uppercase sm:px-6 sm:text-xs">
            <LocalTime />
            <span className="animate-bounce" aria-hidden>
              ↓ {t('scroll')}
            </span>
            <span>{t('location')}</span>
          </div>
        </div>
      </section>

      {/* Skills marquee */}
      <Marquee
        items={marqueeItems}
        className="border-border font-display border-y py-4 text-xl font-semibold tracking-tight uppercase sm:py-5 sm:text-3xl"
      />

      {/* Selected work */}
      {showcase.length > 0 && (
        <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6 sm:py-28">
          <Reveal>
            <div className="mb-10 flex items-baseline justify-between">
              <div className="flex items-center gap-3">
                <span className="bg-accent size-2" aria-hidden />
                <h2 className="font-display text-muted text-sm font-medium tracking-[0.2em] uppercase">
                  {t('featured')}
                </h2>
                <span className="text-muted font-display text-sm tabular-nums">
                  ({showcase.length})
                </span>
              </div>
              <Link
                href="/portfolio"
                className="text-muted hover:text-accent text-sm transition-colors"
              >
                {tCommon('viewAll')} →
              </Link>
            </div>
          </Reveal>
          <ProjectShowcase projects={showcase} />
        </section>
      )}

      {/* Recent posts */}
      {recentPosts.length > 0 && (
        <section className="mx-auto max-w-5xl px-4 pb-24 sm:px-6 sm:pb-32">
          <Reveal>
            <div className="mb-4 flex items-baseline justify-between">
              <div className="flex items-center gap-3">
                <span className="bg-accent size-2" aria-hidden />
                <h2 className="font-display text-muted text-sm font-medium tracking-[0.2em] uppercase">
                  {t('recentPosts')}
                </h2>
              </div>
              <Link href="/blog" className="text-muted hover:text-accent text-sm transition-colors">
                {tCommon('viewAll')} →
              </Link>
            </div>
          </Reveal>
          <div>
            {recentPosts.map((post, i) => (
              <Reveal key={post.id} delay={i * 0.05}>
                <PostCard post={post} locale={locale} index={i} />
              </Reveal>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
