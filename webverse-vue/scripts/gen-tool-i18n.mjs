/**
 * Extract id→desc / id→fullDesc from data TS files, translate to EN, write JSON for locales.
 * Run: node scripts/gen-tool-i18n.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import translate from 'google-translate-api-x'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')

function readQuoted(str, startIdx) {
  let i = startIdx
  let out = ''
  while (i < str.length) {
    const c = str[i]
    if (c === '\\' && str[i + 1] === "'") {
      out += "'"
      i += 2
      continue
    }
    if (c === "'") break
    out += c
    i++
  }
  return { value: out, end: i }
}

/** Collect { id, desc } and { id, fullDesc } from file by scanning `id:` blocks */
function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8')
  const descById = new Map()
  const fullDescById = new Map()
  let i = 0
  while (i < content.length) {
    const idPos = content.indexOf("id: '", i)
    if (idPos === -1) break
    const idQ = readQuoted(content, idPos + 5)
    const id = idQ.value
    const nextIdPos = content.indexOf("id: '", idPos + 6)
    const slice = nextIdPos === -1 ? content.slice(idQ.end) : content.slice(idQ.end, nextIdPos)

    const descMarker = "desc: '"
    const dp = slice.indexOf(descMarker)
    if (dp !== -1) {
      const q = readQuoted(slice, dp + descMarker.length)
      descById.set(id, q.value)
    }

    const fullMarker = "fullDesc: '"
    const fp = slice.indexOf(fullMarker)
    if (fp !== -1) {
      const q = readQuoted(slice, fp + fullMarker.length)
      fullDescById.set(id, q.value)
    }

    i = idPos + 6
  }
  return { descById, fullDescById }
}

function mergeMap(a, b) {
  for (const [k, v] of b) a.set(k, v)
}

async function main() {
  const toolsTs = path.join(root, 'src/data/tools.ts')
  const rankingsTs = path.join(root, 'src/data/rankings.ts')
  const newToolsTs = path.join(root, 'src/data/newTools.ts')

  const desc = new Map()
  const fullDesc = new Map()

  for (const f of [toolsTs, rankingsTs, newToolsTs]) {
    const { descById, fullDescById } = scanFile(f)
    mergeMap(desc, descById)
    mergeMap(fullDesc, fullDescById)
  }

  const zhDesc = Object.fromEntries([...desc.entries()].sort(([a], [b]) => a.localeCompare(b)))
  const zhFull = Object.fromEntries([...fullDesc.entries()].sort(([a], [b]) => a.localeCompare(b)))

  const enDesc = {}
  const ids = Object.keys(zhDesc)
  console.log('Translating', ids.length, 'descriptions…')
  for (let n = 0; n < ids.length; n++) {
    const id = ids[n]
    const text = zhDesc[id]
    try {
      const r = await translate(text, { from: 'auto', to: 'en' })
      enDesc[id] = r.text
    } catch (e) {
      console.warn(id, e.message)
      enDesc[id] = text
    }
    if ((n + 1) % 20 === 0) console.log('…', n + 1, '/', ids.length)
    await new Promise((r) => setTimeout(r, 120))
  }

  const enFull = {}
  const fullIds = Object.keys(zhFull)
  console.log('Translating', fullIds.length, 'fullDesc…')
  for (let n = 0; n < fullIds.length; n++) {
    const id = fullIds[n]
    const text = zhFull[id]
    try {
      const r = await translate(text, { from: 'auto', to: 'en' })
      enFull[id] = r.text
    } catch (e) {
      console.warn(id, e.message)
      enFull[id] = text
    }
    await new Promise((r) => setTimeout(r, 120))
  }

  const outDir = path.join(root, 'src/locales/generated')
  fs.mkdirSync(outDir, { recursive: true })
  fs.writeFileSync(path.join(outDir, 'toolDesc.zh.json'), JSON.stringify(zhDesc, null, 0), 'utf8')
  fs.writeFileSync(path.join(outDir, 'toolDesc.en.json'), JSON.stringify(enDesc, null, 0), 'utf8')
  fs.writeFileSync(path.join(outDir, 'toolFullDesc.zh.json'), JSON.stringify(zhFull, null, 0), 'utf8')
  fs.writeFileSync(path.join(outDir, 'toolFullDesc.en.json'), JSON.stringify(enFull, null, 0), 'utf8')
  console.log('Wrote', outDir)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
