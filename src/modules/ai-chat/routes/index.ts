import { defaultAppMeta } from '@/router/defaults';
import { RouteName } from '@/router/enums/route-names.enum';
import { hasValidRouteId, hasValidRouteQuery } from '@/utils/route-validation.util';

export const chatRoutes = {
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
