import {
  hasValidGoogleCallbackQuery,
  hasValidRouteId,
  hasValidRouteQuery,
} from '@/utils/route-validation.util';
import { createRouter, createWebHistory } from 'vue-router';
import { AdminRouteName } from './enums/admin-route-names.enum';
import { RouteName } from './enums/route-names.enum';
import { adminMiddleware } from './middlewares/admin.middleware';
import { authMiddleware } from './middlewares/auth.middleware';
import { Layout, layoutMiddleware } from './middlewares/layout.middleware';
import { NProgressPlugin } from './plugins/nprogress.router.plugin';

const progressPlugin = new NProgressPlugin();

const defaultAppMeta = {
  requiresAuth: true,
  layout: Layout.App,
};

const defaultAdminMeta = {
  requiresAdmin: true,
  requiresAuth: true,
  layout: Layout.App,
};

const homeRoute = {
  path: '/',
  name: RouteName.HOME,
  component: () => import('@views/HomeView.vue'),
  meta: defaultAppMeta,
};

const userRoutes = {
  path: '/user',
  component: () => import('@views/user/UserRootView.vue'),
  meta: defaultAppMeta,
  children: [
    {
      path: '',
      name: RouteName.USER_LIST,
      beforeEnter: [hasValidRouteQuery],
      component: () => import('@views/user/UserAllView.vue'),
      meta: defaultAppMeta,
    },
    {
      path: 'create',
      name: RouteName.USER_CREATE,
      component: () => import('@views/user/UserCreateView.vue'),
      meta: defaultAppMeta,
    },
    {
      path: ':id',
      name: RouteName.USER_SHOW,
      beforeEnter: [hasValidRouteId],
      component: () => import('@views/user/UserShowView.vue'),
      meta: defaultAppMeta,
    },
    {
      path: ':id/edit',
      name: RouteName.USER_EDIT,
      beforeEnter: [hasValidRouteId],
      component: () => import('@views/user/UserEditView.vue'),
      meta: defaultAppMeta,
    },
  ],
};

const chatRoutes = {
  path: '/chat',
  component: () => import('@views/chat/ChatRootView.vue'),
  meta: defaultAppMeta,
  children: [
    {
      path: '',
      name: RouteName.CHAT_RECENT,
      component: () => import('@views/chat/ChatRecentView.vue'),
      meta: defaultAppMeta,
    },
    {
      path: 'create',
      name: RouteName.CHAT_CREATE,
      component: () => import('@views/chat/ChatCreateView.vue'),
      meta: defaultAppMeta,
    },
    {
      path: 'history',
      name: RouteName.CHAT_HISTORY,
      beforeEnter: [hasValidRouteQuery],
      component: () => import('@views/chat/ChatHistoryView.vue'),
      meta: defaultAppMeta,
    },
    {
      path: ':id',
      name: RouteName.CHAT_SHOW,
      beforeEnter: [hasValidRouteId],
      component: () => import('@views/chat/ChatShowView.vue'),
      meta: defaultAppMeta,
    },
  ],
};

const assistantRoutes = {
  path: '/assistant',
  component: () => import('@views/assistant/AssistantRootView.vue'),
  meta: defaultAppMeta,
  children: [
    {
      path: '',
      name: RouteName.ASSISTANT_INDEX,
      beforeEnter: [hasValidRouteQuery],
      component: () => import('@views/assistant/AssistantListView.vue'),
      meta: defaultAppMeta,
    },
    {
      path: 'create',
      name: RouteName.ASSISTANT_CREATE,
      component: () => import('@views/assistant/AssistantCreateView.vue'),
      meta: defaultAppMeta,
    },
    {
      path: 'template',
      name: RouteName.ASSISTANT_TEMPLATE,
      component: () => import('@views/assistant/AssistantTemplateView.vue'),
      meta: defaultAppMeta,
    },
    {
      path: ':id/edit',
      name: RouteName.ASSISTANT_EDIT,
      beforeEnter: [hasValidRouteId],
      component: () => import('@views/assistant/AssistantEditView.vue'),
      meta: defaultAppMeta,
    },
  ],
};

