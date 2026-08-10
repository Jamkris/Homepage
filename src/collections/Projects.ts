import type { CollectionConfig } from 'payload'

import { publishedOrLoggedIn } from '@/access/publishedOrLoggedIn'
import { slugField } from '@/fields/slug'

export const Projects: CollectionConfig = {
  slug: 'projects',
  labels: {
    singular: { ko: '프로젝트', en: 'Project' },
    plural: { ko: '프로젝트', en: 'Projects' },
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
      label: { ko: '제목', en: 'Title' },
      required: true,
      localized: true,
    },
    slugField(),
    {
      name: 'category',
      type: 'select',
      label: { ko: '구분', en: 'Category' },
      required: true,
      options: [
        { label: { ko: '개인 프로젝트', en: 'Personal' }, value: 'personal' },
        { label: { ko: '오픈소스', en: 'Open source' }, value: 'opensource' },
        { label: { ko: '회사 프로젝트', en: 'Work' }, value: 'work' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: { ko: '대표 프로젝트', en: 'Featured' },
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: '홈 화면에 노출할 대표 프로젝트',
      },
    },
    {
      name: 'summary',
      type: 'textarea',
      label: { ko: '요약', en: 'Summary' },
      required: true,
      localized: true,
      admin: {
        description: '카드에 표시되는 한 줄 요약',
      },
    },
    {
      name: 'coverImage',
      type: 'upload',
      label: { ko: '커버 이미지', en: 'Cover image' },
      relationTo: 'media',
    },
    {
      name: 'techStack',
      type: 'text',
      label: { ko: '기술 스택', en: 'Tech stack' },
      hasMany: true,
    },
    {
      name: 'links',
      type: 'array',
      label: { ko: '링크', en: 'Links' },
      fields: [
        {
          name: 'label',
          type: 'text',
          label: { ko: '이름', en: 'Label' },
          required: true,
        },
        {
          name: 'url',
          type: 'text',
          label: { ko: '주소', en: 'URL' },
          required: true,
        },
      ],
    },
    {
      name: 'description',
      type: 'richText',
      label: { ko: '상세 설명', en: 'Description' },
      localized: true,
    },
    {
      name: 'startedAt',
      type: 'date',
      label: { ko: '시작일', en: 'Started at' },
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'endedAt',
      type: 'date',
      label: { ko: '종료일', en: 'Ended at' },
      admin: {
        position: 'sidebar',
        description: '진행 중이면 비워두세요',
      },
    },
  ],
}
