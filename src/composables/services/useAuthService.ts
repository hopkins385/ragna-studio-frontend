// authService.ts
import { $axios } from '@/axios/axiosInstance';
import { UnauthorizedError } from '@/common/errors/unauthorized.error';
import type { GoogleAuthCallbackQuery } from '@/interfaces/auth/google-auth-callback.interface';
import { getRoute } from '@/utils/route.util';
import { AxiosError } from 'axios';

enum AuthRoute {
  LOGIN = 'auth/login', // POST
  LOGOUT = 'auth/logout', // POST
  REGISTER = 'auth/register', // POST
  REFRESH = 'auth/refresh', // POST
  SESSION = 'auth/session', // GET
  SOCIAL_AUTH_URL = 'auth/:provider/url', // GET
  CALLBACK_GOOGLE = '/auth/google/callback', // POST
}

interface AuthCredentials {
  email: string;
  password: string;
}

interface RegistrationCredentials {
  name: string;
  email: string;
  password: string;
  termsAndConditions: boolean;
  invitationCode?: string;
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

  const handleError = (err: unknown) => {
    if (err instanceof AxiosError) {
      switch (err.response?.status) {
        case 401:
          throw new UnauthorizedError('Invalid credentials');
        case 403:
          throw new AuthServiceError('User is not verified');
        case 404:
          throw new AuthServiceError('User not found');
        default:
          throw new AuthServiceError('Unknown error');
      }
    }

    throw new AuthServiceError('Unknown error');
  };

  const loginUser = async (body: AuthCredentials) => {
    try {
      const route = getRoute(AuthRoute.LOGIN);
      const response = await $axios.post<TokensResponse>(route, body, {
        signal: ac.signal,
      });

      if (response.status !== 200) {
        throw new Error('Failed to login user');
      }

      return response.data;
    } catch (error) {
      return handleError(error);
    }
  };

  const logoutUser = async (): Promise<void> => {
    try {
      const body = {};
      const route = getRoute(AuthRoute.LOGOUT);
      await $axios.post(route, body, {
        signal: ac.signal,
      });
    } catch (error) {
      return handleError(error);
    }
  };

  const registerUser = async (payload: RegistrationCredentials) => {
    const body = {
      name: payload.name,
      email: payload.email,
      password: payload.password,
      termsAndConditions: payload.termsAndConditions,
      invitationCode: payload.invitationCode,
    };
    try {
      const route = getRoute(AuthRoute.REGISTER);
      const response = await $axios.post<AuthUserResponse>(route, body, {
        signal: ac.signal,
      });

      if (response.status !== 201) {
        throw new Error('Failed to register user');
      }

      return response.data;
    } catch (error) {
      return handleError(error);
    }
  };

  const fetchSession = async () => {
    try {
      const route = getRoute(AuthRoute.SESSION);
      const response = await $axios.get<AuthUserResponse>(route, {
        signal: ac.signal,
      });

      if (response.status !== 200) {
        throw new Error('Failed to fetch session');
      }

      return response.data;
    } catch (error) {
      return handleError(error);
    }
  };

  const refreshTokens = async () => {
    try {
      const body = {};
      const route = getRoute(AuthRoute.REFRESH);
      const response = await $axios.post<TokensResponse>(route, body, {
        signal: ac.signal,
      });
      if (response.status !== 201) {
        throw new Error('Failed to refresh token');
      }
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  };

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
      return handleError(error);
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
      return handleError(error);
    }
  };

  // TODO: find alternative to onScopeDispose
  // onScopeDispose(() => {
  //   ac.abort();
  // });

  return {
    loginUser,
    logoutUser,
    registerUser,
    refreshTokens,
    fetchSession,
    fetchSocialAuthUrl,
    googleAuth,
  };
}
