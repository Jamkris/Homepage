import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import React from 'react'

import { MediaImage } from '@/components/MediaImage'
import { RichText } from '@/components/RichText'
import type { Locale } from '@/i18n/routing'
import { formatMonth } from '@/lib/format'
import { getPayloadClient } from '@/lib/payload'
import type { Project } from '@/payload-types'

export const dynamic = 'force-dynamic'

interface ProjectPageProps {
  params: Promise<{ locale: Locale; slug: string }>
}

const findProject = async (locale: Locale, slug: string): Promise<Project | null> => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'projects',
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

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { locale, slug } = await params
  const project = await findProject(locale, slug)

  if (!project) {
    return {}
  }

  return {
    title: project.title,
    description: project.summary,
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  const t = await getTranslations('portfolio')
  const tCommon = await getTranslations('common')
  const project = await findProject(locale, slug)

  if (!project) {
    notFound()
  }

  const period =
    project.startedAt &&
    `${formatMonth(locale, project.startedAt)} — ${
      project.endedAt ? formatMonth(locale, project.endedAt) : tCommon('present')
    }`

  return (
    <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      <header>
        <p className="text-accent text-sm font-medium">{t(`categories.${project.category}`)}</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{project.title}</h1>
        <p className="text-muted mt-3 text-lg">{project.summary}</p>
        {period && <p className="text-muted mt-2 text-sm tabular-nums">{period}</p>}
      </header>

      {project.coverImage && typeof project.coverImage === 'object' && (
        <MediaImage
          media={project.coverImage}
          className="mt-8 w-full rounded-lg"
          sizes="(max-width: 768px) 100vw, 768px"
          priority
        />
      )}

      <div className="mt-10 flex flex-wrap gap-x-12 gap-y-6">
        {project.techStack && project.techStack.length > 0 && (
          <section>
            <h2 className="text-muted text-sm font-medium">{t('techStack')}</h2>
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {project.techStack.map((tech) => (
                <li key={tech} className="bg-surface rounded px-2 py-0.5 text-sm">
                  {tech}
                </li>
              ))}
            </ul>
          </section>
        )}
        {project.links && project.links.length > 0 && (
          <section>
            <h2 className="text-muted text-sm font-medium">{t('links')}</h2>
            <ul className="mt-2 flex flex-wrap gap-4">
              {project.links.map((link) => (
                <li key={link.id ?? link.url}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-accent underline underline-offset-4 transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      {project.description && (
        <div className="mt-10">
          <RichText data={project.description} />
        </div>
      )}
    </article>
  )
}
