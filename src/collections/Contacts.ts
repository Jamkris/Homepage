import type { CollectionConfig } from 'payload'

// Inbox for contact-form submissions. Public REST create is disabled — entries
// are created only via the server action (Local API bypasses access control).
export const Contacts: CollectionConfig = {
  slug: 'contacts',
  labels: {
    singular: { ko: '문의', en: 'Contact' },
    plural: { ko: '받은 문의함', en: 'Contacts' },
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'createdAt', 'archived'],
  },
  access: {
    create: () => false,
    read: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: { ko: '이름', en: 'Name' },
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      label: { ko: '이메일', en: 'Email' },
      required: true,
    },
    {
      name: 'message',
      type: 'textarea',
      label: { ko: '메시지', en: 'Message' },
      required: true,
    },
    {
      name: 'archived',
      type: 'checkbox',
      label: { ko: '처리됨', en: 'Archived' },
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
  ],
}
