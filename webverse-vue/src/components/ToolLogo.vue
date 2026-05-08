<template>
  <div class="tool-logo">
    <svg
      v-if="resolved?.kind === 'simple'"
      class="tool-logo-svg"
      viewBox="0 0 24 24"
      preserveAspectRatio="xMidYMid meet"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path :fill="simplePathFill(resolved.icon.hex)" :d="resolved.icon.path" />
    </svg>
    <svg
      v-else-if="resolved?.kind === 'iconify'"
      class="tool-logo-svg"
      :class="{ 'tool-logo-iconify-light': iconifyNeedsLightSurface }"
      :viewBox="resolved.viewBox"
      preserveAspectRatio="xMidYMid meet"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <g class="tool-logo-g" v-html="resolved.body" />
    </svg>
    <span v-else class="tool-logo-emoji" aria-hidden="true">{{ emojiFallback }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { resolveBrandLogo } from '@/data/brandIcons/registry'

const props = defineProps<{
  toolId: string
  icon: string
}>()

const resolved = computed(() => resolveBrandLogo(props.toolId))

const emojiFallback = computed(() => {
  const t = props.icon?.trim()
  return t || '·'
})

/** Iconify paths with near-background fills (e.g. Midjourney #1a222d). */
const iconifyNeedsLightSurface = computed(
  () => props.toolId === 'midjourney',
)

function simplePathFill(hex: string): string {
  const bare = hex.replace(/^#/, '')
  const n = parseInt(bare, 16)
  if (!Number.isFinite(n) || bare.length < 3) return '#e2e8f0'
  const r = (n >> 16) & 255
  const g = (n >> 8) & 255
  const b = n & 255
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  if (lum < 0.22) return '#e2e8f0'
  return '#' + bare
}
</script>

<style scoped>
.tool-logo {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  overflow: hidden;
  color: rgba(255, 255, 255, 0.92);
}
.tool-logo-svg {
  box-sizing: border-box;
  width: 88%;
  height: 88%;
  max-width: 100%;
  max-height: 100%;
  display: block;
}
.tool-logo-svg :deep(path:not([fill])),
.tool-logo-svg :deep(circle:not([fill])),
.tool-logo-svg :deep(rect:not([fill])),
.tool-logo-svg :deep(ellipse:not([fill])),
.tool-logo-svg :deep(polygon:not([fill])) {
  fill: currentColor;
}
.tool-logo-iconify-light {
  filter: brightness(0) invert(0.93);
}
.tool-logo-emoji {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-size: 1.35em;
  line-height: 1;
}
</style>
