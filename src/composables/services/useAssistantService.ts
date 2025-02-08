import { HttpStatus } from '@/axios/utils/http-status';
import { BadResponseError } from '@/common/errors/bad-response.error';
import { newApiRequest } from '@/common/http/http-request.builder';
import type { PaginateMeta } from '@/interfaces/paginate-meta.interface';
import { getRoute } from '@/utils/route.util';
import type { AssistantTool } from './useAssistantToolsService';

const AssistantRoute = {
  BASE: '/assistant', // GET, POST
  ASSISTANT: '/assistant/:assistantId', // GET, PATCH, DELETE
  HAS_KNOWLEDGE: '/assistant/:assistantId/has-knowledge', // PATCH
  FROM_TEMPLATE: '/assistant/from-template', // POST
};

export class CreateAssistantPayload {
  teamId: string = '';
  llmId: string = '';
  title: string = '';
  description: string = '';
  systemPrompt: string = '';
  isShared: boolean = false;
  hasKnowledgeBase: boolean = false;
  hasWorkflow: boolean = false;
  tools: string[] = [];
}

export interface Assistant {
  id: string;
  teamId: string;
  llmId: string;
  title: string;
  description: string;
  systemPrompt: string;
  isShared: boolean;
  hasKnowledgeBase: boolean;
  hasWorkflow: boolean;
  systemPromptTokenCount: number;
  tools: AssistantTool[];
  llm: any;
  createdAt: string;
  updatedAt: string;
}

export interface AssistantsPaginatedResponse {
  assistants: Assistant[];
  meta: PaginateMeta;
}

export interface AssistantResponse {
  assistant: Assistant;
}

interface PaginateParams {
  page: number;
  limit?: number;
  searchQuery?: string;
}

export interface CreateFromTemplatePayload {
  templateId: string;
  language: 'de' | 'en';
}

export default function useAssistantService() {
  const ac = new AbortController();

  const createAssistant = async (payload: CreateAssistantPayload) => {
    const api = newApiRequest();
    const route = getRoute(AssistantRoute.BASE);
    const { status, data } = await api
      .POST<AssistantResponse, never, CreateAssistantPayload>()
      .setRoute(route)
      .setData(payload)
      .setSignal(ac.signal)
      .send();

    if (status !== HttpStatus.CREATED) {
      throw new BadResponseError();
    }

    return data;
  };

  const createAssistantFromTemplate = async (
    payload: CreateFromTemplatePayload,
  ) => {
    const api = newApiRequest();
    const route = getRoute(AssistantRoute.FROM_TEMPLATE);
    const { status, data } = await api
      .POST<AssistantResponse, never, CreateFromTemplatePayload>()
      .setRoute(route)
      .setData(payload)
      .setSignal(ac.signal)
      .send();

    if (status !== HttpStatus.CREATED) {
      throw new BadResponseError();
    }

    return data;
  };

  const fetchAssistant = async (assistantId: string) => {
    const api = newApiRequest();
    const route = getRoute(AssistantRoute.ASSISTANT, {
      ':assistantId': assistantId,
    });
    const { status, data } = await api
      .GET<AssistantResponse>()
      .setRoute(route)
      .setSignal(ac.signal)
      .send();

    if (status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return data;
  };

  const fetchAllAssistants = async ({
    page,
    limit,
    searchQuery,
  }: {
    page: number;
    limit?: number;
    searchQuery?: string;
  }) => {
    const params = {
      page,
      limit: limit ?? undefined,
      searchQuery: searchQuery ?? undefined,
    };

    const api = newApiRequest();
    const route = getRoute(AssistantRoute.BASE);
    const { status, data } = await api
      .GET<AssistantsPaginatedResponse, PaginateParams>()
      .setRoute(route)
      .setParams(params)
      .setSignal(ac.signal)
      .send();

    if (status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return data;
  };

  const updateAssistant = async (
    assistantId: string,
    payload: Partial<CreateAssistantPayload>,
  ) => {
    const api = newApiRequest();
    const route = getRoute(AssistantRoute.ASSISTANT, {
      ':assistantId': assistantId,
    });
    const { status, data } = await api
      .PATCH<AssistantResponse, never, Partial<CreateAssistantPayload>>()
      .setRoute(route)
      .setData(payload)
      .setSignal(ac.signal)
      .send();

    if (status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return data;
  };

  const updateHasKnowledgeBase = async (
    assistantId: string,
    hasKnowledgeBase: boolean,
  ) => {
    const api = newApiRequest();
    const route = getRoute(AssistantRoute.HAS_KNOWLEDGE, {
      ':assistantId': assistantId,
    });
    const { status, data } = await api
      .PATCH<AssistantResponse, never, { hasKnowledgeBase: boolean }>()
      .setRoute(route)
      .setData({ hasKnowledgeBase })
      .setSignal(ac.signal)
      .send();

    if (status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return data;
  };

  const deleteAssistant = async (assistantId: string) => {
    const api = newApiRequest();
    const route = getRoute(AssistantRoute.ASSISTANT, {
      ':assistantId': assistantId,
    });
    const { status, data } = await api
      .DELETE<AssistantResponse>()
      .setRoute(route)
      .setSignal(ac.signal)
      .send();

    if (status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return data;
  };

  onScopeDispose(() => {
    ac.abort();
  });

  return {
    createAssistant,
    updateAssistant,
    fetchAllAssistants,
    fetchAssistant,
    deleteAssistant,
    updateHasKnowledgeBase,
    createAssistantFromTemplate,
  };
}
