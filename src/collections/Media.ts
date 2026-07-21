import path from 'path'
import type { CollectionConfig } from 'payload'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: { ko: '미디어', en: 'Media' },
    plural: { ko: '미디어', en: 'Media' },
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: { ko: '대체 텍스트', en: 'Alt text' },
      // optional + '' default so pasted images upload instantly; the existing
      // NOT NULL column is satisfied by '' without a schema migration
      defaultValue: '',
      admin: {
        description: '접근성/SEO용 설명 (선택 — 나중에 채워도 됩니다)',
      },
    },
  ],
  upload: {
    // Overridable in Docker via MEDIA_DIR (volume-mounted path)
    staticDir: process.env.MEDIA_DIR || path.resolve(dirname, '../../media'),
    imageSizes: [
      {
        // width-only (no height) preserves aspect ratio — avoids cropped
        // previews in the admin editor and media list
        name: 'thumbnail',
        width: 640,
      },
      {
        name: 'card',
        width: 1024,
      },
    ],
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*', 'application/pdf'],
  },
}
