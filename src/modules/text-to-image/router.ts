import { defaultAppMeta } from '@/router/defaults';
import { RouteName } from '@/router/enums/route-names.enum';
import { hasValidImageId, hasValidRunId } from '@/utils/route-validation.util';
import type { Router } from 'vue-router';

const moduleRoute = {
  path: '/text-to-image',
  component: () => import('./TextToImageModule.vue'),
  meta: defaultAppMeta,
  children: [
    {
      path: '',
      name: RouteName.TEXT_TO_IMAGE_INDEX,
      component: () => import('./views/TextToImageIndexView.vue'),
      meta: defaultAppMeta,
    },
    {
      path: 'edit',
      name: RouteName.TEXT_TO_IMAGE_EDIT_INDEX,
      component: () => import('./views/TextToImageEditView.vue'),
      meta: defaultAppMeta,
    },
    {
      path: 'edit/:runId/:imageId',
      name: RouteName.TEXT_TO_IMAGE_EDIT_RUN_IMAGE,
      beforeEnter: [hasValidRunId, hasValidImageId],
      component: () => import('./views/TextToImageEditView.vue'),
      meta: defaultAppMeta,
    },
    {
      path: 'explore',
      name: RouteName.TEXT_TO_IMAGE_EXPLORE,
      component: () => import('./views/TextToImageExploreView.vue'),
      meta: defaultAppMeta,
    },
  ],
};

export default (router: Router) => {
  router.addRoute(moduleRoute);
};
