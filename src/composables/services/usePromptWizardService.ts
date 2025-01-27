import { BadResponseError } from '@/common/errors/bad-response.error';
import { newApiRequest } from '@/common/http/http-request.builder';
import { getRoute } from '@/utils/route.util';

const PromptWizardRoute = {
  CREATE: '/prompt-wizard/create', // POST
} as const;

type Prompt = string;

interface CreatePromptResponse {
  prompt: Prompt;
}

export function usePromptWizardService() {
  const ac = new AbortController();

  onScopeDispose(() => {
    ac.abort();
  });

  const createPrompt = async (payload: {}) => {
    const api = newApiRequest();
    const route = getRoute(PromptWizardRoute.CREATE);
    const { status, data } = await api
      .POST<CreatePromptResponse, never, {}>()
      .setRoute(route)
      .setData(payload)
      .setSignal(ac.signal)
      .send();

    if (status !== 201) {
      throw new BadResponseError();
    }

    return data;
  };

  return {
    createPrompt,
  };
}
