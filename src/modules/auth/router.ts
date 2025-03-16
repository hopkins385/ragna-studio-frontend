import { defaultAppMeta } from '@/router/defaults';
import { RouteName } from '@/router/enums/route-names.enum';
import { Layout } from '@/router/middlewares/layout.middleware';
import type { Router } from 'vue-router';

export const AuthRoutePath = {
  LOGIN: '/login',
  LOGOUT: '/logout',
  REGISTER: '/register',
  REFRESH: '/auth/refresh', // api backend route
  SOCIAL_AUTH_URL: undefined, // '/auth/:provider/url',
  CALLBACK_GOOGLE: undefined, // '/auth/google/callback',
} as const;

const moduleRoutes = [
  {
    path: AuthRoutePath.LOGIN,
    name: RouteName.LOGIN,
    component: () => import('./views/LoginView.vue'),
    meta: {
      requiresAuth: false,
      layout: Layout.Login,
    },
  },
  {
    path: AuthRoutePath.REGISTER,
    name: RouteName.REGISTER,
    component: () => import('./views/RegisterView.vue'),
    meta: {
      requiresAuth: false,
      layout: Layout.Login,
    },
  },
  {
    path: AuthRoutePath.LOGOUT,
    name: RouteName.LOGOUT,
    component: () => import('./views/LogoutView.vue'),
    meta: defaultAppMeta,
  },
  // TODO: social login routes
  // {
  //   path: AuthRoutePath.SOCIAL_AUTH_URL,
  //   name: RouteName.SOCIAL_AUTH_CALLBACK,
  //   beforeEnter: [hasValidGoogleCallbackQuery],
  //   component: () => import('@views/auth/SocialAuthCallbackView.vue'),
  //   meta: {
  //     requiresAuth: false,
  //     layout: Layout.Login,
  //   },
  // },
];

export default (router: Router) => {
  moduleRoutes.forEach(route => {
    router.addRoute(route);
  });
};
