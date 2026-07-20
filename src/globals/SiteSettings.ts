import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'siteName',
      type: 'text',
      required: true,
      defaultValue: 'Jamkris',
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
      admin: {
        description: '사이트 기본 SEO 설명',
      },
    },
    {
      name: 'socials',
      type: 'array',
      fields: [
        {
          name: 'platform',
          type: 'select',
          required: true,
          options: [
            { label: 'GitHub', value: 'github' },
            { label: 'LinkedIn', value: 'linkedin' },
            { label: 'Email', value: 'email' },
            { label: 'X (Twitter)', value: 'x' },
            { label: 'Instagram', value: 'instagram' },
          ],
        },
        {
          name: 'url',
          type: 'text',
          required: true,
          admin: {
            description: 'Email은 mailto:주소 형식으로 입력',
          },
        },
      ],
    },
  ],
}
