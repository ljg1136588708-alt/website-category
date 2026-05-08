import type { Tool } from '@/types'

/** Resolve localized tool copy; `t`/`te` from vue-i18n `useI18n()`. */
export function toolLocalizedName(
  tool: Tool,
  t: (key: string) => string,
  te: (key: string) => boolean,
): string {
  if (tool.nameKey && te(tool.nameKey)) return t(tool.nameKey)
  const k = `toolName.${tool.id}`
  if (te(k)) return t(k)
  return tool.name
}

export function toolLocalizedDesc(
  tool: Tool,
  t: (key: string) => string,
  te: (key: string) => boolean,
): string {
  if (tool.descKey && te(tool.descKey)) return t(tool.descKey)
  const k = `toolDesc.${tool.id}`
  if (te(k)) return t(k)
  return tool.desc
}

/** Long “bento / featured” copy; keys `toolFullDesc.<id>` in locale JSON. */
export function toolLocalizedFullDesc(
  tool: { id: string; fullDesc: string },
  t: (key: string) => string,
  te: (key: string) => boolean,
): string {
  const k = `toolFullDesc.${tool.id}`
  if (te(k)) return t(k)
  return tool.fullDesc
}
