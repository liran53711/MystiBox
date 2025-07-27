import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/store/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('@/views/HomeView.vue')
    },
    {
      path: '/test',
      name: 'Test',
      component: () => import('@/views/TestView.vue')
    },
    {
      path: '/store',
      name: 'Store',
      component: () => import('@/views/StoreView.vue')
    },
    {
      path: '/series/:id',
      name: 'SeriesDetail',
      component: () => import('@/views/SeriesDetailView.vue')
    },
    {
      path: '/my-pets',
      name: 'MyPets',
      component: () => import('@/views/MyPetsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/plaza',
      name: 'Plaza',
      component: () => import('@/views/PlazaView.vue')
    },
    {
      path: '/my-account',
      name: 'MyAccount',
      component: () => import('@/views/MyAccountView.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: 'history',
          name: 'DrawHistory',
          component: () => import('@/views/DrawHistoryView.vue')
        }
      ]
    },
    {
      path: '/admin',
      name: 'Admin',
      component: () => import('@/views/admin/DashboardView.vue'),
      meta: { requiresAuth: true, requiresAdmin: true },
      children: [
        {
          path: 'series',
          name: 'AdminSeries',
          component: () => import('@/views/admin/SeriesManagementView.vue')
        }
      ]
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/auth/LoginView.vue')
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('@/views/auth/RegisterView.vue')
    }
  ]
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.meta.requiresAdmin && authStore.user?.role !== 'ADMIN') {
    next('/')
  } else {
    next()
  }
})

export default router