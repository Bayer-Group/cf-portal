import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/components/Main'
import Orgs from '@/components/Orgs'
import Spaces from '@/components/Spaces'
import AppSummary from '@/components/Apps/Summary'
import AppStats from '@/components/Apps/Stats'
import AppDetail from '@/components/Apps/Detail'
import Detail from '@/components/Detail'
import NotFound from '@/components/NotFound'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Main',
      component: Main
    },
    {
      path: '/orgs',
      name: 'Orgs',
      component: Orgs
    },
    {
      path: '/spaces',
      name: 'Spaces',
      component: Spaces
    },
    {
      path: '/apps/:guid/summary',
      name: 'AppSummary',
      component: AppSummary
    },
    {
      path: '/apps/:guid/stats',
      name: 'AppStats',
      component: AppStats
    },
    {
      path: '/apps/:guid',
      name: 'AppDetail',
      component: AppDetail
    },
    {
      path: '/apps/:guid/overview',
      name: 'Detail',
      component: Detail
    },
    {
      path: '*',
      name: 'NotFound',
      component: NotFound
    }
  ]
})
