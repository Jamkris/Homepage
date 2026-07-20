import type { GlobalConfig } from 'payload'

export const About: GlobalConfig = {
  slug: 'about',
  label: { ko: '소개', en: 'About' },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: { ko: '이름', en: 'Name' },
      required: true,
      localized: true,
      defaultValue: '이승현',
    },
    {
      name: 'headline',
      type: 'text',
      label: { ko: '한 줄 소개', en: 'Headline' },
      localized: true,
      admin: {
        description: '이름 아래 표시되는 한 줄 소개',
      },
    },
    {
      name: 'profileImage',
      type: 'upload',
      label: { ko: '프로필 이미지', en: 'Profile image' },
      relationTo: 'media',
    },
    {
      name: 'bio',
      type: 'richText',
      label: { ko: '자기소개', en: 'Bio' },
      localized: true,
    },
    {
      name: 'skills',
      type: 'text',
      label: { ko: '기술 스택', en: 'Skills' },
      hasMany: true,
    },
    {
      name: 'experiences',
      type: 'array',
      label: { ko: '경력', en: 'Experience' },
      localized: true,
      admin: {
        description: '경력 (최신순으로 정렬해서 입력)',
      },
      fields: [
        {
          name: 'company',
          type: 'text',
          label: { ko: '회사', en: 'Company' },
          required: true,
        },
        {
          name: 'role',
          type: 'text',
          label: { ko: '직함', en: 'Role' },
          required: true,
        },
        {
          name: 'startDate',
          type: 'date',
          label: { ko: '시작일', en: 'Start date' },
          required: true,
        },
        {
          name: 'endDate',
          type: 'date',
          label: { ko: '종료일', en: 'End date' },
          admin: {
            description: '재직 중이면 비워두세요',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          label: { ko: '설명', en: 'Description' },
        },
      ],
    },
    {
      name: 'certifications',
      type: 'array',
      label: { ko: '자격증', en: 'Certifications' },
      localized: true,
      fields: [
        {
          name: 'name',
          type: 'text',
          label: { ko: '이름', en: 'Name' },
          required: true,
        },
        {
          name: 'issuer',
          type: 'text',
          label: { ko: '발급 기관', en: 'Issuer' },
        },
        {
          name: 'issuedAt',
          type: 'date',
          label: { ko: '취득일', en: 'Issued at' },
        },
        {
          name: 'url',
          type: 'text',
          label: { ko: '링크', en: 'URL' },
          admin: {
            description: '증명서 링크 (선택)',
          },
        },
      ],
    },
  ],
}
