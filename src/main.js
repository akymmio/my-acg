import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import pinia from '@/stores/index'
import '@icon-park/vue-next/styles/index.css'
import vue3dLoader from 'vue-3d-loader'

const app = createApp(App)
app.use(pinia)
app.use(router)
app.use(vue3dLoader)
app.mount('#app')
