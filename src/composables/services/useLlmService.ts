import { $axios } from '@/axios/axiosInstance';
import { getRoute } from '@/utils/route.util';

enum LlmRoute {
  MODELS = 'llm/models', // GET
}

export function useLlmService() {
  const ac = new AbortController();

  const getAllModels = async () => {
    const route = getRoute(LlmRoute.MODELS);
    const response = await $axios.get(route, {
      signal: ac.signal,
    });

    if (response.status !== 200) {
      throw new Error('Failed to fetch models');
    }

    return response.data;
  };

  onScopeDispose(() => {
    ac.abort();
  });

  return {
    getAllModels,
  };
}
