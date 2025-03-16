import { HttpStatus } from '@/axios/utils/http-status';
import { BadResponseError } from '@/common/errors/bad-response.error';
import { BaseApiService } from '@/common/service/base-api.service';
import type { CreatePromptResponse } from '@/modules/prompt-wizard/interfaces';
import { getRoute } from '@/utils/route.util';

const ApiPromptWizardRoute = {
  CREATE: '/prompt-wizard/create', // POST
} as const;

export class PromptWizardService extends BaseApiService {
  constructor() {
    super();
  }

  async createPrompt(payload: {}) {
    const route = getRoute(ApiPromptWizardRoute.CREATE);
    const { status, data } = await this.api
      .POST<CreatePromptResponse, never, {}>()
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

export const promptWizardService = new PromptWizardService();
