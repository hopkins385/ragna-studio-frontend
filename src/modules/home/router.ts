import { defaultAppMeta } from '@/router/defaults';
import { RouteName } from '@/router/enums/route-names.enum';
import type { Router } from 'vue-router';

const moduleRoute = {
  path: '/',
  name: RouteName.HOME,
  component: () => import('./HomeModule.vue'),
  meta: defaultAppMeta,
};

export default (router: Router) => {
  router.addRoute(moduleRoute);
};
