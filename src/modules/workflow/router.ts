import { defaultAppMeta } from '@/router/defaults';
import { RouteName } from '@/router/enums/route-names.enum';
import { hasValidRouteId } from '@/utils/route-validation.util';
import type { Router } from 'vue-router';

const moduleRoute = {
  path: '/workflow',
  component: () => import('./WorkflowModule.vue'),
  meta: defaultAppMeta,
  children: [
    {
      path: '',
      name: RouteName.WORKFLOW_INDEX,
      component: () => import('./views/WorkflowIndexView.vue'),
      meta: defaultAppMeta,
    },
    {
      path: 'create',
      name: RouteName.WORKFLOW_CREATE,
      component: () => import('./views/WorkflowCreateView.vue'),
      meta: defaultAppMeta,
    },
    {
      path: ':id',
      name: RouteName.WORKFLOW_SHOW,
      beforeEnter: [hasValidRouteId],
      component: () => import('./views/WorkflowShowView.vue'),
      meta: defaultAppMeta,
    },
    {
      path: ':id/edit',
      name: RouteName.WORKFLOW_EDIT,
      beforeEnter: [hasValidRouteId],
      component: () => import('./views/WorkflowEditView.vue'),
      meta: defaultAppMeta,
    },
  ],
};

export default (router: Router) => {
  router.addRoute(moduleRoute);
};
