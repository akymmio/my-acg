import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import pinia from '@/stores/index'
import '@icon-park/vue-next/styles/index.css'
import vue3dLoader from 'vue-3d-loader'
import locale from 'element-plus/dist/locale/zh-cn.js'
import ElementPlus from 'element-plus'
const app = createApp(App)
app.use(pinia)
app.use(router)
app.use(vue3dLoader)
app.use(ElementPlus, { locale })
app.mount('#app')
