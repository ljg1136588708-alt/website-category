import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { FilterTab } from '@/types'

export const useToolsStore = defineStore('tools', () => {
  const activeCategory = ref<string>('all')
  const activeFilter = ref<FilterTab>('all')

  function setCategory(key: string) {
    activeCategory.value = key
  }
  function setFilter(tab: FilterTab) {
    activeFilter.value = tab
  }

  return { activeCategory, activeFilter, setCategory, setFilter }
})
