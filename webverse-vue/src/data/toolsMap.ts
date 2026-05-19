import type { Tool, BentoTool } from '@/types'
import { BENTO_TOOLS, HOME_TOOLS } from './tools'
import { FEATURED_NEW, NEW_GROUPS } from './newTools'

// Merge all tools into a single map keyed by id
const map = new Map<string, Tool>()

for (const t of BENTO_TOOLS) map.set(t.id, t)
for (const t of HOME_TOOLS) if (!map.has(t.id)) map.set(t.id, t)

// newTools
if (!map.has(FEATURED_NEW.id)) map.set(FEATURED_NEW.id, FEATURED_NEW)
for (const g of NEW_GROUPS) {
  for (const t of g.tools) if (!map.has(t.id)) map.set(t.id, t)
}

export const TOOLS_MAP = map

export function getToolById(id: string): Tool | undefined {
  return map.get(id)
}
