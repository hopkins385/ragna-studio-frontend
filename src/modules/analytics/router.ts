import { defaultAppMeta } from '@/router/defaults';
import { RouteName } from '@/router/enums/route-names.enum';
import type { Router } from 'vue-router';

const moduleRoute = {
  path: '/analytics',
  component: () => import('./AnalyticsModule.vue'),
  meta: defaultAppMeta,
  children: [
    {
      path: '',
      name: RouteName.ANALYTICS_INDEX,
      component: () => import('./views/AnalyticsIndexView.vue'),
      meta: defaultAppMeta,
    },
  ],
};

export default (router: Router) => {
  router.addRoute(moduleRoute);
};
