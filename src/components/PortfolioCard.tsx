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
        className="group border-border hover:border-accent/50 bg-surface/40 block h-full rounded-xl border p-5 transition-colors"
      >
        <div className="flex items-baseline justify-between gap-3">
          {item.dateLabel && (
            <span className="font-mono text-muted text-xs tabular-nums">{item.dateLabel}</span>
          )}
          <span className="text-accent border-accent/30 shrink-0 rounded-full border px-2.5 py-0.5 text-xs">
            {item.typeLabel}
          </span>
        </div>
        <h3 className="group-hover:text-accent mt-3 text-lg font-bold tracking-tight transition-colors">
          {item.title}
        </h3>
        {item.summary && <p className="text-muted mt-2 line-clamp-3 text-sm">{item.summary}</p>}
        {item.ongoing && (
          <span className="text-muted border-border mt-4 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs">
            <span className="bg-accent size-1.5 animate-pulse rounded-full" aria-hidden />
            {ongoingLabel}
          </span>
        )}
      </Link>
    </article>
  )
}