const collectionRoutes = {
  path: '/collection',
  component: () => import('@views/collection/CollectionRootView.vue'),
  meta: defaultAppMeta,
  children: [
    {
      path: '',
      name: RouteName.COLLECTION_INDEX,
      beforeEnter: [hasValidRouteQuery],
      component: () => import('@views/collection/CollectionListView.vue'),
      meta: defaultAppMeta,
    },
    {
      path: 'create',
      name: RouteName.COLLECTION_CREATE,
      component: () => import('@views/collection/CollectionCreateView.vue'),
      meta: defaultAppMeta,
    },
    {
      path: ':id',
      name: RouteName.COLLECTION_SHOW,
      beforeEnter: [hasValidRouteId],
      component: () => import('@views/collection/CollectionShowView.vue'),
      meta: defaultAppMeta,
    },
    {
      path: ':id/media',
      name: RouteName.COLLECTION_MEDIA,
      beforeEnter: [hasValidRouteId],
      component: () => import('@views/collection/CollectionMediaView.vue'),
      meta: defaultAppMeta,
    },
  ],
};

const mediaRoutes = {
  path: '/media',
  component: () => import('@views/media/MediaRootView.vue'),
  meta: defaultAppMeta,
  children: [
    {
      path: '',
      name: RouteName.MEDIA_INDEX,
      component: () => import('@views/media/MediaIndexView.vue'),
      meta: defaultAppMeta,
    },
    {
      path: 'upload',
      name: RouteName.MEDIA_UPLOAD,
      beforeEnter: [hasValidRouteQuery],
      component: () => import('@views/media/MediaUploadView.vue'),
      meta: defaultAppMeta,
    },
    {
      path: 'google-drive',
      name: RouteName.MEDIA_GOOGLE_DRIVE_INDEX,
      // beforeEnter: [hasValidRouteQuery],
      component: () => import('@views/media/google/MediaGoogleIndexView.vue'),
      meta: defaultAppMeta,
    },
    {
      path: 'google-drive/callback',
      name: RouteName.MEDIA_GOOGLE_DRIVE_CALLBACK,
      component: () =>
        import('@views/media/google/MediaGoogleCallbackView.vue'),
      meta: defaultAppMeta,
    },
    {
      path: 'google-drive/:id',
      name: RouteName.MEDIA_GOOGLE_DRIVE_SHOW,
      // beforeEnter: [hasValidRouteId],
      component: () => import('@views/media/google/MediaGoogleShowView.vue'),
      meta: defaultAppMeta,
    },
    {
      path: 'one-drive',
      name: RouteName.MEDIA_ONE_DRIVE,
      beforeEnter: [hasValidRouteQuery],
      component: () => import('@views/media/onedrive/MediaOneDriveView.vue'),
      meta: defaultAppMeta,
    },
  ],
};

const textToImageRoutes = {
  path: '/text-to-image',
  component: () => import('@views/text-to-image/TextToImageRootView.vue'),
  meta: defaultAppMeta,
  children: [
    {
      path: '',
      name: RouteName.TEXT_TO_IMAGE_INDEX,
      component: () => import('@views/text-to-image/TextToImageIndexView.vue'),
      meta: defaultAppMeta,
    },
    {
      path: 'explore',
      name: RouteName.TEXT_TO_IMAGE_EXPLORE,
      component: () =>
        import('@views/text-to-image/TextToImageExploreView.vue'),
      meta: defaultAppMeta,
    },
  ],
};

const workflowRoutes = {
  path: '/workflow',
  component: () => import('@views/workflow/WorkflowRootView.vue'),
  meta: defaultAppMeta,
  children: [
    {
      path: '',
      name: RouteName.WORKFLOW_INDEX,
      component: () => import('@views/workflow/WorkflowIndexView.vue'),
      meta: defaultAppMeta,
    },
    {
      path: 'create',
      name: RouteName.WORKFLOW_CREATE,
      component: () => import('@views/workflow/WorkflowCreateView.vue'),
      meta: defaultAppMeta,
    },
    {
      path: ':id',
      name: RouteName.WORKFLOW_SHOW,
      beforeEnter: [hasValidRouteId],
      component: () => import('@views/workflow/WorkflowShowView.vue'),
      meta: defaultAppMeta,
    },
    {
      path: ':id/edit',
      name: RouteName.WORKFLOW_EDIT,
      beforeEnter: [hasValidRouteId],
      component: () => import('@views/workflow/WorkflowEditView.vue'),
      meta: defaultAppMeta,
    },
  ],
};

