import { defaultAppMeta } from '@/router/defaults';
import { RouteName } from '@/router/enums/route-names.enum';
import type { Router } from 'vue-router';

const moduleRoute = {
  path: '/onboarding',
  component: () => import('./OnboardingModule.vue'),
  meta: defaultAppMeta,
  children: [
    {
      path: '',
      name: RouteName.ONBOARDING_INDEX,
      component: () => import('./views/OnboardingIndexView.vue'),
      meta: defaultAppMeta,
    },
  ],
};

export default (router: Router) => {
  router.addRoute(moduleRoute);
};
