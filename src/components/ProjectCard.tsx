import { getTranslations } from 'next-intl/server'
import React from 'react'

import { MediaImage } from '@/components/MediaImage'
import { Link } from '@/i18n/navigation'
import type { Project } from '@/payload-types'

interface ProjectCardProps {
  project: Project
}

export async function ProjectCard({ project }: ProjectCardProps) {
  const t = await getTranslations('portfolio')

  const year = project.startedAt ? new Date(project.startedAt).getFullYear() : null
  const ongoing = Boolean(project.startedAt && !project.endedAt)

  return (
    <article className="h-full">
      <Link
        href={`/portfolio/${project.slug}`}
        className="group border-border hover:border-accent/50 bg-surface/40 block h-full overflow-hidden rounded-xl border transition-colors"
      >
        {project.coverImage && typeof project.coverImage === 'object' ? (
          <div className="bg-surface aspect-video overflow-hidden">
            <MediaImage
              media={project.coverImage}
              className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              sizes="(max-width: 640px) 100vw, 33vw"
            />
          </div>
        ) : (
          <div className="bg-surface text-muted/40 flex aspect-video items-center justify-center text-4xl font-bold">
            {project.title.charAt(0)}
          </div>
        )}
        <div className="p-5">
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="group-hover:text-accent text-lg font-bold tracking-tight transition-colors">
              {project.title}
            </h3>
            {year && <span className="text-muted shrink-0 text-sm tabular-nums">{year}</span>}
          </div>
          <p className="text-muted mt-1.5 line-clamp-2 text-sm">{project.summary}</p>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-accent border-accent/30 rounded-full border px-2.5 py-0.5 text-xs">
              {t(`categories.${project.category}`)}
            </span>
            {ongoing && (
              <span className="text-muted border-border flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs">
                <span className="bg-accent size-1.5 animate-pulse rounded-full" aria-hidden />
                {t('ongoing')}
              </span>
            )}
          </div>
        </div>
      </Link>
    </article>
  )
}
