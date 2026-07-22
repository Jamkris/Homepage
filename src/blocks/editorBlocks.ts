import { CodeBlock, lexicalEditor } from '@payloadcms/richtext-lexical'
import type { Block } from 'payload'

// Callout — colored note box with a nested rich-text body
export const CalloutBlock: Block = {
  slug: 'callout',
  interfaceName: 'CalloutBlock',
  labels: {
    singular: { ko: '콜아웃', en: 'Callout' },
    plural: { ko: '콜아웃', en: 'Callouts' },
  },
  fields: [
    {
      name: 'variant',
      type: 'select',
      label: { ko: '종류', en: 'Variant' },
      defaultValue: 'info',
      options: [
        { label: { ko: '정보', en: 'Info' }, value: 'info' },
        { label: { ko: '주의', en: 'Warning' }, value: 'warning' },
        { label: { ko: '성공', en: 'Success' }, value: 'success' },
        { label: { ko: '메모', en: 'Note' }, value: 'note' },
      ],
    },
    {
      name: 'content',
      type: 'richText',
      label: { ko: '내용', en: 'Content' },
      // default editor (no custom blocks) to avoid nesting callouts in callouts
      editor: lexicalEditor(),
    },
  ],
}

// Video — YouTube/Vimeo embed from a plain link
export const VideoBlock: Block = {
  slug: 'video',
  interfaceName: 'VideoBlock',
  labels: {
    singular: { ko: '동영상', en: 'Video' },
    plural: { ko: '동영상', en: 'Videos' },
  },
  fields: [
    {
      name: 'url',
      type: 'text',
      required: true,
      label: { ko: '링크', en: 'URL' },
      admin: { description: 'YouTube 또는 Vimeo 링크를 붙여넣으세요' },
    },
    {
      name: 'caption',
      type: 'text',
      label: { ko: '설명', en: 'Caption' },
    },
  ],
}

// File — a downloadable attachment
export const FileBlock: Block = {
  slug: 'fileDownload',
  interfaceName: 'FileDownloadBlock',
  labels: {
    singular: { ko: '파일', en: 'File' },
    plural: { ko: '파일', en: 'Files' },
  },
  fields: [
    {
      name: 'file',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: { ko: '파일', en: 'File' },
    },
    {
      name: 'label',
      type: 'text',
      label: { ko: '표시 이름', en: 'Label' },
      admin: { description: '비우면 파일 이름이 표시됩니다' },
    },
  ],
}

// Premade code block (language selector + syntax-aware editing in the admin)
export const editorBlocks = [CalloutBlock, VideoBlock, FileBlock, CodeBlock()]
