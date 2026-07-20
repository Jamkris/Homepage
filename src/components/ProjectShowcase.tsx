'use client'

import { AnimatePresence, motion, useMotionValue, useSpring } from 'motion/react'
import Image from 'next/image'
import React, { useState } from 'react'

import { Reveal } from '@/components/fx/Reveal'
import { Link } from '@/i18n/navigation'

export interface ShowcaseProject {
  id: number
  slug: string
  title: string
  categoryLabel: string
  imageUrl?: string
  imageAlt?: string
}

interface ProjectShowcaseProps {
  projects: ShowcaseProject[]
}

// Editorial row list with a floating image preview that trails the cursor
export function ProjectShowcase({ projects }: ProjectShowcaseProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const x = useSpring(mx, { stiffness: 160, damping: 22, mass: 0.6 })
  const y = useSpring(my, { stiffness: 160, damping: 22, mass: 0.6 })

  const active = activeIndex !== null ? projects[activeIndex] : null

  return (
    <div
      onMouseMove={(e) => {
        mx.set(e.clientX)
        my.set(e.clientY)
      }}
      onMouseLeave={() => setActiveIndex(null)}
    >
      {projects.map((project, i) => (
        <Reveal key={project.id} delay={i * 0.05}>
          <Link
            href={`/portfolio/${project.slug}`}
            onMouseEnter={() => setActiveIndex(i)}
            className="group border-border flex items-baseline gap-4 border-t py-6 transition-colors sm:gap-8 sm:py-9"
          >
            <span className="text-muted font-display text-sm tabular-nums">
              {String(i + 1).padStart(2, '0')}
            </span>
            <h3 className="font-display group-hover:text-accent flex-1 text-2xl font-semibold tracking-tight transition-[color,transform] duration-300 group-hover:translate-x-2 sm:text-4xl">
              {project.title}
            </h3>
            <span className="border-border text-muted hidden rounded-full border px-3 py-1 text-xs tracking-wide uppercase sm:inline">
              {project.categoryLabel}
            </span>
            <span
              className="text-muted group-hover:text-accent inline-block transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
              aria-hidden
            >
              ↗
            </span>
          </Link>
        </Reveal>
      ))}
      <div className="border-border border-t" />

      <AnimatePresence>
        {active?.imageUrl && (
          <motion.div
            key={active.id}
            initial={{ opacity: 0, scale: 0.85, rotate: -4 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.85, rotate: 4 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            style={{ x, y }}
            className="pointer-events-none fixed top-0 left-0 z-40 hidden [@media(pointer:fine)]:block"
          >
            <div className="border-border bg-surface -translate-x-1/2 -translate-y-[110%] overflow-hidden rounded-lg border shadow-2xl">
              <Image
                src={active.imageUrl}
                alt={active.imageAlt ?? active.title}
                width={360}
                height={225}
                className="aspect-[16/10] w-[300px] object-cover sm:w-[360px]"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
