import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Tool, FavoriteItem } from '@/types'

const STORAGE_KEY = 'webverse_favorites'

function loadFromStorage(): FavoriteItem[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

export const useFavoritesStore = defineStore('favorites', () => {
  const items = ref<FavoriteItem[]>(loadFromStorage())

  function persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items.value))
  }

  function isSaved(id: string): boolean {
    return items.value.some((item) => item.id === id)
  }

  function toggle(tool: Tool): boolean {
    const idx = items.value.findIndex((i) => i.id === tool.id)
    if (idx >= 0) {
      items.value.splice(idx, 1)
      persist()
      return false
    } else {
      items.value.unshift({ ...tool, savedAt: new Date().toISOString() })
      persist()
      return true
    }
  }

  function remove(id: string) {
    const idx = items.value.findIndex((i) => i.id === id)
    if (idx >= 0) {
      items.value.splice(idx, 1)
      persist()
    }
  }

  const total = computed(() => items.value.length)

  const categories = computed(() =>
    [...new Set(items.value.map((i) => i.category).filter(Boolean))],
  )

  return { items, isSaved, toggle, remove, total, categories }
})
