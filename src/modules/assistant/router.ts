import { defaultAppMeta } from '@/router/defaults';
import { RouteName } from '@/router/enums/route-names.enum';
import { hasValidRouteId, hasValidRouteQuery } from '@/utils/route-validation.util';
import type { Router } from 'vue-router';

const moduleRoute = {
  path: '/assistant',
  component: () => import('./AssistantModule.vue'),
  meta: defaultAppMeta,
  children: [
    {
      path: '',
      name: RouteName.ASSISTANT_INDEX,
      beforeEnter: [hasValidRouteQuery],
      component: () => import('./views/AssistantListView.vue'),
      meta: defaultAppMeta,
    },
    {
      path: 'create',
      name: RouteName.ASSISTANT_CREATE,
      component: () => import('./views/AssistantCreateView.vue'),
      meta: defaultAppMeta,
    },
    {
      path: 'template',
      name: RouteName.ASSISTANT_TEMPLATE,
      component: () => import('./views/AssistantTemplateView.vue'),
      meta: defaultAppMeta,
    },
    {
      path: ':id/edit',
      name: RouteName.ASSISTANT_EDIT,
      beforeEnter: [hasValidRouteId],
      component: () => import('./views/AssistantEditView.vue'),
      meta: defaultAppMeta,
    },
  ],
};

export default (router: Router) => {
  router.addRoute(moduleRoute);
};
