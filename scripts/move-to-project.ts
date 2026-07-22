import fs from 'fs'

const S =
  '/private/tmp/claude-501/-Users-hyun-Documents-side-project-homepage/ab219f04-6869-496b-b698-ef4661272d0f/scratchpad'
const LOG = `${S}/move.log`
const log = (m: string) => fs.appendFileSync(LOG, m + '\n')
fs.writeFileSync(LOG, '')

const TOKEN = process.env.IMPORT_TOKEN as string
const REMOTE = 'http://192.168.45.15:3060'

// activity slug -> project overrides (tech stack, category)
const MOVES: Record<string, { techStack: string[]; summary?: string }> = {
  'everything-gemini-code': {
    techStack: ['TypeScript', 'Gemini CLI', 'Node.js', 'DevTools'],
    summary: 'Everything Claude Code를 Gemini CLI 생태계로 포팅한 오픈소스 (183 스킬 · 48 에이전트 · 80 커맨드)',
  },
  'git-env-manager': {
    techStack: ['TypeScript', 'Node.js', 'Git', 'CLI'],
    summary: '여러 Git 프로필과 SSH 키를 디렉토리별로 자동 전환하는 CLI 도구 (npm 배포)',
  },
}

const run = async () => {
  for (const [slug, ov] of Object.entries(MOVES)) {
    try {
      // fetch the activity (ko locale, keep raw refs/content)
      const r = await fetch(
        `${REMOTE}/api/activities?where[slug][equals]=${slug}&depth=0&locale=ko&fallback-locale=none`,
        { headers: { Authorization: `JWT ${TOKEN}` } },
      )
      const j = (await r.json()) as { docs?: Record<string, unknown>[] }
      const act = j.docs?.[0]
      if (!act) {
        log(`SKIP ${slug} (activity not found)`)
        continue
      }

      // already a project?
      const pr = await fetch(`${REMOTE}/api/projects?where[slug][equals]=${slug}&limit=0`, {
        headers: { Authorization: `JWT ${TOKEN}` },
      })
      if (((await pr.json()) as { totalDocs?: number }).totalDocs) {
        log(`SKIP ${slug} (project exists)`)
        continue
      }

      const refs = (act.references as { label: string; url: string }[] | undefined) ?? []
      const data = {
        title: act.title,
        slug,
        category: 'opensource',
        summary: ov.summary ?? act.organization ?? act.title,
        description: act.content, // reuse the written rich text
        techStack: ov.techStack,
        links: refs.map((x) => ({ label: x.label, url: x.url })),
        startedAt: act.startDate,
        endedAt: act.endDate,
        meta: { title: act.title, description: ov.summary ?? '' },
        _status: 'published',
      }

      const cr = await fetch(`${REMOTE}/api/projects?locale=ko&fallback-locale=none`, {
        method: 'POST',
        headers: { Authorization: `JWT ${TOKEN}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const out = (await cr.json()) as { doc?: { id: number } }
      if (!out.doc) {
        log(`FAIL ${slug}: ${JSON.stringify(out).slice(0, 300)}`)
        continue
      }
      // delete the activity
      await fetch(`${REMOTE}/api/activities/${act.id}`, {
        method: 'DELETE',
        headers: { Authorization: `JWT ${TOKEN}` },
      })
      log(`OK ${slug} -> project id=${out.doc.id} (activity ${act.id} deleted)`)
    } catch (err) {
      log(`ERROR ${slug}: ${err instanceof Error ? err.message : String(err)}`)
    }
  }
  log('DONE')
}

try {
  await run()
} catch (err) {
  log('FATAL: ' + (err instanceof Error ? (err.stack ?? err.message) : String(err)))
}
