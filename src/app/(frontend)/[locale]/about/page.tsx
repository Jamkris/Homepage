import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import React from 'react'

import { MediaImage } from '@/components/MediaImage'
import { RichText } from '@/components/RichText'
import type { Locale } from '@/i18n/routing'
import { formatMonth } from '@/lib/format'
import { getPayloadClient } from '@/lib/payload'

export const dynamic = 'force-dynamic'

interface AboutPageProps {
  params: Promise<{ locale: Locale }>
}

export async function generateMetadata({ params }: AboutPageProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'about' })

  return { title: t('title') }
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations('about')
  const tCommon = await getTranslations('common')
  const payload = await getPayloadClient()

  const about = await payload.findGlobal({ slug: 'about', locale, depth: 1 })

  const skills = about.skills ?? []
  const experiences = about.experiences ?? []
  const certifications = about.certifications ?? []
  const isEmpty = !about.bio && skills.length === 0 && experiences.length === 0

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      <header className="flex items-center gap-6">
        {about.profileImage && typeof about.profileImage === 'object' && (
          <MediaImage
            media={about.profileImage}
            className="size-20 rounded-full object-cover sm:size-24"
            sizes="96px"
            priority
          />
        )}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{about.name}</h1>
          {about.headline && <p className="text-muted mt-1.5">{about.headline}</p>}
        </div>
      </header>

      {isEmpty && <p className="text-muted mt-16 text-center">{t('empty')}</p>}

      {about.bio && (
        <section className="mt-12">
          <RichText data={about.bio} />
        </section>
      )}

      {skills.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-semibold tracking-tight">{t('skills')}</h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {skills.map((skill) => (
              <li key={skill} className="bg-surface rounded-md px-3 py-1 text-sm">
                {skill}
              </li>
            ))}
          </ul>
        </section>
      )}

      {experiences.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-semibold tracking-tight">{t('experience')}</h2>
          <ol className="border-border/60 mt-6 space-y-8 border-l pl-6">
            {experiences.map((exp) => (
              <li key={exp.id ?? `${exp.company}-${exp.startDate}`} className="relative">
                <span className="bg-accent absolute top-1.5 -left-[27.5px] size-2 rounded-full" />
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-semibold">
                    {exp.company} <span className="text-muted font-normal">· {exp.role}</span>
                  </h3>
                  <p className="text-muted text-sm tabular-nums">
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

      {certifications.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-semibold tracking-tight">{t('certifications')}</h2>
          <ul className="mt-4 space-y-3">
            {certifications.map((cert) => (
              <li
                key={cert.id ?? cert.name}
                className="flex flex-wrap items-baseline justify-between gap-2"
              >
                <p>
                  {cert.url ? (
                    <a
                      href={cert.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-accent underline underline-offset-4 transition-colors"
                    >
                      {cert.name}
                    </a>
                  ) : (
                    cert.name
                  )}
                  {cert.issuer && <span className="text-muted"> · {cert.issuer}</span>}
                </p>
                {cert.issuedAt && (
                  <p className="text-muted text-sm tabular-nums">
                    {formatMonth(locale, cert.issuedAt)}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
