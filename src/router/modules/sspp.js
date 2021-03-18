/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const ssppRouter = {
  path: '/sspp',
  component: Layout,
  name: 'Sspp',
  meta: {
    title: 'Sspp',
    icon: 'table'
  },
  children: [
    {
      path: 'index',
      component: () => import('@/views/sspp/index'),
      name: 'SsppIndex',
      meta: { title: 'Sspp Index' }
    },
    {
      path: 'market',
      component: () => import('@/views/sspp/market'),
      hidden: true
    },
    {
      path: 'table',
      component: () => import('@/views/sspp/table'),
      hidden: true
    },
    {
      path: 'search-log',
      component: () => import('@/views/sspp/search-log'),
      hidden: true
    },
    {
      path: 'category',
      component: () => import('@/views/sspp/category'),
      hidden: true
    }
  ]
}
export default ssppRouter
