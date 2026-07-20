import type { GlobalConfig } from 'payload'

export const About: GlobalConfig = {
  slug: 'about',
  label: 'About',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      localized: true,
      defaultValue: '이승현',
    },
    {
      name: 'headline',
      type: 'text',
      localized: true,
      admin: {
        description: '이름 아래 표시되는 한 줄 소개',
      },
    },
    {
      name: 'profileImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'bio',
      type: 'richText',
      localized: true,
    },
    {
      name: 'skills',
      type: 'text',
      hasMany: true,
    },
    {
      name: 'experiences',
      type: 'array',
      localized: true,
      admin: {
        description: '경력 (최신순으로 정렬해서 입력)',
      },
      fields: [
        {
          name: 'company',
          type: 'text',
          required: true,
        },
        {
          name: 'role',
          type: 'text',
          required: true,
        },
        {
          name: 'startDate',
          type: 'date',
          required: true,
        },
        {
          name: 'endDate',
          type: 'date',
          admin: {
            description: '재직 중이면 비워두세요',
          },
        },
        {
          name: 'description',
          type: 'textarea',
        },
      ],
    },
    {
      name: 'certifications',
      type: 'array',
      localized: true,
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'issuer',
          type: 'text',
        },
        {
          name: 'issuedAt',
          type: 'date',
        },
        {
          name: 'url',
          type: 'text',
          admin: {
            description: '증명서 링크 (선택)',
          },
        },
      ],
    },
  ],
}
