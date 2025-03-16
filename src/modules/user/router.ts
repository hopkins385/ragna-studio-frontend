import { defaultAppMeta } from '@/router/defaults';
import { RouteName } from '@/router/enums/route-names.enum';
import { hasValidRouteId, hasValidRouteQuery } from '@/utils/route-validation.util';
import type { Router } from 'vue-router';

const moduleRoute = {
  path: '/user',
  component: () => import('./UserModule.vue'),
  meta: defaultAppMeta,
  children: [
    {
      path: '',
      name: RouteName.USER_LIST,
      beforeEnter: [hasValidRouteQuery],
      component: () => import('./views/UserAllView.vue'),
      meta: defaultAppMeta,
    },
    {
      path: 'create',
      name: RouteName.USER_CREATE,
      component: () => import('./views/UserCreateView.vue'),
      meta: defaultAppMeta,
    },
    {
      path: ':id',
      name: RouteName.USER_SHOW,
      beforeEnter: [hasValidRouteId],
      component: () => import('./views/UserShowView.vue'),
      meta: defaultAppMeta,
    },
    {
      path: ':id/edit',
      name: RouteName.USER_EDIT,
      beforeEnter: [hasValidRouteId],
      component: () => import('./views/UserEditView.vue'),
      meta: defaultAppMeta,
    },
  ],
};

export default (router: Router) => {
  router.addRoute(moduleRoute);
};
