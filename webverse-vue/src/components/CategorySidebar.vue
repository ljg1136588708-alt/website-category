<template>
  <aside class="sidebar">
    <div class="sidebar-title">{{ title || $t('categories.title') }}</div>
    <ul class="cat-list">
      <li v-for="cat in categories" :key="cat.key" class="cat-item">
        <a
          href="#"
          :class="{ active: modelValue === cat.key }"
          @click.prevent="emit('update:modelValue', cat.key)"
        >
          <span class="cat-icon">{{ cat.icon }}</span>
          {{ $t(`categories.${cat.key}`) }}
          <span class="cat-count">{{ cat.count }}</span>
        </a>
      </li>
    </ul>
  </aside>
</template>

<script setup lang="ts">
import type { Category } from '@/types'

defineOptions({ name: 'CategorySidebar' })

defineProps<{
  categories: Category[]
  modelValue: string
  title?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [key: string]
}>()
</script>

<style scoped>
.sidebar {
  position: sticky;
  top: 80px;
  height: fit-content;
}
</style>
