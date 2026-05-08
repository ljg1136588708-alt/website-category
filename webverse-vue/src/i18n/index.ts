import { createI18n } from 'vue-i18n'
import zhCN from '@/locales/zh-CN'
import en from '@/locales/en'

export interface Language {
  code: string
  label: string
  flag: string
  rtl?: boolean
}

export const LANGUAGES: Language[] = [
  { code: 'zh-CN', label: '简体中文', flag: '🇨🇳' },
  { code: 'en',    label: 'English',  flag: '🇺🇸' },
]

const savedLang = typeof localStorage !== 'undefined'
  ? (localStorage.getItem('webverse_lang') || 'zh-CN')
  : 'zh-CN'

export const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: savedLang,
  fallbackLocale: 'en',
  messages: { 'zh-CN': zhCN, en },
})

export function setLanguage(code: string) {
  ;(i18n.global.locale as unknown as { value: string }).value = code
  localStorage.setItem('webverse_lang', code)
  document.documentElement.lang = code
}
