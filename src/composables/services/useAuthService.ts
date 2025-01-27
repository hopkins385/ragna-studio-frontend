// authService.ts
import { BadResponseError } from '@/common/errors/bad-response.error';
import { UnauthorizedError } from '@/common/errors/unauthorized.error';
import { newApiRequest } from '@/common/http/http-request.builder';
import type { GoogleAuthCallbackQuery } from '@/interfaces/auth/google-auth-callback.interface';
import { getRoute } from '@/utils/route.util';

export const AuthRoute = {
  LOGIN: '/auth/login', // POST
  LOGOUT: '/auth/logout', // POST
  REGISTER: '/auth/register', // POST
  REFRESH: '/auth/refresh', // POST
  SESSION: '/auth/session', // GET
  SOCIAL_AUTH_URL: '/auth/:provider/url', // GET
  CALLBACK_GOOGLE: '/auth/google/callback', // POST
} as const;

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

interface EmptyBodyData {}

const emptyBodyData: EmptyBodyData = {};

export function useAuthService() {
  const ac = new AbortController();

  const loginUser = async (body: AuthCredentials) => {
    const api = newApiRequest();
    const route = getRoute(AuthRoute.LOGIN);
    const { status, data } = await api
      .POST<TokensResponse, never, AuthCredentials>()
      .setRoute(route)
      .setData(body)
      .setSignal(ac.signal)
      .send();

    if (status !== 201) {
      throw new UnauthorizedError('Invalid credentials');
    }

    return data;
  };

  const logoutUser = async (): Promise<void> => {
    const api = newApiRequest();
    const route = getRoute(AuthRoute.LOGOUT);
    const { status } = await api
      .POST<never, never, EmptyBodyData>()
      .setRoute(route)
      .setData(emptyBodyData)
      .setSignal(ac.signal)
      .send();

    // Logout should always return 200 (OK) status
    if (status !== 200) {
      throw new BadResponseError();
    }

    return;
  };

  const registerUser = async (payload: RegistrationCredentials) => {
    const api = newApiRequest();
    const route = getRoute(AuthRoute.REGISTER);
    const { status, data } = await api
      .POST<AuthUserResponse, never, RegistrationCredentials>()
      .setRoute(route)
      .setData(payload)
      .setSignal(ac.signal)
      .send();

    if (status !== 201) {
      throw new BadResponseError();
    }

    return data;
  };

  const fetchSession = async () => {
    const api = newApiRequest();
    const route = getRoute(AuthRoute.SESSION);
    const { status, data } = await api
      .GET<AuthUserResponse>()
      .setRoute(route)
      .setSignal(ac.signal)
      .send();

    if (status !== 200) {
      throw new BadResponseError();
    }

    return data;
  };

  const refreshTokens = async () => {
    const api = newApiRequest();
    const route = getRoute(AuthRoute.REFRESH);
    const { status, data } = await api
      .POST<TokensResponse, never, EmptyBodyData>()
      .setRoute(route)
      .setData(emptyBodyData)
      .setSignal(ac.signal)
      .send();

    if (status !== 201) {
      throw new BadResponseError();
    }

    return data;
  };

  const fetchSocialAuthUrl = async (provider: string) => {
    const api = newApiRequest();
    const route = getRoute(AuthRoute.SOCIAL_AUTH_URL, {
      ':provider': provider,
    });
    const { status, data } = await api
      .GET<SocialAuthUrlResponse>()
      .setRoute(route)
      .setSignal(ac.signal)
      .send();

    if (status !== 200) {
      throw new BadResponseError();
    }

    return data;
  };

  const googleAuth = async (callbackData: GoogleAuthCallbackQuery) => {
    const api = newApiRequest();
    const route = getRoute(AuthRoute.CALLBACK_GOOGLE);
    const { status, data } = await api
      .POST<TokensResponse, never, GoogleAuthCallbackQuery>()
      .setRoute(route)
      .setData(callbackData)
      .setSignal(ac.signal)
      .send();

    if (status !== 201) {
      throw new BadResponseError();
    }

    return data;
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
