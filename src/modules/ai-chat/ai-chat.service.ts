import { $axios } from '@/axios/axiosInstance';
import { HttpStatus } from '@/axios/utils/http-status';
import { RequestAbortError } from '@/common/errors/abort.error';
import { BadRequestError } from '@/common/errors/bad-request.error';
import { BadResponseError } from '@/common/errors/bad-response.error';
import { BaseApiService } from '@/common/service/base-api.service';
import type { PaginateDto } from '@/interfaces/paginate.interface';
import { ChatServiceError } from '@/modules/ai-chat/errors/chat-service.error';
import type {
  Chat,
  ChatMessage,
  ChatResponse,
  ChatsPaginatedResponse,
  CreateChatMessagePayload,
  CreateChatStreamPayload,
  InputChatId,
} from '@/modules/ai-chat/interfaces/chat.interfaces';
import { getRoute } from '@/utils/route.util';

const ApiChatRoute = {
  BASE: '/chat', // POST
  CHAT: '/chat/:chatId', // GET, PATCH, DELETE
  CHAT_ALL: '/chat/all', // GET
  CHAT_STREAM: '/chat-stream/:chatId', // POST
  CHAT_HISTORY: '/chat/history', // GET
  CHAT_LATEST: '/chat/latest', // GET
  CHAT_MESSAGE: '/chat/:chatId/message', // POST
  CHAT_MESSAGES: '/chat/:chatId/messages', // DELETE
} as const;

const DEFAULT_MAX_TOKENS = 4000;
const DEFAULT_TEMPERATURE = 80;
const DEFAULT_REASONING_EFFORT = 0;

export class AiChatService extends BaseApiService {
  constructor() {
    super();
  }

  public async createChat(payload: { assistantId: string }): Promise<ChatResponse> {
    const route = getRoute(ApiChatRoute.BASE);
    const { status, data } = await this.api
      .POST<ChatResponse, never, { assistantId: string }>()
      .setRoute(route)
      .setData(payload)
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.CREATED) {
      throw new BadResponseError();
    }

    return data;
  }

  public async createChatMessage(payload: CreateChatMessagePayload): Promise<ChatMessage> {
    const { chatId, message } = payload;
    if (!chatId || !message) {
      throw new BadRequestError();
    }
    const route = getRoute(ApiChatRoute.CHAT_MESSAGE, { ':chatId': chatId });
    const { status, data } = await this.api
      .POST<ChatMessage, never, { message: ChatMessage }>()
      .setRoute(route)
      .setData({ message })
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.CREATED) {
      throw new BadResponseError();
    }

    return data;
  }

  public async createChatStream(
    payload: CreateChatStreamPayload,
  ): Promise<ReadableStream<Uint8Array>> {
    if (!payload.chatId) {
      throw new Error('Chat ID is required');
    }
    const streamRoute = getRoute(ApiChatRoute.CHAT_STREAM, {
      ':chatId': payload.chatId,
    });
    const body = {
      provider: payload.provider.trim().length ? payload.provider : undefined,
      model: payload.model.trim().length ? payload.model : undefined,
      messages: payload.chatMessages,
      reasoningEffort: payload.reasoningEffort || DEFAULT_REASONING_EFFORT,
      maxTokens: payload.maxTokens || DEFAULT_MAX_TOKENS,
      temperature: payload.temperature || DEFAULT_TEMPERATURE,
    };

    try {
      const response = await $axios.post<ReadableStream<Uint8Array>>(streamRoute, body, {
        signal: this.ac.signal,
        headers: {
          Accept: 'text/event-stream',
        },
        responseType: 'stream',
        adapter: 'fetch',
      });

      if (response.status !== HttpStatus.OK) {
        throw new BadResponseError(`Response not ok: ${response.statusText}`);
      }

      if (!(response.data instanceof ReadableStream)) {
        throw new BadResponseError('Response is not a readable stream');
      }

      return response.data;
      //
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new RequestAbortError();
        }
      }
      throw error;
    }
  }

  async fetchChatById(chatId: InputChatId): Promise<ChatResponse> {
    if (!chatId) {
      throw new ChatServiceError('Chat ID is required');
    }
    const route = getRoute(ApiChatRoute.CHAT, { ':chatId': chatId });
    const { status, data } = await this.api
      .GET<ChatResponse>()
      .setRoute(route)
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return data;
  }

  public async fetchAllChats(): Promise<Chat[]> {
    const route = getRoute(ApiChatRoute.CHAT_ALL);
    const { status, data } = await this.api
      .GET<Chat[]>()
      .setRoute(route)
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return data;
  }

  public async fetchAllChatsPaginated(params: PaginateDto): Promise<ChatsPaginatedResponse> {
    const route = getRoute(ApiChatRoute.CHAT_HISTORY);
    const { status, data } = await this.api
      .GET<ChatsPaginatedResponse, PaginateDto>()
      .setRoute(route)
      .setParams(params)
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return data;
  }

  public async fetchLatestChat(): Promise<ChatResponse> {
    const route = getRoute(ApiChatRoute.CHAT_LATEST);
    const { status, data } = await this.api
      .GET<ChatResponse>()
      .setRoute(route)
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return data;
  }

  public async deleteAllChatMessages(chatId: InputChatId) {
    if (!chatId) {
      throw new ChatServiceError('Chat ID is required');
    }
    const route = getRoute(ApiChatRoute.CHAT_MESSAGES, { ':chatId': chatId });
    const { status } = await this.api.DELETE().setRoute(route).setSignal(this.ac.signal).send();

    if (status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return;
  }

  public async deleteChat(chatId: InputChatId) {
    if (!chatId) {
      throw new ChatServiceError('Chat ID is required');
    }
    const route = getRoute(ApiChatRoute.CHAT, { ':chatId': chatId });
    const { status } = await this.api.DELETE().setRoute(route).setSignal(this.ac.signal).send();

    if (status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return;
  }
}

export const aiChatService = new AiChatService();
