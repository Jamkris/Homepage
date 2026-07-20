import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import React from 'react'

import { ProjectShowcase } from '@/components/ProjectShowcase'
import type { Locale } from '@/i18n/routing'
import { getPayloadClient } from '@/lib/payload'
import { localeAlternates } from '@/lib/seo'

export const dynamic = 'force-dynamic'

interface PortfolioPageProps {
  params: Promise<{ locale: Locale }>
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

export default async function PortfolioPage({ params }: PortfolioPageProps) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations('portfolio')
  const payload = await getPayloadClient()

  const { docs: projects } = await payload.find({
    collection: 'projects',
    locale,
    limit: 100,
    depth: 1,
    sort: '-startedAt',
    where: { _status: { equals: 'published' } },
  })

  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-20">
      <p className="eyebrow">{t('sectionLabel')}</p>
      <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-6xl">{t('title')}</h1>
      <p className="text-muted mt-4 max-w-xl text-lg">{t('description')}</p>

      {projects.length === 0 ? (
        <p className="text-muted mt-24 text-center">{t('empty')}</p>
      ) : (
        <div className="mt-16 sm:mt-24">
          <ProjectShowcase projects={projects} />
        </div>
      )}
    </div>
  )
}
