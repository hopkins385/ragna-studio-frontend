import { defaultAppMeta } from '@/router/defaults';
import { RouteName } from '@/router/enums/route-names.enum';
import { hasValidRouteId, hasValidRouteQuery } from '@/utils/route-validation.util';
import type { Router } from 'vue-router';

const moduleRoute = {
  path: '/chat',
  component: () => import('./AiChatModule.vue'),
  meta: defaultAppMeta,
  children: [
    {
      path: '',
      name: RouteName.CHAT_INDEX,
      component: () => import('./views/ChatIndexView.vue'),
      meta: defaultAppMeta,
    },
    {
      path: 'create',
      name: RouteName.CHAT_CREATE,
      component: () => import('./views/ChatCreateView.vue'),
      meta: defaultAppMeta,
    },
    {
      path: 'recent',
      name: RouteName.CHAT_RECENT,
      component: () => import('./views/ChatRecentView.vue'),
      meta: defaultAppMeta,
    },
    {
      path: 'history',
      name: RouteName.CHAT_HISTORY,
      beforeEnter: [hasValidRouteQuery],
      component: () => import('./views/ChatHistoryView.vue'),
      meta: defaultAppMeta,
    },
    {
      path: ':id',
      name: RouteName.CHAT_SHOW,
      beforeEnter: [hasValidRouteId],
      component: () => import('./views/ChatShowView.vue'),
      meta: defaultAppMeta,
    },
  ],
};

export default (router: Router) => {
  router.addRoute(moduleRoute);
};
