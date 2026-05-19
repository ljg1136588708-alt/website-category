<template>
  <nav>
    <RouterLink to="/" class="logo">
      <div class="logo-icon">🌐</div>
      <span>WebVerse</span>
    </RouterLink>

    <div class="nav-links">
      <RouterLink to="/" class="nav-link">{{ $t('nav.discover') }}</RouterLink>
      <RouterLink to="/ranking" class="nav-link">{{ $t('nav.ranking') }}</RouterLink>
      <RouterLink to="/new" class="nav-link">{{ $t('nav.newTools') }}</RouterLink>
    </div>

    <div class="nav-right">
      <a
        class="submit-btn"
        href="mailto:ljg1136588708@gmail.com?subject=WebVerse%20Submit%20Site&body=Site%20URL%3A%0ADescription%3A"
        target="_blank"
        rel="noopener noreferrer"
      >{{ $t('common.submitSite') }}</a>

      <a-dropdown :trigger="['click']" placement="bottomRight">
        <button class="lang-btn">
          {{ currentLang.flag }} <span class="lang-code">{{ currentLang.code.split('-')[0].toUpperCase() }}</span>
        </button>
        <template #overlay>
          <a-menu class="lang-menu" @click="onLangSelect">
            <a-menu-item v-for="lang in LANGUAGES" :key="lang.code" :class="{ 'lang-active': lang.code === currentLang.code }">
              {{ lang.flag }} {{ lang.label }}
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { LANGUAGES, setLanguage, i18n } from '@/i18n'

const currentLang = computed(() =>
  LANGUAGES.find((l) => l.code === (i18n.global.locale as unknown as { value: string }).value) ?? LANGUAGES[0],
)

function onLangSelect({ key }: { key: string }) {
  setLanguage(key)
}
</script>

<style scoped>
nav {
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  background: rgba(10, 10, 15, 0.8);
  border-bottom: 1px solid var(--border);
  padding: 0 32px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.5px;
  text-decoration: none;
  color: var(--text);
}
.logo-icon {
  width: 32px;
  height: 32px;
  background: var(--gradient);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}
.logo span {
  background: var(--gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 4px;
  flex: 1;
  margin-left: 8px;
}
.nav-link {
  font-size: 14px;
  font-weight: 500;
  color: var(--muted);
  text-decoration: none;
  padding: 5px 12px;
  border-radius: 8px;
  transition: all 0.2s;
}
.nav-link:hover { color: var(--text); background: rgba(255,255,255,0.06); }
.nav-link.router-link-active { color: var(--text); background: rgba(255,255,255,0.08); }

.nav-right { display: flex; align-items: center; gap: 12px; }

.submit-btn {
  display: inline-flex;
  align-items: center;
  font-size: 13px;
  font-weight: 600;
  padding: 6px 14px;
  border-radius: 8px;
  background: var(--gradient);
  color: #fff;
  text-decoration: none;
  transition: opacity 0.2s;
  white-space: nowrap;
}
.submit-btn:hover { opacity: 0.85; }

.lang-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 13px;
  padding: 5px 11px;
  border-radius: 8px;
  background: rgba(255,255,255,0.05);
  border: 1px solid var(--border);
  color: var(--muted);
  cursor: pointer;
  font-family: inherit;
  transition: all 0.2s;
}
.lang-btn:hover { color: var(--text); background: rgba(255,255,255,0.09); border-color: var(--border-hover); }
.lang-code { font-size: 11px; font-weight: 600; letter-spacing: 0.5px; }

:global(.lang-menu) { min-width: 160px; }
:global(.lang-active) { color: var(--accent1) !important; }

@media (max-width: 640px) {
  .nav-links { display: none; }
  .lang-btn { padding: 5px 8px; font-size: 12px; }
  .submit-btn { display: none; }
}
</style>
