import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import React from 'react'

import { ProjectCard } from '@/components/ProjectCard'
import { Reveal } from '@/components/fx/Reveal'
import type { Locale } from '@/i18n/routing'
import { getPayloadClient } from '@/lib/payload'
import { localeAlternates } from '@/lib/seo'
import type { Project } from '@/payload-types'

export const dynamic = 'force-dynamic'

const CATEGORY_ORDER = ['work', 'opensource', 'personal'] as const

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

  const grouped = CATEGORY_ORDER.map((category) => ({
    category,
    projects: projects.filter((project: Project) => project.category === category),
  })).filter((group) => group.projects.length > 0)

  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-20">
      <h1 className="font-display text-[clamp(2.5rem,7vw,5rem)] leading-none font-bold tracking-tighter uppercase">
        {t('title')}
        <span className="text-accent">.</span>
      </h1>
      <p className="text-muted mt-4 text-lg">{t('description')}</p>

      {grouped.length === 0 ? (
        <p className="text-muted mt-20 text-center">{t('empty')}</p>
      ) : (
        <div className="mt-14 space-y-20">
          {grouped.map(({ category, projects: categoryProjects }) => (
            <section key={category}>
              <Reveal>
                <div className="mb-7 flex items-center gap-3">
                  <span className="bg-accent size-2" aria-hidden />
                  <h2 className="font-display text-muted text-sm font-medium tracking-[0.2em] uppercase">
                    {t(`categories.${category}`)}
                  </h2>
                  <span className="text-muted font-display text-sm tabular-nums">
                    ({categoryProjects.length})
                  </span>
                </div>
              </Reveal>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {categoryProjects.map((project, i) => (
                  <Reveal key={project.id} delay={Math.min(i * 0.06, 0.3)}>
                    <ProjectCard project={project} />
                  </Reveal>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
