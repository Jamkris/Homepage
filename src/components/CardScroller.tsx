import React from 'react'

import { Link } from '@/i18n/navigation'

export interface ScrollCardItem {
  key: string
  href: string
  title: string
  dateLabel: string
  typeLabel?: string
  summary?: string | null
  tags?: string[]
  ongoing?: boolean
}

interface CardScrollerProps {
  items: ScrollCardItem[]
  readMoreLabel: string
  scrollHint: string
}

// Horizontal scrolling row of link cards with a swipe hint underneath
export function CardScroller({ items, readMoreLabel, scrollHint }: CardScrollerProps) {
  return (
    <>
      <div className="mt-8 flex snap-x gap-4 overflow-x-auto pb-4">
        {items.map((item) => (
          <Link
            key={item.key}
            href={item.href}
            className="group w-[280px] shrink-0 snap-start sm:w-[320px]"
          >
            <div className="border-border bg-surface/40 group-hover:border-accent/50 flex h-full flex-col rounded-xl border p-5 transition-colors">
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-mono text-muted flex items-center gap-1.5 text-xs tabular-nums">
                  {item.dateLabel}
                  {item.ongoing && (
                    <span className="bg-accent size-1.5 animate-pulse rounded-full" aria-hidden />
                  )}
                </span>
                {item.typeLabel && (
                  <span className="text-accent border-accent/30 shrink-0 rounded-full border px-2.5 py-0.5 text-xs">
                    {item.typeLabel}
                  </span>
                )}
              </div>
              <h4 className="group-hover:text-accent mt-3 text-lg font-bold tracking-tight transition-colors">
                {item.title}
              </h4>
              {item.summary && (
                <p className="text-muted mt-2 line-clamp-3 flex-1 text-sm leading-relaxed">
                  {item.summary}
                </p>
              )}
              {item.tags && item.tags.length > 0 && (
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {item.tags.map((tag) => (
                    <li
                      key={tag}
                      className="font-mono text-accent bg-accent/10 rounded px-2 py-0.5 text-xs"
                    >
                      #{tag}
                    </li>
                  ))}
                </ul>
              )}
              <span className="text-accent mt-4 inline-block text-sm">→ {readMoreLabel}</span>
            </div>
          </Link>
        ))}
      </div>
      <p className="font-mono text-muted mt-2 text-center text-xs tracking-wider">
        ← {scrollHint} →
      </p>
    </>
  )
}
