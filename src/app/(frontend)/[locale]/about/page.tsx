import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import React from 'react'

import { CertificateViewer } from '@/components/CertificateViewer'
import { MediaImage } from '@/components/MediaImage'
import { RichText } from '@/components/RichText'
import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'
import { formatMonth, richTextToPlainText } from '@/lib/format'
import { getPayloadClient } from '@/lib/payload'
import { localeAlternates } from '@/lib/seo'

export const dynamic = 'force-dynamic'

interface AboutPageProps {
  params: Promise<{ locale: Locale }>
}

export async function generateMetadata({ params }: AboutPageProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'about' })

  return {
    title: t('title'),
    alternates: localeAlternates(locale, '/about'),
  }
}

interface MetaRow {
  label: string
  value: string
  href?: string
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations('about')
  const tCommon = await getTranslations('common')
  const payload = await getPayloadClient()

  const [about, activitiesResult] = await Promise.all([
    payload.findGlobal({ slug: 'about', locale, depth: 1 }),
    payload.find({
      collection: 'activities',
      locale,
      depth: 1,
      limit: 100,
      sort: '-startDate',
      where: { _status: { equals: 'published' } },
    }),
  ])

  const activities = activitiesResult.docs
  const experiences = about.experiences ?? []
  const certifications = about.certifications ?? []
  const skillGroups = about.skillGroups ?? []
  const flatSkills = about.skills ?? []
  const currentJob = experiences.find((exp) => !exp.endDate)

  const metaRows: MetaRow[] = [
    about.location ? { label: t('basedIn'), value: about.location } : null,
    currentJob
      ? { label: t('currently'), value: `${currentJob.role} @ ${currentJob.company}` }
      : null,
    about.studying ? { label: t('studying'), value: about.studying } : null,
    about.focus ? { label: t('focus'), value: about.focus } : null,
    about.email ? { label: t('email'), value: about.email, href: `mailto:${about.email}` } : null,
    about.phone
      ? { label: t('phone'), value: about.phone, href: `tel:${about.phone.replace(/\s+/g, '')}` }
      : null,
  ].filter((row): row is MetaRow => row !== null)

  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-20">
      <p className="eyebrow">{t('title')}</p>

