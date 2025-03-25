import { defaultAppMeta } from '@/router/defaults';
import { RouteName } from '@/router/enums/route-names.enum';
import type { Router } from 'vue-router';

const moduleRoute = {
  path: '/account',
  component: () => import('./AccountModule.vue'),
  meta: defaultAppMeta,
  children: [
    {
      path: '',
      name: RouteName.ACCOUNT_INDEX,
      component: () => import('./views/AccountIndexView.vue'),
      meta: defaultAppMeta,
    },
    {
      path: 'statistics',
      name: RouteName.ACCOUNT_STATISTICS,
      component: () => import('./views/stats/AccountStatsIndexView.vue'),
      meta: defaultAppMeta,
    },
  ],
};

export default (router: Router) => {
  router.addRoute(moduleRoute);
};
