import { HttpStatus } from '@/axios/utils/http-status';
import { BadResponseError } from '@/common/errors/bad-response.error';
import { newApiRequest, type ApiRequest } from '@/common/http/http-request.builder';
import type { AssistantToolResponse } from '@/modules/assistant-tool/interfaces/assistant-tool.interfaces';
import { getRoute } from '@/utils/route.util';

const ApiAssistantToolRoute = {
  TOOLS: '/assistant-tool/tools', // GET
} as const;

export class AssistantToolService {
  private ac: AbortController;
  private api: ApiRequest;

  constructor() {
    this.ac = new AbortController();
    this.api = newApiRequest();
  }

  async fetchAllTools() {
    const route = getRoute(ApiAssistantToolRoute.TOOLS);
    const { status, data } = await this.api
      .GET<AssistantToolResponse>()
      .setRoute(route)
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return data;
  }

  /**
   * Abort the current request
   */
  abortRequest() {
    this.ac.abort();
    this.ac = new AbortController();
  }
}

export const assistantToolService = new AssistantToolService();
