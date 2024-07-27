import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import type { App } from 'vue'
import { Layout, getParentLayout } from '@/utils/routerHelper'
import { useI18n } from '@/hooks/web/useI18n'

const { t } = useI18n()

export const constantRouterMap: AppRouteRecordRaw[] = [
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    name: 'Root',
    meta: {
      hidden: true
    }
  },
  {
    path: '/redirect',
    component: Layout,
    name: 'Redirect',
    children: [
      {
        path: '/redirect/:path(.*)',
        name: 'Redirect',
        component: () => import('@/views/Redirect/Redirect.vue'),
        meta: {}
      }
    ],
    meta: {
      hidden: true,
      noTagsView: true
    }
  },
  {
    path: '/login',
    component: () => import('@/views/Login/Login.vue'),
    name: 'Login',
    meta: {
      hidden: true,
      title: t('router.login'),
      noTagsView: true
    }
  },
  {
    path: '/personal',
    component: Layout,
    redirect: '/personal/personal-center',
    name: 'Personal',
    meta: {
      title: t('router.personal'),
      hidden: true,
      canTo: true
    },
    children: [
      {
        path: 'personal-center',
        component: () => import('@/views/Personal/PersonalCenter/PersonalCenter.vue'),
        name: 'PersonalCenter',
        meta: {
          title: t('router.personalCenter'),
          hidden: true,
          canTo: true
        }
      }
    ]
  },
  {
    path: '/404',
    component: () => import('@/views/Error/404.vue'),
    name: 'NoFind',
    meta: {
      hidden: true,
      title: '404',
      noTagsView: true
    }
  }
]

export const asyncRouterMap: AppRouteRecordRaw[] = [
  {
    path: '/',
    component: Layout,
    name: 'Home',
    meta: {},
    children: [
      {
        path: '/home',
        name: 'Home1',
        component: () => import('@/views/Home/Home.vue'),
        meta: {
          title: t('首页'),
          icon: 'carbon:home'
        }
      }
    ]
  },
  {
    path: '/iot',
    component: Layout,
    redirect: '/home',
    name: 'ProductList',
    meta: {
      title: t('产品管理'),
      icon: 'carbon:product'
    },
    children: [
      // {
      //   path: '/iot/product-list',
      //   name: 'ProductList',
      //   component: () => import('@/views/iot/product/ProductList.vue'),
      //   meta: { title: '产品管理', keepAlive: true, icon: 'appstore', permission: [ 'product-mgr' ] }
      // },
    ]
  },
  {
    path: '/iot',
    component: Layout,
    redirect: '/home',
    name: 'ProductList',
    meta: {
      title: t('设备管理'),
      icon: 'carbon:product'
    },
    children: [
      // {
      //   path: '/iot/device-list',
      //   name: 'DeviceList',
      //   component: () => import('@/views/iot/device/DeviceList.vue'),
      //   meta: { title: '设备管理', keepAlive: true, icon: 'cluster', permission: [ 'device-mgr' ] }
      // },
    ]
  },
  {
    path: '/iot',
    component: Layout,
    redirect: '/home',
    name: 'ProductList',
    meta: {
      title: t('规则引擎'),
      icon: 'carbon:product'
    },
    children: [
      // {
      //   path: '/iot/rule-list',
      //   name: 'RuleList',
      //   component: () => import('@/views/iot/rule/RuleList.vue'),
      //   meta: { title: '规则引擎', keepAlive: true, icon: 'branches', permission: [ 'rule-mgr' ] }
      // }
    ]
  },
  {
    path: '/iot',
    component: Layout,
    redirect: '/home',
    name: 'ProductList',
    meta: {
      title: t('设备告警'),
      icon: 'carbon:product'
    },
    children: [
      // {
      //   path: '/iot/alarm-list',
      //   name: 'AlarmList',
      //   component: () => import('@/views/iot/alarm/AlarmList.vue'),
      //   meta: { title: '设备告警', keepAlive: true, icon: 'alert', permission: [ 'alarm-mgr' ] }
      // },
    ]
  },
  {
    path: '/iot',
    component: Layout,
    redirect: '/home',
    name: 'ProductList',
    meta: {
      title: t('通知配置'),
      icon: 'carbon:product'
    },
    children: [
      // {
      //   path: '/notice/config-list',
      //   name: 'ConfigList',
      //   component: () => import('@/views/notice/config/ConfigList.vue'),
      //   meta: { title: '通知配置', keepAlive: true, icon: 'notification', permission: [ 'notify-config' ] }
      // },
    ]
  },
  {
    path: '/sys',
    name: 'sysPage',
    component: Layout,
    meta: { title: '系统管理', icon: 'setting' },
    children: [
      {
        path: 'role-list',
        name: 'RoleList',
        component: () => import('@/views/sys/RoleList.vue'),
        meta: { title: '角色列表' }
      },
      {
        path: 'user-list',
        name: 'UserList',
        component: () => import('@/views/sys/UserList.vue'),
        meta: { title: '用户列表', keepAlive: true, permission: ['user-mgr'] }
      }
      // {
      //   path: '/sys/network-list',
      //   name: 'NetWorkList',
      //   component: () => import('@/views/sys/NetworkList.vue'),
      //   meta: { title: '网络管理', keepAlive: true, permission: [ 'network-config' ] }
      // },
      // {
      //   path: '/sys/system-config',
      //   name: 'SystemConfig',
      //   component: () => import('@/views/sys/config/SysConfig.vue'),
      //   meta: { title: '系统配置', keepAlive: true, permission: [ 'sys-config' ] }
      // }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  strict: true,
  routes: constantRouterMap as RouteRecordRaw[],
  scrollBehavior: () => ({ left: 0, top: 0 })
})

export const resetRouter = (): void => {
  const resetWhiteNameList = ['Redirect', 'Login', 'NoFind', 'Root']
  router.getRoutes().forEach((route) => {
    const { name } = route
    if (name && !resetWhiteNameList.includes(name as string)) {
      router.hasRoute(name) && router.removeRoute(name)
    }
  })
}

export const setupRouter = (app: App<Element>) => {
  app.use(router)
}

export default router
