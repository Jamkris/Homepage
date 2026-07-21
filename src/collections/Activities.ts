import type { CollectionConfig } from 'payload'

import { publishedOrLoggedIn } from '@/access/publishedOrLoggedIn'

export const Activities: CollectionConfig = {
  slug: 'activities',
  labels: {
    singular: { ko: '수상 및 활동', en: 'Award / Activity' },
    plural: { ko: '수상 및 활동', en: 'Awards & Activities' },
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'type', 'date', '_status'],
  },
  access: {
    read: publishedOrLoggedIn,
  },
  versions: {
    drafts: true,
  },
  defaultSort: '-date',
  fields: [
    {
      name: 'title',
      type: 'text',
      label: { ko: '제목', en: 'Title' },
      required: true,
      localized: true,
    },
    {
      name: 'type',
      type: 'select',
      label: { ko: '구분', en: 'Type' },
      required: true,
      defaultValue: 'award',
      options: [
        { label: { ko: '수상', en: 'Award' }, value: 'award' },
        { label: { ko: '활동', en: 'Activity' }, value: 'activity' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'date',
      type: 'date',
      label: { ko: '날짜', en: 'Date' },
      admin: { position: 'sidebar' },
    },
    {
      name: 'organization',
      type: 'text',
      label: { ko: '주최/수여 기관', en: 'Organization' },
      localized: true,
    },
    {
      name: 'attachment',
      type: 'upload',
      label: { ko: '상장/증명서 파일', en: 'Certificate file' },
      relationTo: 'media',
      admin: {
        description: '이미지 또는 PDF 업로드 — 사이트에서 뷰어로 바로 열립니다 (수상 시)',
      },
    },
    {
      name: 'content',
      type: 'richText',
      label: { ko: '내용', en: 'Content' },
      localized: true,
      admin: {
        description: '블로그처럼 자유롭게 작성할 수 있어요 (선택)',
      },
    },
  ],
}
