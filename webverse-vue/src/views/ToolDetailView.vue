<template>
  <div v-if="tool" class="detail-page">
    <!-- Breadcrumb -->
    <div class="breadcrumb">
      <RouterLink to="/" class="bread-link">{{ $t('nav.discover') }}</RouterLink>
      <span class="bread-sep">›</span>
      <span class="bread-cur">{{ displayName }}</span>
    </div>

    <!-- Hero -->
    <div class="hero-card">
      <div class="hero-left">
        <div class="tool-icon">
          <ToolLogo :tool-id="tool.id" :icon="tool.icon" />
        </div>
        <div class="tool-meta">
          <h1 class="tool-name">{{ displayName }}</h1>
          <a :href="fullUrl" target="_blank" rel="noopener noreferrer" class="tool-url">
            {{ tool.url }} ↗
          </a>
          <BadgeGroup :badges="tool.badges" class="tool-badges" />
        </div>
      </div>
      <a :href="fullUrl" target="_blank" rel="noopener noreferrer" class="visit-btn">
        {{ $t('detail.visitSite') }} →
      </a>
    </div>

    <!-- Content -->
    <div class="detail-body">
      <!-- Description -->
      <section class="detail-section">
        <h2 class="section-title">{{ $t('detail.about') }}</h2>
        <p class="full-desc">{{ displayFullDesc }}</p>
      </section>

      <!-- Key Info -->
      <section class="detail-section">
        <h2 class="section-title">{{ $t('detail.keyInfo') }}</h2>
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">{{ $t('detail.category') }}</span>
            <span class="info-val">{{ categoryLabel }}</span>
          </div>
          <div v-if="tool.subcategory" class="info-item">
            <span class="info-label">{{ $t('detail.subcategory') }}</span>
            <span class="info-val">{{ subcategoryLabel }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">{{ $t('detail.platform') }}</span>
            <span class="info-val">{{ platformLabel }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">{{ $t('detail.pricing') }}</span>
            <span class="info-val">{{ pricingLabel }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">{{ $t('detail.website') }}</span>
            <a :href="fullUrl" target="_blank" rel="noopener noreferrer" class="info-link">
              {{ tool.url }}
            </a>
          </div>
        </div>
      </section>

      <!-- CTA -->
      <div class="cta-block">
        <a :href="fullUrl" target="_blank" rel="noopener noreferrer" class="cta-btn">
          {{ $t('detail.goToSite') }} {{ displayName }} →
        </a>
        <RouterLink to="/" class="back-btn">← {{ $t('detail.backToList') }}</RouterLink>
      </div>
    </div>
  </div>

  <!-- 404 -->
  <div v-else class="not-found">
    <div class="nf-icon">🔍</div>
    <h2>{{ $t('detail.notFound') }}</h2>
    <RouterLink to="/" class="back-btn">← {{ $t('detail.backToList') }}</RouterLink>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import BadgeGroup from '@/components/BadgeGroup.vue'
import ToolLogo from '@/components/ToolLogo.vue'
import { getToolById } from '@/data/toolsMap'
import { toolLocalizedName, toolLocalizedDesc, toolLocalizedFullDesc } from '@/utils/toolLocaleText'

const route = useRoute()
const { t, te, locale } = useI18n()

const tool = computed(() => getToolById(route.params.id as string))

const displayName = computed(() => {
  void locale.value
  return tool.value ? toolLocalizedName(tool.value, t, te) : ''
})

const displayFullDesc = computed(() => {
  void locale.value
  if (!tool.value) return ''
  const full = (tool.value as any).fullDesc ?? tool.value.desc
  return toolLocalizedFullDesc({ id: tool.value.id, fullDesc: full }, t, te)
})

const fullUrl = computed(() =>
  tool.value?.url.startsWith('http') ? tool.value.url : `https://${tool.value?.url}`
)

const categoryLabel = computed(() => {
  if (!tool.value) return ''
  return t(`categories.${tool.value.category}`)
})

const subcategoryLabel = computed(() => {
  if (!tool.value?.subcategory) return ''
  const key = `subcategories.${tool.value.category}.${tool.value.subcategory}`
  return te(key) ? t(key) : tool.value.subcategory
})

const platformLabel = computed(() => {
  if (!tool.value) return ''
  const platforms = tool.value.badges.filter(b => b === 'pc' || b === 'app')
  return platforms.map(p => t(`badges.${p}`)).join(' / ') || 'PC'
})

const pricingLabel = computed(() => {
  if (!tool.value) return ''
  const pricing = tool.value.badges.find(b => ['free', 'freepaid', 'paid'].includes(b))
  return pricing ? t(`badges.${pricing}`) : '-'
})
</script>

<style scoped>
.detail-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 32px 24px 80px;
  position: relative;
  z-index: 1;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--muted);
  margin-bottom: 28px;
}
.bread-link { color: var(--accent1); text-decoration: none; }
.bread-link:hover { opacity: 0.8; }
.bread-sep { opacity: 0.4; }
.bread-cur { color: var(--muted); }

.hero-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 28px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.hero-left { display: flex; align-items: flex-start; gap: 18px; }

.tool-icon {
  width: 64px; height: 64px;
  border-radius: 16px;
  background: rgba(255,255,255,0.05);
  border: 1px solid var(--border);
  display: flex; align-items: center; justify-content: center;
  font-size: 32px;
  flex-shrink: 0;
}

.tool-meta { display: flex; flex-direction: column; gap: 6px; }
.tool-name { font-size: 24px; font-weight: 800; letter-spacing: -0.5px; color: var(--text); margin: 0; }
.tool-url {
  font-size: 13px; color: var(--accent1); text-decoration: none;
  transition: opacity 0.2s;
}
.tool-url:hover { opacity: 0.7; }
.tool-badges { margin-top: 4px; }

.visit-btn {
  display: inline-flex;
  align-items: center;
  padding: 10px 22px;
  background: var(--gradient);
  border-radius: 10px;
  color: #fff;
  font-weight: 700;
  font-size: 14px;
  text-decoration: none;
  transition: opacity 0.2s, transform 0.2s;
  white-space: nowrap;
  flex-shrink: 0;
}
.visit-btn:hover { opacity: 0.88; transform: translateY(-1px); }

.detail-body { display: flex; flex-direction: column; gap: 24px; }

.detail-section {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 24px;
}

.section-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--text);
  margin: 0 0 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border);
}

