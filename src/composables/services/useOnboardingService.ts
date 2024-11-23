import { $axios } from '@/axios/axiosInstance';
import { getRoute } from '@/utils/route.util';

enum OnboardingRoute {
  USER = '/onboard/user', // POST
}

interface OnboardingResponse {
  success: boolean;
}

class OnboardingServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'OnboardingServiceError';
  }
}

export function useOnboardingService() {
  const ac = new AbortController();

  onScopeDispose(() => {
    ac.abort();
  });

  async function onboardUser({
    orgName,
  }: {
    orgName: string;
  }): Promise<OnboardingResponse> {
    const body = { orgName };
    try {
      const route = getRoute(OnboardingRoute.USER);
      const response = await $axios.post<OnboardingResponse>(route, body, {
        signal: ac.signal,
      });
      if (response.status !== 201) {
        throw new Error('Onboarding failed');
      }
      return response.data;
    } catch (error) {
      console.error('Failed to onboard user:', error);
      throw new OnboardingServiceError('Failed to onboard user');
    }
  }

  return {
    onboardUser,
  };
}
