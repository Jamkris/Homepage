import { createServerFeature } from '@payloadcms/richtext-lexical'

export const MarkdownTextFormatFeature = createServerFeature({
  key: 'markdownTextFormat',
  feature: {
    ClientFeature:
      '@/features/markdownTextFormat/feature.client#MarkdownTextFormatClientFeature',
  },
})
