import { ChatService } from '@/services/chat/chat.service';
import type { Chat, ChatMessage } from '@/services/chat/intefaces/chat.interfaces';
import { useChatInferenceStore } from '@/stores/chat-inference.store';
import { useChatSettingsStore } from '@/stores/chat-settings.store';
import { defineStore } from 'pinia';
import type { CreateChatMessageStreamPayload } from './../services/chat/intefaces/chat.interfaces';

export const useAiChatStore = defineStore('ai-chat-store', () => {
  const chatService = new ChatService();
  const chatStore = useChatInferenceStore();
  const chatSettingsStore = useChatSettingsStore();

  const isPending = ref(false);
  const isStreaming = ref(false);
  const isThinking = ref(false);

  // const chatId = ref<string | undefined>();
  // const assistantId = ref<string | undefined>();

  const chat = ref<Chat | null>(null);
  const chatMessages = ref<ChatMessage[]>([]);
  const chatTextChunks = ref<string[]>([]);
  const assistantId = ref('');

  const hasChat = computed(() => chat.value !== null);
  const hasChatMessages = computed(() => chatMessages.value.length > 0);
  const chatAssistant = computed(() => chat.value?.assistant);

  function setAssistantId(id: string) {
    assistantId.value = id;
  }
  function getAssistantId() {
    return assistantId.value;
  }
  function setIsThinking(thinking: boolean) {
    isThinking.value = thinking;
  }
  function setIsPending(pending: boolean) {
    isPending.value = pending;
  }
  function setIsStreaming(streaming: boolean) {
    isStreaming.value = streaming;
  }

  function resetStreamStates() {
    setIsThinking(false);
    setIsStreaming(false);
    setIsPending(false);
  }

  function appendChatMessage(message: ChatMessage) {
    chatMessages.value.push(message);
  }

  async function createNewChat(id?: string | undefined) {
    let newAssistantId = id;
    if (!id) {
      newAssistantId = assistantId.value;
    }

    if (!newAssistantId) {
      throw new Error('Assistant ID is required to create a new chat');
    }

    const { chat } = await chatService.createChat(newAssistantId);
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
      const data = await chatService.createChatMessage({
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
      // return handleError(error);
      throw new Error('Error creating user chat message');
    }
  }

  async function sendChatMessage(payload: CreateChatMessageStreamPayload) {
    const userChatMessage = await createUserChatMessage({
      chatId: payload.chatId,
      type: payload.type,
      content: payload.content,
      visionContent: payload.visionContent,
      model: payload.model,
      provider: payload.provider,
    });

    if (!userChatMessage) {
      return;
    }

    setIsThinking(true);

    const stream = await chatService.createChatStream({
      chatId: payload.chatId,
      chatMessages: [userChatMessage],
      provider: chatStore.provider,
      model: chatStore.model,
      reasoningEffort: chatSettingsStore.thinkLevel?.[0] || 0,
      maxTokens: chatSettingsStore.maxTokens?.[0] || 4000,
      temperature: chatSettingsStore.temperature?.[0] || 80,
    });

    setIsThinking(false);
    setIsStreaming(true);

    await streamChatMessages(stream);

    finalizeChatStream();
  }

  async function hydrateChatById(chatId: string | undefined) {
    if (!chatId) {
      throw new Error('Chat ID is required to hydrate chat');
    }

    const { chat } = await chatService.fetchChatById(chatId);

    if (!chat) {
      throw new Error('Failed to hydrate chat');
    }

    return hydrateChat(chat);
  }

  function hydrateChatMessages(messages: ChatMessage[]) {
    chatMessages.value = messages.map(message => ({
      type: message.type,
      role: message.role,
      content: message.content,
      visionContent: message.visionContent,
    }));
  }

  function hydrateChat(payload: Chat) {
    resetStreamStates();

    chat.value = {
      id: payload.id,
      title: payload.title,
      assistant: payload.assistant,
      messages: payload.messages,
      createdAt: payload.createdAt,
      updatedAt: payload.updatedAt,
    };

    chatMessages.value =
      payload.messages?.map(message => ({
        type: message.type,
        role: message.role,
        content: message.content,
        visionContent: message.visionContent,
      })) || [];

    chatTextChunks.value = [];

    return chat.value;
  }

  // Helpers

  function abort() {
    chatService.abortRequest();
    resetStreamStates();
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
            const { message } = JSON.parse(line.slice(6).trim());
            if (message) {
              chatTextChunks.value.push(message);
            }
          }
        } catch (e) {
          console.error('Error parsing JSON:', e);
        }
      }
    }
  }

  function finalizeChatStream() {
    resetStreamStates();

    if (chatTextChunks.value.length === 0) {
      return;
    }

    const assistantContent = chatTextChunks.value.join('');
    chatTextChunks.value = [];

    appendChatMessage({
      type: 'text',
      role: 'assistant',
      content: assistantContent,
    });
  }

  return {
    chat,
    chatMessages,
    chatTextChunks,
    chatAssistant,
    assistantId,
    hasChat,
    hasChatMessages,
    abort,
    createNewChat,
    createUserChatMessage,
    sendChatMessage,
    hydrateChatById,
    hydrateChatMessages,
    hydrateChat,
    setAssistantId,
    getAssistantId,
  };
});
