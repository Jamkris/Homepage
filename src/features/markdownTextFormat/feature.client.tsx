'use client'

import { TEXT_FORMAT_TRANSFORMERS } from '@lexical/markdown'
import { createClientFeature } from '@payloadcms/richtext-lexical/client'

// Registers the inline markdown shortcuts Payload leaves off by default:
// **bold**, *italic*, ~~strikethrough~~, `code`
export const MarkdownTextFormatClientFeature = createClientFeature({
  markdownTransformers: TEXT_FORMAT_TRANSFORMERS,
})
