/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const juanRouter = {
  path: '/jmain',
  component: Layout,
  name: 'Jmain',
  meta: {
    title: 'Jmain',
    icon: 'table'
  },
  children: [
    {
      path: 'imgdesc',
      component: () => import('@/views/juan/imgdesc'),
      name: 'imgdesc',
      meta: { title: '图文配置' }
    },
    {
      path: 'navigation',
      component: () => import('@/views/juan/navigation'),
      name: 'navigation',
      meta: { title: '导航栏配置' }
    }
  ]
}
export default juanRouter
