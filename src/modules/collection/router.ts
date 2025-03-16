import { defaultAppMeta } from '@/router/defaults';
import { RouteName } from '@/router/enums/route-names.enum';
import { hasValidRouteId, hasValidRouteQuery } from '@/utils/route-validation.util';
import type { Router } from 'vue-router';

const moduleRoute = {
  path: '/collection',
  component: () => import('./CollectionModule.vue'),
  meta: defaultAppMeta,
  children: [
    {
      path: '',
      name: RouteName.COLLECTION_INDEX,
      beforeEnter: [hasValidRouteQuery],
      component: () => import('./views/CollectionListView.vue'),
      meta: defaultAppMeta,
    },
    {
      path: 'create',
      name: RouteName.COLLECTION_CREATE,
      component: () => import('./views/CollectionCreateView.vue'),
      meta: defaultAppMeta,
    },
    {
      path: ':id',
      name: RouteName.COLLECTION_SHOW,
      beforeEnter: [hasValidRouteId],
      component: () => import('./views/CollectionShowView.vue'),
      meta: defaultAppMeta,
    },
    {
      path: ':id/media',
      name: RouteName.COLLECTION_MEDIA,
      beforeEnter: [hasValidRouteId],
      component: () => import('./views/CollectionMediaView.vue'),
      meta: defaultAppMeta,
    },
  ],
};

export default (router: Router) => {
  router.addRoute(moduleRoute);
};
