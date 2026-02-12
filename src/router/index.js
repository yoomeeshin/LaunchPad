import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Companies from '@/views/Companies.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/companies',
    name: 'Companies',
    component: Companies
  },
  {
    path: '/company-review/:companyName',
    name: 'CompanyReview',
    component: () => import('@/views/CompanyReview.vue')
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/Profile.vue')
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('@/components/AdminTools.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
