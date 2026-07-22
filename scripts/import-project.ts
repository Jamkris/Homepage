import fs from 'fs'

const S =
  '/private/tmp/claude-501/-Users-hyun-Documents-side-project-homepage/ab219f04-6869-496b-b698-ef4661272d0f/scratchpad'
const LOG = `${S}/project.log`
const log = (m: string) => fs.appendFileSync(LOG, m + '\n')
fs.writeFileSync(LOG, '')

const TOKEN = process.env.IMPORT_TOKEN as string
const REMOTE = 'http://192.168.45.15:3060'

const SPEC: {
  title: string
  slug: string
  category: string
  summary: string
  techStack: string[]
  links: { label: string; url: string }[]
  startedAt: string
  endedAt?: string
  ongoing?: boolean
  markdown: string
} = {
  title: 'Bastion',
  slug: 'bastion',
  category: 'opensource',
  summary: '셀프호스팅 서버용 fail2ban + nftables 보안 대시보드 — 방화벽 상태·IP 차단·ntfy 알림을 컨테이너 하나로',
  techStack: ['Python', 'FastAPI', 'HTMX', 'nftables', 'Docker'],
  links: [{ label: 'GitHub', url: 'https://github.com/Jamkris/Bastion' }],
  startedAt: '2026-07-09T12:00:00.000Z',
  ongoing: true,
  markdown: `# Introduce

**Bastion** 은 셀프호스팅 서버 하나를 위한 가벼운 **fail2ban + nftables 보안 대시보드**입니다. 방화벽 상태 확인, IP 차단/해제, 허용목록 관리, 공격 급증 시 푸시 알림까지 — 전부 브라우저에서, 작은 컨테이너 하나로 처리합니다.

- Python (FastAPI + HTMX) · Docker · MIT
- 한/영 UI · 단일 컨테이너(:8009)

## 🧩 주요 기능

**관측 (Observability)**
- 차단된 IP 목록 (jail별, GeoIP 국가 플래그)
- Top 공격자 (\`auth.log\` / journald 로그인 실패 집계)
- 열린 포트 (\`ss -tlnp\` + 소유 프로세스), 방화벽 규칙 (\`nft -j list ruleset\`)
- 홈 화면 트렌드 스파크라인 + \`GET /api/history\` JSON, 30초 라이브 갱신 (HTMX)

**관리 (Management)**
- \`fail2ban-client\` 로 IP 차단/해제, Top 공격자 **일괄 차단**
- nftables set 기반 **허용목록** 추가/삭제

**알림 (Alerting)**
- **ntfy 푸시** — 차단 급증(임계값/기간), 새 공격자 IP, 열린 포트 변경. 각각 개별 토글 + 테스트 전송

**보안 & UX**
- 단일 비밀번호 로그인 게이트(HMAC 서명 세션 쿠키), 로그인 레이트리밋(브루트포스 방어)
- 재배포 없이 런타임에 바꾸는 **설정 페이지**(알림·허용목록·레이트리밋)
- 모든 입력 엄격 검증, 명령은 argv 리스트로 실행(셸 문자열 X), 쓰기 작업 감사 로그 + 인증 필요

## ⚙️ 아키텍처

\`\`\`
runner.py     명령 1개 실행 -> stdout        (fail2ban-client, nft, ss)
services/     원시 텍스트 -> 파싱 -> dataclass (순수 함수, 전부 테스트)
prefs.py      런타임 사용자 설정             (디스크 JSON, env 위에 레이어)
web/          FastAPI + HTMX 페이지 + JSON API
\`\`\`

로직을 전부 \`services/\` · \`prefs.py\` 에 두어 HTMX 페이지와 JSON API가 같은 코드를 재사용합니다. 파서는 실제 서버 픽스처로 테스트한 순수 함수입니다.

## 👨🏻‍💻 기여한 부분

- 기획 · 설계 · 구현 · 배포 단독 진행
- fail2ban / nftables 출력을 파싱해 dataclass로 변환하는 로직(순수 함수 + 테스트) 설계
- FastAPI + HTMX 대시보드, ntfy 알림, 허용목록/레이트리밋 런타임 설정
- Docker(host network + NET_ADMIN) 배포, 한/영 i18n

# Experience

## 시스템 · 보안 도구 설계 경험

방화벽·로그 같은 시스템 데이터를 안전하게 다루면서 셸 인젝션을 원천 차단(argv 실행)하고 입력을 엄격히 검증하는 보안 관점의 설계를 익혔습니다. 파싱 로직을 순수 함수로 분리해 테스트 가능하게 만들고, HTMX로 서버 렌더링 대시보드를 가볍게 구성하는 경험을 했습니다.
`,
}

type AnyField = { name?: string; editor?: unknown; fields?: AnyField[]; tabs?: { fields?: AnyField[] }[] }
const findRichText = (fields: AnyField[], name: string): AnyField | null => {
  for (const f of fields) {
    if (f.name === name && f.editor) return f
    if (f.fields) {
      const r = findRichText(f.fields, name)
      if (r) return r
    }
    if (f.tabs) for (const t of f.tabs) {
      const r = findRichText(t.fields ?? [], name)
      if (r) return r
    }
  }
  return null
}

const run = async () => {
  const projR = await fetch(`${REMOTE}/api/projects?where[slug][equals]=${SPEC.slug}&limit=0`, {
    headers: { Authorization: `JWT ${TOKEN}` },
  })
  if (((await projR.json()) as { totalDocs?: number }).totalDocs) {
    log('project already exists, skipping')
    return
  }

  const { default: config } = await import('@payload-config')
  const { getPayload } = await import('payload')
  const lex = await import('@payloadcms/richtext-lexical')
  const payload = await getPayload({ config })
  const field = findRichText(payload.collections['projects'].config.fields as AnyField[], 'description')
  if (!field) throw new Error('projects description field not found')
  const editorConfig = lex.editorConfigFactory.fromField({ field: field as never })
  const state = lex.convertMarkdownToLexical({ editorConfig, markdown: SPEC.markdown }) as {
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
    title: SPEC.title,
    slug: SPEC.slug,
    category: SPEC.category,
    summary: SPEC.summary,
    description: state,
    techStack: SPEC.techStack,
    links: SPEC.links,
    startedAt: SPEC.startedAt,
    endedAt: SPEC.endedAt,
    meta: { title: SPEC.title, description: SPEC.summary },
    _status: 'published',
  }
  const res = await fetch(`${REMOTE}/api/projects?locale=ko&fallback-locale=none`, {
    method: 'POST',
    headers: { Authorization: `JWT ${TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  const out = (await res.json()) as { doc?: { id: number; slug: string } }
  if (!out.doc) throw new Error('create failed: ' + JSON.stringify(out).slice(0, 400))
  log(`OK project id=${out.doc.id} slug=${out.doc.slug}`)
}

try {
  await run()
} catch (err) {
  log('ERROR: ' + (err instanceof Error ? (err.stack ?? err.message) : String(err)))
}
