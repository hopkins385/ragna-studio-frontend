import { defaultAppMeta } from '@/router/defaults';
import { RouteName } from '@/router/enums/route-names.enum';
import type { Router } from 'vue-router';

const moduleRoute = {
  path: '/document',
  component: () => import('./DocumentModule.vue'),
  meta: defaultAppMeta,
  children: [
    {
      path: '',
      name: RouteName.DOCUMENT_INDEX,
      component: () => import('./views/DocumentIndexView.vue'),
      meta: defaultAppMeta,
    },
  ],
};

export default (router: Router) => {
  router.addRoute(moduleRoute);
};
