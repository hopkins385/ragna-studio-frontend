import { useCsrfStore } from '@/stores/csrf.store';
import { $axios } from './axiosInstance';
import type { AxiosError, AxiosRequestConfig } from 'axios';

const CSRF_ERROR_MESSAGE = 'invalid csrf token';
const MAX_RETRY_ATTEMPTS = 1;
const RETRY_TIMEOUT = 5000;

interface RetryConfig extends AxiosRequestConfig {
  _retry?: boolean;
  _retryCount?: number;
}

export class RefreshTimeoutError extends Error {
  constructor() {
    super('Timeout while refreshing CSRF token');
    this.name = 'RefreshTimeoutError';
  }
}

export function setupAxiosInterceptors() {
  const csrfStore = useCsrfStore();

  const isCsrfError = (error: AxiosError): boolean => {
    return (
      error.response?.status === 403 &&
      (error.response?.data as { message: string })?.message ===
        CSRF_ERROR_MESSAGE
    );
  };

  $axios.interceptors.response.use(
    response => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as RetryConfig;

      if (
        isCsrfError(error) &&
        (!originalRequest._retry ||
          (originalRequest._retryCount ?? 0) < MAX_RETRY_ATTEMPTS)
      ) {
        originalRequest._retry = true;
        originalRequest._retryCount = (originalRequest._retryCount ?? 0) + 1;

        if (csrfStore.isRefreshing) {
          return new Promise((resolve, reject) => {
            const timeoutId = setTimeout(() => {
              reject(new RefreshTimeoutError());
            }, RETRY_TIMEOUT);

            csrfStore.addRequestToQueue(async () => {
              clearTimeout(timeoutId);
              try {
                const response = await $axios(originalRequest);
                resolve(response);
              } catch (err) {
                reject(err);
              }
            });
          });
        }

        try {
          csrfStore.isRefreshing = true;
          await csrfStore.fetchToken();
          csrfStore.processQueue(null);
          return $axios(originalRequest);
        } catch (err: any) {
          csrfStore.processQueue(err);
          csrfStore.clearToken();
          throw err;
        } finally {
          csrfStore.isRefreshing = false;
        }
      }

      throw error;
    },
  );
}
