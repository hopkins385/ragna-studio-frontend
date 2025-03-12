import { HttpStatus } from '@/axios/utils/http-status';
import { BadResponseError } from '@/common/errors/bad-response.error';
import { newApiRequest } from '@/common/http/http-request.builder';
import type { LargeLangModelListResponse } from '@/modules/llm/interfaces';
import { getRoute } from '@/utils/route.util';

const ApiLlmRoute = {
  MODELS: '/llm/models', // GET
} as const;

export class LLMService {
  private ac: AbortController;

  constructor() {
    this.ac = new AbortController();
  }

  async getAllModels() {
    const api = newApiRequest();
    const route = getRoute(ApiLlmRoute.MODELS);
    const { status, data } = await api
      .GET<LargeLangModelListResponse>()
      .setRoute(route)
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return data;
  }

  public abortRequest() {
    this.ac.abort();
    this.ac = new AbortController();
  }
}

export const llmService = new LLMService();
