<template>
  <a-config-provider :theme="themeConfig" :locale="antLocale">
    <div class="blob blob-1" />
    <div class="blob blob-2" />
    <div class="blob blob-3" />
    <AppNav />
    <RouterView />
    <AppFooter />
  </a-config-provider>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { theme } from 'ant-design-vue'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import enUS from 'ant-design-vue/es/locale/en_US'
import AppNav from '@/components/AppNav.vue'
import AppFooter from '@/components/AppFooter.vue'
import { i18n } from '@/i18n'

const antLocale = computed(() => {
  const code = (i18n.global.locale as unknown as { value: string }).value
  return code === 'zh-CN' ? zhCN : enUS
})

// Sync <html lang> with current locale
watch(
  () => (i18n.global.locale as unknown as { value: string }).value,
  (lang) => { document.documentElement.lang = lang },
  { immediate: true },
)

const themeConfig = {
  algorithm: theme.darkAlgorithm,
  token: {
    colorPrimary: '#8b5cf6',
    colorPrimaryHover: '#a78bfa',
    colorBgContainer: '#16161f',
    colorBgElevated: '#1e1e2d',
    colorBgLayout: '#0a0a0f',
    colorBorder: 'rgba(255,255,255,0.1)',
    colorText: '#f0f0ff',
    colorTextSecondary: '#6b7280',
    colorTextPlaceholder: '#6b7280',
    borderRadius: 10,
    fontFamily: "-apple-system, 'Inter', 'Segoe UI', sans-serif",
    controlHeight: 36,
    fontSize: 14,
  },
}
</script>
