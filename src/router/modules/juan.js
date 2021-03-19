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
      meta: { title: 'imgdesc' }
    }
  ]
}
export default juanRouter
