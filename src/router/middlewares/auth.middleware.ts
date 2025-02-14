import { useAuthStore } from '@/stores/auth.store';
import type { RouteLocationNormalized } from 'vue-router';
import { RouteName } from '../enums/route-names.enum';

export async function authMiddleware(to: RouteLocationNormalized) {
  const authStore = useAuthStore();

  if (
    to.meta.requiresAuth &&
    !authStore.isAuthenticated &&
    !authStore.hasRefreshToken
  ) {
    return { name: RouteName.LOGIN };
  }

  if (
    to.meta.requiresAuth &&
    !authStore.isAuthenticated &&
    authStore.hasRefreshToken
  ) {
    try {
      await authStore.refreshAuth();
      if (!authStore.isAuthenticated) {
        return { name: RouteName.LOGIN };
      } else {
        return true;
      }
    } catch (error: unknown) {
      console.error('[middleware] Failed to refresh auth', error);
      return { name: RouteName.LOGIN };
    }
  }

  if (
    to.meta.requiresAuth &&
    authStore.isAuthenticated &&
    !authStore.onboardingIsComplete &&
    to.name !== RouteName.ONBOARDING_INDEX
  ) {
    return { name: RouteName.ONBOARDING_INDEX };
  }

  if (to.name === RouteName.LOGIN && authStore.isAuthenticated) {
    return { name: RouteName.HOME };
  }
}
