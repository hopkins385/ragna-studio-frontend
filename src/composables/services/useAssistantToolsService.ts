import { $axios } from '@/axios/axiosInstance';
import { getRoute } from '@/utils/route.util';

enum AssistantToolRoute {
  TOOLS = 'assistant-tool/tools', // GET
}

export interface AssistantTool {
  id: string;
  toolId: string;
  name: string;
  description?: string | null;
  iconName?: string | null;
}

export interface AssistantToolResponse {
  tools: AssistantTool[];
}

class AssistantToolsServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AssistantToolsServiceError';
  }
}

export function useAssistantToolsService() {
  const ac = new AbortController();

  const handleError = (err: unknown, customMessage?: string) => {
    if (err instanceof Error) {
    }
    console.error(err);
    throw new AssistantToolsServiceError(
      customMessage || 'Failed to fetch data',
    );
  };

  async function fetchAllTools() {
    try {
      const route = getRoute(AssistantToolRoute.TOOLS);
      const response = await $axios.get<AssistantToolResponse>(route, {
        signal: ac.signal,
      });
      if (response.status !== 200) {
        throw new Error('Failed to fetch assistant tools');
      }
      return response.data;
    } catch (error) {
      return handleError('Failed to fetch assistant tools');
    }
  }

  onScopeDispose(() => {
    ac.abort();
  });

  return {
    fetchAllTools,
  };
}
