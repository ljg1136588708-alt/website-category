<template>
  <div class="card" @click="goDetail">
    <div class="card-header">
      <div class="card-logo">
        <ToolLogo :tool-id="tool.id" :icon="tool.icon" />
      </div>
      <div class="card-meta">
        <div class="card-name">{{ displayName }}</div>
        <div class="card-url">{{ tool.url }}</div>
      </div>
      <a class="visit-icon" :href="fullUrl" target="_blank" rel="noopener noreferrer" @click.stop title="Visit Site">↗</a>
    </div>

    <BadgeGroup :badges="tool.badges" class="card-badges" />

    <div class="card-desc">{{ displayDesc }}</div>

    <div v-if="tool.relatedPlatform" class="related-note">
      <template v-if="tool.relatedPlatform === 'app'">
        📱 {{ $t('common.hasApp') }} →
      </template>
      <template v-else>
        🖥 {{ $t('common.hasPc') }} →
      </template>
      <a class="related-link" :href="fullUrl" target="_blank" rel="noopener noreferrer" @click.stop>
        {{ tool.relatedPlatform === 'app' ? $t('common.viewApp') : $t('common.viewPc') }} ↗
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import BadgeGroup from './BadgeGroup.vue'
import ToolLogo from './ToolLogo.vue'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import type { Tool } from '@/types'
import { toolLocalizedDesc, toolLocalizedName } from '@/utils/toolLocaleText'

const props = defineProps<{ tool: Tool }>()

const { t, te, locale } = useI18n()
const router = useRouter()

const displayName = computed(() => {
  void locale.value
  return toolLocalizedName(props.tool, t, te)
})

const displayDesc = computed(() => {
  void locale.value
  return toolLocalizedDesc(props.tool, t, te)
})

const fullUrl = computed(() =>
  props.tool.url.startsWith('http') ? props.tool.url : `https://${props.tool.url}`
)

function goDetail() {
  router.push(`/tool/${props.tool.id}`)
}
</script>

<style scoped>
.card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.25s;
  position: relative;
  overflow: hidden;
}
.card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--gradient);
  opacity: 0;
  transition: opacity 0.25s;
  pointer-events: none;
}
.card:hover { border-color: var(--border-hover); transform: translateY(-2px); box-shadow: var(--glow); }
.card:hover::before { opacity: 0.03; }

.card-header { display: flex; align-items: flex-start; gap: 14px; margin-bottom: 12px; position: relative; }
.card-logo {
  width: 44px; height: 44px; border-radius: 11px;
  display: flex; align-items: center; justify-content: center;
  font-size: 22px; flex-shrink: 0;
  background: rgba(255,255,255,0.05); border: 1px solid var(--border);
  overflow: hidden;
}
.card-logo :deep(.tool-logo) { width: 44px; height: 44px; }
.card-meta { flex: 1; min-width: 0; }
.card-name { font-size: 15px; font-weight: 700; margin-bottom: 3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.card-url { font-size: 11px; color: var(--muted); }

.visit-icon {
  font-size: 13px;
  color: var(--muted);
  text-decoration: none;
  padding: 4px 6px;
  border-radius: 6px;
  border: 1px solid var(--border);
  transition: all 0.2s;
  flex-shrink: 0;
  line-height: 1;
}
.visit-icon:hover { color: var(--accent1); border-color: var(--accent1); }

.card-badges { margin-bottom: 10px; position: relative; }

.card-desc {
  font-size: 13px; color: var(--muted); line-height: 1.6;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
  position: relative;
}

.related-note {
  margin-top: 14px; padding-top: 12px; border-top: 1px solid var(--border);
  display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--muted);
  position: relative;
}
.related-link {
  color: var(--accent1); text-decoration: none; font-weight: 600;
  display: flex; align-items: center; gap: 3px; transition: opacity 0.2s;
}
.related-link:hover { opacity: 0.7; }

</style>
