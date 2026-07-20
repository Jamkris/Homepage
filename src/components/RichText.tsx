import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { RichText as LexicalRichText } from '@payloadcms/richtext-lexical/react'
import React from 'react'

interface RichTextProps {
  data: SerializedEditorState | null | undefined
  className?: string
}

export function RichText({ data, className }: RichTextProps) {
  if (!data) {
    return null
  }

  return (
    <LexicalRichText
      data={data}
      className={`prose dark:prose-invert prose-headings:tracking-tight max-w-none ${className ?? ''}`}
    />
  )
}
