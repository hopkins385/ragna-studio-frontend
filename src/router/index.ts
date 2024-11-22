import { createRouter, createWebHistory } from 'vue-router';
import { authMiddleware } from './middlewares/auth.middleware';
import { csrfMiddleware } from './middlewares/csrf.middleware';
import { layoutMiddleware, Layout } from './middlewares/layout.middleware';
import {
  hasValidRouteId,
  hasValidRouteQuery,
} from '@/utils/route-validation.util';
import { NProgressPlugin } from './plugins/nprogress.router.plugin';

const progressPlugin = new NProgressPlugin();

const defaultAppMeta = {
  requiresAuth: true,
  layout: Layout.App,
};

const homeRoute = {
  path: '/',
  name: 'home',
  component: () => import('../views/HomeView.vue'),
  meta: defaultAppMeta,
};

const userRoutes = {
  path: '/user',
  component: () => import('../views/user/UserRootView.vue'),
  meta: defaultAppMeta,
  children: [
    {
      path: '',
      name: 'user.list',
      beforeEnter: [hasValidRouteQuery],
      component: () => import('../views/user/UserAllView.vue'),
      meta: defaultAppMeta,
    },
    {
      path: 'create',
      name: 'user.create',
      component: () => import('../views/user/UserCreateView.vue'),
      meta: defaultAppMeta,
    },
    {
      path: ':id',
      name: 'user.show',
      beforeEnter: [hasValidRouteId],
      component: () => import('../views/user/UserShowView.vue'),
      meta: defaultAppMeta,
    },
    {
      path: ':id/edit',
      name: 'user.edit',
      beforeEnter: [hasValidRouteId],
      component: () => import('../views/user/UserEditView.vue'),
      meta: defaultAppMeta,
    },
  ],
};

const chatRoutes = {
  path: '/chat',
  component: () => import('../views/chat/ChatRootView.vue'),
  meta: defaultAppMeta,
  children: [
    {
      path: '',
      name: 'chat.recent',
      component: () => import('../views/chat/ChatRecentView.vue'),
      meta: defaultAppMeta,
    },
    {
      path: 'create',
      name: 'chat.create',
      component: () => import('../views/chat/ChatCreateView.vue'),
      meta: defaultAppMeta,
    },
    {
      path: 'history',
      name: 'chat.history',
      beforeEnter: [hasValidRouteQuery],
      component: () => import('../views/chat/ChatHistoryView.vue'),
      meta: defaultAppMeta,
    },
    {
      path: ':id',
      name: 'chat.show',
      beforeEnter: [hasValidRouteId],
      component: () => import('../views/chat/ChatShowView.vue'),
      meta: defaultAppMeta,
    },
  ],
};

const assistantRoutes = {
  path: '/assistant',
  component: () => import('../views/assistant/AssistantRootView.vue'),
  meta: defaultAppMeta,
  children: [
    {
      path: '',
      name: 'assistant.index',
      beforeEnter: [hasValidRouteQuery],
      component: () => import('../views/assistant/AssistantListView.vue'),
      meta: defaultAppMeta,
    },
    {
      path: 'create',
      name: 'assistant.create',
      component: () => import('../views/assistant/AssistantCreateView.vue'),
      meta: defaultAppMeta,
    },
    {
      path: ':id/edit',
      name: 'assistant.edit',
      beforeEnter: [hasValidRouteId],
      component: () => import('../views/assistant/AssistantEditView.vue'),
      meta: defaultAppMeta,
    },
  ],
};

const collectionRoutes = {
  path: '/collection',
  component: () => import('../views/collection/CollectionRootView.vue'),
  meta: defaultAppMeta,
  children: [
    {
      path: '',
      name: 'collection.index',
      beforeEnter: [hasValidRouteQuery],
      component: () => import('../views/collection/CollectionListView.vue'),
      meta: defaultAppMeta,
    },
    {
      path: 'create',
      name: 'collection.create',
      component: () => import('../views/collection/CollectionCreateView.vue'),
      meta: defaultAppMeta,
    },
    {
      path: ':id',
      name: 'collection.show',
      beforeEnter: [hasValidRouteId],
      component: () => import('../views/collection/CollectionShowView.vue'),
      meta: defaultAppMeta,
    },
  ],
};

const mediaRoutes = {
  path: '/media',
  component: () => import('../views/media/MediaRootView.vue'),
  meta: defaultAppMeta,
  children: [
    {
      path: '',
      name: 'media.index',
      component: () => import('../views/media/MediaIndexView.vue'),
      meta: defaultAppMeta,
    },
    {
      path: 'upload',
      name: 'media.upload',
      beforeEnter: [hasValidRouteQuery],
      component: () => import('../views/media/MediaUploadView.vue'),
      meta: defaultAppMeta,
    },
  ],
};

const textToImageRoutes = {
  path: '/text-to-image',
  component: () => import('../views/text-to-image/TextToImageRootView.vue'),
  meta: defaultAppMeta,
  children: [
    {
      path: '',
      name: 'text-to-image.index',
      component: () =>
        import('../views/text-to-image/TextToImageIndexView.vue'),
      meta: defaultAppMeta,
    },
    {
      path: 'explore',
      name: 'text-to-image.explore',
      component: () =>
        import('../views/text-to-image/TextToImageExploreView.vue'),
      meta: defaultAppMeta,
    },
  ],
};

const workflowRoutes = {
  path: '/workflow',
  component: () => import('../views/workflow/WorkflowRootView.vue'),
  meta: defaultAppMeta,
  children: [
    {
      path: '',
      name: 'workflow.index',
      component: () => import('../views/workflow/WorkflowIndexView.vue'),
      meta: defaultAppMeta,
    },
    {
      path: 'create',
      name: 'workflow.create',
      component: () => import('../views/workflow/WorkflowCreateView.vue'),
      meta: defaultAppMeta,
    },
    {
      path: ':id',
      name: 'workflow.show',
      beforeEnter: [hasValidRouteId],
      component: () => import('../views/workflow/WorkflowShowView.vue'),
      meta: defaultAppMeta,
    },
    {
      path: ':id/edit',
      name: 'workflow.edit',
      beforeEnter: [hasValidRouteId],
      component: () => import('../views/workflow/WorkflowEditView.vue'),
      meta: defaultAppMeta,
    },
  ],
};

const accountRoutes = {
  path: '/account',
  component: () => import('../views/account/AccountRootView.vue'),
  meta: defaultAppMeta,
  children: [
    {
      path: '',
      name: 'account.index',
      component: () => import('../views/account/AccountIndexView.vue'),
      meta: defaultAppMeta,
    },
  ],
};

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    homeRoute,
    userRoutes,
    chatRoutes,
    assistantRoutes,
    collectionRoutes,
    workflowRoutes,
    mediaRoutes,
    textToImageRoutes,
    accountRoutes,
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: {
        requiresAuth: false,
        layout: Layout.Login,
      },
    },
    {
      path: '/logout',
      name: 'logout',
      component: () => import('../views/LogoutView.vue'),
      meta: defaultAppMeta,
    },
    // 404 route - must be last
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue'),
      meta: {
        requiresAuth: false,
        layout: Layout.Error,
      },
    },
  ],
});

// Order matters: layout first, then csrf, then auth
router.beforeEach(layoutMiddleware);
// router.beforeEach(csrfMiddleware);
router.beforeEach(authMiddleware);

// Install NProgress plugin
progressPlugin.install(router);

export default router;
