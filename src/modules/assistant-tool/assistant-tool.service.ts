import { HttpStatus } from '@/axios/utils/http-status';
import { BadResponseError } from '@/common/errors/bad-response.error';
import { BaseApiService } from '@/common/service/base-api.service';
import type { AssistantToolResponse } from '@/modules/assistant-tool/interfaces/assistant-tool.interfaces';
import { getRoute } from '@/utils/route.util';

const ApiAssistantToolRoute = {
  TOOLS: '/assistant-tool/tools', // GET
} as const;

export class AssistantToolService extends BaseApiService {
  constructor() {
    super();
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
}

export const assistantToolService = new AssistantToolService();
