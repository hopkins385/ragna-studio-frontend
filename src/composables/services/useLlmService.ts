import { BadResponseError } from '@/common/errors/bad-response.error';
import { newApiRequest } from '@/common/http/http-request.builder';
import { getRoute } from '@/utils/route.util';
import type { LargeLangModel } from './interfaces/large-lang-model.interface';

interface LargeLangModelResponse {
  llm: LargeLangModel;
}

interface LargeLangModelListResponse {
  llms: LargeLangModel[];
}

enum LlmRoute {
  MODELS = '/llm/models', // GET
}

export function useLlmService() {
  const ac = new AbortController();

  const getAllModels = async () => {
    const api = newApiRequest();
    const route = getRoute(LlmRoute.MODELS);
    const { status, data } = await api
      .GET<LargeLangModelListResponse>()
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
    getAllModels,
  };
}
