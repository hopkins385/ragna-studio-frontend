import { useAuthStore } from '@/stores/auth.store';
import type { RouteLocationNormalized } from 'vue-router';

export async function authMiddleware(to: RouteLocationNormalized) {
  const authStore = useAuthStore();

  if (
    to.meta.requiresAuth &&
    !authStore.isAuthenticated &&
    !authStore.hasRefreshToken
  ) {
    return { name: 'login' };
  }

  if (
    to.meta.requiresAuth &&
    !authStore.isAuthenticated &&
    authStore.hasRefreshToken
  ) {
    try {
      await authStore.refreshAuth();
      if (!authStore.isAuthenticated) {
        return { name: 'login' };
      } else {
        return true;
      }
    } catch (error: unknown) {
      console.error('[middleware] Failed to refresh auth');
      return { name: 'login' };
    }
  }

  if (to.name === 'login' && authStore.isAuthenticated) {
    return { name: 'home' };
  }
}
