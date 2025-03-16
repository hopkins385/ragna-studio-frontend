import { defaultAdminMeta, defaultAppMeta } from '@/router/defaults';
import { hasValidRouteId } from '@/utils/route-validation.util';
import { createRouter, createWebHistory } from 'vue-router';
import { AdminRouteName } from './enums/admin-route-names.enum';
import { RouteName } from './enums/route-names.enum';
import { adminMiddleware } from './middlewares/admin.middleware';
import { authMiddleware } from './middlewares/auth.middleware';
import { Layout, layoutMiddleware } from './middlewares/layout.middleware';
import { NProgressPlugin } from './plugins/nprogress.router.plugin';

const progressPlugin = new NProgressPlugin();

const adminRoutes = {
  path: '/admin',
  component: () => import('@views/admin/AdminRootView.vue'),
  meta: defaultAdminMeta,
  children: [
    {
      path: '',
      name: AdminRouteName.ADMIN_INDEX,
      component: () => import('@views/admin/AdminIndexView.vue'),
      meta: defaultAdminMeta,
    },
    {
      path: 'user',
      name: AdminRouteName.ADMIN_USER,
      component: () => import('@views/admin/user/AdminUserIndexView.vue'),
      meta: defaultAdminMeta,
    },
    {
      path: 'user/:id/edit',
      name: AdminRouteName.ADMIN_USER_EDIT,
      beforeEnter: [hasValidRouteId],
      component: () => import('@views/admin/user/AdminUserEditView.vue'),
      meta: defaultAdminMeta,
    },
  ],
};

const kanbanRoutes = {
  path: '/kanban',
  component: () => import('@views/kanban/KanbanRootView.vue'),
  meta: defaultAppMeta,
  children: [
    {
      path: '',
      name: RouteName.KANBAN_INDEX,
      component: () => import('@views/kanban/KanbanIndexView.vue'),
      meta: defaultAppMeta,
    },
  ],
};

const architectureRoutes = {
  path: '/architecture',
  component: () => import('@views/architecture/ArchitectureRootView.vue'),
  meta: defaultAppMeta,
  children: [
    {
      path: '',
      name: RouteName.ARCHITECTURE_INDEX,
      component: () => import('@views/architecture/ArchitectureIndexView.vue'),
      meta: defaultAppMeta,
    },
  ],
};

const analyticsRoutes = {
  path: '/analytics',
  component: () => import('@views/analytics/AnalyticsRootView.vue'),
  meta: defaultAppMeta,
  children: [
    {
      path: '',
      name: RouteName.ANALYTICS_INDEX,
      component: () => import('@views/analytics/AnalyticsIndexView.vue'),
      meta: defaultAppMeta,
    },
  ],
};

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    kanbanRoutes,
    architectureRoutes,
    analyticsRoutes,
    adminRoutes,

    // 404 route - must be last
    {
      path: '/:pathMatch(.*)*',
      name: RouteName.NOT_FOUND,
      component: () => import('@views/NotFoundView.vue'),
      meta: {
        requiresAuth: false,
        layout: Layout.Error,
      },
    },
  ],
});

// Order matters: layout first, then auth, then admin
router.beforeEach(layoutMiddleware);
router.beforeEach(authMiddleware);
router.beforeEach(adminMiddleware);

// Install NProgress plugin
progressPlugin.install(router);

export default router;
