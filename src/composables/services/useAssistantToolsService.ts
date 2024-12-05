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

export function useAssistantToolsService() {
  const ac = new AbortController();

  async function fetchAllTools() {
    const route = getRoute(AssistantToolRoute.TOOLS);
    const response = await $axios.get<AssistantToolResponse>(route, {
      signal: ac.signal,
    });
    if (response.status !== 200) {
      throw new Error('Failed to fetch assistant tools');
    }
    return response.data;
  }

  onScopeDispose(() => {
    ac.abort();
  });

  return {
    fetchAllTools,
  };
}
