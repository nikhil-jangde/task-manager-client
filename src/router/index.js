import { createRouter, createWebHistory } from 'vue-router'
// We will implement these components later, for now we import them assuming they exist 
// or I will create empty placeholders soon to avoid errors if the user tries to run it immediately.
// Actually, imports might fail if files don't exist. I should create the views first or stub them.
// But I will write the router first, then the views.
// To avoid build errors if I don't create them immediately, I'll use dynamic imports or just ensure I create them next.

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/projects',
      name: 'projects',
      component: () => import('../views/ProjectsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/members',
      name: 'members',
      component: () => import('../views/MembersView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: { guest: true }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue'),
      meta: { guest: true }
    }
  ]
})

// Navigation Guard
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const isAuthenticated = !!token

  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'login' })
  } else if (to.meta.guest && isAuthenticated) {
    next({ name: 'dashboard' })
  } else {
    next()
  }
})

export default router
