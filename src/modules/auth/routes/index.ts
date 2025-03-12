import { defaultAppMeta } from '@/router/defaults';
import { RouteName } from '@/router/enums/route-names.enum';
import { Layout } from '@/router/middlewares/layout.middleware';
import { hasValidGoogleCallbackQuery } from '@/utils/route-validation.util';

export const AuthRoutePath = {
  LOGIN: '/login',
  LOGOUT: '/logout',
  REGISTER: '/register',
  REFRESH: '/auth/refresh',
  SOCIAL_AUTH_URL: '/auth/:provider/url',
  CALLBACK_GOOGLE: '/auth/google/callback',
} as const;

export const authRoutes = [
  {
    path: AuthRoutePath.LOGIN,
    name: RouteName.LOGIN,
    component: () => import('@views/auth/LoginView.vue'),
    meta: {
      requiresAuth: false,
      layout: Layout.Login,
    },
  },
  {
    path: AuthRoutePath.REGISTER,
    name: RouteName.REGISTER,
    component: () => import('@views/auth/RegisterView.vue'),
    meta: {
      requiresAuth: false,
      layout: Layout.Login,
    },
  },
  {
    path: AuthRoutePath.REFRESH,
    name: RouteName.LOGOUT,
    component: () => import('@views/auth/LogoutView.vue'),
    meta: defaultAppMeta,
  },
  {
    path: AuthRoutePath.SOCIAL_AUTH_URL,
    name: RouteName.SOCIAL_AUTH_CALLBACK,
    beforeEnter: [hasValidGoogleCallbackQuery],
    component: () => import('@views/auth/SocialAuthCallbackView.vue'),
    meta: {
      requiresAuth: false,
      layout: Layout.Login,
    },
  },
];
