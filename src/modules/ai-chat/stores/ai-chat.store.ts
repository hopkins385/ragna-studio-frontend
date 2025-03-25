import { getRagnaClient } from '@/common/http/ragna.client';
import { useAiChatSettingsStore } from '@/modules/ai-chat-settings/stores/ai-chat-settings.store';
import { createUUID } from '@/utils/uuid';
import { defineStore } from 'pinia';
import {
  RequestAbortError,
  type Chat,
  type ChatMessage,
  type CreateChatMessageStreamPayload,
} from 'ragna-sdk';

export const useAiChatStore = defineStore('ai-chat-store', () => {
  const client = getRagnaClient();
  const chatSettingsStore = useAiChatSettingsStore();

  // internal state
  const _isPending = ref(false);
  const _isStreaming = ref(false);
  const _isThinking = ref(false);

  const _chat = ref<Chat | undefined>(undefined);
  const _chatMessages = ref<ChatMessage[]>([]);
  const _messageTextChunks = ref<string[]>([]);

  const _chatToolCalls = ref<any[]>([]);

  // external state
  const chat = computed(() => _chat.value);
  const chatId = computed(() => _chat.value?.id);
  const chatTitle = computed(() => _chat.value?.title);
  const chatMessages = computed(() => _chatMessages.value);

  const chatToolCalls = computed(() => _chatToolCalls.value);

  const assistant = computed(() => _chat.value?.assistant);
  const assistantHasImageInput = computed(() => assistant.value?.llm.capabilities?.imageInput);

  const isPending = computed<boolean>(() => _isPending.value);
  const isStreaming = computed<boolean>(() => _isStreaming.value);
  const isThinking = computed<boolean>(() => _isThinking.value);
  const isLoading = computed<boolean>(
    () => _isPending.value || _isStreaming.value || _isThinking.value,
  );

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

    const { chat } = await client.aiChat.createChat({ assistantId: payload.assistantId });
    if (!chat) {
      throw new Error('Failed to create chat');
    }

    return hydrateChat(chat);
  }

  async function createUserChatMessage(
    payload: CreateChatMessageStreamPayload,
  ): Promise<ChatMessage> {
    const userChatMessage: ChatMessage = {
      id: createUUID(),
      type: payload.type,
      role: 'user',
      content: payload.content,
      visionContent: payload.visionContent,
    };

    try {
      const data = await client.aiChat.createChatMessage({
        chatId: payload.chatId,
        message: userChatMessage,
      });

      appendChatMessage({
        id: data.id,
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

    const temperature = Math.min(Math.max(chatSettingsStore.temperature?.[0] ?? 80, 0), 100);
    const chatMessages = chatSettingsStore.hideToolCalls
      ? _chatMessages.value.filter(
          message => message.type !== 'tool-call' && message.type !== 'tool-result',
        )
      : _chatMessages.value;

    try {
      const stream = await client.aiChat.createChatStream({
        chatId: payload.chatId,
        chatMessages,
        reasoningEffort: chatSettingsStore.thinkLevel?.[0] || 0,
        maxTokens: chatSettingsStore.maxTokens?.[0] || 4000,
        temperature,
        context: payload.context,
      });

      setIsThinking(false);
      setIsStreaming(true);

      const jsonStream = client.utils.streamToJson(stream);

      for await (const chunk of jsonStream) {
        if (chunk?.message) {
          _messageTextChunks.value.push(chunk.message);
        }
      }
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
      // wait 250ms to ensure the stream is finished
      await new Promise(resolve => setTimeout(resolve, 250));
      await hydrateChatById(payload.chatId);
    }
  }

  async function hydrateChatById(chatId: string | null | undefined) {
    if (!chatId) {
      throw new Error('Chat ID is required to hydrate chat');
    }

    const { chat } = await client.aiChat.fetchChatById(chatId);

    if (!chat) {
      throw new Error('Failed to hydrate chat');
    }

    return hydrateChat(chat);
  }

  function hydrateChatMessages(messages: ChatMessage[]) {
    _chatMessages.value = messages
      // .filter(message => message.type !== 'tool-call' && message.type !== 'tool-result')
      .map(message => ({
        id: message.id,
        type: message.type,
        role: message.role,
        content: message.content,
        visionContent: message.visionContent,
      }));

    _chatToolCalls.value = messages.filter(
      message => message.type === 'tool-call' || message.type === 'tool-result',
    );
  }

  function hydrateChat(payload: Chat) {
    resetStreamStates();

    _messageTextChunks.value = [];

    _chat.value = {
      id: payload.id,
      title: payload.title,
      assistant: payload.assistant,
      messages: payload.messages,
      createdAt: payload.createdAt,
      updatedAt: payload.updatedAt,
    };

    hydrateChatMessages(payload.messages || []);

    return _chat.value;
  }

  async function resetChatById(payload: { chatId: string }) {
    if (!payload || !payload.chatId) {
      throw new Error('Chat ID is required to reset chat');
    }

    await client.aiChat.deleteAllChatMessages({ chatId: payload.chatId });
    return hydrateChatById(payload.chatId);
  }

  // Helpers

  function resetStreamStates() {
    setIsThinking(false);
    setIsStreaming(false);
    setIsPending(false);
  }

  function abortChatRequest() {
    client.aiChat.abortRequest();
    finalizeChatStream();
  }

  function finalizeChatStream() {
    resetStreamStates();

    if (_messageTextChunks.value.length === 0) {
      return;
    }

    const assistantContent = _messageTextChunks.value.join('');
    _messageTextChunks.value = [];

    appendChatMessage({
      id: createUUID(),
      type: 'text',
      role: 'assistant',
      content: [
        {
          type: 'text',
          text: assistantContent,
        },
      ],
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
    isLoading,
    chat,
    chatMessages,
    chatToolCalls,
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
