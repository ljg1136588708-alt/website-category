import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'
import router from './router'
import App from './App.vue'
import './styles/global.css'
import { i18n, setLanguage } from './i18n'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(Antd)
app.use(i18n)

const savedLang = localStorage.getItem('webverse_lang') || 'zh-CN'
setLanguage(savedLang)

app.mount('#app')
