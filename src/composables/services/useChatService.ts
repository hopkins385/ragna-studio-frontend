import { $axios } from '@/axios/axiosInstance';
import type { PaginateMeta } from '@/interfaces/paginate-meta.interface';
import { useChatStore } from '@stores/chat.store';
import type { PaginateDto } from '@/interfaces/paginate.interface';
import { getRoute } from '@/utils/route.util';
import { useChatSettingsStore } from '@/stores/chat-settings.store';

enum ChatRoute {
  BASE = 'chat', // POST
  CHAT = 'chat/:id', // GET, PATCH, DELETE
  CHAT_ALL = 'chat/all', // GET
  CHAT_STREAM = 'chat-stream/:id', // POST
  CHAT_HISTORY = 'chat/history', // GET
  CHAT_LATEST = 'chat/latest', // GET
  CHAT_MESSAGE = 'chat/:id/message', // POST
  CHAT_MESSAGES = 'chat/:id/messages', // DELETE
}

export type InputChatId = string | null | undefined;

export interface AssistantLLM {
  provider: string;
  displayName: string;
  apiName: string;
  multiModal: boolean;
}

export interface Assistant {
  id: string;
  name: string;
  title: string;
  description: string;
  llm: AssistantLLM;
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

export class ChatServiceError extends Error {
  constructor(
    public statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = 'ChatServiceError';
  }
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

export function useChatService() {
  const ac = new AbortController();
  let acStream = new AbortController();

  const error = ref<string | null>(null);
  const errorMessage = ref<string>('');
  const hasError = computed(() => error.value !== null);

  const isPending = ref(false);
  const isStreaming = ref(false);

  const chat = ref<Chat | null>(null);
  const chatMessages = ref<ChatMessage[]>([]);
  const chatTextChunks = ref<string[]>([]);

  const isThinking = computed(
    () => chatTextChunks.value.length === 0 && isStreaming.value,
  );

  const hasChatMessages = computed(() => chatMessages.value.length > 0);
  const chatAssistant = computed(() => chat.value?.assistant);

  const chatStore = useChatStore();
  const chatSettingsStore = useChatSettingsStore();

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
    if (!assistantId) {
      throw new Error('Assistant ID is required');
    }

    const response = await $axios.post<ChatResponse>('chat', {
      assistantId,
    });

    if (response.status !== 201) {
      throw new Error('Failed to create chat');
    }

    return response.data;
  };

  const createChatMessage = async (payload: CreateChatMessage) => {
    const { chatId, message } = payload;
    if (!chatId || !message) {
      throw new Error('Chat ID and message are required');
    }

    try {
      const route = getRoute(ChatRoute.CHAT_MESSAGE, chatId);
      const response = await $axios.post<ChatMessage>(
        route,
        { message },
        {
          signal: ac.signal,
        },
      );
      if (response.status !== 201) {
        throw new Error('Failed to create chat message');
      }
      addChatMessage(response.data);
    } catch (error: any) {
      console.error(error);
      throw new ChatServiceError(
        error.response?.status ?? 500,
        'Failed to create chat message',
      );
    }
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
      await createChatMessage({ chatId, message: chatMessage });
    } catch (error: any) {
      console.error(error);
      throw new ChatServiceError(
        error.response?.status ?? 500,
        'Failed to create chat message',
      );
    }

    try {
      const streamRoute = getRoute(ChatRoute.CHAT_STREAM, chatId);
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

      if (response.status !== 200) {
        throw new Error(`Response not ok: ${response.statusText}`);
      }

      if (!(response.data instanceof ReadableStream)) {
        throw new Error('Response is not a readable stream');
      }

      isStreaming.value = true;

      const reader = response.data
        .pipeThrough(new TextDecoderStream())
        .getReader();

      let done = false;
      let buffer = '';

      while (!done) {
        const { value, done: _done } = await reader.read();
        if (done) {
          break;
        }
        done = _done;
        buffer += value;

        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          try {
            if (line.trim().startsWith('data: ')) {
              const { message } = JSON.parse(line.slice(6).trim());
              if (message) {
                chatTextChunks.value.push(message);
              }
              await nextTick();
            }
          } catch (e) {
            console.error('Error parsing JSON:', e);
          }
        }
      }
    } catch (error: any) {
      if (error instanceof Error && error.name === 'AbortError') {
        return;
      }
      throw new ChatServiceError(
        error.response?.status ?? 500,
        'Failed to send chat message',
      );
    } finally {
      isStreaming.value = false;
      finalizeStream();
    }
  };

  const finalizeStream = () => {
    const assistantContent = chatTextChunks.value.join('');
    chatTextChunks.value = [];

    addChatMessage({
      type: 'text',
      role: 'assistant',
      content: assistantContent,
    });
  };

  const fetchAllChats = async () => {
    const route = getRoute(ChatRoute.CHAT);
    const response = await $axios.get<Chat[]>(route, {
      signal: ac.signal,
    });

    if (response.status !== 200) {
      throw new Error('Failed to fetch chats');
    }

    return response.data;
  };

  const fetchAllChatsPaginated = async (params: PaginateDto) => {
    const route = getRoute(ChatRoute.CHAT_HISTORY);
    const response = await $axios.get<ChatsPaginated>(route, {
      params,
      signal: ac.signal,
    });

    if (response.status !== 200) {
      throw new Error('Failed to fetch chats');
    }

    return response.data;
  };

  const fetchLatestChat = async () => {
    try {
      const route = getRoute(ChatRoute.CHAT_LATEST);
      const response = await $axios.get<ChatResponse>(route, {
        signal: ac.signal,
      });
      if (response.status !== 200) {
        throw new Error('Failed to fetch latest chat');
      }
      return response.data;
    } catch (error: any) {
      throw new ChatServiceError(
        error.response?.status ?? 500,
        'Failed to fetch latest chat',
      );
    }
  };

  const deleteAllChatMessages = async (chatId: InputChatId) => {
    if (!chatId) {
      throw new Error('Chat ID is required');
    }

    try {
      const route = getRoute(ChatRoute.CHAT_MESSAGES, chatId);
      const response = await $axios.delete(route, {
        signal: ac.signal,
      });
      if (response.status !== 200) {
        throw new Error('Failed to delete chat messages');
      }
    } catch (error: any) {
      throw new ChatServiceError(
        error.response?.status ?? 500,
        'Failed to delete chat messages',
      );
    }
  };

  const deleteChat = async (chatId: InputChatId) => {
    if (!chatId) {
      throw new Error('Chat ID is required');
    }
    try {
      const route = getRoute(ChatRoute.CHAT, chatId);
      const response = await $axios.delete(route, {
        signal: ac.signal,
      });
      if (response.status !== 200) {
        throw new Error('Failed to delete chat');
      }
    } catch (error: any) {
      throw new ChatServiceError(
        error.response?.status ?? 500,
        'Failed to delete chat',
      );
    }
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

    try {
      const route = getRoute(ChatRoute.CHAT, chatId);
      const response = await $axios.get<ChatResponse>(route, {
        signal: ac.signal,
      });
      if (response.status !== 200) {
        throw new Error('Failed to fetch chat');
      }
      chat.value = response.data.chat;
      chatStore.setModel({
        model: chat.value.assistant?.llm.apiName || '',
        provider: chat.value.assistant?.llm.provider || '',
        hasVision: chat.value.assistant?.llm.multiModal || false,
      });
      initChatMessages(chat.value?.messages || []);
    } catch (error: any) {
      throw new ChatServiceError(
        error.response?.status ?? 500,
        'Failed to fetch chat messages',
      );
    }
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