.full-desc {
  font-size: 15px;
  color: rgba(240,240,255,0.75);
  line-height: 1.85;
  margin: 0;
}

.info-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-item {
  display: flex;
  align-items: baseline;
  gap: 12px;
}

.info-label {
  font-size: 13px;
  color: var(--muted);
  min-width: 80px;
  flex-shrink: 0;
}

.info-val {
  font-size: 14px;
  color: var(--text);
  font-weight: 500;
}

.info-link {
  font-size: 14px;
  color: var(--accent1);
  text-decoration: none;
  font-weight: 500;
}
.info-link:hover { opacity: 0.8; }

.cta-block {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  padding: 8px 0;
}

.cta-btn {
  display: inline-flex;
  align-items: center;
  padding: 12px 28px;
  background: var(--gradient);
  border-radius: 12px;
  color: #fff;
  font-weight: 700;
  font-size: 15px;
  text-decoration: none;
  transition: opacity 0.2s, transform 0.2s;
}
.cta-btn:hover { opacity: 0.88; transform: translateY(-1px); }

.back-btn {
  font-size: 14px;
  color: var(--muted);
  text-decoration: none;
  transition: color 0.2s;
}
.back-btn:hover { color: var(--text); }

.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  gap: 16px;
  text-align: center;
}
.nf-icon { font-size: 48px; }
.not-found h2 { font-size: 20px; color: var(--muted); }

@media (max-width: 600px) {
  .hero-card { flex-direction: column; }
  .visit-btn { width: 100%; justify-content: center; }
  .cta-btn { width: 100%; justify-content: center; }
}
</style>
