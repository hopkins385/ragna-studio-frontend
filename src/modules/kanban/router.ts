import { defaultAppMeta } from '@/router/defaults';
import { RouteName } from '@/router/enums/route-names.enum';
import type { Router } from 'vue-router';

const moduleRoute = {
  path: '/kanban',
  component: () => import('./KanbanModule.vue'),
  meta: defaultAppMeta,
  children: [
    {
      path: '',
      name: RouteName.KANBAN_INDEX,
      component: () => import('./views/KanbanIndexView.vue'),
      meta: defaultAppMeta,
    },
  ],
};

export default (router: Router) => {
  router.addRoute(moduleRoute);
};
