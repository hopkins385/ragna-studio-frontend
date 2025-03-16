import { defaultAppMeta } from '@/router/defaults';
import { RouteName } from '@/router/enums/route-names.enum';
import type { Router } from 'vue-router';

const moduleRoute = {
  path: '/architecture',
  component: () => import('./ArchitectureModule.vue'),
  meta: defaultAppMeta,
  children: [
    {
      path: '',
      name: RouteName.ARCHITECTURE_INDEX,
      component: () => import('./views/ArchitectureIndexView.vue'),
      meta: defaultAppMeta,
    },
  ],
};

export default (router: Router) => {
  router.addRoute(moduleRoute);
};
