import { HttpStatus } from '@/axios/utils/http-status';
import { BadResponseError } from '@/common/errors/bad-response.error';
import { newApiRequest } from '@/common/http/http-request.builder';
import { getRoute } from '@/utils/route.util';

export type ProviderAuthName = 'google' | 'microsoft';
export type ProviderAuthType = 'googledrive' | 'onedrive';

interface ProviderAuthConsentURL {
  url: string;
}

interface ProviderAuthHasAccess {
  hasAccess: boolean;
}

type ProviderAuthConsentURLResponse = ProviderAuthConsentURL;
type ProviderAuthHasAccessResponse = ProviderAuthHasAccess;

const ProviderAuthRoute = {
  GOOGLE: '/google-drive',
  GOOGLE_CONSENT_URL: '/google-drive/consent-url',
  GOOGLE_CALLBACK: '/google-drive/callback',
  GOOGLE_HAS_ACCESS: '/google-drive/has-access',
} as const;

export function useProviderAuthService() {
  const ac = new AbortController();

  const fetchUserHasAccess = async (provider: ProviderAuthName) => {
    const api = newApiRequest();
    const route = getRoute(ProviderAuthRoute.GOOGLE_HAS_ACCESS);
    const { status, data } = await api
      .GET<ProviderAuthHasAccessResponse>()
      .setRoute(route)
      .setSignal(ac.signal)
      .send();

    if (status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return data;
  };

  const fetchConsentURL = async (provider: ProviderAuthName) => {
    const api = newApiRequest();
    const route = getRoute(ProviderAuthRoute.GOOGLE_CONSENT_URL);
    const { status, data } = await api
      .GET<ProviderAuthConsentURLResponse>()
      .setRoute(route)
      .setSignal(ac.signal)
      .send();

    if (status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return data;
  };

  const connectGoogleDrive = async (payload: { code: string }) => {
    const api = newApiRequest();
    const route = getRoute(ProviderAuthRoute.GOOGLE_CALLBACK);
    const { status, data } = await api
      .GET<any, { code: string }>()
      .setRoute(route)
      .setParams(payload)
      .setSignal(ac.signal)
      .send();

    if (status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return data;
  };

  return {
    fetchUserHasAccess,
    fetchConsentURL,
    connectGoogleDrive,
  };
}
