import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const enPath = join(__dirname, '../src/locales/generated/toolDesc.en.json')

const en = JSON.parse(readFileSync(enPath, 'utf8'))
const chineseRegex = /[一-鿿]/

const toTranslate = Object.entries(en).filter(([, v]) => chineseRegex.test(v))
console.log(`需要翻译: ${toTranslate.length} 条`)

const BATCH = 20
const API_KEY = process.env.DEEPSEEK_API_KEY || 'sk-5f3b7513411b45799465c96ea6eab98e'

async function translateBatch(items) {
  const prompt = items.map(([id, zh], i) => `${i + 1}. [${id}] ${zh}`).join('\n')
  const res = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${API_KEY}` },
    body: JSON.stringify({
      model: 'deepseek-chat',
      temperature: 0.3,
      messages: [
        {
          role: 'system',
          content: `You are a tool description translator. Translate each Chinese tool description to concise English (max 80 chars). Keep product names, URLs, and numbers as-is. Reply ONLY with the same numbered format:\n1. [id] English description\n2. [id] English description\n...`,
        },
        { role: 'user', content: prompt },
      ],
    }),
  })
  if (!res.ok) throw new Error(`API error ${res.status}: ${await res.text()}`)
  const data = await res.json()
  const text = data.choices[0].message.content
  const results = {}
  for (const line of text.split('\n')) {
    const m = line.match(/^\d+\.\s*\[([^\]]+)\]\s*(.+)/)
    if (m) results[m[1]] = m[2].trim()
  }
  return results
}

let translated = 0
for (let i = 0; i < toTranslate.length; i += BATCH) {
  const batch = toTranslate.slice(i, i + BATCH)
  process.stdout.write(`翻译 ${i + 1}-${Math.min(i + BATCH, toTranslate.length)} / ${toTranslate.length} ...`)
  try {
    const results = await translateBatch(batch)
    for (const [id, text] of Object.entries(results)) {
      if (en[id] !== undefined) { en[id] = text; translated++ }
    }
    console.log(` ✓ (${Object.keys(results).length} 条)`)
  } catch (e) {
    console.log(` ✗ ${e.message}`)
  }
  if (i + BATCH < toTranslate.length) await new Promise(r => setTimeout(r, 500))
}

writeFileSync(enPath, JSON.stringify(en, null, 2), 'utf8')
console.log(`\n完成！共翻译 ${translated} 条，已写入 toolDesc.en.json`)
