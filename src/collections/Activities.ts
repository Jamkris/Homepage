import type { CollectionConfig } from 'payload'

import { publishedOrLoggedIn } from '@/access/publishedOrLoggedIn'
import { slugField } from '@/fields/slug'

export const Activities: CollectionConfig = {
  slug: 'activities',
  labels: {
    singular: { ko: '수상 및 활동', en: 'Award / Activity' },
    plural: { ko: '수상 및 활동', en: 'Awards & Activities' },
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'type', 'startDate', '_status'],
  },
  access: {
    read: publishedOrLoggedIn,
  },
  versions: {
    drafts: true,
  },
  defaultSort: '-startDate',
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
      name: 'startDate',
      type: 'date',
      label: { ko: '시작일', en: 'Start date' },
      admin: { position: 'sidebar' },
    },
    {
      name: 'ongoing',
      type: 'checkbox',
      label: { ko: '진행 중', en: 'Ongoing' },
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: '체크하면 종료일 대신 "진행 중"으로 표시돼요',
      },
    },
    {
      name: 'endDate',
      type: 'date',
      label: { ko: '종료일', en: 'End date' },
      admin: {
        position: 'sidebar',
        description: '진행 중이면 비워두세요',
        condition: (_, siblingData) => !siblingData?.ongoing,
      },
    },
    {
      name: 'tags',
      type: 'text',
      label: { ko: '해시태그', en: 'Tags' },
      hasMany: true,
      admin: {
        description: '내가 맡았던 부분 등 (예: APP, WEB, INFRA)',
      },
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
