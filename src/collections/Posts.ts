import type { CollectionConfig } from 'payload'

import { publishedOrLoggedIn } from '@/access/publishedOrLoggedIn'
import { slugField } from '@/fields/slug'

export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: {
    singular: { ko: '블로그 글', en: 'Post' },
    plural: { ko: '블로그 글', en: 'Posts' },
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'publishedAt', '_status'],
  },
  access: {
    read: publishedOrLoggedIn,
  },
  versions: {
    drafts: true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: { ko: '제목', en: 'Title' },
      required: true,
      localized: true,
    },
    slugField(),
    {
      name: 'excerpt',
      type: 'textarea',
      label: { ko: '요약', en: 'Excerpt' },
      localized: true,
      admin: {
        description: '목록과 SEO 설명에 사용되는 짧은 요약',
      },
    },
    {
      name: 'coverImage',
      type: 'upload',
      label: { ko: '커버 이미지', en: 'Cover image' },
      relationTo: 'media',
    },
    {
      name: 'content',
      type: 'richText',
      label: { ko: '본문', en: 'Content' },
      required: true,
      localized: true,
    },
    {
      name: 'tags',
      type: 'text',
      label: { ko: '태그', en: 'Tags' },
      hasMany: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      label: { ko: '발행일', en: 'Published at' },
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            // Stamp publish date on first publish if not set manually
            if (!value && siblingData._status === 'published') {
              return new Date()
            }
            return value
          },
        ],
      },
    },
  ],
}
