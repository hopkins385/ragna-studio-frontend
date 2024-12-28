import { $axios } from '@/axios/axiosInstance';
import type { PaginateMeta } from '@/interfaces/paginate-meta.interface';
import { getRoute } from '@/utils/route.util';
import type { AssistantTool } from './useAssistantToolsService';

enum AssistantRoute {
  BASE = 'assistant', // GET, POST
  ASSISTANT = 'assistant/:assistantId', // GET, PATCH, DELETE
  HAS_KNOWLEDGE = 'assistant/:assistantId/has-knowledge', // PATCH
}

export class AssistantDto {
  teamId: string = '';
  llmId: string = '';
  title: string = '';
  description: string = '';
  systemPrompt: string = '';
  isShared: boolean = false;
  hasKnowledgeBase: boolean = false;
  hasWorkflow: boolean = false;
  systemPromptTokenCount: number = 0;
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

class AssistantServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AssistantServiceError';
  }
}

export default function useAssistantService() {
  const ac = new AbortController();

  const handleError = (err: unknown, customMessage?: string) => {
    if (err instanceof Error) {
    }
    console.error(err);
    throw new AssistantServiceError(customMessage || 'Failed to fetch data');
  };

  const createAssistant = async (payload: AssistantDto) => {
    try {
      const response = await $axios.post(
        'assistant',
        {
          ...payload,
        },
        {
          signal: ac.signal,
        },
      );

      if (response.status !== 201) {
        throw new Error('Failed to create assistant');
      }

      return response.data;
    } catch (error) {
      return handleError('Failed to create assistant');
    }
  };

  const fetchAssistant = async (
    assistantId: string | string[] | undefined | null,
  ) => {
    if (!assistantId) {
      throw new Error('Assistant ID is required');
    }

    try {
      const route = getRoute(AssistantRoute.ASSISTANT, {
        ':assistantId': assistantId.toString(),
      });

      const response = await $axios.get<AssistantResponse>(route, {
        signal: ac.signal,
      });

      if (response.status !== 200) {
        throw new Error('Failed to fetch assistant');
      }

      return response.data;
    } catch (error) {
      return handleError('Failed to fetch assistant');
    }
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

    try {
      const route = getRoute(AssistantRoute.BASE);
      const response = await $axios.get<AssistantsPaginatedResponse>(route, {
        params,
        signal: ac.signal,
      });

      if (response.status !== 200) {
        throw new Error('Failed to fetch assistants');
      }

      return response.data;
    } catch (error) {
      return handleError('Failed to fetch assistants');
    }
  };

  const updateAssistant = async (
    assistantId: string,
    payload: Partial<AssistantDto>,
  ) => {
    try {
      const route = getRoute(AssistantRoute.ASSISTANT, {
        ':assistantId': assistantId,
      });
      const response = await $axios.patch(route, payload, {
        signal: ac.signal,
      });

      if (response.status !== 200) {
        throw new Error('Failed to update assistant');
      }

      return response.data;
    } catch (error) {
      return handleError('Failed to update assistant');
    }
  };

  const updateHasKnowledgeBase = async (
    assistantId: string,
    hasKnowledgeBase: boolean,
  ) => {
    try {
      const route = getRoute(AssistantRoute.HAS_KNOWLEDGE, {
        ':assistantId': assistantId,
      });
      const response = await $axios.patch(route, {
        hasKnowledgeBase,
      });

      if (response.status !== 200) {
        throw new Error('Failed to update assistant knowledge base');
      }

      return response.data;
    } catch (error) {
      return handleError('Failed to update assistant knowledge base');
    }
  };

  const deleteAssistant = async (assistantId: string) => {
    try {
      const route = getRoute(AssistantRoute.ASSISTANT, {
        ':assistantId': assistantId,
      });
      const response = await $axios.delete(route, {
        signal: ac.signal,
      });

      if (response.status !== 200) {
        throw new Error('Failed to delete assistant');
      }

      return response.data;
    } catch (error) {
      return handleError('Failed to delete assistant');
    }
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
  };
}
