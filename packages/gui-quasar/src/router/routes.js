const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        components: { default: () => import('pages/main/Index.vue') },
        meta: { requiresAuth: true }
      },
      {
        path: 'gglass/login',
        components: { sidebar: () => import('pages/sidebar/Login.vue') },
        meta: { requiresAuth: false }
      },
      {
        path: 'gglass/profile',
        components: { default: () => import('pages/main/Index.vue') },
        meta: { requiresAuth: true }
      },
      {
        path: 'gglass/settings',
        components: { default: () => import('pages/main/Index.vue') },
        meta: { requiresAuth: true }
      },
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', components: { default: () => import('pages/Error404.vue') } }
    ]
  })
}

export default routes
