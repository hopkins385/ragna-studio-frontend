import { $axios } from '@/axios/axiosInstance';
import { retryWithExponentialBackoff } from '@/utils/backoff/exponentialBackoff';
import type { AxiosResponse, AxiosError } from 'axios';
import { defineStore } from 'pinia';

interface QueueItem {
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}

interface ICsrfStore {
  token: string | null;
  isRefreshing: boolean;
  failedQueue: QueueItem[];
  lastRefresh: number | null;
}

interface CsrfTokenResponse {
  csrfToken: string;
}

type FetchTokenResponse = AxiosResponse<CsrfTokenResponse>;

const CSRF_ROUTE = '/csrf/token';
const CSRF_HEADER = 'X-CSRF-TOKEN';
const TOKEN_EXPIRY = 3600000; // 1 hour in milliseconds
const MAX_RETRIES = 3;

export const useCsrfStore = defineStore('csrf-store', {
  state: (): ICsrfStore => ({
    token: null,
    isRefreshing: false,
    failedQueue: [],
    lastRefresh: null,
  }),

  getters: {
    hasToken(): boolean {
      return !!this.token && this.token.length > 0;
    },
  },

  actions: {
    async getToken(): Promise<string | null> {
      if (!this.hasToken) {
        await this.fetchToken();
      }
      return this.token;
    },

    setToken(token: string | null): void {
      this.token = token;
      this.lastRefresh = token ? Date.now() : null;

      if (token) {
        $axios.defaults.headers.common[CSRF_HEADER] = token;
      } else {
        delete $axios.defaults.headers.common[CSRF_HEADER];
      }
    },

    async fetchToken(): Promise<void> {
      try {
        const response = await retryWithExponentialBackoff<FetchTokenResponse>(
          () => $axios.get(CSRF_ROUTE),
          {
            retries: MAX_RETRIES,
            factor: 2,
            delay: 1000,
          },
        );
        this.setToken(response.data.csrfToken);
      } catch (error) {
        this.setToken(null);
        throw new Error('Failed to fetch CSRF token');
      }
    },

    async addRequestToQueue(
      callback: () => Promise<unknown>,
    ): Promise<unknown> {
      return new Promise((resolve, reject) => {
        this.failedQueue.push({ resolve, reject });
      }).then(() => callback());
    },

    processQueue(error: Error | null): void {
      this.failedQueue.forEach(request => {
        if (error) {
          request.reject(error);
        } else {
          request.resolve(undefined);
        }
      });
      this.failedQueue = [];
    },

    clearToken(): void {
      this.setToken(null);
      this.lastRefresh = null;
    },

    reset(): void {
      this.token = null;
      this.isRefreshing = false;
      this.failedQueue = [];
      this.lastRefresh = null;
      delete $axios.defaults.headers.common[CSRF_HEADER];
    },
  },
});
