import { BadResponseError } from '@/common/errors/bad-response.error';
import { newApiRequest } from '@/common/http/http-request.builder';
import { getRoute } from '@/utils/route.util';

const OnboardingRoute = {
  USER: '/onboard/user', // POST
} as const;

interface OnboardingResponse {
  success: boolean;
}

export function useOnboardingService() {
  const ac = new AbortController();

  async function onboardUser(payload: {
    orgName: string;
  }): Promise<OnboardingResponse> {
    const api = newApiRequest();
    const route = getRoute(OnboardingRoute.USER);
    const { status, data } = await api
      .POST<OnboardingResponse, never, { orgName: string }>()
      .setRoute(route)
      .setData(payload)
      .setSignal(ac.signal)
      .send();

    if (status !== 201) {
      throw new BadResponseError();
    }

    return data;
  }

  onScopeDispose(() => {
    ac.abort();
  });

  return {
    onboardUser,
  };
}
