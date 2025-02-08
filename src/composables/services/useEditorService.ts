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
  const ac = new AbortController();

  const fetchPromptCompletion = async (payload: PromptCompletionPayload) => {
    const api = newApiRequest();
    const route = getRoute(EditorRoute.PROMPT_COMPLETION);
    const { status, data } = await api
      .POST<PromptCompletionResponse, never, PromptCompletionPayload>()
      .setRoute(route)
      .setSignal(ac.signal)
      .setData(payload)
      .send();

    if (status !== 200) {
      throw new BadResponseError();
    }

    return data;
  };

  return {
    fetchPromptCompletion,
  };
}
