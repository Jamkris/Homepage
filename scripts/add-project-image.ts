import fs from 'fs'

const S =
  '/private/tmp/claude-501/-Users-hyun-Documents-side-project-homepage/ab219f04-6869-496b-b698-ef4661272d0f/scratchpad'
const LOG = `${S}/img.log`
const log = (m: string) => fs.appendFileSync(LOG, m + '\n')
fs.writeFileSync(LOG, '')

const TOKEN = process.env.IMPORT_TOKEN as string
const REMOTE = 'http://192.168.45.15:3060'

const IMG = '/Users/hyun/.claude/image-cache/ab219f04-6869-496b-b698-ef4661272d0f/20.png'
const SLUG = 'chaellimi'
const ALT = '챌리미 서비스 소개 포스터'
const INSERT_BODY = false // poster -> cover only

const run = async () => {
  const buf = fs.readFileSync(IMG)
  const form = new FormData()
  form.append('file', new Blob([buf], { type: 'image/png' }), `${SLUG}.png`)
  form.append('_payload', JSON.stringify({ alt: ALT }))
  const up = await fetch(`${REMOTE}/api/media`, {
    method: 'POST',
    headers: { Authorization: `JWT ${TOKEN}` },
    body: form,
  })
  const uj = (await up.json()) as { doc?: { id: number } }
  if (!uj.doc) throw new Error('upload failed: ' + JSON.stringify(uj).slice(0, 200))
  const mediaId = uj.doc.id
  log(`uploaded media id=${mediaId}`)

  const pr = await fetch(
    `${REMOTE}/api/projects?where[slug][equals]=${SLUG}&depth=0&locale=ko&fallback-locale=none`,
    { headers: { Authorization: `JWT ${TOKEN}` } },
  )
  const project = ((await pr.json()) as { docs?: Record<string, unknown>[] }).docs?.[0]
  if (!project) throw new Error('project not found')

  const body: Record<string, unknown> = { coverImage: mediaId }
  if (INSERT_BODY) {
    const desc = project.description as { root: { children: { type?: string }[] } }
    const node = { type: 'upload', relationTo: 'media', value: mediaId, fields: {}, format: '', version: 3 }
    const codeIdx = desc.root.children.findIndex((n) => n.type === 'block')
    desc.root.children.splice(codeIdx >= 0 ? codeIdx + 1 : 0, 0, node as never)
    body.description = desc
  }

  const patch = await fetch(`${REMOTE}/api/projects/${project.id}?locale=ko`, {
    method: 'PATCH',
    headers: { Authorization: `JWT ${TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const out = (await patch.json()) as { doc?: { id: number } }
  log(out.doc ? `OK cover set on project id=${out.doc.id}` : `FAIL ${JSON.stringify(out).slice(0, 300)}`)
}

try {
  await run()
} catch (err) {
  log('ERROR: ' + (err instanceof Error ? (err.stack ?? err.message) : String(err)))
}
