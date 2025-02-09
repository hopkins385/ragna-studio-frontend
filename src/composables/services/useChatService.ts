import { $axios } from '@/axios/axiosInstance';
import { HttpStatus } from '@/axios/utils/http-status';
import { BadRequestError } from '@/common/errors/bad-request.error';
import { BadResponseError } from '@/common/errors/bad-response.error';
import { newApiRequest } from '@/common/http/http-request.builder';
import type { PaginateMeta } from '@/interfaces/paginate-meta.interface';
import type { PaginateDto } from '@/interfaces/paginate.interface';
import { useChatStore } from '@/stores/chat-inference.store';
import { useChatSettingsStore } from '@/stores/chat-settings.store';
import { getRoute } from '@/utils/route.util';
import { AxiosError, CanceledError } from 'axios';

const ChatRoute = {
  BASE: '/chat', // POST
  CHAT: '/chat/:chatId', // GET, PATCH, DELETE
  CHAT_ALL: '/chat/all', // GET
  CHAT_STREAM: '/chat-stream/:chatId', // POST
  CHAT_HISTORY: '/chat/history', // GET
  CHAT_LATEST: '/chat/latest', // GET
  CHAT_MESSAGE: '/chat/:chatId/message', // POST
  CHAT_MESSAGES: '/chat/:chatId/messages', // DELETE
} as const;

export type InputChatId = string | null | undefined;

export interface AssistantLLM {
  provider: string;
  displayName: string;
  apiName: string;
  multiModal: boolean;
  capabilities: {
    imageInput: boolean;
    audioInput: boolean;
    videoInput: boolean;
    textOutput: boolean;
    imageOutput: boolean;
    audioOutput: boolean;
    videoOutput: boolean;
  };
}

export interface Assistant {
  id: string;
  name: string;
  title: string;
  description: string;
  llm: AssistantLLM; // TODO: change interface to LargeLangModel interface
  createdAt: string;
  updatedAt: string;
}

export interface Chat {
  id: string;
  title: string;
  assistant?: Assistant;
  messages?: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface VisionImageUrlContent {
  type: string;
  url: string;
}

export type ChatMessageVisionContent = VisionImageUrlContent;

export interface ChatMessage {
  type: 'text' | 'image';
  role: 'user' | 'assistant';
  content: string;
  visionContent?: ChatMessageVisionContent[];
}

export interface ChatsPaginated {
  chats: Chat[];
  meta: PaginateMeta;
}

export interface ChatResponse {
  chat: Chat;
}

export interface CreateChatMessage {
  chatId: InputChatId;
  message: ChatMessage;
}

export interface CreateChatMessageStream {
  chatId: InputChatId;
  type: ChatMessage['type'];
  content: ChatMessage['content'];
  visionContent?: ChatMessage['visionContent'];
  model?: string;
  provider?: string;
}

class ChatServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ChatServiceError';
  }
}

