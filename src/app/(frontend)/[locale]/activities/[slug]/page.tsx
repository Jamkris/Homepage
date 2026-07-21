import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import React from 'react'

import { CertificateViewer } from '@/components/CertificateViewer'
import { RichText } from '@/components/RichText'
import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'
import { formatFullDate, truncateUrl } from '@/lib/format'
import { getPayloadClient } from '@/lib/payload'
import { localeAlternates } from '@/lib/seo'
import type { Activity } from '@/payload-types'

export const dynamic = 'force-dynamic'

interface ActivityPageProps {
  params: Promise<{ locale: Locale; slug: string }>
}

const findActivity = async (locale: Locale, slug: string): Promise<Activity | null> => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'activities',
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

export async function generateMetadata({ params }: ActivityPageProps): Promise<Metadata> {
  const { locale, slug } = await params
  const activity = await findActivity(locale, slug)

  if (!activity) {
    return {}
  }

  return {
    title: activity.title,
    description: activity.organization ?? undefined,
    alternates: localeAlternates(locale, `/activities/${slug}`),
  }
}

export default async function ActivityPage({ params }: ActivityPageProps) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  const t = await getTranslations('about')
  const tCommon = await getTranslations('common')
  const activity = await findActivity(locale, slug)

  if (!activity) {
    notFound()
  }

  const media =
    activity.attachment && typeof activity.attachment === 'object' ? activity.attachment : null
  const thumbUrl = media?.sizes?.thumbnail?.url ?? media?.url ?? null

  const period =
    activity.startDate &&
    `${formatFullDate(locale, activity.startDate)}${
      activity.ongoing
        ? ` ~ ${tCommon('present')}`
        : activity.endDate
          ? ` ~ ${formatFullDate(locale, activity.endDate)}`
          : ''
    }`

  return (
    <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      <Link
        href="/portfolio"
        className="font-mono text-muted hover:text-accent text-xs tracking-wider uppercase transition-colors"
      >
        ← {tCommon('viewAll')}
      </Link>

      <header className="mt-6">
        <p className="font-mono text-accent text-xs font-medium tracking-[0.25em] uppercase sm:text-sm">
          {t(`activityType.${activity.type}`)}
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-balance sm:text-5xl">
          {activity.title}
        </h1>
        <div className="text-muted mt-3 flex flex-wrap items-center gap-x-3 gap-y-1">
          {activity.organization && <span>{activity.organization}</span>}
          {period && <span className="font-mono text-sm tabular-nums">{period}</span>}
        </div>
        {activity.tags && activity.tags.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-1.5">
            {activity.tags.map((tag) => (
              <li
                key={tag}
                className="font-mono text-accent bg-accent/10 rounded px-2 py-0.5 text-xs"
              >
                #{tag}
              </li>
            ))}
          </ul>
        )}
        {activity.references && activity.references.length > 0 && (
          <dl className="mt-5 space-y-1.5">
            {activity.references.map((ref) => (
              <div key={ref.id ?? ref.url} className="flex flex-wrap gap-x-2 text-sm">
                <dt className="font-mono text-muted">{ref.label}:</dt>
                <dd>
                  <a
                    href={ref.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={ref.url}
                    className="text-accent underline underline-offset-4"
                  >
                    {truncateUrl(ref.url)}
                  </a>
                </dd>
              </div>
            ))}
          </dl>
        )}
      </header>

      {media?.url && (
        <div className="mt-8">
          <CertificateViewer
            name={activity.title}
            url={media.url}
            mimeType={media.mimeType}
            thumbUrl={thumbUrl}
          />
        </div>
      )}

      {activity.content && (
        <div className="mt-10">
          <RichText data={activity.content} />
        </div>
      )}
    </article>
  )
}
