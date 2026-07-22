import fs from 'fs'

const S =
  '/private/tmp/claude-501/-Users-hyun-Documents-side-project-homepage/ab219f04-6869-496b-b698-ef4661272d0f/scratchpad'
const LOG = `${S}/activity.log`
const log = (m: string) => fs.appendFileSync(LOG, m + '\n')
fs.writeFileSync(LOG, '')

const TOKEN = process.env.IMPORT_TOKEN as string
const REMOTE = 'http://192.168.45.15:3060'

interface ActivitySpec {
  title: string
  slug: string
  type: 'award' | 'activity'
  organization?: string
  startDate?: string
  endDate?: string
  ongoing?: boolean
  tags: string[]
  references: { label: string; url: string }[]
  markdown: string
}

const ACTIVITIES: ActivitySpec[] = [
  {
    title: 'git-env-manager',
    slug: 'git-env-manager',
    type: 'activity',
    organization: '오픈소스 · 개인',
    startDate: '2026-04-08T12:00:00.000Z',
    tags: ['OSS', 'CLI', 'TypeScript', 'Git', 'DevTools'],
    references: [
      { label: 'GitHub', url: 'https://github.com/Jamkris/git-env-manager' },
      { label: 'npm', url: 'https://www.npmjs.com/package/git-env-manager' },
    ],
    markdown: `# Introduce

**git-env-manager (ghem)** 는 여러 Git 프로필과 SSH 키를 한 곳에서 관리하는 CLI 도구입니다. 개인/회사 계정을 오갈 때마다 \`git config\` 와 \`ssh-add\` 를 수동으로 바꾸는 번거로움을, Git 네이티브 \`includeIf\` 기반의 **디렉토리별 자동 전환**으로 해결합니다.

- 오픈소스 · MIT · npm 배포 (\`npm i -g git-env-manager\`)
- TypeScript · CLI (\`ghem\`)

## 🧩 무엇을 하나

- **프로필 중앙 관리** — 이름/이메일/SSH 키를 프로필 단위로 등록하고 전환
- **SSH 키 자동 생성** — \`ssh-keygen\` 을 자동 실행하고 공개키를 출력해 그대로 GitHub/GitLab에 등록
- **디렉토리 기반 자동 전환** — 특정 폴더에 들어가면 프로필이 알아서 바뀜 (Git \`includeIf\`)
- \`ghem add / switch / list\` 등 직관적인 커맨드

## 👨🏻‍💻 기여한 부분

- 기획 · 설계 · 구현 · 배포 단독 진행
- Git \`includeIf\` 를 이용한 디렉토리 자동 스위칭 로직 구현
- SSH 키 생성/등록 흐름을 대화형 프롬프트로 구성
- CI 파이프라인 + npm 패키지 배포 + 한/영 문서화

# Experience

## CLI 도구 설계 경험

매일 겪던 불편(계정 전환)을 직접 도구로 만들면서 Git 내부 설정과 SSH 에이전트 동작을 깊이 이해하게 되었고, npm 배포와 CI까지 오픈소스 배포 파이프라인을 처음부터 끝까지 경험했습니다.
`,
  },
  {
    title: 'Github-Gist-Status',
    slug: 'github-gist-status',
    type: 'activity',
    organization: '오픈소스 · 개인',
    startDate: '2026-04-07T12:00:00.000Z',
    ongoing: true,
    tags: ['OSS', 'GitHub API', 'TypeScript', '자동화', '시각화'],
    references: [{ label: 'GitHub', url: 'https://github.com/Jamkris/Github-Gist-Status' }],
    markdown: `# Introduce

**Github-Gist-Status** 는 GitHub 커밋 활동과 프로필 통계를 분석해서 고정(pinned) Gist를 자동으로 업데이트하는 도구입니다. 프로필에 살아 움직이는 대시보드를 만들어 줍니다.

- 오픈소스 · MIT · TypeScript
- 3종 Gist 지원: **Activity / Overview / Project**

## 🧩 무엇을 하나

- **Activity Gist** — 커밋 기록을 시간대별로 분석해 막대그래프로 표시
- **Overview Gist** — 스타 · 커밋 · PR · 이슈 등 GitHub 통계를 한눈에 요약
- **Project Gist** — 진행 중인 프로젝트를 라이브 스타/포크/버전과 커스텀 태그(🚧 WIP, 🎯 Focus 등)로 노출

\`\`\`
🌞 Morning    73 commits ███████▍░░░░░░░░░░░░░  19.3%
🌆 Daytime   142 commits ██████████████▍░░░░░░░  37.6%
🌃 Evening   112 commits ███████████▎░░░░░░░░░░  29.6%
🌙 Night      51 commits █████▏░░░░░░░░░░░░░░░  13.5%
\`\`\`

## 👨🏻‍💻 기여한 부분

- 기획 · 구현 · 배포 단독 진행
- GitHub API로 커밋/통계 수집 및 시간대 분석 로직 구현
- Gist 자동 업데이트 파이프라인(주기 실행) 구성
- 커스텀 태그 · 한/영 다국어 지원

# Experience

## 데이터 시각화 & 자동화 경험

GitHub API에서 데이터를 모아 사람이 읽기 좋은 형태(막대그래프 · 요약)로 가공하고, 이를 주기적으로 자동 갱신하는 파이프라인을 만들며 API 연동과 자동화를 경험했습니다.
`,
  },
]

