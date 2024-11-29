import type { PaginateMeta } from '@/interfaces/paginate-meta.interface';
import type { AssistantTool } from './useAssistantToolsService';
import { $axios } from '@/axios/axiosInstance';
import { getRoute } from '@/utils/route.util';

enum AssistantRoute {
  BASE = 'assistant', // GET, POST
  ASSISTANT = 'assistant/:id', // GET, PATCH, DELETE
}

export class AssistantDto {
  teamId: string = '';
  llmId: string = '';
  title: string = '';
  description: string = '';
  systemPrompt: string = '';
  isShared: boolean = false;
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

export default function useAssistantService() {
  const ac = new AbortController();

  const createAssistant = async (payload: AssistantDto) => {
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
  };

  const fetchAssistant = async (id: string | string[] | undefined | null) => {
    if (!id) {
      throw new Error('Assistant ID is required');
    }

    const route = getRoute(AssistantRoute.ASSISTANT, id.toString());

    const response = await $axios.get<AssistantResponse>(route, {
      signal: ac.signal,
    });

    if (response.status !== 200) {
      throw new Error('Failed to fetch assistant');
    }

    return response.data;
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
    const route = getRoute(AssistantRoute.BASE);
    const response = await $axios.get<AssistantsPaginatedResponse>(route, {
      params,
      signal: ac.signal,
    });

    if (response.status !== 200) {
      throw new Error('Failed to fetch assistants');
    }

    return response.data;
    /*return useAsyncData(
      'allAssistants',
      async () => {
        const [assistants, meta] = await $client.assistant.all.query(
          {
            page: page.value,
            searchQuery: searchQuery.value,
          },
          {
            signal: ac.signal,
          },
        );
        return { assistants, meta };
      },
      {
        watch: [page, searchQuery],
        ...options,
      },
    );*/
  };

  const updateAssistant = async (
    id: string,
    payload: Partial<AssistantDto>,
  ) => {
    const route = getRoute(AssistantRoute.ASSISTANT, id);
    const response = await $axios.patch(route, payload, {
      signal: ac.signal,
    });

    if (response.status !== 200) {
      throw new Error('Failed to update assistant');
    }

    return response.data;
    /*return $client.assistant.update.mutate(
      { ...payload },
      {
        signal: ac.signal,
      },
    );*/
  };

  const deleteAssistant = async (id: string, teamId: string) => {
    const route = getRoute(AssistantRoute.ASSISTANT, id);
    const response = await $axios.delete(route, {
      signal: ac.signal,
    });

    if (response.status !== 204) {
      throw new Error('Failed to delete assistant');
    }

    return response.data;
    /*return $client.assistant.delete.mutate(
      { id, teamId },
      {
        signal: ac.signal,
      },
    );*/
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
  };
}
