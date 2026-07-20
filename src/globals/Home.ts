import type { GlobalConfig } from 'payload'

export const Home: GlobalConfig = {
  slug: 'home',
  label: 'Home',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'heroTitle',
      type: 'text',
      localized: true,
      admin: {
        description: '비워두면 기본 인사말이 표시됩니다',
      },
    },
    {
      name: 'heroSubtitle',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'featuredProjects',
      type: 'relationship',
      relationTo: 'projects',
      hasMany: true,
      admin: {
        description: '홈에 노출할 대표 프로젝트 (순서대로 표시)',
      },
    },
    {
      name: 'recentPostsLimit',
      type: 'number',
      defaultValue: 3,
      min: 0,
      max: 10,
      admin: {
        description: '홈에 표시할 최근 글 개수 (0이면 숨김)',
      },
    },
  ],
}
