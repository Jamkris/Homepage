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

// Render inline uploads at their natural aspect ratio (no cropping) instead of
// the default converter, which can clip tall images.
const SIZE_CLASS: Record<string, string> = {
  small: 'max-w-xs',
  medium: 'max-w-md',
  full: 'max-w-full',
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
