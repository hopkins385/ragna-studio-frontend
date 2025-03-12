import { HttpStatus } from '@/axios/utils/http-status';
import { BadResponseError } from '@/common/errors/bad-response.error';
import { UnauthorizedError } from '@/common/errors/unauthorized.error';
import { newApiRequest } from '@/common/http/http-request.builder';
import type { GoogleAuthCallbackQuery } from '@/interfaces/auth/google-auth-callback.interface';
import type {
  AuthCredentials,
  AuthUserResponse,
  EmptyBodyData,
  RegistrationCredentials,
  SocialAuthUrlResponse,
  TokensResponse,
} from '@/modules/auth/interfaces/auth.interfaces';
import { getRoute } from '@/utils/route.util';

export const ApiAuthRoute = {
  LOGIN: '/auth/login', // POST
  LOGOUT: '/auth/logout', // POST
  REGISTER: '/auth/register', // POST
  REFRESH: '/auth/refresh', // POST
  SESSION: '/auth/session', // GET
  SOCIAL_AUTH_URL: '/auth/:provider/url', // GET
  CALLBACK_GOOGLE: '/auth/google/callback', // POST
} as const;

const emptyBodyData: EmptyBodyData = {};

export class AuthService {
  private ac: AbortController;

  constructor() {
    this.ac = new AbortController();
  }

  async loginUser(body: AuthCredentials) {
    this.abortRequest();
    const api = newApiRequest();
    const route = getRoute(ApiAuthRoute.LOGIN);
    const { status, data } = await api
      .POST<TokensResponse, never, AuthCredentials>()
      .setRoute(route)
      .setData(body)
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.CREATED) {
      throw new UnauthorizedError('Invalid credentials');
    }

    return data;
  }

  async logoutUser(): Promise<void> {
    this.abortRequest();
    const api = newApiRequest();
    const route = getRoute(ApiAuthRoute.LOGOUT);
    const { status } = await api
      .POST<never, never, EmptyBodyData>()
      .setRoute(route)
      .setData(emptyBodyData)
      .setSignal(this.ac.signal)
      .send();

    // Logout should always return 200 (OK) status
    if (status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return;
  }

  async registerUser(payload: RegistrationCredentials) {
    this.abortRequest();
    const api = newApiRequest();
    const route = getRoute(ApiAuthRoute.REGISTER);
    const { status, data } = await api
      .POST<AuthUserResponse, never, RegistrationCredentials>()
      .setRoute(route)
      .setData(payload)
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.CREATED) {
      throw new BadResponseError();
    }

    return data;
  }

  async fetchSession() {
    const api = newApiRequest();
    const route = getRoute(ApiAuthRoute.SESSION);
    const { status, data } = await api
      .GET<AuthUserResponse>()
      .setRoute(route)
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return data;
  }

  async refreshTokens() {
    const api = newApiRequest();
    const route = getRoute(ApiAuthRoute.REFRESH);
    const { status, data } = await api
      .POST<TokensResponse, never, EmptyBodyData>()
      .setRoute(route)
      .setData(emptyBodyData)
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.CREATED) {
      throw new BadResponseError();
    }

    return data;
  }

  async fetchSocialAuthUrl(provider: string) {
    const api = newApiRequest();
    const route = getRoute(ApiAuthRoute.SOCIAL_AUTH_URL, {
      ':provider': provider,
    });
    const { status, data } = await api
      .GET<SocialAuthUrlResponse>()
      .setRoute(route)
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return data;
  }

  async googleAuth(callbackData: GoogleAuthCallbackQuery) {
    const api = newApiRequest();
    const route = getRoute(ApiAuthRoute.CALLBACK_GOOGLE);
    const { status, data } = await api
      .POST<TokensResponse, never, GoogleAuthCallbackQuery>()
      .setRoute(route)
      .setData(callbackData)
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.CREATED) {
      throw new BadResponseError();
    }

    return data;
  }

  // Helpers
  public abortRequest(): void {
    this.ac.abort();
    this.ac = new AbortController();
  }
}

export const authService = new AuthService();
