import { createApp } from 'vue'
import '@/assets/css/index.scss'
import 'element-plus/dist/index.css'
import App from './App.vue'
import chart from '@/components/chart'
import router from '@/router'
import pinia from './stores'

createApp(App)
.use(chart)
.use(router)
.use(pinia)
.mount('#app')
