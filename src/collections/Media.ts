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
      required: true,
    },
  ],
  upload: {
    // Overridable in Docker via MEDIA_DIR (volume-mounted path)
    staticDir: process.env.MEDIA_DIR || path.resolve(dirname, '../../media'),
    imageSizes: [
      {
        name: 'thumbnail',
        width: 480,
        height: 320,
        position: 'centre',
      },
      {
        name: 'card',
        width: 1024,
        height: undefined,
      },
    ],
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*'],
  },
}
