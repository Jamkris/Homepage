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
      name: 'location',
      type: 'text',
      label: { ko: '거주지', en: 'Based in' },
      localized: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'studying',
      type: 'text',
      label: { ko: '학력/전공', en: 'Studying' },
      localized: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'focus',
      type: 'text',
      label: { ko: '관심 분야', en: 'Focus' },
      localized: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'email',
      type: 'email',
      label: { ko: '이메일', en: 'Email' },
      admin: { position: 'sidebar' },
    },
    {
      name: 'phone',
      type: 'text',
      label: { ko: '전화번호', en: 'Phone' },
      admin: { position: 'sidebar', description: '표시할 전화번호 (선택)' },
    },
    {
      name: 'bio',
      type: 'richText',
      label: { ko: '자기소개', en: 'Bio' },
      localized: true,
    },
    {
      name: 'skillGroups',
      type: 'array',
      label: { ko: '기술 스택 (그룹)', en: 'Skill groups' },
      localized: true,
      admin: {
        description: '카테고리별로 묶은 기술 스택 (예: 언어 / 프론트엔드 / 백엔드 / 인프라)',
      },
      fields: [
        {
          name: 'category',
          type: 'text',
          label: { ko: '카테고리', en: 'Category' },
          required: true,
        },
        {
          name: 'items',
          type: 'text',
          label: { ko: '항목', en: 'Items' },
          hasMany: true,
          required: true,
        },
      ],
    },
    {
      name: 'skills',
      type: 'text',
      label: { ko: '기술 스택 (단일 목록)', en: 'Skills (flat)' },
      hasMany: true,
      admin: {
        description: '그룹을 안 쓸 때 사용하는 단순 목록',
      },
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
          name: 'attachment',
          type: 'upload',
          label: { ko: '증명서 파일', en: 'Certificate file' },
          relationTo: 'media',
          admin: {
            description: '이미지 또는 PDF 업로드 — 사이트에서 뷰어로 바로 열립니다',
          },
        },
        {
          name: 'url',
          type: 'text',
          label: { ko: '외부 링크', en: 'External URL' },
          admin: {
            description: '파일 대신 외부 링크를 쓸 때 (선택)',
          },
        },
      ],
    },
  ],
}
