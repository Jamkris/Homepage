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
  ],
}
