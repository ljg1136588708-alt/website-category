<template>
  <!-- Hero -->
  <section class="hero">
    <div class="hero-badge">{{ $t('home.badge') }}</div>
    <h1>{{ $t('home.title1') }}<span class="gradient-text">{{ $t('home.title2') }}</span></h1>
    <p class="hero-sub">{{ $t('home.sub') }}</p>

    <!-- AI Search -->
    <div class="ai-search">
      <div class="ai-search-inner" :class="{ focused: searchFocused }">
        <div class="ai-icon">✦</div>
        <a-input
          v-model:value="searchQuery"
          :placeholder="$t('home.searchPlaceholder')"
          :bordered="false"
          @focus="searchFocused = true"
          @blur="searchFocused = false"
          @press-enter="triggerAI"
        />
        <button class="ai-send" @click="triggerAI">↑</button>
      </div>
    </div>

    <div class="ai-tips">
      <span v-for="tip in tips" :key="tip" class="tip-chip" @click="searchQuery = tip">
        {{ tip }}
      </span>
    </div>

    <!-- AI response panel -->
    <div v-if="aiPanelVisible" class="ai-panel">
      <div class="ai-panel-header">
        <span>✦</span> {{ $t('home.aiHeader') }}
        <div v-if="aiTyping" class="ai-thinking">
          <div class="dot" /><div class="dot" /><div class="dot" />
        </div>
        <div class="ai-panel-actions">
          <button v-if="aiTyping" class="ai-stop-btn" @click="stopAI">{{ $t('home.aiStop') }}</button>
          <button class="ai-close-btn" @click="aiPanelVisible = false">✕</button>
        </div>
      </div>
      <div v-if="aiError" class="ai-error">{{ aiError }}</div>
      <div v-else class="ai-result">{{ aiResult }}</div>
    </div>
  </section>

  <!-- Main -->
  <div class="main" v-if="!loading">
    <CategorySidebar
      :categories="CATEGORIES"
      v-model="toolsStore.activeCategory"
    />

    <div class="content">
      <!-- Featured Bento：仅全部分类时显示 -->
      <template v-if="toolsStore.activeCategory === 'all'">
        <div class="section-head">
          <h2>✦ {{ $t('home.featured') }}</h2>
        </div>
        <div class="cards-grid" style="margin-bottom: 40px;">
          <ToolCard v-for="item in bento" :key="item.id" :tool="item" />
        </div>
      </template>

      <!-- Filter bar -->
      <div ref="resultsRef" class="filter-bar">
        <div class="filter-tabs">
          <button
            v-for="tab in filterTabs"
            :key="tab.key"
            class="filter-tab"
            :class="{ active: toolsStore.activeFilter === tab.key }"
            @click="toolsStore.setFilter(tab.key as any)"
          >{{ tab.label }}</button>
        </div>
      </div>

      <!-- Subcategory chips -->
      <div v-if="subcategoryChips.length > 0" class="subcat-bar">
        <button
          class="subcat-chip"
          :class="{ active: activeSubcategory === 'all' }"
          @click="activeSubcategory = 'all'"
        >{{ $t('home.filterAll') }}</button>
        <button
          v-for="chip in subcategoryChips"
          :key="chip.key"
          class="subcat-chip"
          :class="{ active: activeSubcategory === chip.key }"
          @click="activeSubcategory = chip.key"
        >{{ chip.label }}</button>
      </div>

      <div class="section-head">
        <h2 v-if="toolsStore.activeCategory !== 'all'">{{ sectionTitle }}</h2>
        <span class="section-tag">{{ $t('home.toolCount', { n: filteredTools.length }) }}</span>
      </div>

      <div class="cards-grid">
        <ToolCard v-for="tool in filteredTools" :key="tool.id" :tool="tool" />
      </div>
    </div>
  </div>

  <div v-else class="loading-wrap">
    <a-spin size="large" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import CategorySidebar from '@/components/CategorySidebar.vue'
import ToolCard from '@/components/ToolCard.vue'
import { CATEGORIES } from '@/data/categories'
import { toolsApi } from '@/api'
import { useToolsStore } from '@/stores/tools'
import type { BentoTool, Tool } from '@/types'

const { t } = useI18n()
const toolsStore = useToolsStore()

const loading = ref(true)
const bento = ref<BentoTool[]>([])
const toolList = ref<Tool[]>([])
const resultsRef = ref<HTMLElement>()

const searchQuery = ref('')
const searchFocused = ref(false)
const aiPanelVisible = ref(false)
const aiTyping = ref(false)
const aiResult = ref('')
const aiError = ref('')
let abortController: AbortController | null = null

const tips = computed(() => [
  t('home.tip1'), t('home.tip2'), t('home.tip3'), t('home.tip4'), t('home.tip5'),
])

const filterTabs = computed(() => [
  { key: 'all',  label: t('home.filterAll')  },
  { key: 'pc',   label: t('home.filterPc')   },
  { key: 'app',  label: t('home.filterApp')  },
  { key: 'free', label: t('home.filterFree') },
])