type AnyField = { name?: string; editor?: unknown; fields?: AnyField[]; tabs?: { fields?: AnyField[] }[] }
const findContent = (fields: AnyField[]): AnyField | null => {
  for (const f of fields) {
    if (f.name === 'content' && f.editor) return f
    if (f.fields) {
      const r = findContent(f.fields)
      if (r) return r
    }
    if (f.tabs) for (const t of f.tabs) {
      const r = findContent(t.fields ?? [])
      if (r) return r
    }
  }
  return null
}

const slugExists = async (slug: string): Promise<boolean> => {
  const r = await fetch(
    `${REMOTE}/api/activities?where[slug][equals]=${slug}&limit=0&depth=0`,
    { headers: { Authorization: `JWT ${TOKEN}` } },
  )
  const j = (await r.json()) as { totalDocs?: number }
  return (j.totalDocs ?? 0) > 0
}

const run = async () => {
  const { default: config } = await import('@payload-config')
  const { getPayload } = await import('payload')
  const lex = await import('@payloadcms/richtext-lexical')
  const payload = await getPayload({ config })
  const field = findContent(payload.collections['activities'].config.fields as AnyField[])
  if (!field) throw new Error('activities content field not found')
  const editorConfig = lex.editorConfigFactory.fromField({ field: field as never })

  for (const spec of ACTIVITIES) {
    try {
      if (await slugExists(spec.slug)) {
        log(`SKIP ${spec.slug} (exists)`)
        continue
      }
      const state = lex.convertMarkdownToLexical({ editorConfig, markdown: spec.markdown }) as {
        root: { children: { type?: string; fields?: Record<string, unknown>; children?: unknown[] }[] }
      }
      const fixLang = (nodes: { type?: string; fields?: Record<string, unknown>; children?: unknown[] }[]) => {
        for (const n of nodes) {
          if (n.type === 'block' && n.fields?.blockType === 'Code') n.fields.language = 'plaintext'
          if (Array.isArray(n.children)) fixLang(n.children as never)
        }
      }
      fixLang(state.root.children)

      const data = {
        title: spec.title,
        slug: spec.slug,
        type: spec.type,
        organization: spec.organization,
        startDate: spec.startDate,
        endDate: spec.endDate,
        ongoing: spec.ongoing ?? false,
        tags: spec.tags,
        references: spec.references,
        content: state,
        _status: 'published',
      }
      const res = await fetch(`${REMOTE}/api/activities?locale=ko&fallback-locale=none`, {
        method: 'POST',
        headers: { Authorization: `JWT ${TOKEN}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const out = (await res.json()) as { doc?: { id: number; slug: string } }
      if (!out.doc) {
        log(`FAIL ${spec.slug}: ${JSON.stringify(out).slice(0, 300)}`)
        continue
      }
      log(`OK ${out.doc.slug} id=${out.doc.id}`)
    } catch (err) {
      log(`ERROR ${spec.slug}: ${err instanceof Error ? err.message : String(err)}`)
    }
  }
  log('DONE')
}

try {
  await run()
} catch (err) {
  log('FATAL: ' + (err instanceof Error ? (err.stack ?? err.message) : String(err)))
}
