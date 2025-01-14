import { AuthRoute } from '@composables/services/useAuthService';
import { useAuthStore } from '@stores/auth.store';
import type { AxiosError, AxiosRequestConfig } from 'axios';
import { $axios } from './axiosInstance';

const MAX_REFRESH_RETRIES = 3;

interface ExtendedAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: number;
}

// setupJwt.ts
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

function setAuthorizationHeader(config: AxiosRequestConfig, token: string) {
  if (!config.headers) {
    config.headers = {};
  }
  config.headers.Authorization = `Bearer ${token}`;
}

export function setupAxiosJwtInterceptor() {
  const authStore = useAuthStore();

  $axios.interceptors.request.use(config => {
    const token =
      config.url === AuthRoute.REFRESH
        ? authStore.getRefreshToken
        : authStore.getAccessToken;
    if (token) {
      setAuthorizationHeader(config, token);
    }
    return config;
  });

  // Auto refresh token
  $axios.interceptors.response.use(
    response => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as ExtendedAxiosRequestConfig;

      if (
        error.response?.status === 401 &&
        !originalRequest._retry &&
        authStore.hasRefreshToken
      ) {
        // do not auto refresh token for these routes
        if (
          originalRequest.url === AuthRoute.REFRESH ||
          originalRequest.url === AuthRoute.LOGIN ||
          originalRequest.url === AuthRoute.CALLBACK_GOOGLE ||
          originalRequest.url === AuthRoute.SOCIAL_AUTH_URL ||
          originalRequest.url === AuthRoute.REGISTER
        ) {
          return Promise.reject(error);
        }

        console.log('Refreshing token...');
        console.log('Route', originalRequest.url);

        originalRequest._retry = 1;
        isRefreshing = true;

        try {
          await authStore.refreshAuth();
          processQueue(null, authStore.getAccessToken);
          return $axios.request(originalRequest);
        } catch (err) {
          processQueue(err, null);
          return Promise.reject(err);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    },
  );
}
