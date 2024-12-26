// authService.ts
import { $axios } from '@/axios/axiosInstance';
import type { GoogleAuthCallbackQuery } from '@/interfaces/auth/google-auth-callback.interface';
import { getRoute } from '@/utils/route.util';

enum AuthRoute {
  LOGIN = 'auth/login', // POST
  LOGOUT = 'auth/logout', // POST
  REFRESH = 'auth/refresh', // POST
  SOCIAL_AUTH_URL = 'auth/:provider/url', // GET
  CALLBACK_GOOGLE = '/auth/google/callback', // POST
}

interface AuthCredentials {
  email: string;
  password: string;
}

interface AuthUserResponse {
  userData: AuthUserData;
}

interface AuthUserData {
  id: number;
  name: string;
  email: string;
}

interface TokensResponse {
  accessToken: string;
  accessTokenExpiresAt: number;
  refreshToken: string;
  refreshTokenExpiresAt: number;
}

type AuthUrl = string;

interface SocialAuthUrlResponse {
  url: AuthUrl;
}

class AuthServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthServiceError';
  }
}

export function useAuthService() {
  const ac = new AbortController();

  const handleError = (err: unknown, customMessage?: string) => {
    if (err instanceof Error) {
    }
    console.error(err);
    throw new AuthServiceError(customMessage || 'Failed to fetch data');
  };

  async function loginUser(body: AuthCredentials): Promise<TokensResponse> {
    try {
      const route = getRoute(AuthRoute.LOGIN);
      const response = await $axios.post<TokensResponse>(route, body, {
        signal: ac.signal,
      });
      if (response.status !== 200) throw new Error('Login failed');
      return response.data;
    } catch (error) {
      return handleError('Failed to login user');
    }
  }

  async function logoutUser(): Promise<void> {
    const body = {};
    const route = getRoute(AuthRoute.LOGOUT);
    await $axios.post(route, body, {
      signal: ac.signal,
    });
  }

  async function refreshTokens(): Promise<TokensResponse> {
    try {
      const body = {};
      const route = getRoute(AuthRoute.REFRESH);
      const response = await $axios.post<TokensResponse>(route, body, {
        signal: ac.signal,
      });
      if (response.status !== 201) throw new Error('Failed to refresh token');
      return response.data;
    } catch (error) {
      return handleError('Failed to refresh tokens');
    }
  }

  const fetchSocialAuthUrl = async (provider: string) => {
    try {
      const route = getRoute(AuthRoute.SOCIAL_AUTH_URL, {
        ':provider': provider,
      });
      const response = await $axios.get<SocialAuthUrlResponse>(route, {
        signal: ac.signal,
      });

      if (response.status !== 200) {
        throw new Error('Failed to fetch social auth url');
      }

      return response.data;
    } catch (error) {
      return handleError('Failed to fetch social auth url');
    }
  };

  const googleAuth = async (data: GoogleAuthCallbackQuery) => {
    const body = {
      code: data.code,
      scope: data.scope,
      authuser: data.authuser,
      prompt: data.prompt,
    };

    try {
      const route = getRoute(AuthRoute.CALLBACK_GOOGLE);
      const response = await $axios.post<TokensResponse>(route, body, {
        signal: ac.signal,
      });

      if (response.status !== 201) {
        throw new Error('Failed to authenticate with Google');
      }

      return response.data;
    } catch (error) {
      return handleError('Failed to authenticate with Google');
    }
  };

  // TODO: find alternative to onScopeDispose
  // onScopeDispose(() => {
  //   ac.abort();
  // });

  return {
    loginUser,
    logoutUser,
    refreshTokens,
    fetchSocialAuthUrl,
    googleAuth,
  };
}
