import type { Field } from 'payload'

const formatSlug = (value: string): string =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^\w가-힣\s-]/g, '')
    .replace(/\s+/g, '-')

export const slugField = (): Field => ({
  name: 'slug',
  type: 'text',
  required: true,
  unique: true,
  index: true,
  admin: {
    position: 'sidebar',
    description: 'URL에 사용되는 고유 식별자 (예: my-first-post)',
  },
  hooks: {
    beforeValidate: [
      ({ value }) => (typeof value === 'string' ? formatSlug(value) : value),
    ],
  },
})
