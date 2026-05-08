import axios from 'axios'
import { HOME_TOOLS, BENTO_TOOLS } from '@/data/tools'
import { PODIUM, RANK_LIST } from '@/data/rankings'
import { FEATURED_NEW, NEW_GROUPS } from '@/data/newTools'
import type {
  HomeToolsResponse,
  RankingsResponse,
  NewToolsResponse,
} from '@/types'

const http = axios.create({
  baseURL: '/api',
  timeout: 8000,
})

http.interceptors.response.use(
  (res) => res,
  (err) => Promise.reject(err),
)

// Mock helpers — replace these implementations with real http calls when backend is ready
const delay = (ms = 300) => new Promise<void>((r) => setTimeout(r, ms))

export const toolsApi = {
  async getHomeTools(): Promise<HomeToolsResponse> {
    await delay()
    return { bento: BENTO_TOOLS, list: HOME_TOOLS }
  },

  async getRankings(): Promise<RankingsResponse> {
    await delay()
    return { podium: PODIUM, list: RANK_LIST }
  },

  async getNewTools(): Promise<NewToolsResponse> {
    await delay()
    return { featured: FEATURED_NEW, groups: NEW_GROUPS }
  },
}

export default http
