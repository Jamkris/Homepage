import fs from 'fs'
const S='/private/tmp/claude-501/-Users-hyun-Documents-side-project-homepage/ab219f04-6869-496b-b698-ef4661272d0f/scratchpad'
fs.writeFileSync(S+'/conv.log','start\n')
const { default: config } = await import('@payload-config')
fs.appendFileSync(S+'/conv.log','config ok\n')
const { getPayload } = await import('payload')
const payload = await getPayload({ config })
fs.appendFileSync(S+'/conv.log','payload ok\n')
const lex = await import('@payloadcms/richtext-lexical')
const ec = await lex.editorConfigFactory.default({ config: payload.config })
const st = lex.convertMarkdownToLexical({ editorConfig: ec, markdown: '# 제목\n\n**굵게** `코드`\n\n- a\n- b\n\n```\ncode\n```\n\n![alt](https://ex.com/x.png)' })
fs.writeFileSync(S+'/ref.json', JSON.stringify(st,null,1))
fs.appendFileSync(S+'/conv.log','done\n')
