import { useAuthStore } from '@/modules/auth/stores/auth.store';
import type { RouteLocationNormalized } from 'vue-router';

export function authMiddleware(to: RouteLocationNormalized) {
  const authStore = useAuthStore();
}
