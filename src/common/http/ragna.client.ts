import { useAuthStore } from '@/modules/auth/stores/auth.store';
import { RagnaClient } from 'ragna-sdk';
import type { Plugin } from 'vue';

let ragnaClient: RagnaClient;

export function getRagnaClient() {
  const authStore = useAuthStore();

  if (ragnaClient) {
    return ragnaClient;
  }

  ragnaClient = new RagnaClient({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    timeout: 10000,
    getAccessTokenCallback: () => authStore.getAccessToken,
    getRefreshTokenCallback: () => authStore.getRefreshToken,
  });

  return ragnaClient;
}

const ragnaClientPlugin: Plugin = {
  install(app) {
    app.config.globalProperties.$ragnaClient = ragnaClient;
  },
};
export default ragnaClientPlugin;
export { ragnaClient };
