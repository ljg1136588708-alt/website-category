/**
 * Extract id→desc, fullDesc, name from data files → JSON (no network).
 * Run: node scripts/extract-tool-i18n-zh.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

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

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8')
  const descById = new Map()
  const fullDescById = new Map()
  const nameById = new Map()
  let i = 0
  while (i < content.length) {
    const idPos = content.indexOf("id: '", i)
    if (idPos === -1) break
    const idQ = readQuoted(content, idPos + 5)
    const id = idQ.value
    const nextIdPos = content.indexOf("id: '", idPos + 6)
    const slice = nextIdPos === -1 ? content.slice(idQ.end) : content.slice(idQ.end, nextIdPos)

    const nm = slice.indexOf("name: '")
    if (nm !== -1) {
      const q = readQuoted(slice, nm + 7)
      nameById.set(id, q.value)
    }

    const dp = slice.indexOf("desc: '")
    if (dp !== -1) {
      const q = readQuoted(slice, dp + 7)
      descById.set(id, q.value)
    }

    const fp = slice.indexOf("fullDesc: '")
    if (fp !== -1) {
      const q = readQuoted(slice, fp + 11)
      fullDescById.set(id, q.value)
    }

    i = idPos + 6
  }
  return { descById, fullDescById, nameById }
}

function merge(a, b) {
  for (const [k, v] of b) a.set(k, v)
}

const toolsTs = path.join(root, 'src/data/tools.ts')
const rankingsTs = path.join(root, 'src/data/rankings.ts')
const newToolsTs = path.join(root, 'src/data/newTools.ts')

const desc = new Map()
const fullDesc = new Map()
const names = new Map()

for (const f of [toolsTs, rankingsTs, newToolsTs]) {
  const { descById, fullDescById, nameById } = scanFile(f)
  merge(desc, descById)
  merge(fullDesc, fullDescById)
  merge(names, nameById)
}

const sortObj = (m) => Object.fromEntries([...m.entries()].sort(([a], [b]) => a.localeCompare(b)))

const outDir = path.join(root, 'src/locales/generated')
fs.mkdirSync(outDir, { recursive: true })
fs.writeFileSync(path.join(outDir, 'toolDesc.zh.json'), JSON.stringify(sortObj(desc), null, 2), 'utf8')
fs.writeFileSync(path.join(outDir, 'toolFullDesc.zh.json'), JSON.stringify(sortObj(fullDesc), null, 2), 'utf8')
fs.writeFileSync(path.join(outDir, 'toolName.zh.json'), JSON.stringify(sortObj(names), null, 2), 'utf8')

console.log('desc keys:', desc.size, 'fullDesc:', fullDesc.size, 'names:', names.size)
console.log('Wrote', outDir)
