import { HttpStatus } from '@/axios/utils/http-status';
import { BadResponseError } from '@/common/errors/bad-response.error';
import { newApiRequest, type ApiRequest } from '@/common/http/http-request.builder';
import type { CreateAssistantDto } from '@/modules/assistant/dto/create-assistant.dto';
import type {
  AssistantResponse,
  AssistantsPaginatedResponse,
  CreateAssistantFromTemplatePayload,
  PaginateParams,
} from '@/modules/assistant/interfaces/assistant.interfaces';
import { getRoute } from '@/utils/route.util';

const ApiAssistantRoute = {
  BASE: '/assistant', // GET, POST
  ASSISTANT: '/assistant/:assistantId', // GET, PATCH, DELETE
  HAS_KNOWLEDGE: '/assistant/:assistantId/has-knowledge', // PATCH
  FROM_TEMPLATE: '/assistant/from-template', // POST
};

export class AssistantService {
  private ac: AbortController;
  private api: ApiRequest;

  constructor() {
    this.ac = new AbortController();
    this.api = newApiRequest();
  }

  public async createAssistant(payload: CreateAssistantDto) {
    const route = getRoute(ApiAssistantRoute.BASE);
    const { status, data } = await this.api
      .POST<AssistantResponse, never, CreateAssistantDto>()
      .setRoute(route)
      .setData(payload)
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.CREATED) {
      throw new BadResponseError();
    }

    return data;
  }

  public async createAssistantFromTemplate(payload: CreateAssistantFromTemplatePayload) {
    const route = getRoute(ApiAssistantRoute.FROM_TEMPLATE);
    const { status, data } = await this.api
      .POST<AssistantResponse, never, CreateAssistantFromTemplatePayload>()
      .setRoute(route)
      .setData(payload)
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.CREATED) {
      throw new BadResponseError();
    }

    return data;
  }

  public async fetchAssistant(assistantId: string) {
    const route = getRoute(ApiAssistantRoute.ASSISTANT, {
      ':assistantId': assistantId,
    });
    const { status, data } = await this.api
      .GET<AssistantResponse>()
      .setRoute(route)
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return data;
  }

  public async fetchAllAssistants({
    page,
    limit,
    searchQuery,
  }: {
    page: number;
    limit?: number;
    searchQuery?: string;
  }) {
    const params = {
      page,
      limit: limit ?? undefined,
      searchQuery: searchQuery ?? undefined,
    };
    const route = getRoute(ApiAssistantRoute.BASE);
    const { status, data } = await this.api
      .GET<AssistantsPaginatedResponse, PaginateParams>()
      .setRoute(route)
      .setParams(params)
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return data;
  }

  public async updateAssistant(assistantId: string, payload: Partial<CreateAssistantDto>) {
    const route = getRoute(ApiAssistantRoute.ASSISTANT, {
      ':assistantId': assistantId,
    });
    const { status, data } = await this.api
      .PATCH<AssistantResponse, never, Partial<CreateAssistantDto>>()
      .setRoute(route)
      .setData(payload)
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return data;
  }

  public async updateHasKnowledgeBase(assistantId: string, hasKnowledgeBase: boolean) {
    const route = getRoute(ApiAssistantRoute.HAS_KNOWLEDGE, {
      ':assistantId': assistantId,
    });
    const { status, data } = await this.api
      .PATCH<AssistantResponse, never, { hasKnowledgeBase: boolean }>()
      .setRoute(route)
      .setData({ hasKnowledgeBase })
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return data;
  }

  public async deleteAssistant(assistantId: string) {
    const route = getRoute(ApiAssistantRoute.ASSISTANT, {
      ':assistantId': assistantId,
    });
    const { status, data } = await this.api
      .DELETE<AssistantResponse>()
      .setRoute(route)
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return data;
  }

  // Helpers
  public abortRequest(): void {
    this.ac.abort();
    this.ac = new AbortController();
  }
}

export const assistantService = new AssistantService();
