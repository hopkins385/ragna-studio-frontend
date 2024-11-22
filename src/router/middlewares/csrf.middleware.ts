import { useCsrfStore } from '@/stores/csrf.store';

export async function csrfMiddleware() {
  const csrfStore = useCsrfStore();

  if (!csrfStore.hasToken) {
    try {
      await csrfStore.getToken();
    } catch (error) {
      console.error('[middleware] Failed to fetch CSRF token', error);
    }
  }
}
