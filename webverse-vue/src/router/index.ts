import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
    },
    {
      path: '/privacy',
      name: 'privacy',
      component: () => import('@/views/PrivacyView.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/AboutView.vue'),
    },
    {
      path: '/tool/:id',
      name: 'toolDetail',
      component: () => import('@/views/ToolDetailView.vue'),
    },
    {
      path: '/ranking',
      name: 'ranking',
      component: () => import('@/views/RankingView.vue'),
    },
    {
      path: '/new',
      name: 'newTools',
      component: () => import('@/views/NewView.vue'),
    },
    // {
    //   path: '/favorites',
    //   name: 'favorites',
    //   component: () => import('@/views/FavoritesView.vue'),
    // },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
