import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/views/layout/layoutContainer.vue'),
      redirect: '/explore',
      children: [
        {
          path: '/explore',
          component: () => import('@/views/explore/explorePage.vue')
        },
        {
          path: '/user/profile',
          component: () => import('@/views/user/userProfile.vue')
        },
        {
          path: '/notification',
          component: () => import('@/views/notify/notifyPage.vue')
        },
        {
          path: '/publish',
          component: () => import('@/views/publish/publishPage.vue')
        }
      ]
    },
    {
      path: '/login',
      component: () => import('@/views/login/loginPage.vue')
    }
  ]
})
router.beforeEach((to) => {
  //没有token，访问非登录页面，跳转到登录页面
  const userStore = useUserStore()
  if (!userStore.token && to.path !== '/login') {
    return '/login'
  }
})

export default router