      {/* Intro: photo + meta sidebar | statement + bio */}
      <div className="mt-10 grid gap-10 lg:grid-cols-[300px_1fr] lg:gap-16">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          {about.profileImage && typeof about.profileImage === 'object' && (
            <div className="border-accent/25 overflow-hidden rounded-2xl border">
              <MediaImage
                media={about.profileImage}
                className="aspect-[4/5] w-full object-cover"
                sizes="300px"
                priority
              />
            </div>
          )}
          {metaRows.length > 0 && (
            <dl className="mt-8 space-y-4">
              {metaRows.map((row) => (
                <div key={row.label} className="border-border/60 border-t pt-3">
                  <dt className="font-mono text-muted text-[11px] tracking-[0.15em] uppercase">
                    {row.label}
                  </dt>
                  <dd className="mt-1 font-mono text-sm">
                    {row.href ? (
                      <a href={row.href} className="hover:text-accent transition-colors">
                        {row.value}
                      </a>
                    ) : (
                      row.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          )}
        </aside>

        <div>
          <h1 className="text-3xl leading-tight font-bold tracking-tight text-balance sm:text-5xl">
            {about.headline || about.name}
          </h1>
          {about.bio && (
            <div className="mt-8">
              <RichText data={about.bio} />
            </div>
          )}
        </div>
      </div>

      {/* Experience */}
      {experiences.length > 0 && (
        <section className="border-border mt-20 border-t pt-14">
          <h2 className="eyebrow">{t('experience')}</h2>
          <ol className="border-border/60 mt-8 space-y-8 border-l pl-6">
            {experiences.map((exp) => (
              <li key={exp.id ?? `${exp.company}-${exp.startDate}`} className="relative">
                <span className="bg-accent absolute top-1.5 -left-[27.5px] size-2 rounded-full" />
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-semibold">
                    {exp.company} <span className="text-muted font-normal">· {exp.role}</span>
                  </h3>
                  <p className="font-mono text-muted text-sm tabular-nums">
                    {formatMonth(locale, exp.startDate)} —{' '}
                    {exp.endDate ? formatMonth(locale, exp.endDate) : tCommon('present')}
                  </p>
                </div>
                {exp.description && (
                  <p className="text-muted mt-2 text-sm whitespace-pre-line">{exp.description}</p>
                )}
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <section className="border-border mt-16 border-t pt-14">
          <h2 className="eyebrow">{t('certifications')}</h2>
          <ul className="mt-8 space-y-5">
            {certifications.map((cert) => {
              const media =
                cert.attachment && typeof cert.attachment === 'object' ? cert.attachment : null
              const thumbUrl = media?.sizes?.thumbnail?.url ?? media?.url ?? null

              return (
                <li
                  key={cert.id ?? cert.name}
                  className="border-border/60 flex flex-wrap items-center justify-between gap-3 border-t pt-4"
                >
                  <div className="min-w-0">
                    <p>
                      {cert.name}
                      {cert.issuer && <span className="text-muted"> · {cert.issuer}</span>}
                    </p>
                    {cert.issuedAt && (
                      <p className="font-mono text-muted mt-1 text-sm tabular-nums">
                        {formatMonth(locale, cert.issuedAt)}
                      </p>
                    )}
                  </div>
                  {media?.url ? (
                    <CertificateViewer
                      name={cert.name}
                      url={media.url}
                      mimeType={media.mimeType}
                      thumbUrl={thumbUrl}
                    />
                  ) : (
                    cert.url && (
                      <a
                        href={cert.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono border-accent/40 bg-accent/10 text-accent hover:bg-accent/20 hover:border-accent inline-flex shrink-0 items-center gap-1.5 rounded-md border px-3 py-2 text-xs transition-colors"
                      >
                        {t('viewCertificate')} ↗
                      </a>
                    )
                  )}
                </li>
              )
            })}
          </ul>
        </section>
      )}

      {/* Awards & Activities — horizontal scrolling cards */}
      {activities.length > 0 && (
        <section className="border-border mt-16 border-t pt-14">
          <h2 className="eyebrow">{t('awards')}</h2>
          <h3 className="mt-4 text-2xl font-bold tracking-tight">{t('awardsTitle')}</h3>

          <div className="mt-8 flex snap-x gap-4 overflow-x-auto pb-4">
            {activities.map((activity) => {
              const excerpt = richTextToPlainText(activity.content) || activity.organization || ''
              const card = (
                <div className="border-border bg-surface/40 group-hover:border-accent/50 flex h-full flex-col rounded-xl border p-5 transition-colors">
                  <p className="font-mono text-muted text-xs tabular-nums">
                    {formatMonth(locale, activity.startDate)}
                    {activity.ongoing
                      ? ` ~ ${tCommon('present')}`
                      : activity.endDate
                        ? ` ~ ${formatMonth(locale, activity.endDate)}`
                        : ''}
                  </p>
                  <h4 className="group-hover:text-accent mt-3 text-lg font-bold tracking-tight transition-colors">
                    {activity.title}
                  </h4>
                  {excerpt && (
                    <p className="text-muted mt-2 line-clamp-3 flex-1 text-sm leading-relaxed">
                      {excerpt}
                    </p>
                  )}
                  {activity.tags && activity.tags.length > 0 && (
                    <ul className="mt-3 flex flex-wrap gap-1.5">
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
                  {activity.slug && (
                    <span className="text-accent mt-4 inline-block text-sm">
                      → {tCommon('readMore')}
                    </span>
                  )}
                </div>
              )

              return activity.slug ? (
                <Link
                  key={activity.id}
                  href={`/activities/${activity.slug}`}
                  className="group w-[280px] shrink-0 snap-start sm:w-[320px]"
                >
                  {card}
                </Link>
              ) : (
                <div key={activity.id} className="w-[280px] shrink-0 snap-start sm:w-[320px]">
                  {card}
                </div>
              )
            })}
          </div>
          <p className="font-mono text-muted mt-2 text-center text-xs tracking-wider">
            ← {t('scrollHint')} →
          </p>
        </section>
      )}

      {/* Tools */}
      {(skillGroups.length > 0 || flatSkills.length > 0) && (
        <section className="border-border mt-16 border-t pt-14">
          <h2 className="eyebrow">{t('tools')}</h2>
          {skillGroups.length > 0 ? (
            <div className="mt-8 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
              {skillGroups.map((group) => (
                <div key={group.id ?? group.category}>
                  <h3 className="font-mono text-accent flex items-center gap-2 text-xs tracking-[0.15em] uppercase">
                    <span className="bg-accent h-px w-4" aria-hidden />
                    {group.category}
                  </h3>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {(group.items ?? []).map((item) => (
                      <li
                        key={item}
                        className="font-mono bg-surface border-border rounded-md border px-2.5 py-1 text-sm"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <ul className="mt-8 flex flex-wrap gap-2">
              {flatSkills.map((skill) => (
                <li
                  key={skill}
                  className="font-mono bg-surface border-border rounded-md border px-2.5 py-1 text-sm"
                >
                  {skill}
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  )
}
