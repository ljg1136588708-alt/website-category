<template>
  <div class="badge-group">
    <span
      v-for="badge in badges"
      :key="badge"
      :class="['badge', `badge-${badge === 'freepaid' || badge === 'paid' ? 'free' : badge}`]"
    >
      <template v-if="badge === 'pc'">🖥 {{ $t('badges.pc') }}</template>
      <template v-else-if="badge === 'app'">📱 {{ $t('badges.app') }}</template>
      <template v-else-if="badge === 'free'">{{ $t('badges.free') }}</template>
      <template v-else-if="badge === 'freepaid'">{{ $t('badges.freepaid') }}</template>
      <template v-else-if="badge === 'paid'">{{ $t('badges.paid') }}</template>
      <template v-else-if="badge === 'cn'">{{ $t('badges.cn') }}</template>
    </span>
  </div>
</template>

<script setup lang="ts">
import type { BadgeKey } from '@/types'
defineProps<{ badges: BadgeKey[] }>()
</script>

<style scoped>
.badge-group {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
}
</style>
