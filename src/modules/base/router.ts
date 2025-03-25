import { defaultAppMeta } from '@/router/defaults';
import { RouteName } from '@/router/enums/route-names.enum';
import type { Router } from 'vue-router';

const moduleRoute = {
  path: '/app',
  component: () => import('./BaseModule.vue'),
  meta: defaultAppMeta,
  children: [
    {
      path: 'settings',
      name: RouteName.APP_SETTINGS,
      component: () => import('./views/AppSettingsView.vue'),
      meta: defaultAppMeta,
    },
  ],
};

export default (router: Router) => {
  router.addRoute(moduleRoute);
};
