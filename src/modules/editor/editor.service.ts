import { HttpStatus } from '@/axios/utils/http-status';
import { BadResponseError } from '@/common/errors/bad-response.error';
import { BaseApiService } from '@/common/service/base-api.service';
import type {
  InlineCompletionPayload,
  InlineCompletionResponse,
  PromptCompletionPayload,
  PromptCompletionResponse,
} from '@/modules/editor/interfaces';
import { getRoute } from '@/utils/route.util';

const ApiEditorRoute = {
  PROMPT_COMPLETION: '/editor/completion',
  INLINE_COMPLETION: '/editor/inline-completion',
} as const;

export class EditorService extends BaseApiService {
  constructor() {
    super();
  }

  async fetchPromptCompletion(payload: PromptCompletionPayload) {
    this.abortRequest();
    const route = getRoute(ApiEditorRoute.PROMPT_COMPLETION);
    const { status, data } = await this.api
      .POST<PromptCompletionResponse, never, PromptCompletionPayload>()
      .setRoute(route)
      .setSignal(this.ac.signal)
      .setData(payload)
      .send();

    if (status !== HttpStatus.CREATED) {
      throw new BadResponseError();
    }

    return data;
  }

  async fetchInlineCompletion({ context }: any) {
    this.abortRequest();
    const route = getRoute(ApiEditorRoute.INLINE_COMPLETION);
    const { status, data } = await this.api
      .POST<InlineCompletionResponse, never, InlineCompletionPayload>()
      .setRoute(route)
      .setSignal(this.ac.signal)
      .setData(context)
      .send();

    if (status !== HttpStatus.CREATED) {
      throw new BadResponseError();
    }

    return data;
  }
}

export const editorService = new EditorService();
