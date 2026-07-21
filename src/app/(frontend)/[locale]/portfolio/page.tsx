import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import React from 'react'

import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'
import { formatMonth } from '@/lib/format'
import { getPayloadClient } from '@/lib/payload'
import { localeAlternates } from '@/lib/seo'

export const dynamic = 'force-dynamic'

interface PortfolioPageProps {
  params: Promise<{ locale: Locale }>
}

interface TimelineItem {
  key: string
  href: string
  title: string
  summary?: string | null
  typeLabel: string
  dateMs: number
  dateLabel: string
  ongoing: boolean
  tags: string[]
  imageUrl?: string | null
}

export async function generateMetadata({ params }: PortfolioPageProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'portfolio' })

  return {
    title: t('title'),
    description: t('description'),
    alternates: localeAlternates(locale, '/portfolio'),
  }
}

const msOf = (value?: string | null): number =>
  value ? new Date(value).getTime() : Number.NEGATIVE_INFINITY

export default async function PortfolioPage({ params }: PortfolioPageProps) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations('portfolio')
  const tAbout = await getTranslations('about')
  const payload = await getPayloadClient()

  const [projectsResult, activitiesResult] = await Promise.all([
    payload.find({
      collection: 'projects',
      locale,
      limit: 200,
      depth: 1,
      where: { _status: { equals: 'published' } },
    }),
    payload.find({
      collection: 'activities',
      locale,
      limit: 200,
      depth: 1,
      where: { _status: { equals: 'published' } },
    }),
  ])

  const projectItems: TimelineItem[] = projectsResult.docs.map((project) => {
    const media = typeof project.coverImage === 'object' ? project.coverImage : null
    return {
      key: `project-${project.id}`,
      href: `/portfolio/${project.slug}`,
      title: project.title,
      summary: project.summary,
      typeLabel: t(`categories.${project.category}`),
      dateMs: msOf(project.startedAt),
      dateLabel: formatMonth(locale, project.startedAt),
      ongoing: Boolean(project.startedAt && !project.endedAt),
      tags: project.techStack ?? [],
      imageUrl: media?.sizes?.card?.url ?? media?.url ?? null,
    }
  })

  const activityItems: TimelineItem[] = activitiesResult.docs
    .filter((activity) => activity.slug)
    .map((activity) => {
      const media = typeof activity.attachment === 'object' ? activity.attachment : null
      const isImage = (media?.mimeType ?? '').startsWith('image/')
      return {
        key: `activity-${activity.id}`,
        href: `/activities/${activity.slug}`,
        title: activity.title,
        summary: activity.organization,
        typeLabel: tAbout(`activityType.${activity.type}`),
        dateMs: msOf(activity.startDate),
        dateLabel: formatMonth(locale, activity.startDate),
        ongoing: Boolean(activity.startDate && !activity.endDate && activity.ongoing),
        tags: activity.tags ?? [],
        imageUrl: isImage ? (media?.sizes?.thumbnail?.url ?? media?.url ?? null) : null,
      }
    })

  const items = [...projectItems, ...activityItems].sort((a, b) => b.dateMs - a.dateMs)

  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-20">
      <p className="eyebrow">{t('sectionLabel')}</p>
      <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-6xl">{t('title')}</h1>
      <p className="text-muted mt-4 max-w-xl text-lg">{t('description')}</p>

      {items.length === 0 ? (
        <p className="text-muted mt-24 text-center">{t('empty')}</p>
      ) : (
        <div className="mt-16 sm:mt-20">
          {items.map((item, i) => (
            <article
              key={item.key}
              className="border-border grid grid-cols-1 gap-5 border-t py-8 sm:grid-cols-[1fr_auto] sm:gap-10 sm:py-10"
            >
              <div className="min-w-0">
                <div className="font-mono text-muted flex flex-wrap items-center gap-x-4 gap-y-1 text-xs tracking-wider uppercase">
                  <span className="text-accent tabular-nums">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {item.dateLabel && <span className="tabular-nums">{item.dateLabel}</span>}
                  <span className="bg-border h-px w-6" aria-hidden />
                  <span>{item.typeLabel}</span>
                  {item.ongoing && (
                    <span className="text-accent flex items-center gap-1.5">
                      <span className="bg-accent size-1.5 animate-pulse rounded-full" aria-hidden />
                      {t('ongoing')}
                    </span>
                  )}
                </div>
                <h3 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
                  <Link
                    href={item.href}
                    className="hover:text-accent inline-flex items-baseline gap-2 transition-colors"
                  >
                    {item.title}
                    <span className="text-base" aria-hidden>
                      ↗
                    </span>
                  </Link>
                </h3>
                {item.summary && (
                  <p className="text-muted mt-3 max-w-xl leading-relaxed">{item.summary}</p>
                )}
                {item.tags.length > 0 && (
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <li
                        key={tag}
                        className="font-mono border-border text-muted rounded-md border px-2.5 py-1 text-xs"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {item.imageUrl && (
                <Link href={item.href} className="group block sm:order-first sm:w-64">
                  <div className="border-border bg-surface overflow-hidden rounded-lg border">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="aspect-video w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                  </div>
                </Link>
              )}
            </article>
          ))}
          <div className="border-border border-t" />
        </div>
      )}
    </div>
  )
}
