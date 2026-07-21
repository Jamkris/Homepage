import type { GlobalConfig } from 'payload'

export const Home: GlobalConfig = {
  slug: 'home',
  label: { ko: '홈', en: 'Home' },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'heroTitle',
      type: 'text',
      label: { ko: '히어로 제목', en: 'Hero title' },
      localized: true,
      admin: {
        description: '비워두면 기본 인사말이 표시됩니다',
      },
    },
    {
      name: 'heroSubtitle',
      type: 'textarea',
      label: { ko: '히어로 부제', en: 'Hero subtitle' },
      localized: true,
    },
    {
      name: 'featuredProjects',
      type: 'relationship',
      label: { ko: '대표 프로젝트 (고정)', en: 'Pinned projects' },
      relationTo: 'projects',
      hasMany: true,
      admin: {
        description: '지정하면 이 프로젝트들을 맨 앞에 고정 노출 (선택). 비우면 최신순으로 채워집니다.',
      },
    },
    {
      name: 'portfolioLimit',
      type: 'number',
      label: { ko: '홈 포트폴리오 개수', en: 'Portfolio limit' },
      defaultValue: 4,
      min: 0,
      max: 12,
      admin: {
        description: '홈에 표시할 포트폴리오 개수 — 프로젝트+수상·활동을 최신순으로 (0이면 숨김)',
      },
    },
    {
      name: 'recentPostsLimit',
      type: 'number',
      label: { ko: '최근 글 개수', en: 'Recent posts limit' },
      defaultValue: 3,
      min: 0,
      max: 10,
      admin: {
        description: '홈에 표시할 최근 글 개수 (0이면 숨김)',
      },
    },
  ],
}
