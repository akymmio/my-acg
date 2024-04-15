import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/explore'
    },
    {
      path: '/index',
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
        }
      ]
    },
    {
      path: '/login',
      component: () => import('@/views/login/loginPage.vue')
    }
  ]
})

export default router