const ducumentRoutes = {
  path: '/document',
  component: () => import('@views/document/DocumentRootView.vue'),
  meta: defaultAppMeta,
  children: [
    {
      path: '',
      name: RouteName.DOCUMENT_INDEX,
      component: () => import('@views/document/DocumentIndexView.vue'),
      meta: defaultAppMeta,
    },
  ],
};

const accountRoutes = {
  path: '/account',
  component: () => import('@views/account/AccountRootView.vue'),
  meta: defaultAppMeta,
  children: [
    {
      path: '',
      name: RouteName.ACCOUNT_INDEX,
      component: () => import('@views/account/AccountIndexView.vue'),
      meta: defaultAppMeta,
    },
    {
      path: 'settings',
      name: RouteName.ACCOUNT_SETTINGS,
      component: () => import('@views/account/AccountSettingsView.vue'),
      meta: defaultAppMeta,
    },
  ],
};

const socialAuthCallbackRoutes = {
  path: '/auth/:provider/callback',
  name: RouteName.SOCIAL_AUTH_CALLBACK,
  beforeEnter: [hasValidGoogleCallbackQuery],
  component: () => import('@views/auth/SocialAuthCallbackView.vue'),
  meta: {
    requiresAuth: false,
    layout: Layout.Login,
  },
};

const onboardingRoutes = {
  path: '/onboarding',
  component: () => import('@views/onboarding/OnboardingRootView.vue'),
  meta: defaultAppMeta,
  children: [
    {
      path: '',
      name: RouteName.ONBOARDING_INDEX,
      component: () => import('@views/onboarding/OnboardingIndexView.vue'),
      meta: defaultAppMeta,
    },
  ],
};

const adminRoutes = {
  path: '/admin',
  component: () => import('@views/admin/AdminRootView.vue'),
  meta: defaultAdminMeta,
  children: [
    {
      path: '',
      name: AdminRouteName.ADMIN_INDEX,
      component: () => import('@views/admin/AdminIndexView.vue'),
      meta: defaultAdminMeta,
    },
    {
      path: 'user',
      name: AdminRouteName.ADMIN_USER,
      component: () => import('@views/admin/user/AdminUserIndexView.vue'),
      meta: defaultAdminMeta,
    },
    {
      path: 'user/:id/edit',
      name: AdminRouteName.ADMIN_USER_EDIT,
      beforeEnter: [hasValidRouteId],
      component: () => import('@views/admin/user/AdminUserEditView.vue'),
      meta: defaultAdminMeta,
    },
  ],
};

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    onboardingRoutes,
    homeRoute,
    userRoutes,
    chatRoutes,
    assistantRoutes,
    collectionRoutes,
    workflowRoutes,
    ducumentRoutes,
    mediaRoutes,
    textToImageRoutes,
    accountRoutes,
    socialAuthCallbackRoutes,
    adminRoutes,
    {
      path: '/login',
      name: RouteName.LOGIN,
      component: () => import('@views/auth/LoginView.vue'),
      meta: {
        requiresAuth: false,
        layout: Layout.Login,
      },
    },
    {
      path: '/register',
      name: RouteName.REGISTER,
      component: () => import('@views/auth/RegisterView.vue'),
      meta: {
        requiresAuth: false,
        layout: Layout.Login,
      },
    },
    {
      path: '/logout',
      name: RouteName.LOGOUT,
      component: () => import('@views/auth/LogoutView.vue'),
      meta: defaultAppMeta,
    },
    // 404 route - must be last
    {
      path: '/:pathMatch(.*)*',
      name: RouteName.NOT_FOUND,
      component: () => import('@views/NotFoundView.vue'),
      meta: {
        requiresAuth: false,
        layout: Layout.Error,
      },
    },
  ],
});

// Order matters: layout first, then auth, then admin
router.beforeEach(layoutMiddleware);
router.beforeEach(authMiddleware);
router.beforeEach(adminMiddleware);

// Install NProgress plugin
progressPlugin.install(router);

export default router;
