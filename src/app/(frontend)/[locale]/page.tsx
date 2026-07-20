import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import React from 'react'

import { MediaImage } from '@/components/MediaImage'
import { PostCard } from '@/components/PostCard'
import { ProjectCard } from '@/components/ProjectCard'
import { SectionHeading } from '@/components/SectionHeading'
import { LocalTime } from '@/components/fx/LocalTime'
import { Reveal } from '@/components/fx/Reveal'
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

  const [home, about, settings] = await Promise.all([
    payload.findGlobal({ slug: 'home', locale, depth: 1 }),
    payload.findGlobal({ slug: 'about', locale, depth: 1 }),
    payload.findGlobal({ slug: 'site-settings', locale }),
  ])

  let featured = (home.featuredProjects ?? []).filter(
    (project): project is Project =>
      typeof project === 'object' && project._status === 'published',
  )

  if (featured.length === 0) {
    const { docs } = await payload.find({
      collection: 'projects',
      locale,
      limit: 3,
      depth: 1,
      sort: '-startedAt',
      where: { _status: { equals: 'published' } },
    })
    featured = docs
  }

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

  const currentJob = (about.experiences ?? []).find((exp) => !exp.endDate)
  const socials = settings.socials ?? []
  const email = socials.find((social) => social.platform === 'email')?.url

  return (
    <div>
      {/* Hero */}
      <section className="relative flex min-h-[calc(100svh-3.5rem)] items-center overflow-hidden sm:min-h-[calc(100svh-4rem)]">
        <div
          className="bg-accent/15 absolute top-[-15%] left-[-10%] size-[26rem] rounded-full blur-[130px]"
          aria-hidden
        />
        <div className="mx-auto grid w-full max-w-5xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_auto]">
          <div>
            <Reveal>
              <p className="text-muted text-lg font-light sm:text-xl">{t('greeting')}</p>
            </Reveal>
            <Reveal delay={0.1}>
              <h1 className="mt-3 text-6xl leading-none font-extrabold tracking-tight text-balance uppercase sm:text-8xl">
                {home.heroTitle || about.name}
              </h1>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="text-accent mt-6 text-sm font-medium tracking-[0.25em] uppercase">
                {about.headline || t('role')}
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <p className="text-muted mt-5 max-w-xl text-lg">
                {home.heroSubtitle || t('tagline')}
              </p>
            </Reveal>
            <Reveal delay={0.4}>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Link
                  href="/portfolio"
                  className="bg-accent text-background rounded-full px-6 py-3 text-sm font-semibold transition-transform hover:scale-[1.03]"
                >
                  {t('viewWork')} →
                </Link>
                <Link
                  href="/about"
                  className="border-border hover:border-accent hover:text-accent rounded-full border px-6 py-3 text-sm font-medium transition-colors"
                >
                  {t('aboutMe')}
                </Link>
              </div>
            </Reveal>
          </div>
          {about.profileImage && typeof about.profileImage === 'object' && (
            <Reveal delay={0.25} className="hidden lg:block">
              <div className="border-accent/25 relative overflow-hidden rounded-2xl border">
                <MediaImage
                  media={about.profileImage}
                  className="aspect-[4/5] w-[320px] object-cover"
                  sizes="320px"
                  priority
                />
              </div>
            </Reveal>
          )}
        </div>
        <div className="absolute bottom-0 left-0 w-full">
          <div className="text-muted mx-auto flex max-w-5xl items-center justify-between px-4 pb-6 text-[11px] tracking-[0.2em] uppercase sm:px-6 sm:text-xs">
            <LocalTime />
            <span className="animate-bounce" aria-hidden>
              ↓ {t('scroll')}
            </span>
            <span>{t('location')}</span>
          </div>
        </div>
      </section>

      {/* Currently */}
      {currentJob && (
        <section className="border-border border-t">
          <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
            <Reveal>
              <SectionHeading label={t('currentlyLabel')} />
              <p className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
                {currentJob.role}{' '}
                <span className="text-muted font-normal">@ {currentJob.company}</span>
              </p>
              {currentJob.description && (
                <p className="text-muted mt-3 max-w-2xl">{currentJob.description}</p>
              )}
              <Link
                href="/about"
                className="text-accent mt-5 inline-block text-sm font-medium hover:underline"
              >
                {tCommon('readMore')} →
              </Link>
            </Reveal>
          </div>
        </section>
      )}

      {/* Featured projects */}
      {featured.length > 0 && (
        <section className="border-border border-t">
          <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
            <Reveal>
              <div className="flex items-end justify-between">
                <SectionHeading label={t('featuredLabel')} title={t('featured')} />
                <Link
                  href="/portfolio"
                  className="text-muted hover:text-accent mb-1 hidden text-sm transition-colors sm:block"
                >
                  {tCommon('viewAll')} →
                </Link>
              </div>
            </Reveal>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((project, i) => (
                <Reveal key={project.id} delay={i * 0.08}>
                  <ProjectCard project={project} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recent posts */}
      {recentPosts.length > 0 && (
        <section className="border-border border-t">
          <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
            <Reveal>
              <div className="flex items-end justify-between">
                <SectionHeading label={t('recentPostsLabel')} title={t('recentPosts')} />
                <Link
                  href="/blog"
                  className="text-muted hover:text-accent mb-1 hidden text-sm transition-colors sm:block"
                >
                  {tCommon('viewAll')} →
                </Link>
              </div>
            </Reveal>
            <div className="mt-8">
              {recentPosts.map((post, i) => (
                <Reveal key={post.id} delay={i * 0.05}>
                  <PostCard post={post} locale={locale} index={i} />
                </Reveal>
              ))}
              <div className="border-border border-t" />
            </div>
          </div>
        </section>
      )}

      {/* Contact */}
      <section className="border-border border-t">
        <div className="mx-auto max-w-5xl px-4 py-20 text-center sm:px-6 sm:py-28">
          <Reveal>
            <SectionHeading label={t('contactLabel')} className="[&>p]:text-center" />
            <h2 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
              {t('contactTitle')}
            </h2>
            <p className="text-muted mx-auto mt-4 max-w-md">{t('contactSub')}</p>
            {email && (
              <a
                href={email}
                className="bg-accent text-background mt-8 inline-block rounded-full px-8 py-3.5 text-sm font-semibold transition-transform hover:scale-[1.03]"
              >
                {t('getInTouch')} →
              </a>
            )}
          </Reveal>
        </div>
      </section>
    </div>
  )
}
