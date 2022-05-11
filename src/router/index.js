import { createRouter, createWebHashHistory } from 'vue-router'


const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/launchPage',
    name: 'Launch',
    component: ()=>import('@/pages/launchPage')
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/pages/dashboard')
  },
  {
    path: '/suspend',
    name:'Suspend',
    component:()=>import('@/pages/suspend')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
