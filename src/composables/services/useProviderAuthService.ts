import { $axios } from '@/axios/axiosInstance';
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

enum ProviderAuthRoute {
  GOOGLE = 'google-drive',
  GOOGLE_CONSENT_URL = 'google-drive/consent-url',
  GOOGLE_CALLBACK = 'google-drive/callback',
  GOOGLE_HAS_ACCESS = 'google-drive/has-access',
}

class ProviderAuthServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ProviderAuthServiceError';
  }
}

export function useProviderAuthService() {
  const fetchUserHasAccess = async (provider: ProviderAuthName) => {
    try {
      const route = getRoute(ProviderAuthRoute.GOOGLE_HAS_ACCESS);
      const response = await $axios.get<ProviderAuthHasAccessResponse>(route);
      if (!response.data) {
        throw new Error('No data received');
      }
      return response.data;
    } catch (error) {
      throw new ProviderAuthServiceError('Failed to fetch user access');
    }
  };

  const fetchConsentURL = async (provider: ProviderAuthName) => {
    try {
      const route = getRoute(ProviderAuthRoute.GOOGLE_CONSENT_URL);
      const response = await $axios.get<ProviderAuthConsentURLResponse>(route);
      if (!response.data) {
        throw new Error('No data received');
      }
      return response.data;
    } catch (error) {
      throw new ProviderAuthServiceError('Failed to fetch consent URL');
    }
  };

  const connectGoogleDrive = async (payload: { code: string }) => {
    try {
      const route = getRoute(ProviderAuthRoute.GOOGLE_CALLBACK);
      const params = {
        code: payload.code,
      };
      const response = await $axios.get(route, {
        params,
      });
      if (!response.data) {
        throw new Error('No data received');
      }
      return response.data;
    } catch (error) {
      throw new ProviderAuthServiceError('Failed to connect provider');
    }
  };

  return {
    fetchUserHasAccess,
    fetchConsentURL,
    connectGoogleDrive,
  };
}
