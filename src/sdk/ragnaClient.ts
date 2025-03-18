import type { AxiosError } from 'axios';
import { BaseClient } from './baseClient';
import { configureAuthorizationHeader } from './utils/configure-header.util';
import { AiChatClient } from './v1/clients/ai-chat.client';

type CallBack = () => void;

export class RagnaClient extends BaseClient {
  public readonly aiChat: AiChatClient;

  private getAccessTokenCallback?: CallBack;
  private getRefreshTokenCallback?: CallBack;
  private setTokensCallback?: CallBack;
  private onRefreshFailedCallback?: CallBack;

  private failedQueue: Array<{
    resolve: (value?: unknown) => void;
    reject: (error: any) => void;
  }> = [];

  private isRefreshing = false;

  constructor(options?: { baseURL?: string; timeout?: number }) {
    super(options);

    this.aiChat = new AiChatClient(this);

    this.setupRequestInterceptor();
    this.setupResponseInterceptor();
  }

  get getAccessToken(): string | null {
    if (!this.accessToken) {
      const response = this.getAccessTokenCallback?.();
      this.accessToken = response?.accessToken || null;
    }
    return this.accessToken || null;
  }
  get getRefreshToken(): string | null {
    if (!this.refreshToken) {
      const response = this.getRefreshTokenCallback?.();
      this.refreshToken = response?.refreshToken || null;
    }
    return this.refreshToken;
  }

  private setupRequestInterceptor() {
    this.axiosInstance.interceptors.request.use(config => {
      const token =
        config.url === AuthRoutePath.REFRESH ? this.getRefreshToken : this.getAccessToken;
      if (token) {
        configureAuthorizationHeader(config, token);
      }
      return config;
    });
  }

  private setupResponseInterceptor() {
    // Auto refresh token
    this.axiosInstance.interceptors.response.use(
      response => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as ExtendedAxiosRequestConfig;

        if (error.response?.status === 401 && !originalRequest._retry && this.getRefreshToken) {
          // do not auto refresh token for these routes
          if (
            originalRequest.url === AuthRoutePath.REFRESH ||
            originalRequest.url === AuthRoutePath.LOGIN ||
            originalRequest.url === AuthRoutePath.CALLBACK_GOOGLE ||
            originalRequest.url === AuthRoutePath.SOCIAL_AUTH_URL ||
            originalRequest.url === AuthRoutePath.REGISTER
          ) {
            return Promise.reject(error);
          }

          console.log('Refreshing token...');
          console.log('Route', originalRequest.url);

          originalRequest._retry = 1;
          this.isRefreshing = true;

          try {
            await authStore.refreshAuth();
            this.processQueue(null, this.getAccessToken);
            return this.axiosInstance.request(originalRequest);
          } catch (err) {
            this.processQueue(err, null);
            return Promise.reject(err);
          } finally {
            this.isRefreshing = false;
          }
        }

        return Promise.reject(error);
      },
    );
  }

  private processQueue(error: any, token: string | null = null) {
    this.failedQueue.forEach(prom => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve(token);
      }
    });
    this.failedQueue = [];
  }
}
