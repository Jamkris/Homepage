import React from 'react'

import { Link } from '@/i18n/navigation'
import { formatDate } from '@/lib/format'
import type { Post } from '@/payload-types'

interface PostCardProps {
  post: Post
  locale: string
}

export function PostCard({ post, locale }: PostCardProps) {
  return (
    <article>
      <Link href={`/blog/${post.slug}`} className="group block py-5">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="group-hover:text-accent text-lg font-semibold tracking-tight transition-colors">
            {post.title}
          </h2>
          <time
            dateTime={post.publishedAt ?? undefined}
            className="text-muted shrink-0 text-sm tabular-nums"
          >
            {formatDate(locale, post.publishedAt)}
          </time>
        </div>
        {post.excerpt && <p className="text-muted mt-1.5 line-clamp-2 text-sm">{post.excerpt}</p>}
        {post.tags && post.tags.length > 0 && (
          <ul className="mt-2.5 flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <li key={tag} className="bg-surface text-muted rounded px-2 py-0.5 text-xs">
                {tag}
              </li>
            ))}
          </ul>
        )}
      </Link>
    </article>
  )
}
