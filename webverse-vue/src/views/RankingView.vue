<template>
  <!-- Hero -->
  <section class="page-hero">
    <div class="hero-badge">{{ $t('ranking.badge') }}</div>
    <h1>{{ $t('ranking.title1') }}<span class="gold-text"> {{ $t('ranking.title2') }}</span></h1>
    <p>{{ $t('ranking.sub') }}</p>
  </section>

  <div class="main" v-if="!loading">
    <div class="content">
      <!-- Podium -->
      <div class="section-head">
        <h2>🥇 {{ $t('ranking.todayTop') }} {{ $t('ranking.top3') }}</h2>
        <span class="section-tag">{{ $t('ranking.heatIndex') }}</span>
      </div>
      <div class="podium">
        <div
          v-for="item in podium"
          :key="item.id"
          class="podium-card"
          :class="`p${item.rank}`"
          @click="router.push(`/tool/${item.id}`)"
        >
          <div class="podium-glow" />
          <span class="podium-medal">{{ medals[item.rank - 1] }}</span>
          <span class="podium-rank-lbl">#{{ item.rank }}</span>
          <div class="podium-logo">
            <ToolLogo :tool-id="item.id" :icon="item.icon" />
          </div>
          <div class="podium-name">{{ rankToolName(item) }}</div>
          <div class="podium-url">{{ item.url }}</div>
          <span class="podium-score">{{ item.score.toLocaleString() }}</span>
          <span class="podium-score-lbl">{{ $t('ranking.heatIndex') }}</span>
          <BadgeGroup :badges="item.badges" class="podium-badges" />
        </div>
      </div>

      <!-- Rank list -->
      <div class="section-head">
        <h2>📊 {{ $t('ranking.fullList') }}</h2>
        <span class="section-tag">{{ $t('ranking.rankRange') }}</span>
      </div>
      <div class="rank-list">
        <div v-for="item in rankList" :key="item.id" class="rank-row" @click="router.push(`/tool/${item.id}`)">
          <span class="rank-n" :class="{ hi: item.rank <= 6 }">{{ item.rank }}</span>
          <div class="rank-logo">
            <ToolLogo :tool-id="item.id" :icon="item.icon" />
          </div>
          <div class="rank-info">
            <div class="rank-name">{{ rankToolName(item) }}</div>
            <div class="rank-desc">{{ rankToolDesc(item) }}</div>
          </div>
          <div class="rank-right">
            <BadgeGroup :badges="item.badges" class="rank-badges" />
            <div class="rank-score">
              <span class="rank-score-val">{{ item.score.toLocaleString() }}</span>
              <span class="rank-score-lbl">{{ $t('ranking.heatShort') }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="loading-wrap"><a-spin size="large" /></div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import BadgeGroup from '@/components/BadgeGroup.vue'
import ToolLogo from '@/components/ToolLogo.vue'
import { toolsApi } from '@/api'
import type { PodiumItem, RankItem } from '@/types'
import { toolLocalizedDesc, toolLocalizedName } from '@/utils/toolLocaleText'

const { t, te, locale } = useI18n()
const router = useRouter()

function rankToolName(item: PodiumItem | RankItem) {
  void locale.value
  return toolLocalizedName(item, t, te)
}

function rankToolDesc(item: RankItem) {
  void locale.value
  return toolLocalizedDesc(item, t, te)
}

const loading = ref(true)
const podium = ref<PodiumItem[]>([])
const rankList = ref<RankItem[]>([])

const medals = ['🥇', '🥈', '🥉']

async function loadData() {
  try {
    const res = await toolsApi.getRankings()
    podium.value = [
      res.podium.find((p) => p.rank === 2)!,
      res.podium.find((p) => p.rank === 1)!,
      res.podium.find((p) => p.rank === 3)!,
    ]
    rankList.value = res.list
  } finally {
    loading.value = false
  }
}

onMounted(loadData)
</script>

<style scoped>
.page-hero {
  position: relative; z-index: 1; text-align: center; padding: 64px 32px 48px;
}
.hero-badge {
  display: inline-flex; align-items: center; gap: 6px;
  background: rgba(255,215,0,0.1); border: 1px solid rgba(255,215,0,0.3);
  border-radius: 100px; padding: 5px 14px; font-size: 12px; color: #ffd700;
  margin-bottom: 20px; font-weight: 500;
}
h1 { font-size: clamp(28px,4vw,52px); font-weight: 800; letter-spacing: -1.5px; margin-bottom: 12px; }
.gold-text { background: linear-gradient(135deg,#ffd700,#f59e0b); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.page-hero p { color: var(--muted); font-size: 15px; max-width: 460px; margin: 0 auto; line-height: 1.6; }

.main {
  position: relative; z-index: 1; max-width: 900px; margin: 0 auto;
  padding: 48px 32px 80px;
}
.loading-wrap { display: flex; justify-content: center; padding: 80px; }

/* Podium */
.podium { display: grid; grid-template-columns: 1fr 1.08fr 1fr; gap: 12px; margin-bottom: 40px; align-items: end; }
.podium-card {
  background: var(--card); border: 1px solid var(--border); border-radius: 20px; padding: 20px 18px 22px;
  position: relative; overflow: hidden; text-align: center; transition: all 0.25s; cursor: pointer;
  display: flex; flex-direction: column; align-items: center;
}
.podium-card:hover { transform: translateY(-3px); box-shadow: var(--glow); }
.p1 { padding-top: 36px; background: linear-gradient(135deg,rgba(255,215,0,0.07),rgba(255,140,0,0.03)); border-color: rgba(255,215,0,0.22); }
.p2 { background: linear-gradient(135deg,rgba(192,192,192,0.06),rgba(136,136,136,0.03)); border-color: rgba(192,192,192,0.16); }
.p3 { background: linear-gradient(135deg,rgba(205,127,50,0.06),rgba(139,69,19,0.03)); border-color: rgba(205,127,50,0.16); }
.podium-medal { font-size: 26px; display: block; margin-bottom: 6px; }
.podium-rank-lbl { font-size: 10px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 12px; display: block; }
.p1 .podium-rank-lbl { color: #ffd700; }
.p2 .podium-rank-lbl { color: #c0c0c0; }
.p3 .podium-rank-lbl { color: #cd7f32; }
.podium-logo {
  width: 56px; height: 56px; margin: 0 auto 12px; flex-shrink: 0; font-size: 28px;
  border-radius: 14px; display: flex; align-items: center; justify-content: center;
  background: rgba(255,255,255,0.05); border: 1px solid var(--border); overflow: hidden;
}
.podium-logo :deep(.tool-logo) { width: 56px; height: 56px; }
.podium-name { font-size: 17px; font-weight: 800; margin-bottom: 3px; }
.podium-url { font-size: 11px; color: var(--muted); margin-bottom: 14px; }
.podium-score { font-size: 28px; font-weight: 900; letter-spacing: -1px; display: block; margin-bottom: 2px; }
.p1 .podium-score { background: linear-gradient(135deg,#ffd700,#ff8c00); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.p2 .podium-score { background: linear-gradient(135deg,#c0c0c0,#888); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.p3 .podium-score { background: linear-gradient(135deg,#cd7f32,#8b4513); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.podium-score-lbl { font-size: 11px; color: var(--muted); margin-bottom: 12px; display: block; }
.podium-badges { display: flex; gap: 5px; justify-content: center; flex-wrap: wrap; }
.podium-glow { position: absolute; width: 160px; height: 160px; border-radius: 50%; filter: blur(60px); opacity: 0.15; bottom: -60px; left: 50%; transform: translateX(-50%); pointer-events: none; }
.p1 .podium-glow { background: #ffd700; }
.p2 .podium-glow { background: #c0c0c0; }
.p3 .podium-glow { background: #cd7f32; }

/* Rank list */
.rank-list { display: flex; flex-direction: column; gap: 8px; }
.rank-row {
  background: var(--card); border: 1px solid var(--border); border-radius: 14px; padding: 14px 18px;
  display: flex; align-items: center; gap: 14px; cursor: pointer; transition: all 0.2s; position: relative; overflow: hidden;
}
.rank-row::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 3px; background: var(--gradient); opacity: 0; transition: opacity 0.2s; border-radius: 3px 0 0 3px; }
.rank-row:hover { border-color: var(--border-hover); transform: translateX(4px); }
.rank-row:hover::before { opacity: 1; }
.rank-n { font-size: 16px; font-weight: 800; width: 30px; text-align: center; flex-shrink: 0; color: var(--muted); }
.rank-n.hi { color: var(--text); }
.rank-logo { width: 42px; height: 42px; border-radius: 11px; display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0; background: rgba(255,255,255,0.05); border: 1px solid var(--border); overflow: hidden; }
.rank-logo :deep(.tool-logo) { width: 42px; height: 42px; }
.rank-info { flex: 1; min-width: 0; }
.rank-name { font-size: 14px; font-weight: 700; margin-bottom: 3px; }
.rank-desc { font-size: 12px; color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.rank-right { display: flex; align-items: center; gap: 12px; flex-shrink: 0; }
.rank-score { text-align: right; min-width: 60px; }
.rank-score-val { font-size: 15px; font-weight: 800; letter-spacing: -0.5px; display: block; }
.rank-score-lbl { font-size: 10px; color: var(--muted); }

@media (max-width: 900px) { .rank-badges { display: none; } }
@media (max-width: 768px) { .podium { grid-template-columns: 1fr; } }
</style>