export function useChatService() {
  const ac = new AbortController();
  let acStream = new AbortController();

  const error = ref<string | null>(null);
  const errorMessage = ref<string>('');
  const hasError = computed(() => error.value !== null);

  const isPending = ref(false);
  const isStreaming = ref(false);
  const isThinking = ref(false);

  const chat = ref<Chat | null>(null);
  const chatMessages = ref<ChatMessage[]>([]);
  const chatTextChunks = ref<string[]>([]);

  const hasChatMessages = computed(() => chatMessages.value.length > 0);
  const chatAssistant = computed(() => chat.value?.assistant);

  const chatStore = useChatStore();
  const chatSettingsStore = useChatSettingsStore();

  const handleError = (err: unknown) => {
    if (err instanceof DOMException && err.name === 'AbortError') {
      console.warn('DOM: Request was aborted');
      return;
    }
    if (
      err instanceof CanceledError ||
      (err instanceof AxiosError && err.message === 'AbortError')
    ) {
      console.warn('Axios: Request was aborted');
      return;
    }
    if (err instanceof Error) {
      return setError(err.message);
    }
    console.error(err);
    throw new ChatServiceError('Failed to fetch data');
  };

  const setError = (message: string) => {
    error.value = message;
    errorMessage.value = message;
  };

  const clearError = () => {
    error.value = null;
  };

  const addChatMessage = (message: ChatMessage) => {
    chatMessages.value.push(message);
  };

  const createChat = async (assistantId: string) => {
    const api = newApiRequest();
    const route = getRoute(ChatRoute.BASE);
    const { status, data } = await api
      .POST<ChatResponse, never, { assistantId: string }>()
      .setRoute(route)
      .setData({ assistantId })
      .setSignal(ac.signal)
      .send();

    if (status !== HttpStatus.CREATED) {
      throw new BadResponseError();
    }

    return data;
  };

  const createChatMessage = async (payload: CreateChatMessage) => {
    const { chatId, message } = payload;
    if (!chatId || !message) {
      throw new BadRequestError();
    }
    const api = newApiRequest();
    const route = getRoute(ChatRoute.CHAT_MESSAGE, { ':chatId': chatId });
    const { status, data } = await api
      .POST<ChatMessage, never, { message: ChatMessage }>()
      .setRoute(route)
      .setData({ message })
      .setSignal(ac.signal)
      .send();

    if (status !== HttpStatus.CREATED) {
      throw new BadResponseError();
    }

    return data;
  };

  const sendChatMessage = async (payload: CreateChatMessageStream) => {
    acStream = new AbortController();
    const { chatId, content, visionContent } = payload;

    if (!chatId) {
      throw new Error('Chat ID is required');
    }

    if (!content) {
      throw new Error('Content is required');
    }

    const chatMessage: ChatMessage = {
      type: payload.type,
      role: 'user',
      content,
      visionContent,
    };

    try {
      const data = await createChatMessage({ chatId, message: chatMessage });
      addChatMessage(data);
    } catch (error: unknown) {
      return handleError(error);
    }

    isThinking.value = true;

    try {
      const streamRoute = getRoute(ChatRoute.CHAT_STREAM, {
        ':chatId': chatId,
      });
      const response = await $axios.post<ReadableStream<Uint8Array>>(
        streamRoute,
        {
          provider: payload.provider || chatStore.provider,
          model: payload.model || chatStore.model,
          messages: chatMessages.value,
          maxTokens: chatSettingsStore.maxTokens[0],
          temperature: chatSettingsStore.temperature[0],
        },
        {
          signal: acStream.signal,
          headers: {
            Accept: 'text/event-stream',
          },
          responseType: 'stream',
          adapter: 'fetch',
        },
      );

      if (response.status !== HttpStatus.OK) {
        throw new Error(`Response not ok: ${response.statusText}`);
      }

      if (!(response.data instanceof ReadableStream)) {
        throw new Error('Response is not a readable stream');
      }

      isThinking.value = false;
      isStreaming.value = true;

      const reader = response.data
        .pipeThrough(new TextDecoderStream())
        .getReader();

      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          break;
        }

        const lines = value.split('\n');

        for (const line of lines) {
          try {
            if (line.trim().startsWith('data: ')) {
              const { message } = JSON.parse(line.slice(6).trim());
              // console.log('message:', JSON.stringify({ message }, null, 2));
              if (message) {
                chatTextChunks.value.push(message);
              }
            }
          } catch (e) {
            console.error('Error parsing JSON:', e);
          }
        }
      }
    } catch (error: unknown) {
      return handleError(error);
    } finally {
      finalizeStream();
    }
  };

  const finalizeStream = () => {
    isThinking.value = false;
    isStreaming.value = false;
    isPending.value = false;

    if (chatTextChunks.value.length === 0) {
      return;
    }

    const assistantContent = chatTextChunks.value.join('');
    chatTextChunks.value = [];

    addChatMessage({
      type: 'text',
      role: 'assistant',
      content: assistantContent,
    });
  };

  const fetchAllChats = async () => {
    const api = newApiRequest();
    const route = getRoute(ChatRoute.CHAT_ALL);
    const { status, data } = await api
      .GET<Chat[]>()
      .setRoute(route)
      .setSignal(ac.signal)
      .send();

    if (status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return data;
  };

  const fetchAllChatsPaginated = async (params: PaginateDto) => {
    const api = newApiRequest();
    const route = getRoute(ChatRoute.CHAT_HISTORY);
    const { status, data } = await api
      .GET<ChatsPaginated, PaginateDto>()
      .setRoute(route)
      .setParams(params)
      .setSignal(ac.signal)
      .send();

    if (status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return data;
  };

  const fetchLatestChat = async () => {
    const api = newApiRequest();
    const route = getRoute(ChatRoute.CHAT_LATEST);
    const { status, data } = await api
      .GET<ChatResponse>()
      .setRoute(route)
      .setSignal(ac.signal)
      .send();

    if (status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return data;
  };

  const deleteAllChatMessages = async (chatId: InputChatId) => {
    if (!chatId) {
      throw new Error('Chat ID is required');
    }
    const api = newApiRequest();
    const route = getRoute(ChatRoute.CHAT_MESSAGES, { ':chatId': chatId });
    const { status } = await api
      .DELETE()
      .setRoute(route)
      .setSignal(ac.signal)
      .send();

    if (status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return;
  };

  const deleteChat = async (chatId: InputChatId) => {
    if (!chatId) {
      throw new Error('Chat ID is required');
    }
    const api = newApiRequest();
    const route = getRoute(ChatRoute.CHAT, { ':chatId': chatId });
    const { status } = await api
      .DELETE()
      .setRoute(route)
      .setSignal(ac.signal)
      .send();

    if (status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return;
  };

  const initChatMessages = async (messages: ChatMessage[]) => {
    chatMessages.value =
      messages?.map(message => ({
        type: message.type,
        role: message.role,
        content: message.content,
        visionContent: message.visionContent,
      })) || [];
  };

  const initChat = async (chatId: InputChatId) => {
    if (!chatId) {
      throw new Error('Chat ID is required');
    }
    const api = newApiRequest();
    const route = getRoute(ChatRoute.CHAT, { ':chatId': chatId });
    const { status, data } = await api
      .GET<ChatResponse>()
      .setRoute(route)
      .setSignal(ac.signal)
      .send();

    if (status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    chat.value = data.chat;

    chatStore.setModel({
      model: chat.value.assistant?.llm.apiName || '',
      provider: chat.value.assistant?.llm.provider || '',
      hasVision: chat.value.assistant?.llm?.capabilities?.imageInput || false,
    });

    isThinking.value = false;
    isPending.value = false;
    isStreaming.value = false;

    initChatMessages(chat.value?.messages || []);
  };

  const clearChatMessages = async () => {
    abortChatRequest();
    if (!chat.value) {
      throw new Error('Chat is required');
    }
    if (!chatMessages.value.length) {
      return;
    }
    await deleteAllChatMessages(chat.value.id);
    chatMessages.value = [];
  };

  const abortChatRequest = () => {
    acStream.abort();
    isStreaming.value = false;
    isPending.value = false;
  };

  onScopeDispose(() => {
    abortChatRequest();
  });

  return {
    error,
    errorMessage,
    hasError,
    setError,
    clearError,
    initChat,
    fetchAllChats,
    fetchAllChatsPaginated,
    fetchLatestChat,
    sendChatMessage,
    createChatMessage,
    clearChatMessages,
    abortChatRequest,
    createChat,
    deleteChat,
    isPending,
    isStreaming,
    isThinking,
    chat,
    chatAssistant,
    hasChatMessages,
    chatMessages,
    chatTextChunks,
  };
}
