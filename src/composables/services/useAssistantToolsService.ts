import { BadResponseError } from '@/common/errors/bad-response.error';
import { newApiRequest } from '@/common/http/http-request.builder';
import { getRoute } from '@/utils/route.util';

enum AssistantToolRoute {
  TOOLS = '/assistant-tool/tools', // GET
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

  const fetchAllTools = async () => {
    const api = newApiRequest();
    const route = getRoute(AssistantToolRoute.TOOLS);
    const { status, data } = await api
      .GET<AssistantToolResponse>()
      .setRoute(route)
      .setSignal(ac.signal)
      .send();

    if (status !== 200) {
      throw new BadResponseError();
    }

    return data;
  };

  onScopeDispose(() => {
    ac.abort();
  });

  return {
    fetchAllTools,
  };
}
