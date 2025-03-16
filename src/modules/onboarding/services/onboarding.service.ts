import { HttpStatus } from '@/axios/utils/http-status';
import { BadResponseError } from '@/common/errors/bad-response.error';
import { BaseApiService } from '@/common/service/base-api.service';
import type { OnboardingResponse } from '@/modules/onboarding/interfaces';
import { getRoute } from '@/utils/route.util';

const ApiOnboardingRoute = {
  USER: '/onboard/user', // POST
} as const;

export class OnboardingService extends BaseApiService {
  constructor() {
    super();
  }

  async onboardUser(payload: { orgName: string }): Promise<OnboardingResponse> {
    const route = getRoute(ApiOnboardingRoute.USER);
    const { status, data } = await this.api
      .POST<OnboardingResponse, never, { orgName: string }>()
      .setRoute(route)
      .setData(payload)
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.CREATED) {
      throw new BadResponseError();
    }

    return data;
  }
}

export const onboardingService = new OnboardingService();
