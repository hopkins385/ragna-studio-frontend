import { useAuthStore } from '@/modules/auth/stores/auth.store';
import { RagnaClient } from 'ragna-sdk';

let ragnaClient: RagnaClient;

export function getRagnaClient() {
  const authStore = useAuthStore();

  if (ragnaClient) {
    return ragnaClient;
  }

  ragnaClient = new RagnaClient({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    timeout: 300000, // 5 minutes
    getAccessTokenCallback: () => authStore.getAccessToken,
    getRefreshTokenCallback: () => authStore.getRefreshToken,
    refreshAuthCallback: authStore.refreshAuth,
  });

  return ragnaClient;
}
