import { defaultAppMeta } from '@/router/defaults';
import { RouteName } from '@/router/enums/route-names.enum';
import { hasValidRouteQuery } from '@/utils/route-validation.util';
import type { Router } from 'vue-router';

const moduleRoute = {
  path: '/media',
  component: () => import('../media/MediaModule.vue'),
  meta: defaultAppMeta,
  children: [
    {
      path: '',
      name: RouteName.MEDIA_INDEX,
      component: () => import('../media/views/MediaIndexView.vue'),
      meta: defaultAppMeta,
    },
    {
      path: 'upload',
      name: RouteName.MEDIA_UPLOAD,
      beforeEnter: [hasValidRouteQuery],
      component: () => import('./views/MediaUploadView.vue'),
      meta: defaultAppMeta,
    },
    {
      path: 'google-drive',
      name: RouteName.MEDIA_GOOGLE_DRIVE_INDEX,
      // beforeEnter: [hasValidRouteQuery],
      component: () => import('./views/google/GoogleDriveIndexView.vue'),
      meta: defaultAppMeta,
    },
    {
      path: 'google-drive/callback',
      name: RouteName.MEDIA_GOOGLE_DRIVE_CALLBACK,
      component: () => import('./views/google/GoogleDriveCallbackView.vue'),
      meta: defaultAppMeta,
    },
    {
      path: 'google-drive/:id',
      name: RouteName.MEDIA_GOOGLE_DRIVE_SHOW,
      // beforeEnter: [hasValidRouteId],
      component: () => import('./views/google/GoogleDriveShowView.vue'),
      meta: defaultAppMeta,
    },
    {
      path: 'one-drive',
      name: RouteName.MEDIA_ONE_DRIVE,
      beforeEnter: [hasValidRouteQuery],
      component: () => import('./views/onedrive/OneDriveIndexView.vue'),
      meta: defaultAppMeta,
    },
    // {
    //   path: 'capture',
    //   name: 'media.capture',
    //   component: () => import('./views/MediaCaptureView.vue'),
    //   meta: defaultAppMeta,
    // },
  ],
};

export default (router: Router) => {
  router.addRoute(moduleRoute);
};
