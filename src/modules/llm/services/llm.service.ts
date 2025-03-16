import { HttpStatus } from '@/axios/utils/http-status';
import { BadResponseError } from '@/common/errors/bad-response.error';
import { BaseApiService } from '@/common/service/base-api.service';
import type { LargeLangModelListResponse } from '@/modules/llm/interfaces';
import { getRoute } from '@/utils/route.util';

const ApiLlmRoute = {
  MODELS: '/llm/models', // GET
} as const;

export class LLMService extends BaseApiService {
  constructor() {
    super();
  }

  async getAllModels() {
    const route = getRoute(ApiLlmRoute.MODELS);
    const { status, data } = await this.api
      .GET<LargeLangModelListResponse>()
      .setRoute(route)
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return data;
  }
}

export const llmService = new LLMService();
