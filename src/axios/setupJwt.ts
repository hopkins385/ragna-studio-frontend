import { useAuthStore } from '@/stores/auth.store';
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
      config.url === 'auth/refresh'
        ? authStore.getRefreshToken
        : authStore.getAccessToken;
    if (token) {
      setAuthorizationHeader(config, token);
    }
    return config;
  });

  $axios.interceptors.response.use(
    response => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as ExtendedAxiosRequestConfig;

      if (
        error.response?.status === 401 &&
        !originalRequest._retry &&
        authStore.hasRefreshToken
      ) {
        // if route is login do not refresh token
        if (originalRequest.url === 'auth/login') {
          return Promise.reject(error);
        }
        console.log('Refreshing token...');
        console.log('Route', originalRequest.url);

        // TODO: doesnt work, is it needed?
        /*if (isRefreshing) {
          console.log('Token is being refreshed, adding to queue...');
          return new Promise(function (resolve, reject) {
            failedQueue.push({ resolve, reject });
          })
            .then(() => $axios.request(originalRequest))
            .catch(err => Promise.reject(err));
        }*/

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
