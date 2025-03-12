import { HttpStatus } from '@/axios/utils/http-status';
import { BadResponseError } from '@/common/errors/bad-response.error';
import { newApiRequest } from '@/common/http/http-request.builder';
import type { AssistantToolResponse } from '@/modules/assistant-tool/interfaces/assistant-tool.interfaces';
import { getRoute } from '@/utils/route.util';

const APIAssistantToolRoute = {
  TOOLS: '/assistant-tool/tools', // GET
} as const;

export class AssistantToolService {
  private ac: AbortController;

  constructor() {
    this.ac = new AbortController();
  }

  async fetchAllTools() {
    this.abortRequest();
    const api = newApiRequest();
    const route = getRoute(APIAssistantToolRoute.TOOLS);
    const { status, data } = await api
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
