import { HttpStatus } from '@/axios/utils/http-status';
import { BadResponseError } from '@/common/errors/bad-response.error';
import { BaseApiService } from '@/common/service/base-api.service';
import type {
  ProviderAuthConsentURLResponse,
  ProviderAuthHasAccessResponse,
  ProviderAuthName,
} from '@/modules/auth/interfaces/auth-provider.interfaces';
import { getRoute } from '@/utils/route.util';

const ApiProviderAuthRoute = {
  GOOGLE: '/google-drive',
  GOOGLE_CONSENT_URL: '/google-drive/consent-url',
  GOOGLE_CALLBACK: '/google-drive/callback',
  GOOGLE_HAS_ACCESS: '/google-drive/has-access',
} as const;

export class AuthProviderService extends BaseApiService {
  constructor() {
    super();
  }

  public async fetchUserHasAccess(provider: ProviderAuthName) {
    const route = getRoute(ApiProviderAuthRoute.GOOGLE_HAS_ACCESS);
    const { status, data } = await this.api
      .GET<ProviderAuthHasAccessResponse>()
      .setRoute(route)
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return data;
  }

  public async fetchConsentURL(provider: ProviderAuthName) {
    const route = getRoute(ApiProviderAuthRoute.GOOGLE_CONSENT_URL);
    const { status, data } = await this.api
      .GET<ProviderAuthConsentURLResponse>()
      .setRoute(route)
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return data;
  }

  public async connectGoogleDrive(payload: { code: string }) {
    const route = getRoute(ApiProviderAuthRoute.GOOGLE_CALLBACK);
    const { status, data } = await this.api
      .GET<any, { code: string }>()
      .setRoute(route)
      .setParams(payload)
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return data;
  }
}

export const authProviderService = new AuthProviderService();
