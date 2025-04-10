import { AdminRouteName } from '@/modules/admin/enums/admin-route-names.enum';
import { defaultAdminMeta } from '@/router/defaults';
import { hasValidRouteId } from '@/utils/route-validation.util';
import type { Router } from 'vue-router';

const moduleRoute = {
  path: '/admin',
  component: () => import('./AdminModule.vue'),
  meta: defaultAdminMeta,
  children: [
    {
      path: '',
      name: AdminRouteName.ADMIN_INDEX,
      component: () => import('./views/AdminIndexView.vue'),
      meta: defaultAdminMeta,
    },
    {
      path: 'user',
      name: AdminRouteName.ADMIN_USER,
      component: () => import('./views/user/AdminUserIndexView.vue'),
      meta: defaultAdminMeta,
    },
    {
      path: 'user/create',
      name: AdminRouteName.ADMIN_USER_CREATE,
      component: () => import('./views/user/AdminUserCreateView.vue'),
      meta: defaultAdminMeta,
    },
    {
      path: 'user/:id/edit',
      name: AdminRouteName.ADMIN_USER_EDIT,
      beforeEnter: [hasValidRouteId],
      component: () => import('./views/user/AdminUserEditView.vue'),
      meta: defaultAdminMeta,
    },
  ],
};

export default (router: Router) => {
  router.addRoute(moduleRoute);
};
