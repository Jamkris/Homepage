import React from 'react'

import { Link } from '@/i18n/navigation'
import { formatDate } from '@/lib/format'
import type { Post } from '@/payload-types'

interface PostCardProps {
  post: Post
  locale: string
  index?: number
}

export function PostCard({ post, locale, index }: PostCardProps) {
  return (
    <article className="border-border border-t">
      <Link
        href={`/blog/${post.slug}`}
        className="group flex items-baseline gap-4 py-6 sm:gap-8 sm:py-8"
      >
        {index !== undefined && (
          <span className="text-muted text-sm tabular-nums">
            {String(index + 1).padStart(2, '0')}
          </span>
        )}
        <div className="min-w-0 flex-1">
          <h2 className="group-hover:text-accent text-xl font-semibold tracking-tight transition-[color,transform] duration-300 group-hover:translate-x-2 sm:text-3xl">
            {post.title}
          </h2>
          {post.excerpt && (
            <p className="text-muted mt-2 line-clamp-2 max-w-2xl text-sm sm:text-base">
              {post.excerpt}
            </p>
          )}
          {post.tags && post.tags.length > 0 && (
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {post.tags.map((tag) => (
                <li
                  key={tag}
                  className="border-border text-muted rounded-full border px-2.5 py-0.5 text-xs"
                >
                  {tag}
                </li>
              ))}
            </ul>
          )}
        </div>
        <time
          dateTime={post.publishedAt ?? undefined}
          className="text-muted shrink-0 text-xs tabular-nums sm:text-sm"
        >
          {formatDate(locale, post.publishedAt)}
        </time>
        <span
          className="text-muted group-hover:text-accent hidden transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 sm:inline"
          aria-hidden
        >
          ↗
        </span>
      </Link>
    </article>
  )
}
