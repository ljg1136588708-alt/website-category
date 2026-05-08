export type BadgeKey = 'pc' | 'app' | 'free' | 'freepaid' | 'paid' | 'cn'
export type FilterTab = 'all' | 'pc' | 'app' | 'free'
export type SortOption = 'popular' | 'newest' | 'rating' | 'updated'
export type TimePeriod = 'today' | 'week' | 'month' | 'all'
export type NewPeriod = 'today' | 'week' | 'month'

export interface Category {
  key: string
  icon: string
  label: string
  count: string
}

export interface Tool {
  id: string
  name: string
  icon: string
  url: string
  desc: string
  /** vue-i18n path e.g. toolName.eleme — overrides `name` when present in messages */
  nameKey?: string
  /** vue-i18n path e.g. toolDesc.eleme — overrides `desc` when present in messages */
  descKey?: string
  badges: BadgeKey[]
  category: string
  subcategory?: string
  relatedPlatform?: 'pc' | 'app'
}

export interface BentoTool extends Tool {
  fullDesc: string
  glowColor: string
  featured?: boolean
}

export interface RankItem extends Tool {
  rank: number
  score: number
  trend: 'up' | 'down' | 'same' | 'new'
  trendValue?: number
}

export interface PodiumItem extends Tool {
  rank: 1 | 2 | 3
  score: number
  changePercent: string
}

export interface NewGroup {
  period: NewPeriod
  label: string
  dateLabel: string
  tools: NewTool[]
}

export interface NewTool extends Tool {
  period: NewPeriod
  dateLabel: string
}

export interface FavoriteItem extends Tool {
  savedAt: string
}

export interface RankingsResponse {
  podium: PodiumItem[]
  list: RankItem[]
}

export interface HomeToolsResponse {
  bento: BentoTool[]
  list: Tool[]
}

export interface NewToolsResponse {
  featured: BentoTool
  groups: NewGroup[]
}
