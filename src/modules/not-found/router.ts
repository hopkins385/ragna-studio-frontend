import { RouteName } from '@/router/enums/route-names.enum';
import { Layout } from '@/router/middlewares/layout.middleware';
import type { Router } from 'vue-router';

const moduleRoute = {
  path: '/:pathMatch(.*)*',
  name: RouteName.NOT_FOUND,
  component: () => import('./NotFoundModule.vue'),
  meta: {
    requiresAuth: false,
    layout: Layout.Error,
  },
};

export default (router: Router) => {
  router.addRoute(moduleRoute);
};
