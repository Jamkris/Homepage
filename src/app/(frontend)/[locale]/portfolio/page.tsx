import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import React from 'react'

import { ProjectCard } from '@/components/ProjectCard'
import type { Locale } from '@/i18n/routing'
import { getPayloadClient } from '@/lib/payload'
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
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
      <p className="text-muted mt-2">{t('description')}</p>

      {grouped.length === 0 ? (
        <p className="text-muted mt-16 text-center">{t('empty')}</p>
      ) : (
        <div className="mt-10 space-y-14">
          {grouped.map(({ category, projects: categoryProjects }) => (
            <section key={category}>
              <h2 className="mb-5 text-xl font-semibold tracking-tight">
                {t(`categories.${category}`)}
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {categoryProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
