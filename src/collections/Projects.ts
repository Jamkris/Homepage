import type { CollectionConfig } from 'payload'

import { publishedOrLoggedIn } from '@/access/publishedOrLoggedIn'
import { slugField } from '@/fields/slug'

export const Projects: CollectionConfig = {
  slug: 'projects',
  labels: {
    singular: 'Project',
    plural: 'Projects',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'featured', '_status'],
  },
  access: {
    read: publishedOrLoggedIn,
  },
  versions: {
    drafts: true,
  },
  defaultSort: '-startedAt',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    slugField(),
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: '개인 프로젝트', value: 'personal' },
        { label: '오픈소스', value: 'opensource' },
        { label: '회사 프로젝트', value: 'work' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: '홈 화면에 노출할 대표 프로젝트',
      },
    },
    {
      name: 'summary',
      type: 'textarea',
      required: true,
      localized: true,
      admin: {
        description: '카드에 표시되는 한 줄 요약',
      },
    },
    {
      name: 'description',
      type: 'richText',
      localized: true,
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'techStack',
      type: 'text',
      hasMany: true,
    },
    {
      name: 'links',
      type: 'array',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'url',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'startedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'endedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        description: '진행 중이면 비워두세요',
      },
    },
  ],
}
