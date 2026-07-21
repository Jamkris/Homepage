import type { GlobalConfig } from 'payload'

// Admin-only read so the ntfy token never leaks through the public API.
export const Notifications: GlobalConfig = {
  slug: 'notifications',
  label: { ko: '알림 (ntfy)', en: 'Notifications (ntfy)' },
  access: {
    read: ({ req }) => Boolean(req.user),
  },
  admin: {
    description: '연락 폼 제출 시 ntfy로 푸시 알림을 보냅니다.',
  },
  fields: [
    {
      name: 'enabled',
      type: 'checkbox',
      label: { ko: '알림 사용', en: 'Enable notifications' },
      defaultValue: false,
    },
    {
      name: 'ntfyUrl',
      type: 'text',
      label: { ko: 'ntfy 서버 주소', en: 'ntfy server URL' },
      defaultValue: 'https://ntfy.sh',
    },
    {
      name: 'ntfyTopic',
      type: 'text',
      label: { ko: '토픽', en: 'Topic' },
      admin: { description: '예: homepage-contact' },
    },
    {
      name: 'ntfyToken',
      type: 'text',
      label: { ko: '액세스 토큰 (선택)', en: 'Access token (optional)' },
      admin: { description: '보호된 토픽일 때만 입력' },
    },
  ],
}
