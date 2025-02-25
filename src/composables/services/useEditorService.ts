import { HttpStatus } from '@/axios/utils/http-status';
import { BadResponseError } from '@/common/errors/bad-response.error';
import { newApiRequest } from '@/common/http/http-request.builder';
import { getRoute } from '@/utils/route.util';

const EditorRoute = {
  PROMPT_COMPLETION: '/editor/completion',
  INLINE_COMPLETION: '/editor/inline-completion',
} as const;

interface PromptCompletionPayload {
  context: string;
  selectedText: string;
  prompt: string;
}

interface PromptCompletionResponse {
  completion: string;
}

interface InlineCompletionPayload {}

interface InlineCompletionResponse {
  inlineCompletion: string;
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

  const fetchInlineCompletion = async ({ context }: any) => {
    abortCompletion();
    const api = newApiRequest();
    const route = getRoute(EditorRoute.INLINE_COMPLETION);
    const { status, data } = await api
      .POST<InlineCompletionResponse, never, InlineCompletionPayload>()
      .setRoute(route)
      .setSignal(ac.signal)
      .setData(context)
      .send();

    if (status !== HttpStatus.CREATED) {
      throw new BadResponseError();
    }

    return data;
  };

  return {
    fetchPromptCompletion,
    fetchInlineCompletion,
    abortCompletion,
  };
}
