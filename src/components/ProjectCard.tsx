import React from 'react'

import { MediaImage } from '@/components/MediaImage'
import { Link } from '@/i18n/navigation'
import type { Project } from '@/payload-types'

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article>
      <Link
        href={`/portfolio/${project.slug}`}
        className="group border-border hover:border-accent/50 block h-full overflow-hidden rounded-lg border transition-colors"
      >
        {project.coverImage && typeof project.coverImage === 'object' && (
          <div className="bg-surface aspect-[16/9] overflow-hidden">
            <MediaImage
              media={project.coverImage}
              className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              sizes="(max-width: 640px) 100vw, 50vw"
            />
          </div>
        )}
        <div className="p-4">
          <h3 className="font-display group-hover:text-accent text-lg font-semibold tracking-tight transition-colors">
            {project.title}
            <span className="ml-1.5 inline-block transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden>
              ↗
            </span>
          </h3>
          <p className="text-muted mt-1 line-clamp-2 text-sm">{project.summary}</p>
          {project.techStack && project.techStack.length > 0 && (
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {project.techStack.map((tech) => (
                <li key={tech} className="bg-surface text-muted rounded px-2 py-0.5 text-xs">
                  {tech}
                </li>
              ))}
            </ul>
          )}
        </div>
      </Link>
    </article>
  )
}