const activeSubcategory = ref('all')

const subcategoryChips = computed(() => {
  const cat = toolsStore.activeCategory
  if (cat === 'all') return []
  const subcatMap = t(`subcategories.${cat}`) as unknown as Record<string, string>
  if (!subcatMap || typeof subcatMap !== 'object') return []
  const used = new Set(
    toolList.value.filter((tool) => tool.category === cat && tool.subcategory).map((tool) => tool.subcategory!)
  )
  return Object.entries(subcatMap).filter(([key]) => used.has(key)).map(([key, label]) => ({ key, label }))
})

const filteredTools = computed(() => {
  const bentoIds = new Set(bento.value.map((t) => t.id))
  let list = toolList.value

  if (toolsStore.activeCategory !== 'all') {
    list = list.filter((tool) => tool.category === toolsStore.activeCategory)
    if (activeSubcategory.value !== 'all') {
      list = list.filter((tool) => tool.subcategory === activeSubcategory.value)
    }
  } else {
    list = list.filter((tool) => !bentoIds.has(tool.id))
  }
  if (toolsStore.activeFilter === 'pc')   list = list.filter((t) => t.badges.includes('pc'))
  if (toolsStore.activeFilter === 'app')  list = list.filter((t) => t.badges.includes('app'))
  if (toolsStore.activeFilter === 'free') list = list.filter((t) => t.badges.includes('free') || t.badges.includes('freepaid'))

  return list
})

const sectionTitle = computed(() => {
  const cat = CATEGORIES.find((c) => c.key === toolsStore.activeCategory)
  return `${cat?.icon ?? ''} ${t('categories.' + toolsStore.activeCategory)}`
})

watch(() => toolsStore.activeCategory, async () => {
  activeSubcategory.value = 'all'
  await nextTick()
  resultsRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
})

async function loadData() {
  try {
    const res = await toolsApi.getHomeTools()
    bento.value = res.bento
    toolList.value = res.list
  } finally {
    loading.value = false
  }
}

