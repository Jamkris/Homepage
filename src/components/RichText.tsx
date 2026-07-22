import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import {
  RichText as LexicalRichText,
  type JSXConvertersFunction,
} from '@payloadcms/richtext-lexical/react'
import React from 'react'

import type { Media } from '@/payload-types'

interface RichTextProps {
  data: SerializedEditorState | null | undefined
  className?: string
}

const SIZE_CLASS: Record<string, string> = {
  small: 'max-w-xs',
  medium: 'max-w-md',
  full: 'max-w-full',
}

const CALLOUT_VARIANT: Record<string, { box: string; icon: string }> = {
  info: { box: 'border-accent/40 bg-accent/5', icon: 'ℹ' },
  warning: { box: 'border-amber-500/40 bg-amber-500/5', icon: '⚠' },
  success: { box: 'border-emerald-500/40 bg-emerald-500/5', icon: '✓' },
  note: { box: 'border-border bg-surface', icon: '✎' },
}

// Turn a YouTube/Vimeo watch link into an embeddable URL
const toEmbedUrl = (url: string): string | null => {
  try {
    const u = new URL(url)
    const host = u.hostname.replace(/^www\./, '')
    if (host === 'youtu.be') {
      return `https://www.youtube.com/embed/${u.pathname.slice(1)}`
    }
    if (host.endsWith('youtube.com')) {
      const v = u.searchParams.get('v')
      if (v) {
        return `https://www.youtube.com/embed/${v}`
      }
      if (u.pathname.startsWith('/embed/')) {
        return url
      }
    }
    if (host.endsWith('vimeo.com')) {
      const id = u.pathname.split('/').filter(Boolean)[0]
      if (id) {
        return `https://player.vimeo.com/video/${id}`
      }
    }
    return null
  } catch {
    return null
  }
}

const converters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
  upload: ({ node }) => {
    const value = node.value
    if (!value || typeof value !== 'object') {
      return null
    }

    const media = value as Media
    if (!media.url) {
      return null
    }

    const isImage = (media.mimeType ?? '').startsWith('image/')
    if (!isImage) {
      return (
        <a
          href={media.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent underline underline-offset-4"
        >
          {media.filename ?? 'file'}
        </a>
      )
    }

    const size = (node.fields as { size?: string } | undefined)?.size ?? 'full'
    const sizeClass = SIZE_CLASS[size] ?? SIZE_CLASS.full

    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={media.url}
        alt={media.alt ?? ''}
        width={media.width ?? undefined}
        height={media.height ?? undefined}
        className={`mx-auto h-auto w-full rounded-lg ${sizeClass}`}
      />
    )
  },
  blocks: {
    callout: ({ node }: { node: { fields: { variant?: string; content?: SerializedEditorState } } }) => {
      const fields = node.fields
      const variant = CALLOUT_VARIANT[fields.variant ?? 'info'] ?? CALLOUT_VARIANT.info
      return (
        <div className={`not-prose my-6 flex gap-3 rounded-lg border p-4 ${variant.box}`}>
          <span aria-hidden className="text-lg leading-none">
            {variant.icon}
          </span>
          <div className="prose dark:prose-invert prose-sm min-w-0 max-w-none">
            <RichText data={fields.content} />
          </div>
        </div>
      )
    },
    video: ({ node }: { node: { fields: { url?: string; caption?: string } } }) => {
      const fields = node.fields
      const embed = fields.url ? toEmbedUrl(fields.url) : null
      if (!embed) {
        return null
      }
      return (
        <figure className="not-prose my-6">
          <div className="aspect-video w-full overflow-hidden rounded-lg">
            <iframe
              src={embed}
              title={fields.caption ?? 'video'}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="size-full border-0"
            />
          </div>
          {fields.caption && (
            <figcaption className="text-muted mt-2 text-center text-sm">{fields.caption}</figcaption>
          )}
        </figure>
      )
    },
    Code: ({ node }: { node: { fields: { code?: string; language?: string } } }) => {
      const { code, language } = node.fields
      if (!code) {
        return null
      }
      return (
        <div className="not-prose my-6">
          {language && (
            <div className="border-border text-muted bg-surface rounded-t-lg border border-b-0 px-4 py-1.5 font-mono text-xs">
              {language}
            </div>
          )}
          <pre
            className={`border-border bg-surface overflow-x-auto border p-4 text-sm ${
              language ? 'rounded-b-lg' : 'rounded-lg'
            }`}
          >
            <code className="font-mono">{code}</code>
          </pre>
        </div>
      )
    },
    fileDownload: ({
      node,
    }: {
      node: { fields: { file?: Media | number | null; label?: string } }
    }) => {
      const fields = node.fields
      const file = fields.file
      if (!file || typeof file !== 'object' || !file.url) {
        return null
      }
      return (
        <a
          href={file.url}
          target="_blank"
          rel="noopener noreferrer"
          download
          className="not-prose border-border hover:border-accent my-4 inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm transition-colors"
        >
          <span aria-hidden>↓</span>
          <span>{fields.label || file.filename || 'download'}</span>
        </a>
      )
    },
  },
})

export function RichText({ data, className }: RichTextProps) {
  if (!data) {
    return null
  }

  return (
    <LexicalRichText
      data={data}
      converters={converters}
      className={`prose dark:prose-invert prose-headings:tracking-tight prose-img:rounded-lg max-w-none ${className ?? ''}`}
    />
  )
}
