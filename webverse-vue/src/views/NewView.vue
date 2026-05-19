<template>
  <!-- Hero -->
  <section class="page-hero">
    <div class="hero-badge">{{ $t('newPage.badge') }}</div>
    <h1>{{ $t('newPage.title1') }}<span class="green-text">{{ $t('newPage.title2') }}</span></h1>
    <p>{{ $t('newPage.sub') }}</p>
    <div class="filter-chips">
      <button
        v-for="chip in chips"
        :key="chip.key"
        class="filter-chip"
        :class="{ active: activeChip === chip.key }"
        @click="activeChip = chip.key"
      >{{ chip.label }}</button>
    </div>
  </section>

  <div class="main" v-if="!loading">
    <div class="content">
      <!-- Featured -->
      <div v-if="featured" class="featured-card" @click="router.push(`/tool/${featured.id}`)">
        <div class="featured-glow" />
        <div class="featured-logo">
          <ToolLogo :tool-id="featured.id" :icon="featured.icon" />
        </div>
        <div class="featured-body">
          <div class="featured-eyebrow">
            <span class="featured-eyebrow-label">{{ $t('newPage.todayPick') }}</span>
            <span class="badge badge-new">✦ {{ $t('common.new') }}</span>
          </div>
          <div class="featured-title">{{ featuredDisplayName }}</div>
          <div class="featured-url">{{ featured.url }}</div>
          <div class="featured-desc">{{ featuredFullDesc }}</div>
          <BadgeGroup :badges="featured.badges" class="featured-badges" />
          <span class="featured-cta">{{ $t('newPage.viewDetail') }}</span>
        </div>
      </div>

      <!-- Timeline groups -->
      <div v-for="group in visibleGroups" :key="group.period" class="timeline-section">
        <div class="timeline-header">
          <div class="timeline-dot" :class="`dot-${group.period}`" />
          <span class="timeline-title">{{ periodLabel[group.period] }}</span>
          <span class="section-tag">{{ $t('newPage.toolCount', { n: group.tools.length }) }}</span>
          <span class="timeline-date">{{ group.dateLabel }}</span>
        </div>
        <div class="cards-grid">
          <div v-for="tool in group.tools" :key="tool.id" class="new-card" @click="router.push(`/tool/${tool.id}`)">
            <div class="card-header">
              <div class="card-logo">
                <ToolLogo :tool-id="tool.id" :icon="tool.icon" />
              </div>
              <div class="card-meta">
                <div class="card-name">{{ newToolName(tool) }}</div>
                <div class="card-url">{{ tool.url }}</div>
              </div>
              <span class="card-new-badge">{{ $t('common.new') }}</span>
            </div>
            <BadgeGroup :badges="tool.badges" class="card-badges" />
            <div class="card-desc">{{ newToolDesc(tool) }}</div>
            <div class="card-footer">
              <span class="card-cat">{{ $t(`categories.${tool.category}`) }}</span>
              <span class="card-date">{{ tool.dateLabel }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="loading-wrap"><a-spin size="large" /></div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import BadgeGroup from '@/components/BadgeGroup.vue'
import ToolLogo from '@/components/ToolLogo.vue'
import { toolsApi } from '@/api'
import type { BentoTool, NewGroup, NewTool } from '@/types'
import { toolLocalizedDesc, toolLocalizedFullDesc, toolLocalizedName } from '@/utils/toolLocaleText'

const { t, te, locale } = useI18n()
const router = useRouter()

const loading = ref(true)
const activeChip = ref('all')
const featured = ref<BentoTool | null>(null)
const groups = ref<NewGroup[]>([])

const featuredDisplayName = computed(() => {
  const f = featured.value
  if (!f) return ''
  void locale.value
  return toolLocalizedName(f, t, te)
})

const featuredFullDesc = computed(() => {
  const f = featured.value
  if (!f) return ''
  void locale.value
  return toolLocalizedFullDesc(f, t, te)
})

function newToolName(tool: NewTool) {
  void locale.value
  return toolLocalizedName(tool, t, te)
}

function newToolDesc(tool: NewTool) {
  void locale.value
  return toolLocalizedDesc(tool, t, te)
}

const chips = computed(() => [
  { key: 'all',    label: t('newPage.chipAll')    },
  { key: 'ai',     label: t('newPage.chipAi')     },
  { key: 'design', label: t('newPage.chipDesign') },
  { key: 'dev',    label: t('newPage.chipDev')    },
  { key: 'app',    label: t('newPage.chipApp')    },
])

const periodLabel = computed<Record<string, string>>(() => ({
  today: t('newPage.periodToday'),
  week:  t('newPage.periodWeek'),
  month: t('newPage.periodMonth'),
}))

const visibleGroups = computed(() => {
  return groups.value.map((g) => ({
    ...g,
    tools: activeChip.value === 'all'
      ? g.tools
      : g.tools.filter((tool) => {
          if (activeChip.value === 'app') return tool.badges.includes('app')
          return tool.category === activeChip.value
        }),
  })).filter((g) => g.tools.length > 0)
})

async function loadData() {
  try {
    const res = await toolsApi.getNewTools()
    featured.value = res.featured
    groups.value = res.groups
  } finally {
    loading.value = false
  }
}

onMounted(loadData)
</script>

<style scoped>
.page-hero { position: relative; z-index: 1; text-align: center; padding: 64px 32px 48px; }
.hero-badge {
  display: inline-flex; align-items: center; gap: 6px;
  background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.3);
  border-radius: 100px; padding: 5px 14px; font-size: 12px; color: #10b981;
  margin-bottom: 20px; font-weight: 500;
}
h1 { font-size: clamp(28px,4vw,52px); font-weight: 800; letter-spacing: -1.5px; margin-bottom: 12px; }
.green-text { background: linear-gradient(135deg,#10b981,#06b6d4); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.page-hero p { color: var(--muted); font-size: 15px; max-width: 480px; margin: 0 auto 28px; line-height: 1.6; }
.filter-chips { display: flex; justify-content: center; gap: 8px; flex-wrap: wrap; }
.filter-chip {
  padding: 7px 16px; border-radius: 100px; font-size: 13px; cursor: pointer;
  border: 1px solid var(--border); background: var(--card); color: var(--muted); font-family: inherit; transition: all 0.2s;
}
.filter-chip.active { background: rgba(16,185,129,0.12); border-color: rgba(16,185,129,0.4); color: #10b981; }
.filter-chip:hover:not(.active) { color: var(--text); background: rgba(255,255,255,0.04); }

.main {
  position: relative; z-index: 1; max-width: 1100px; margin: 0 auto;
  padding: 48px 32px 80px;
}
.loading-wrap { display: flex; justify-content: center; padding: 80px; }

/* Featured */
.featured-card {
  position: relative; overflow: hidden;
  background: linear-gradient(135deg,rgba(16,185,129,0.08),rgba(6,182,212,0.05));
  border: 1px solid rgba(16,185,129,0.2); border-radius: 20px; padding: 32px;
  display: flex; gap: 28px; align-items: center; margin-bottom: 40px; cursor: pointer; transition: all 0.25s;
}
.featured-card:hover { border-color: rgba(16,185,129,0.4); transform: translateY(-2px); box-shadow: 0 0 40px rgba(16,185,129,0.1); }
.featured-logo {
  font-size: 64px; flex-shrink: 0; width: 96px; height: 96px;
  background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 20px;
  display: flex; align-items: center; justify-content: center; overflow: hidden;
}
.featured-logo :deep(.tool-logo) { width: 96px; height: 96px; }
.featured-body { flex: 1; min-width: 0; }
.featured-eyebrow { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
.featured-eyebrow-label { font-size: 11px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: #10b981; }
.featured-title { font-size: 28px; font-weight: 800; letter-spacing: -0.8px; margin-bottom: 8px; }
.featured-url { font-size: 13px; color: var(--muted); margin-bottom: 12px; }
.featured-desc { font-size: 14px; color: var(--muted); line-height: 1.7; margin-bottom: 16px; max-width: 560px; }
.featured-badges { margin-bottom: 16px; }
.featured-cta {
  display: inline-flex; align-items: center; gap: 6px;
  background: rgba(16,185,129,0.15); border: 1px solid rgba(16,185,129,0.3);
  color: #10b981; padding: 8px 18px; border-radius: 10px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s;
}
.featured-cta:hover { background: rgba(16,185,129,0.25); }
.featured-glow {
  position: absolute; width: 300px; height: 300px; background: #10b981;
  border-radius: 50%; filter: blur(80px); opacity: 0.06; top: -80px; right: -80px; pointer-events: none;
}

/* Timeline */
.timeline-section { margin-bottom: 40px; }
.timeline-header {
  display: flex; align-items: center; gap: 12px; margin-bottom: 20px;
  padding-bottom: 14px; border-bottom: 1px solid var(--border);
}
.timeline-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
.dot-today { background: var(--gradient); box-shadow: 0 0 8px rgba(139,92,246,0.5); }
.dot-week  { background: var(--accent2); box-shadow: 0 0 8px rgba(6,182,212,0.5); }
.dot-month { background: var(--accent3); box-shadow: 0 0 8px rgba(245,158,11,0.5); }
.timeline-title { font-size: 15px; font-weight: 700; letter-spacing: -0.3px; }
.timeline-date { font-size: 12px; color: var(--muted); margin-left: auto; }

/* Cards */
.cards-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
.new-card {
  background: var(--card); border: 1px solid var(--border); border-radius: 16px; padding: 20px;
  cursor: pointer; transition: all 0.25s; position: relative; overflow: hidden;
}
.new-card:hover { border-color: var(--border-hover); transform: translateY(-2px); box-shadow: var(--glow); }
.card-header { display: flex; align-items: flex-start; gap: 14px; margin-bottom: 10px; position: relative; }
.card-logo { width: 44px; height: 44px; border-radius: 11px; display: flex; align-items: center; justify-content: center; font-size: 22px; flex-shrink: 0; background: rgba(255,255,255,0.05); border: 1px solid var(--border); }
.card-meta { flex: 1; min-width: 0; }
.card-name { font-size: 15px; font-weight: 700; margin-bottom: 3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.card-url { font-size: 11px; color: var(--muted); }
.card-new-badge { position: absolute; top: 0; right: 0; font-size: 10px; font-weight: 800; background: rgba(16,185,129,0.15); color: #10b981; border: 1px solid rgba(16,185,129,0.3); padding: 2px 8px; border-radius: 6px; letter-spacing: 0.5px; }
.card-badges { margin-bottom: 10px; position: relative; }
.card-desc { font-size: 13px; color: var(--muted); line-height: 1.6; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; position: relative; }
.card-footer { margin-top: 12px; padding-top: 10px; border-top: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
.card-cat { font-size: 11px; color: var(--muted); }
.card-date { font-size: 11px; color: var(--muted); }

@media (max-width: 768px) {
  .featured-card { flex-direction: column; }
  .featured-logo { width: 72px; height: 72px; font-size: 44px; }
}
</style>
