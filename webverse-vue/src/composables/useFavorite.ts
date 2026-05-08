import { computed } from 'vue'
import { message } from 'ant-design-vue'
import { useI18n } from 'vue-i18n'
import { useFavoritesStore } from '@/stores/favorites'
import type { Tool } from '@/types'

export function useFavorite(tool: Tool) {
  const store = useFavoritesStore()
  const { t } = useI18n()

  const saved = computed(() => store.isSaved(tool.id))

  function toggle() {
    const added = store.toggle(tool)
    if (added) {
      message.success(t('common.favAdded', { name: tool.name }))
    } else {
      message.info(t('common.favRemoved', { name: tool.name }))
    }
  }

  return { saved, toggle }
}
