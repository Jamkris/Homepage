import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import React from 'react'

import { MediaImage } from '@/components/MediaImage'
import { ContactForm } from '@/components/ContactForm'
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
  // Prefer the About email; fall back to a mailto-style email social link
  const socialEmail = socials.find((social) => social.platform === 'email')?.url
  const mailto = about.email
    ? `mailto:${about.email}`
    : socialEmail
      ? socialEmail.startsWith('mailto:')
        ? socialEmail
        : `mailto:${socialEmail}`
      : null

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
              <p className="font-mono text-muted flex items-center gap-2.5 text-xs tracking-[0.2em] uppercase">
                <span className="bg-accent size-2 animate-pulse rounded-full" aria-hidden />
                {t('openTo')}
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <h1 className="mt-6 text-6xl leading-[0.95] font-extrabold tracking-tight text-balance uppercase sm:text-8xl">
                {home.heroTitle || about.name}
                <span className="text-accent">.</span>
              </h1>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="font-mono text-accent mt-6 text-xs tracking-[0.2em] uppercase sm:text-sm">
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
                  className="font-mono border-accent/50 hover:border-accent bg-accent/5 hover:bg-accent/10 rounded-lg border px-6 py-3.5 text-sm transition-colors"
                >
                  {t('viewWork')} →
                </Link>
                <Link
                  href="/about"
                  className="font-mono text-muted hover:text-foreground px-3 py-3.5 text-sm transition-colors"
                >
                  {t('aboutMe')} ↗
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
        <div className="mx-auto max-w-5xl px-4 py-24 text-center sm:px-6 sm:py-32">
          <Reveal>
            <p className="font-mono text-accent text-xs tracking-[0.2em] uppercase">
              {t('contactLabel')}
            </p>
            <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-6xl">
              {t('contactTitle')}
            </h2>
            <p className="text-muted mx-auto mt-4 max-w-md">{t('contactSub')}</p>
            <ContactForm />
            {mailto && (
              <a
                href={mailto}
                className="font-mono text-muted hover:text-accent mt-6 inline-block text-xs transition-colors"
              >
                {t('getInTouch')} ↗
              </a>
            )}
          </Reveal>
        </div>
      </section>
    </div>
  )
}
