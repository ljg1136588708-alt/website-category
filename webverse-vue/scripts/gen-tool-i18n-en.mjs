/**
 * Build toolDesc.en.json / toolName.en.json from zh JSON via MyMemory (free tier, rate-limited).
 * Run: node scripts/gen-tool-i18n-en.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const genDir = path.join(root, 'src/locales/generated')

async function translateMyMemory(text) {
  const max = 450
  const chunk = text.length > max ? text.slice(0, max) : text
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(chunk)}&langpair=zh-CN|en-GB`
  const res = await fetch(url)
  const j = await res.json()
  if (j.responseStatus !== 200) {
    throw new Error(j.responseDetails || JSON.stringify(j))
  }
  return j.responseData.translatedText
}

async function mapObject(zhObj, label) {
  const ids = Object.keys(zhObj).sort()
  const out = {}
  console.log(label, ids.length, 'keys')
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i]
    const text = zhObj[id]
    try {
      out[id] = await translateMyMemory(text)
    } catch (e) {
      console.warn(id, e.message)
      out[id] = text
    }
    if ((i + 1) % 25 === 0) console.log('…', i + 1, '/', ids.length)
    await new Promise((r) => setTimeout(r, 350))
  }
  return out
}

async function main() {
  const zhDesc = JSON.parse(fs.readFileSync(path.join(genDir, 'toolDesc.zh.json'), 'utf8'))
  const zhName = JSON.parse(fs.readFileSync(path.join(genDir, 'toolName.zh.json'), 'utf8'))
  const zhFull = JSON.parse(fs.readFileSync(path.join(genDir, 'toolFullDesc.zh.json'), 'utf8'))

  const enDesc = await mapObject(zhDesc, 'toolDesc')
  const enName = await mapObject(zhName, 'toolName')
  const enFull = await mapObject(zhFull, 'toolFullDesc')

  fs.writeFileSync(path.join(genDir, 'toolDesc.en.json'), JSON.stringify(enDesc, null, 2), 'utf8')
  fs.writeFileSync(path.join(genDir, 'toolName.en.json'), JSON.stringify(enName, null, 2), 'utf8')
  fs.writeFileSync(path.join(genDir, 'toolFullDesc.en.json'), JSON.stringify(enFull, null, 2), 'utf8')
  console.log('Done.')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
