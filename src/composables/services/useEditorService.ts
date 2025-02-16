import { HttpStatus } from '@/axios/utils/http-status';
import { BadResponseError } from '@/common/errors/bad-response.error';
import { newApiRequest } from '@/common/http/http-request.builder';
import { getRoute } from '@/utils/route.util';

const EditorRoute = {
  PROMPT_COMPLETION: '/editor/completion',
} as const;

interface PromptCompletionPayload {
  context: string;
  selectedText: string;
  prompt: string;
}

interface PromptCompletionResponse {
  completion: string;
}

export function useEditorService() {
  let ac: AbortController = new AbortController();

  const abortCompletion = () => {
    if (ac) {
      ac.abort();
    }
    ac = new AbortController();
  };

  const fetchPromptCompletion = async (payload: PromptCompletionPayload) => {
    abortCompletion();
    const api = newApiRequest();
    const route = getRoute(EditorRoute.PROMPT_COMPLETION);
    const { status, data } = await api
      .POST<PromptCompletionResponse, never, PromptCompletionPayload>()
      .setRoute(route)
      .setSignal(ac.signal)
      .setData(payload)
      .send();

    if (status !== HttpStatus.CREATED) {
      throw new BadResponseError();
    }

    return data;
  };

  return {
    fetchPromptCompletion,
    abortCompletion,
  };
}
