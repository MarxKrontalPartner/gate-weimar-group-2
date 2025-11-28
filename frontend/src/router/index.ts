import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

import Signup from '../views/Signup.vue'
import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'
import ProjectDetail from '../views/ProjectDetail.vue'

const routes: Array<RouteRecordRaw> = [
  { path: '/', redirect: '/login' },
  { path: '/signup', component: Signup },
  { path: '/login', component: Login },
  {
    path: '/dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  { path: '/projects/:id', component: ProjectDetail, props: true }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')

  // 1. Protected routes → require token
  if (to.meta.requiresAuth && !token) {
    return next('/login')
  }

  // 2. If logged in → block login/signup pages
  if ((to.path === '/login' || to.path === '/signup') && token) {
    return next('/dashboard')
  }

  next()
})

export default router