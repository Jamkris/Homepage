import { getTranslations } from 'next-intl/server'
import React from 'react'

import { MediaImage } from '@/components/MediaImage'
import { Reveal } from '@/components/fx/Reveal'
import { Link } from '@/i18n/navigation'
import type { Project } from '@/payload-types'

interface ProjectShowcaseProps {
  projects: Project[]
}

// Editorial alternating rows: browser-framed screenshot + detail panel
export async function ProjectShowcase({ projects }: ProjectShowcaseProps) {
  const t = await getTranslations('portfolio')

  return (
    <div className="space-y-20 sm:space-y-28">
      {projects.map((project, i) => {
        const year = project.startedAt ? new Date(project.startedAt).getFullYear() : null
        const ongoing = Boolean(project.startedAt && !project.endedAt)
        const flip = i % 2 === 1

        return (
          <Reveal key={project.id}>
            <article className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
              {/* Screenshot */}
              <Link
                href={`/portfolio/${project.slug}`}
                className={`group block ${flip ? 'lg:order-2' : ''}`}
              >
                <div className="border-border bg-surface overflow-hidden rounded-xl border">
                  <div className="border-border/70 flex items-center gap-1.5 border-b px-4 py-3">
                    <span className="bg-muted/40 size-2.5 rounded-full" aria-hidden />
                    <span className="bg-muted/40 size-2.5 rounded-full" aria-hidden />
                    <span className="bg-accent/60 size-2.5 rounded-full" aria-hidden />
                  </div>
                  {project.coverImage && typeof project.coverImage === 'object' ? (
                    <div className="aspect-video overflow-hidden">
                      <MediaImage
                        media={project.coverImage}
                        className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                    </div>
                  ) : (
                    <div className="text-muted/30 flex aspect-video items-center justify-center text-6xl font-bold">
                      {project.title.charAt(0)}
                    </div>
                  )}
                </div>
              </Link>

              {/* Detail */}
              <div className={flip ? 'lg:order-1' : ''}>
                <div className="font-mono text-muted flex flex-wrap items-center gap-x-4 gap-y-1 text-xs tracking-wider uppercase">
                  <span className="text-accent tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                  {year && <span className="tabular-nums">{year}</span>}
                  <span className="bg-border h-px w-6" aria-hidden />
                  <span>{t(`categories.${project.category}`)}</span>
                  {ongoing && (
                    <span className="text-accent flex items-center gap-1.5">
                      <span className="bg-accent size-1.5 animate-pulse rounded-full" aria-hidden />
                      {t('ongoing')}
                    </span>
                  )}
                </div>

                <h3 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                  {project.title}
                </h3>
                <p className="text-muted mt-4 max-w-lg leading-relaxed">{project.summary}</p>

                {project.techStack && project.techStack.length > 0 && (
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {project.techStack.map((tech) => (
                      <li
                        key={tech}
                        className="font-mono border-border text-muted rounded-md border px-2.5 py-1 text-xs"
                      >
                        {tech}
                      </li>
                    ))}
                  </ul>
                )}

                <div className="font-mono mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                  <Link
                    href={`/portfolio/${project.slug}`}
                    className="text-accent hover:underline"
                  >
                    {t('caseStudy')} ↗
                  </Link>
                  {(project.links ?? []).map((link) => (
                    <a
                      key={link.id ?? link.url}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            </article>
          </Reveal>
        )
      })}
    </div>
  )
}
