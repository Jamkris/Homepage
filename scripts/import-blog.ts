import fs from 'fs'
import path from 'path'

const S =
  '/private/tmp/claude-501/-Users-hyun-Documents-side-project-homepage/ab219f04-6869-496b-b698-ef4661272d0f/scratchpad'
const LOG = `${S}/import.log`
const log = (m: string) => {
  fs.appendFileSync(LOG, m + '\n')
}
fs.writeFileSync(LOG, '')

const TOKEN = process.env.IMPORT_TOKEN as string
const REMOTE = 'http://192.168.45.15:3060'
const BLOG_DIR = '/Users/hyun/Documents/side-project/blog'

// Curated extra tags per slug (frontmatter tags + these, deduped, ~5 total)
const EXTRA_TAGS: Record<string, string[]> = {
  blog2: ['컴파일'],
  blog3: ['컴파일'],
  blog4: ['컴파일', 'JDK'],
  blog5: ['버전관리', '협업', '설치'],
  blog6: ['Python', '알고리즘', '정렬'],
  blog7: ['Python', '알고리즘', '입출력'],
  blog8: ['SQL', 'CS'],
  blog9: ['SQL', 'CS'],
  blog10: ['자동화', 'AppsScript'],
  blog11: ['일상'],
  blog12: ['SQL', 'MySQL'],
  blog13: ['ChatGPT', 'AI', '생각', '칼럼'],
  blog14: ['로봇', 'AI', '데니스홍', '생각'],
  blog15: ['일상'],
  blog16: ['리눅스', '부팅'],
  blog17: ['일상'],
  blog18: ['일상', '계획', '잡담', '회고'],
  blog19: ['Python', '알고리즘', '스택'],
  blog20: ['Python', '알고리즘', '소수'],
  blog21: ['일상'],
  blog22: ['부소마', '후기', '협업', '회고'],
  blog23: ['SSH', '서버'],
  blog24: ['자동화', 'cron'],
  blog25: ['트러블슈팅', '회원가입'],
  blog26: ['트러블슈팅', '로그인'],
  blog27: ['트러블슈팅', 'Express'],
  blog28: ['일상'],
  blog29: ['CS', '보조기억장치', 'SSD', 'HDD'],
  blog30: ['Karabiner', '자동화'],
  blog31: ['일상'],
}

// Fixes for missing/placeholder metadata
const OVERRIDES: Record<string, { title?: string; excerpt?: string }> = {
  blog10: { title: '메일앱 없이 바로 이메일 보내기 (Google Sheet + HTML)' },
  blog7: { excerpt: 'EOF(입력 끝)까지 여러 줄의 A+B를 입력받아 처리하는 문제 풀이' },
  blog29: { excerpt: '컴퓨터구조 정리 — 다양한 보조기억장치(HDD, SSD 등)' },
}

interface FM {
  [k: string]: string | string[]
}

const parseFrontmatter = (raw: string): { fm: FM; body: string } => {
  const m = raw.match(/^---\s*\n([\s\S]*?)\n---\s*/)
  const fm: FM = {}
  if (!m) return { fm, body: raw }
  for (const line of m[1].split('\n')) {
    const i = line.indexOf(':')
    if (i < 0) continue
    const k = line.slice(0, i).trim()
    let v = line.slice(i + 1).trim()
    if (v.startsWith('"') && v.endsWith('"')) v = v.slice(1, -1)
    if (v.startsWith('[') && v.endsWith(']')) {
      fm[k] = v
        .slice(1, -1)
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    } else {
      fm[k] = v
    }
  }
  return { fm, body: raw.slice(m[0].length) }
}

const extOf = (url: string): string => {
  const m = url.split('?')[0].match(/\.(png|jpe?g|gif|webp)$/i)
  if (!m) return '.png'
  return m[0].toLowerCase().replace('.jpeg', '.jpg')
}

const plainText = (nodes: unknown[]): string => {
  let t = ''
  for (const n of nodes) {
    const node = n as { text?: string; children?: unknown[] }
    if (typeof node.text === 'string') t += node.text
    if (Array.isArray(node.children)) t += plainText(node.children)
  }
  return t
}

type AnyField = { name?: string; editor?: unknown; fields?: AnyField[]; tabs?: { fields?: AnyField[] }[] }
const findContent = (fields: AnyField[]): AnyField | null => {
  for (const f of fields) {
    if (f.name === 'content' && f.editor) return f
    if (f.fields) {
      const r = findContent(f.fields)
      if (r) return r
    }
    if (f.tabs) {
      for (const t of f.tabs) {
        const r = findContent(t.fields ?? [])
        if (r) return r
      }
    }
  }
  return null
}