async function triggerAI() {
  const query = searchQuery.value.trim()
  if (!query) return

  // 停止上一次请求
  abortController?.abort()
  abortController = new AbortController()

  aiPanelVisible.value = true
  aiTyping.value = true
  aiResult.value = ''
  aiError.value = ''

  const systemPrompt = `你是 WebVerse 的 AI 助手，WebVerse 是一个全球网站与工具导航平台。
平台收录了以下分类的优质工具：AI 工具、设计创作、开发者、效率办公、视频影音、资讯阅读、电商购物、游戏娱乐、教育学习、金融理财、社交媒体、安全隐私。
根据用户的需求，推荐合适的工具或网站，并简单说明推荐理由。回答简洁友好，不超过 150 字。用用户提问的语言回答。`

  try {
    const res = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_DEEPSEEK_API_KEY}`,
      },
      signal: abortController.signal,
      body: JSON.stringify({
        model: 'deepseek-chat',
        stream: true,
        max_tokens: 300,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: query },
        ],
      }),
    })

    if (!res.ok) throw new Error(`API error ${res.status}`)

    const reader = res.body!.getReader()
    const decoder = new TextDecoder()

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      const lines = decoder.decode(value).split('\n')
      for (const line of lines) {
        if (!line.startsWith('data: ')) continue
        const data = line.slice(6)
        if (data === '[DONE]') break
        try {
          const chunk = JSON.parse(data)
          const content = chunk.choices?.[0]?.delta?.content
          if (content) aiResult.value += content
        } catch {}
      }
    }
  } catch (err: any) {
    if (err.name !== 'AbortError') {
      aiError.value = t('home.aiError')
    }
  } finally {
    aiTyping.value = false
    abortController = null
  }
}

function stopAI() {
  abortController?.abort()
  aiTyping.value = false
}

onMounted(loadData)
</script>

<style scoped>
/* Hero */
.hero {
  position: relative; z-index: 1;
  text-align: center;
  padding: 80px 32px 60px;
}
.hero-badge {
  display: inline-flex; align-items: center; gap: 6px;
  background: rgba(139,92,246,0.1); border: 1px solid rgba(139,92,246,0.3);
  border-radius: 100px; padding: 5px 14px; font-size: 12px; color: var(--accent1);
  margin-bottom: 24px; font-weight: 500;
}
h1 {
  font-size: clamp(36px, 6vw, 72px); font-weight: 800; line-height: 1.1;
  letter-spacing: -2px; margin-bottom: 20px;
}
.hero-sub { color: var(--muted); font-size: 18px; max-width: 800px; margin: 0 auto 48px; line-height: 1.6; }

/* AI Search */
.ai-search { max-width: 680px; margin: 0 auto 20px; }
.ai-search-inner {
  background: var(--card); border: 1px solid var(--border); border-radius: 16px;
  padding: 16px 20px; display: flex; align-items: center; gap: 12px;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.ai-search-inner.focused { border-color: var(--accent1); box-shadow: 0 0 0 3px rgba(139,92,246,0.1); }
.ai-icon {
  width: 36px; height: 36px;
  background: linear-gradient(135deg, rgba(139,92,246,0.2), rgba(6,182,212,0.2));
  border: 1px solid rgba(139,92,246,0.3); border-radius: 10px;
  display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0;
}
.ai-send {
  background: var(--gradient); border: none; width: 36px; height: 36px; border-radius: 10px;
  color: white; cursor: pointer; display: flex; align-items: center; justify-content: center;
  font-size: 16px; flex-shrink: 0; transition: opacity 0.2s, transform 0.1s;
}
.ai-send:hover { opacity: 0.85; transform: scale(1.05); }

.ai-tips { display: flex; gap: 8px; justify-content: center; flex-wrap: wrap; }
.tip-chip {
  background: rgba(255,255,255,0.04); border: 1px solid var(--border); border-radius: 100px;
  padding: 5px 14px; font-size: 12px; color: var(--muted); cursor: pointer; transition: all 0.2s;
}
.tip-chip:hover { color: var(--text); border-color: rgba(255,255,255,0.15); }

/* AI Panel */
.ai-panel {
  max-width: 680px; margin: 20px auto 0;
  background: var(--card); border: 1px solid rgba(139,92,246,0.25); border-radius: 16px; padding: 20px;
}
.ai-panel-header {
  display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--accent1);
  font-weight: 600; margin-bottom: 12px;
}
.ai-panel-actions { margin-left: auto; display: flex; align-items: center; gap: 6px; }
.ai-stop-btn {
  font-size: 12px; padding: 3px 10px; border-radius: 6px;
  background: rgba(139,92,246,0.12); border: 1px solid rgba(139,92,246,0.3);
  color: var(--accent1); cursor: pointer; font-family: inherit; transition: all 0.2s;
}
.ai-stop-btn:hover { background: rgba(139,92,246,0.22); }
.ai-close-btn {
  width: 22px; height: 22px; border-radius: 6px;
  background: rgba(255,255,255,0.06); border: 1px solid var(--border);
  color: var(--muted); cursor: pointer; font-size: 12px;
  display: flex; align-items: center; justify-content: center; transition: all 0.2s;
}
.ai-close-btn:hover { color: var(--text); background: rgba(255,255,255,0.1); }
.ai-error { font-size: 13px; color: #ef4444; }
.ai-thinking { display: flex; gap: 4px; align-items: center; }
.dot {
  width: 6px; height: 6px; border-radius: 50%; background: var(--accent1);
  animation: bounce 1.2s infinite;
}
.dot:nth-child(2) { animation-delay: 0.2s; }
.dot:nth-child(3) { animation-delay: 0.4s; }
@keyframes bounce {
  0%,60%,100% { transform: translateY(0); opacity: 0.4; }
  30% { transform: translateY(-6px); opacity: 1; }
}
.ai-result { font-size: 14px; color: #a0a0b0; line-height: 1.7; white-space: pre-wrap; }

/* Main layout */
.main {
  position: relative; z-index: 1; max-width: 1400px; margin: 0 auto;
  padding: 0 32px 80px; display: grid; grid-template-columns: 220px 1fr; gap: 32px;
}
.loading-wrap { display: flex; justify-content: center; padding: 80px; }

/* Cards grid */
.cards-grid {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px;
}

/* Filter bar */
.filter-bar {
  display: flex; align-items: center; gap: 10px; margin-bottom: 24px; flex-wrap: wrap;
}
.filter-tabs {
  display: flex; gap: 4px; background: var(--card); border: 1px solid var(--border);
  border-radius: 10px; padding: 4px;
}
.filter-tab {
  padding: 6px 16px; border-radius: 7px; font-size: 13px; cursor: pointer;
  color: var(--muted); transition: all 0.2s; border: none; background: transparent; font-family: inherit;
}
.filter-tab.active { background: rgba(139,92,246,0.2); color: var(--text); }
.filter-tab:hover:not(.active) { color: var(--text); }

/* Subcategory chips */
.subcat-bar {
  display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 20px;
}
.subcat-chip {
  padding: 5px 14px; border-radius: 100px; font-size: 12px; cursor: pointer;
  border: 1px solid var(--border); background: transparent; color: var(--muted);
  font-family: inherit; transition: all 0.2s;
}
.subcat-chip:hover:not(.active) { color: var(--text); border-color: rgba(255,255,255,0.15); }
.subcat-chip.active {
  background: rgba(139,92,246,0.15); border-color: rgba(139,92,246,0.4); color: var(--text);
}

@media (max-width: 768px) {
  .main { grid-template-columns: 1fr; }
  .stats { gap: 24px; }
  h1 { letter-spacing: -1px; }
}
</style>
