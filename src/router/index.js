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
          component: () => import('@/views/explore/explorePage.vue'),
          // meta: { keepAlive: true }, // 表明这个组件应该被缓存
          children: [
            {
              path: 'content/:id', // 这会匹配 /explore/content/123
              name: 'ExploreDetail',
              component: () => import('../views/content/contentPage.vue')
            }
          ]
        },
        {
          path: '/collection',
          component: () => import('@/views/collection/collectionPage.vue'),
          meta: { keepAlive: true } // 表明这个组件应该被缓存
        },
        {
          path: '/activity',
          component: () => import('@/views/activity/activityPage.vue'),
          meta: { keepAlive: true } // 表明这个组件应该被缓存
        },
        // {
        //   path: '/explore/:id',
        //   component: () => import('@/views/content/contentPage.vue')
        //   // meta: { keepAlive: true } // 表明这个组件应该被缓存
        // },

        {
          path: '/user/profile/:id',
          component: () => import('@/views/user/userProfile.vue'),
          meta: { keepAlive: true } // 表明这个组件应该被缓存
        },
        {
          path: '/notification',
          component: () => import('@/views/notify/notifyPage.vue')
        },
        {
          path: '/publish',
          component: () => import('@/views/publish/publishPage.vue')
        },
        {
          path: '/activityPublish',
          component: () => import('@/views/publish/activityPublishPage.vue')
        },
        {
          path: '/model',
          component: () => import('@/views/model/modelPage.vue')
        }
        // ,
        // {
        //   path: '/explore/`channel_id=${channelId}`',
        //   component: () => import('@/views/explore/explorePage.vue')
        // }
      ]
    },
    {
      path: '/login',
      component: () => import('@/views/login/loginPage.vue')
    }
  ],
  // mode: 'history',
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition // 如果 savedPosition 存在，则滚动到该位置
    } else {
      return { left: 0, top: 0 } // 否则，滚动到页面顶部
    }
  }
})
//没有token，访问非登录页面，跳转到首页
//导航守卫
router.beforeEach((to) => {
  const userStore = useUserStore()

  // 定义不需要登录的白名单路径
  const whiteList = ['/explore', '/model', '/collection', '/activity'] // 添加你希望放开的路径

  // 如果用户未登录且访问的路径不在白名单中，则重定向到首页
  if (!userStore.token && !whiteList.some((path) => to.path.startsWith(path))) {
    return '/'
  }
})

export default router