const slugExists = async (slug: string): Promise<boolean> => {
  const r = await fetch(
    `${REMOTE}/api/posts?where[slug][equals]=${slug}&limit=0&depth=0`,
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
  const contentField = findContent(payload.collections['posts'].config.fields as AnyField[])
  if (!contentField) throw new Error('content field not found')
  const editorConfig = lex.editorConfigFactory.fromField({ field: contentField as never })

  const args = process.argv.slice(2).filter((a) => a.endsWith('.md'))
  const files = args.length ? args : Array.from({ length: 30 }, (_, i) => `blog${i + 2}.md`)

  for (const file of files) {
    try {
      const slug = path.basename(file, '.md') // canonical slug = filename (fixes bad frontmatter slugs)
      if (await slugExists(slug)) {
        log(`SKIP ${slug} (already exists)`)
        continue
      }

      const raw = fs.readFileSync(path.join(BLOG_DIR, file), 'utf8')
      const { fm, body } = parseFrontmatter(raw)
      const ov = OVERRIDES[slug] ?? {}
      const title = ov.title || String(fm.title || slug)

      // images: cover first, then body images (in order)
      const imgRe = /!\[([^\]]*)\]\(([^)]+)\)/g
      const images: { alt: string; url: string }[] = []
      if (fm['커버이미지']) images.push({ alt: title, url: String(fm['커버이미지']) })
      let mm: RegExpExecArray | null
      while ((mm = imgRe.exec(body))) images.push({ alt: mm[1] || title, url: mm[2] })

      const total = images.length
      const urlToId: Record<string, number> = {}
      let coverId: number | undefined
      for (let i = 0; i < images.length; i++) {
        const name = (total >= 2 ? `${slug}-${i + 1}` : slug) + extOf(images[i].url)
        const dl = await fetch(images[i].url)
        if (!dl.ok) {
          log(`  WARN image download ${dl.status} ${images[i].url}`)
          continue
        }
        const buf = Buffer.from(await dl.arrayBuffer())
        const ct = dl.headers.get('content-type') || 'image/png'
        const form = new FormData()
        form.append('file', new Blob([buf], { type: ct }), name)
        form.append('_payload', JSON.stringify({ alt: images[i].alt }))
        const up = await fetch(`${REMOTE}/api/media`, {
          method: 'POST',
          headers: { Authorization: `JWT ${TOKEN}` },
          body: form,
        })
        const j = (await up.json()) as { doc?: { id: number } }
        if (!j.doc) {
          log(`  WARN media upload failed ${name}`)
          continue
        }
        urlToId[images[i].url] = j.doc.id
        if (i === 0 && fm['커버이미지']) coverId = j.doc.id
      }

      // replace body images with block placeholders
      let idx = 0
      const placeholders: Record<string, number> = {}
      const bodyForConvert = body.replace(imgRe, (_f, _a, url) => {
        const id = urlToId[url]
        if (id === undefined) return '' // dropped (download failed)
        const key = `@@IMG${idx}@@`
        placeholders[key] = id
        idx++
        return `\n\n${key}\n\n`
      })

      const state = lex.convertMarkdownToLexical({ editorConfig, markdown: bodyForConvert }) as {
        root: { children: { type?: string; children?: unknown[] }[] }
      }
      state.root.children = state.root.children.map((node) => {
        if (node.type === 'paragraph' && node.children) {
          const txt = plainText(node.children).trim()
          if (placeholders[txt] !== undefined) {
            return {
              type: 'upload',
              relationTo: 'media',
              value: placeholders[txt],
              fields: {},
              format: '',
              version: 3,
            } as never
          }
        }
        return node
      })

      // Force a valid language on every Code block (bare ``` fences otherwise
      // get an invalid select value and fail validation)
      const fixLang = (nodes: { type?: string; fields?: Record<string, unknown>; children?: unknown[] }[]) => {
        for (const n of nodes) {
          if (n.type === 'block' && n.fields?.blockType === 'Code') {
            n.fields.language = 'plaintext'
          }
          if (Array.isArray(n.children)) fixLang(n.children as never)
        }
      }
      fixLang(state.root.children)

      const fmTags = Array.isArray(fm.tags) ? fm.tags : []
      const tags = Array.from(new Set([...fmTags, ...(EXTRA_TAGS[slug] ?? [])]))
      const excerpt =
        ov.excerpt ||
        (typeof fm.excerpt === 'string' && fm.excerpt) ||
        plainText(state.root.children).replace(/\s+/g, ' ').trim().slice(0, 80)

      const data = {
        title,
        slug,
        excerpt,
        content: state,
        tags,
        publishedAt: fm.publishedAt ? new Date(String(fm.publishedAt)).toISOString() : undefined,
        coverImage: coverId,
        meta: { title, description: String(excerpt).slice(0, 155), image: coverId },
        _status: 'published',
      }

      const res = await fetch(`${REMOTE}/api/posts?locale=ko&fallback-locale=none`, {
        method: 'POST',
        headers: { Authorization: `JWT ${TOKEN}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const out = (await res.json()) as { doc?: { id: number }; errors?: unknown }
      if (!out.doc) {
        log(`FAIL ${slug}: ${JSON.stringify(out).slice(0, 300)}`)
        continue
      }
      log(`OK ${slug} id=${out.doc.id} imgs=${total} tags=${tags.length} cover=${coverId ?? '-'}`)
    } catch (err) {
      log(`ERROR ${file}: ${err instanceof Error ? err.message : String(err)}`)
    }
  }
  log('BATCH DONE')
}

try {
  await run()
} catch (err) {
  log('FATAL: ' + (err instanceof Error ? (err.stack ?? err.message) : String(err)))
}
