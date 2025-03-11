import { useAuthStore } from '@/modules/auth/stores/auth.store';
import type { RouteLocationNormalized } from 'vue-router';
import { RouteName } from '../enums/route-names.enum';

export async function adminMiddleware(to: RouteLocationNormalized) {
  const authStore = useAuthStore();

  if (to.meta.requiresAdmin && !authStore.userHasAdminRole) {
    return { name: RouteName.NOT_FOUND };
  }
}
