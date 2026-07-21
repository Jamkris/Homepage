import React from 'react'

import { Link } from '@/i18n/navigation'

export interface PortfolioCardItem {
  key: string
  href: string
  title: string
  summary?: string | null
  typeLabel: string
  dateLabel: string
  ongoing: boolean
  imageUrl?: string | null
}

interface PortfolioCardProps {
  item: PortfolioCardItem
  ongoingLabel: string
}

export function PortfolioCard({ item, ongoingLabel }: PortfolioCardProps) {
  return (
    <article className="h-full">
      <Link
        href={item.href}
        className="group border-border hover:border-accent/50 bg-surface/40 block h-full overflow-hidden rounded-xl border transition-colors"
      >
        {item.imageUrl ? (
          <div className="bg-surface aspect-video overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.imageUrl}
              alt={item.title}
              className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            />
          </div>
        ) : (
          <div className="bg-surface text-muted/40 flex aspect-video items-center justify-center text-4xl font-bold">
            {item.title.charAt(0)}
          </div>
        )}
        <div className="p-5">
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="group-hover:text-accent text-lg font-bold tracking-tight transition-colors">
              {item.title}
            </h3>
            {item.dateLabel && (
              <span className="text-muted shrink-0 text-sm tabular-nums">{item.dateLabel}</span>
            )}
          </div>
          {item.summary && <p className="text-muted mt-1.5 line-clamp-2 text-sm">{item.summary}</p>}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-accent border-accent/30 rounded-full border px-2.5 py-0.5 text-xs">
              {item.typeLabel}
            </span>
            {item.ongoing && (
              <span className="text-muted border-border flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs">
                <span className="bg-accent size-1.5 animate-pulse rounded-full" aria-hidden />
                {ongoingLabel}
              </span>
            )}
          </div>
        </div>
      </Link>
    </article>
  )
}
