import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: { ko: '사이트 설정', en: 'Site Settings' },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'siteName',
      type: 'text',
      label: { ko: '사이트 이름', en: 'Site name' },
      required: true,
      defaultValue: 'Jamkris',
    },
    {
      name: 'description',
      type: 'textarea',
      label: { ko: '사이트 설명', en: 'Site description' },
      localized: true,
      admin: {
        description: '사이트 기본 SEO 설명',
      },
    },
    {
      name: 'socials',
      type: 'array',
      label: { ko: '소셜 링크', en: 'Social links' },
      fields: [
        {
          name: 'platform',
          type: 'select',
          label: { ko: '플랫폼', en: 'Platform' },
          required: true,
          options: [
            { label: 'GitHub', value: 'github' },
            { label: 'LinkedIn', value: 'linkedin' },
            { label: { ko: '이메일', en: 'Email' }, value: 'email' },
            { label: 'X (Twitter)', value: 'x' },
            { label: { ko: '인스타그램', en: 'Instagram' }, value: 'instagram' },
          ],
        },
        {
          name: 'url',
          type: 'text',
          label: { ko: '주소', en: 'URL' },
          required: true,
          admin: {
            description: 'Email은 mailto:주소 형식으로 입력',
          },
        },
      ],
    },
    {
      name: 'seo',
      type: 'group',
      label: { ko: 'SEO / 검색 최적화', en: 'SEO' },
      fields: [
        {
          name: 'keywords',
          type: 'text',
          hasMany: true,
          label: { ko: '검색 키워드', en: 'Keywords' },
          admin: {
            description:
              '검색에 걸리게 할 단어들 (예: 이승현, 부산소마고 이승현, 소마고 이승현, 미스고 이승현, Jamkris)',
          },
        },
        {
          name: 'naverVerification',
          type: 'text',
          label: { ko: '네이버 사이트 인증코드', en: 'Naver verification' },
          admin: {
            description: '네이버 서치어드바이저 사이트 소유확인 메타태그의 content 값',
          },
        },
        {
          name: 'googleVerification',
          type: 'text',
          label: { ko: '구글 사이트 인증코드', en: 'Google verification' },
          admin: {
            description: '구글 서치 콘솔 HTML 태그 소유확인의 content 값',
          },
        },
        {
          name: 'personName',
          type: 'text',
          label: { ko: '이름 (인물 데이터)', en: 'Person name' },
          admin: { description: '검색용 인물 구조화 데이터 — 예: 이승현' },
        },
        {
          name: 'alternateNames',
          type: 'text',
          hasMany: true,
          label: { ko: '다른 이름', en: 'Alternate names' },
          admin: { description: '예: Seunghyun Lee, Jamkris' },
        },
        {
          name: 'jobTitle',
          type: 'text',
          label: { ko: '직함', en: 'Job title' },
          admin: { description: '예: 개발자, 소프트웨어 엔지니어' },
        },
        {
          name: 'affiliation',
          type: 'text',
          label: { ko: '소속 / 학교', en: 'Affiliation / School' },
          admin: { description: '예: 부산소프트웨어마이스터고등학교' },
        },
      ],
    },
  ],
}
