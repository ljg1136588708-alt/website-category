<template>
  <!-- Hero -->
  <section class="page-hero">
    <div class="hero-inner">
      <div>
        <div class="hero-badge">{{ $t('favorites.badge') }}</div>
        <h1>{{ $t('favorites.title') }}</h1>
        <p>{{ $t('favorites.sub') }}</p>
      </div>
      <div v-if="favStore.total > 0" class="hero-stats">
        <div class="h-stat">
          <div class="h-stat-num">{{ favStore.total }}</div>
          <div class="h-stat-lbl">{{ $t('favorites.savedCount') }}</div>
        </div>
        <div class="h-stat">
          <div class="h-stat-num">{{ favStore.categories.length }}</div>
          <div class="h-stat-lbl">{{ $t('favorites.categoriesLabel') }}</div>
        </div>
      </div>
    </div>
  </section>

  <div class="main">
    <!-- Collections sidebar -->
    <aside class="col-sidebar">
      <div class="sidebar-title">{{ $t('favorites.collectionTitle') }}</div>
      <ul class="cat-list">
        <li class="cat-item">
          <a href="#" :class="{ active: activeCol === 'all' }" @click.prevent="activeCol = 'all'">
            <span class="cat-icon">⭐</span>{{ $t('favorites.allSaved') }}
            <span class="cat-count">{{ favStore.total }}</span>
          </a>
        </li>
        <li v-for="cat in favStore.categories" :key="cat" class="cat-item">
          <a href="#" :class="{ active: activeCol === cat }" @click.prevent="activeCol = cat">
            <span class="cat-icon">📁</span>{{ $t(`categories.${cat}`) }}
            <span class="cat-count">{{ catCount(cat) }}</span>
          </a>
        </li>
      </ul>
      <button class="new-col-btn">{{ $t('favorites.newCollection') }}</button>
    </aside>

    <div class="content">
      <div class="content-header">
        <div class="section-head">
          <h2>⭐ {{ activeColLabel }}</h2>
          <span class="section-tag">{{ $t('favorites.toolCount', { n: sortedItems.length }) }}</span>
        </div>
        <a-select v-model:value="sortBy" :options="sortOptions" class="sort-select" />
      </div>

      <!-- Empty state -->
      <div v-if="favStore.total === 0" class="empty-wrap">
        <a-empty description="">
          <template #description>
            <div class="empty-title">{{ $t('favorites.emptyTitle') }}</div>
            <div class="empty-desc">{{ $t('favorites.emptyDesc') }}</div>
          </template>
          <RouterLink to="/" class="empty-cta">
            {{ $t('favorites.emptyCta') }}
          </RouterLink>
        </a-empty>
      </div>

      <!-- Cards -->
      <div v-else class="cards-grid">
        <div v-for="item in sortedItems" :key="item.id" class="fav-card">
          <div class="card-header">
            <div class="card-logo">
              <ToolLogo :tool-id="item.id" :icon="item.icon" />
            </div>
            <div class="card-meta">
              <div class="card-name">{{ toolName(item) }}</div>
              <div class="card-url">{{ item.url }}</div>
            </div>
            <a-tooltip :title="$t('favorites.removeTip')" placement="top">
              <button class="card-remove" @click="favStore.remove(item.id)">✕</button>
            </a-tooltip>
          </div>
          <BadgeGroup :badges="item.badges" class="card-badges" />
          <div class="card-desc">{{ toolDesc(item) }}</div>
          <div class="card-footer">
            <span class="card-cat">{{ $t(`categories.${item.category}`) }}</span>
            <span class="card-date">{{ $t('favorites.savedAt', { date: formatDate(item.savedAt) }) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { toolLocalizedDesc, toolLocalizedName } from '@/utils/toolLocaleText'
import BadgeGroup from '@/components/BadgeGroup.vue'
import ToolLogo from '@/components/ToolLogo.vue'
import { useFavoritesStore } from '@/stores/favorites'
import type { FavoriteItem } from '@/types'

const { t, te, locale } = useI18n()

function toolName(item: FavoriteItem) {
  void locale.value
  return toolLocalizedName(item, t, te)
}

function toolDesc(item: FavoriteItem) {
  void locale.value
  return toolLocalizedDesc(item, t, te)
}
const favStore = useFavoritesStore()
const activeCol = ref('all')
const sortBy = ref<'newest' | 'oldest' | 'name'>('newest')

const sortOptions = computed(() => [
  { value: 'newest', label: t('favorites.sortNewest') },
  { value: 'oldest', label: t('favorites.sortOldest') },
  { value: 'name',   label: t('favorites.sortName')   },
])

const activeColLabel = computed(() =>
  activeCol.value === 'all' ? t('favorites.allSaved') : t(`categories.${activeCol.value}`),
)

const filteredItems = computed<FavoriteItem[]>(() =>
  activeCol.value === 'all'
    ? favStore.items
    : favStore.items.filter((i) => i.category === activeCol.value),
)

const sortedItems = computed(() => {
  const list = [...filteredItems.value]
  if (sortBy.value === 'oldest') return list.reverse()
  if (sortBy.value === 'name')   return list.sort((a, b) => a.name.localeCompare(b.name))
  return list
})

function catCount(cat: string) {
  return favStore.items.filter((i) => i.category === cat).length
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}
</script>

<style scoped>
.page-hero { position: relative; z-index: 1; padding: 48px 32px 36px; }
.hero-inner { max-width: 1400px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; gap: 24px; flex-wrap: wrap; }
.hero-badge {
  display: inline-flex; align-items: center; gap: 6px;
  background: rgba(139,92,246,0.1); border: 1px solid rgba(139,92,246,0.3);
  border-radius: 100px; padding: 5px 14px; font-size: 12px; color: var(--accent1); margin-bottom: 14px; font-weight: 500;
}
h1 { font-size: clamp(24px,3vw,40px); font-weight: 800; letter-spacing: -1px; margin-bottom: 8px; }
p { color: var(--muted); font-size: 14px; line-height: 1.6; }
.hero-stats { display: flex; gap: 24px; }
.h-stat { text-align: center; }
.h-stat-num { font-size: 24px; font-weight: 800; letter-spacing: -1px; background: var(--gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.h-stat-lbl { font-size: 11px; color: var(--muted); margin-top: 2px; }

.main {
  position: relative; z-index: 1; max-width: 1400px; margin: 0 auto;
  padding: 0 32px 80px; display: grid; grid-template-columns: 220px 1fr; gap: 32px;
}

/* Collections sidebar */
.col-sidebar { position: sticky; top: 80px; height: fit-content; }
.new-col-btn {
  width: 100%; padding: 9px 12px; border-radius: 10px;
  background: rgba(139,92,246,0.08); border: 1px dashed rgba(139,92,246,0.25);
  color: var(--accent1); font-size: 13px; font-weight: 500; cursor: pointer;
  font-family: inherit; transition: all 0.2s; text-align: left; margin-top: 8px;
}
.new-col-btn:hover { background: rgba(139,92,246,0.15); border-color: rgba(139,92,246,0.4); }

/* Content */
.content-header { display: flex; align-items: center; gap: 10px; margin-bottom: 24px; flex-wrap: wrap; }
.sort-select { margin-left: auto; min-width: 120px; }

/* Empty */
.empty-wrap { padding: 60px 0; }
.empty-title { font-size: 18px; font-weight: 700; color: var(--text); margin-bottom: 8px; }
.empty-desc { font-size: 14px; color: var(--muted); max-width: 360px; line-height: 1.7; margin-bottom: 20px; }
.empty-cta {
  display: inline-flex; align-items: center; gap: 8px;
  background: var(--gradient); color: white; padding: 10px 22px;
  border-radius: 10px; text-decoration: none; font-size: 14px; font-weight: 600; transition: opacity 0.2s;
}
.empty-cta:hover { opacity: 0.85; }

/* Cards */
.cards-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
.fav-card {
  background: var(--card); border: 1px solid var(--border); border-radius: 16px; padding: 20px;
  cursor: pointer; transition: all 0.25s; position: relative; overflow: hidden;
}
.fav-card:hover { border-color: var(--border-hover); transform: translateY(-2px); box-shadow: var(--glow); }
.card-header { display: flex; align-items: flex-start; gap: 14px; margin-bottom: 10px; }
.card-logo { width: 44px; height: 44px; border-radius: 11px; display: flex; align-items: center; justify-content: center; font-size: 22px; flex-shrink: 0; background: rgba(255,255,255,0.05); border: 1px solid var(--border); overflow: hidden; }
.card-logo :deep(.tool-logo) { width: 44px; height: 44px; }
.card-meta { flex: 1; min-width: 0; }
.card-name { font-size: 15px; font-weight: 700; margin-bottom: 3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.card-url { font-size: 11px; color: var(--muted); }
.card-remove {
  width: 28px; height: 28px; border-radius: 8px; background: rgba(239,68,68,0.08);
  border: 1px solid rgba(239,68,68,0.2); color: #ef4444; font-size: 13px;
  display: flex; align-items: center; justify-content: center; cursor: pointer;
  transition: all 0.2s; opacity: 0; flex-shrink: 0;
}
.fav-card:hover .card-remove { opacity: 1; }
.card-remove:hover { background: rgba(239,68,68,0.2); }
.card-badges { margin-bottom: 10px; }
.card-desc { font-size: 13px; color: var(--muted); line-height: 1.6; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.card-footer { margin-top: 12px; padding-top: 10px; border-top: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
.card-cat { font-size: 11px; color: var(--muted); }
.card-date { font-size: 11px; color: var(--muted); }

@media (max-width: 768px) {
  .main { grid-template-columns: 1fr; }
  .col-sidebar { display: none; }
}
</style>
