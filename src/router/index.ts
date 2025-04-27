import { createRouter, createWebHashHistory, type RouteRecordRaw } from "vue-router";
import Screen from '@/views/screen/index.vue'
import event from '@/api/eventEmiter'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/screen'
  }, {
    path: '/screen',
    component: Screen
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

event.on('API:INVALID', () => {
  ElMessage.warning('参数错误')
})
event.on('API:SESSION_EXPIRED', () => {
  ElMessage.warning('登录过期')
  // router.push('/login')
})


export default router