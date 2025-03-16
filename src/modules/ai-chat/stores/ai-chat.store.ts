import { RequestAbortError } from '@/common/errors/abort.error';
import { useAiChatSettingsStore } from '@/modules/ai-chat-settings/stores/ai-chat-settings.store';
import type {
  Chat,
  ChatMessage,
  CreateChatMessageStreamPayload,
} from '@/modules/ai-chat/interfaces/chat.interfaces';
import { AiChatService } from '@/modules/ai-chat/services/ai-chat.service';
import { defineStore } from 'pinia';

export const useAiChatStore = defineStore('ai-chat-store', () => {
  const aiChatService = new AiChatService();
  const chatSettingsStore = useAiChatSettingsStore();

  // internal state
  const _isPending = ref(false);
  const _isStreaming = ref(false);
  const _isThinking = ref(false);

  const _chat = ref<Chat | undefined>(undefined);
  const _chatMessages = ref<ChatMessage[]>([]);
  const _messageTextChunks = ref<string[]>([]);

  // external state
  const chat = computed(() => _chat.value);
  const chatId = computed(() => _chat.value?.id);
  const chatTitle = computed(() => _chat.value?.title);
  const chatMessages = computed(() => _chatMessages.value);

  const assistant = computed(() => _chat.value?.assistant);
  const assistantHasImageInput = computed(() => assistant.value?.llm.capabilities?.imageInput);

  const isPending = computed<boolean>(() => _isPending.value);
  const isStreaming = computed<boolean>(() => _isStreaming.value);
  const isThinking = computed<boolean>(() => _isThinking.value);

  const hasChat = computed(() => !!_chat.value);
  const hasAssistant = computed(() => !!_chat.value?.assistant);
  const hasChatMessages = computed(() => _chatMessages.value.length > 0);

  const joinedMessageTextChunks = computed(() => _messageTextChunks.value.join(''));

  function setIsThinking(thinking: boolean) {
    _isThinking.value = thinking;
  }
  function setIsPending(pending: boolean) {
    _isPending.value = pending;
  }
  function setIsStreaming(streaming: boolean) {
    _isStreaming.value = streaming;
  }
  function clearChatMessages() {
    _chatMessages.value = [];
    _messageTextChunks.value = [];
  }
  function appendChatMessage(message: ChatMessage) {
    _chatMessages.value.push(message);
  }

  async function createNewChat(payload: { assistantId: string }) {
    if (!payload || !payload.assistantId) {
      throw new Error('Assistant ID is required to create a new chat');
    }

    const { chat } = await aiChatService.createChat({ assistantId: payload.assistantId });
    if (!chat) {
      throw new Error('Failed to create chat');
    }

    return hydrateChat(chat);
  }

  async function createUserChatMessage(
    payload: CreateChatMessageStreamPayload,
  ): Promise<ChatMessage> {
    const userChatMessage: ChatMessage = {
      type: payload.type,
      role: 'user',
      content: payload.content,
      visionContent: payload.visionContent,
    };

    try {
      const data = await aiChatService.createChatMessage({
        chatId: payload.chatId,
        message: userChatMessage,
      });

      appendChatMessage({
        type: data.type,
        role: data.role,
        content: data.content,
        visionContent: data.visionContent,
      });

      return data;
      //
    } catch (error: unknown) {
      throw new Error('Error creating user chat message');
    }
  }

  async function sendChatMessage(payload: CreateChatMessageStreamPayload) {
    const userChatMessage = await createUserChatMessage({
      chatId: payload.chatId,
      type: payload.type,
      content: payload.content,
      visionContent: payload.visionContent,
    });

    if (!userChatMessage) {
      return;
    }

    setIsThinking(true);

    try {
      const stream = await aiChatService.createChatStream({
        chatId: payload.chatId,
        chatMessages: _chatMessages.value,
        reasoningEffort: chatSettingsStore.thinkLevel?.[0] || 0,
        maxTokens: chatSettingsStore.maxTokens?.[0] || 4000,
        temperature: chatSettingsStore.temperature?.[0] || 80,
        context: payload.context,
      });

      setIsThinking(false);
      setIsStreaming(true);

      await streamChatMessages(stream);
      //
    } catch (error: unknown) {
      // if abort error is thrown, we can ignore it
      if (error instanceof RequestAbortError) return;
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          return;
        }
      }
      throw error;
    } finally {
      finalizeChatStream();
    }
  }

  async function hydrateChatById(chatId: string | undefined) {
    if (!chatId) {
      throw new Error('Chat ID is required to hydrate chat');
    }

    const { chat } = await aiChatService.fetchChatById(chatId);

    if (!chat) {
      throw new Error('Failed to hydrate chat');
    }

    return hydrateChat(chat);
  }

  function hydrateChatMessages(messages: ChatMessage[]) {
    _chatMessages.value = messages.map(message => ({
      type: message.type,
      role: message.role,
      content: message.content,
      visionContent: message.visionContent,
    }));
  }

  function hydrateChat(payload: Chat) {
    resetStreamStates();

    _chat.value = {
      id: payload.id,
      title: payload.title,
      assistant: payload.assistant,
      messages: payload.messages,
      createdAt: payload.createdAt,
      updatedAt: payload.updatedAt,
    };

    hydrateChatMessages(payload.messages || []);

    _messageTextChunks.value = [];

    return _chat.value;
  }

  async function resetChatById(payload: { chatId: string }) {
    if (!payload || !payload.chatId) {
      throw new Error('Chat ID is required to reset chat');
    }

    await aiChatService.deleteAllChatMessages({ chatId: payload.chatId });
    return hydrateChatById(payload.chatId);
  }

  // Helpers

  function resetStreamStates() {
    setIsThinking(false);
    setIsStreaming(false);
    setIsPending(false);
  }

  function abortChatRequest() {
    aiChatService.abortRequest();
    finalizeChatStream();
  }

  async function streamChatMessages(stream: ReadableStream<Uint8Array>) {
    const reader = stream.pipeThrough(new TextDecoderStream()).getReader();

    while (true) {
      const { value, done } = await reader.read();
      if (done) {
        break;
      }

      const lines = value.split('\n');

      for (const line of lines) {
        try {
          if (line.trim().startsWith('data: ')) {
            const parsedData = JSON.parse(line.slice(6).trim());
            if (parsedData?.message) {
              _messageTextChunks.value.push(parsedData.message);
            }
          }
        } catch (e) {
          console.error('Error parsing JSON:', e, 'line:', line);
        }
      }
    }
  }

  function finalizeChatStream() {
    resetStreamStates();

    if (_messageTextChunks.value.length === 0) {
      return;
    }

    const assistantContent = _messageTextChunks.value.join('');
    _messageTextChunks.value = [];

    appendChatMessage({
      type: 'text',
      role: 'assistant',
      content: assistantContent,
    });
  }

  function resetChat() {
    _chat.value = undefined;
    _chatMessages.value = [];
    _messageTextChunks.value = [];
  }

  function resetStore() {
    resetStreamStates();
    resetChat();
  }

  return {
    isPending,
    isStreaming,
    isThinking,
    chat,
    chatMessages,
    chatId,
    chatTitle,
    joinedMessageTextChunks,
    hasAssistant,
    assistant,
    assistantHasImageInput,
    hasChat,
    hasChatMessages,
    abortChatRequest,
    createNewChat,
    createUserChatMessage,
    sendChatMessage,
    clearChatMessages,
    resetChatById,
    hydrateChatById,
    hydrateChatMessages,
    hydrateChat,
    resetChat,
    resetStore,
  };
});
