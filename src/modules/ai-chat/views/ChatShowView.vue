<script setup lang="ts">
import { useWebSocketStore } from '@/common/stores/websocket.store';
import ErrorAlert from '@/components/error/ErrorAlert.vue';
import { useAutoScroll } from '@/composables/useAutoScroll';
import { useErrorAlert } from '@/composables/useErrorAlert';
import ChatSettings from '@/modules/ai-chat-settings/components/ChatSettings.vue';
import { useAiChatSettingsStore } from '@/modules/ai-chat-settings/stores/ai-chat-settings.store';
import ChatAssistantDetails from '@/modules/ai-chat/components/ChatAssistantDetails.vue';
import ChatButtonNewChat from '@/modules/ai-chat/components/ChatButtonNewChat.vue';
import ChatHistoryDrawerButton from '@/modules/ai-chat/components/ChatHistoryDrawerButton.vue';
import ChatImageInput from '@/modules/ai-chat/components/ChatImageInput.vue';
import ChatInputTextarea from '@/modules/ai-chat/components/ChatInputTextarea.vue';
import ChatMessageBox from '@/modules/ai-chat/components/ChatMessageBox.vue';
import ChatMessageChunk from '@/modules/ai-chat/components/ChatMessageChunk.vue';
import ChatPresets from '@/modules/ai-chat/components/ChatPresets.vue';
import ChatThinkingBox from '@/modules/ai-chat/components/ChatThinkingBox.vue';
import ChatToolCallMessage from '@/modules/ai-chat/components/ChatToolCallMessage.vue';
import ChatToolCallResult from '@/modules/ai-chat/components/ChatToolCallResult.vue';
import { useChatImages, type ChatImage } from '@/modules/ai-chat/composables/useChatImages';
import { useChatTools, type ToolInfoData } from '@/modules/ai-chat/composables/useChatTools';
import { ChatMessageRole } from '@/modules/ai-chat/enums/chat-role.enum';
import { chatInputTextSchema } from '@/modules/ai-chat/schemas/chat-input-text.schema';
import { useAiChatStore } from '@/modules/ai-chat/stores';
import { useAuthStore } from '@/modules/auth/stores/auth.store';
import BoxContainer from '@components/box/BoxContainer.vue';
import { Button } from '@ui/button';
import { PaperclipIcon } from 'lucide-vue-next';

const route = useRoute();
const socket = useWebSocketStore();
const aiChatStore = useAiChatStore();
const authStore = useAuthStore();
const settings = useAiChatSettingsStore();

const { t } = useI18n();

const { setActiveTool, unsetActiveTool, clearActiveTools, activeTools } = useChatTools();
const { errorAlert, setErrorAlert, unsetErrorAlert } = useErrorAlert();

const activeChatId = ref('');

const setupChatIsCompleted = ref(false);

const chatBoxContainerRef = ref<HTMLElement | null>(null);
const chatMessagesContainerRef = ref<HTMLElement | null>(null);

const showPresets = computed(
  () => setupChatIsCompleted.value === true && !aiChatStore.hasChatMessages,
);

function getVisionContent(images: ChatImage[]): any {
  return images.map(image => {
    if (image.status !== 'loaded') return;
    return {
      type: 'image',
      url: image.src,
    };
  });
}

const clearVisionContent = () => {
  inputImages.value = [];
};

// SUBMIT
const sendChatMessage = async (payload: { chatId: string; inputText: string }) => {
  unsetErrorAlert();

  if (!payload.chatId || !payload.chatId.trim()) {
    console.error('No chatId provided');
    return;
  }

  const userMessageContent = payload.inputText.trim();

  if (!userMessageContent || userMessageContent.length < 1) {
    return;
  }

  // validate input
  const result = chatInputTextSchema.safeParse({ input: userMessageContent });
  if (!result.success) {
    setErrorAlert(result.error.format()._errors[0]);
    return;
  }

  const hasImages = inputImages.value.some(image => image.status === 'loaded');
  const msgType = hasImages ? 'image' : 'text';
  const visionContent = getVisionContent(inputImages.value);

  clearVisionContent();

  try {
    await aiChatStore.sendChatMessage({
      chatId: payload.chatId,
      type: msgType,
      content: [
        {
          type: 'text',
          text: userMessageContent.toString(),
        },
      ],
      visionContent,
    });
  } catch (e: any) {
    setErrorAlert(e.message);
    console.error('Failed to send message:', e);
  }
};

const scrollToBottom = (options: { instant: boolean } = { instant: false }) => {
  nextTick(() => {
    chatMessagesContainerRef.value?.scrollTo({
      top: chatMessagesContainerRef.value.scrollHeight,
      behavior: options.instant ? 'instant' : 'smooth',
    });
  });
};

const onPresetClick = (prompt: string) => {
  sendChatMessage({ chatId: activeChatId.value, inputText: prompt });
};

const abortChatRequest = () => {
  aiChatStore.abortChatRequest();
  clearActiveTools();
};

const onResetChat = async () => {
  abortChatRequest();
  clearActiveTools();
  clearVisionContent();
  await aiChatStore.resetChatById({ chatId: activeChatId.value });
};

const onToolStartEvent = (payload: ToolInfoData) => {
  setActiveTool(payload);
  /*console.log('Tool start event:', payload);
  if (!payload.toolInfo) {
    console.error('Tool info is missing');
    return;
  }
  if (!payload.toolName) {
    console.error('Tool name is missing');
    return;
  }*/
  /*aiChatStore.appendChatMessage({
    id: new Date().getTime().toString(),
    type: 'tool-call',
    role: 'assistant',
    content: [
      {
        args: payload.toolInfo,
        type: 'tool-call',
        toolName: payload.toolName,
        toolCallId: undefined,
      },
    ] as any,
  });*/
};

const setupSocketListeners = (chatId: string) => {
  socket.on(`chat:${chatId}-tool-start-event`, onToolStartEvent);
  socket.on(`chat:${chatId}-tool-end-event`, unsetActiveTool);
};

const removeSocketListeners = (chatId: string) => {
  socket.off(`chat:${chatId}-tool-start-event`, onToolStartEvent);
  socket.off(`chat:${chatId}-tool-end-event`, unsetActiveTool);
};

const setupChat = async (chatId: string) => {
  // console.log('Setting up chat:', chatId);
  setupChatIsCompleted.value = false;
  activeChatId.value = chatId;
  settings.resetSettings();
  await aiChatStore.hydrateChatById(chatId);
  removeSocketListeners(chatId);
  setupSocketListeners(chatId);
  scrollToBottom({ instant: true });
  setupChatIsCompleted.value = true;
};

const { openFileDialog, readFile, inputImages, allowedFileMimeTypes } = useChatImages();

const { isOverDropZone } = useDropZone(chatBoxContainerRef, {
  onDrop: files => {
    if (!aiChatStore.assistantHasImageInput) return;
    const file = files?.[0];
    readFile(file);
  },
  dataTypes: allowedFileMimeTypes,
});

// Auto SCROLL
const { isAutoScrolling } = useAutoScroll(chatMessagesContainerRef);

// watch route changes and setup chat onMount
// onMounted setupChat is not required, because the watcher is immediate
watch(
  () => route.params.id.toString(),
  async id => await setupChat(id),
  { immediate: true },
);

useHead({
  title: t('chat.title'),
  meta: [
    {
      name: 'description',
      content: t('chat.subtitle'),
    },
  ],
});

onBeforeUnmount(() => {
  removeSocketListeners(activeChatId.value);
  aiChatStore.resetStore();
});

onMounted(() => {});
</script>

<template>
  <BoxContainer
    id="chatWrapper"
    ref="chatBoxContainerRef"
    class="relative flex size-full flex-col px-14 lg:px-32 pb-8 pt-16"
  >
    <!-- chat header -->
    <!-- left quick controls -->
    <div class="absolute left-7 top-5 border-0 z-10">
      <div class="space-y-3 border-0 flex flex-col p-2 rounded-lg">
        <ChatButtonNewChat />
        <ChatHistoryDrawerButton />
      </div>
    </div>
    <!-- right quick controls -->
    <div class="absolute right-10 top-5 border-0 z-10">
      <div class="flex justify-center items-center shrink-0 space-x-5">
        <ChatAssistantDetails
          :chat-title="aiChatStore.chatTitle"
          :llm-provider="aiChatStore.assistant?.llm.provider"
          :llm-name="aiChatStore.assistant?.llm.displayName"
          :title="aiChatStore.assistant?.title"
        />
        <ChatSettings :assistant-id="aiChatStore.assistant?.id" @reset-chat="onResetChat" />
      </div>
    </div>
    <!-- chat error alert -->
    <ErrorAlert v-model="errorAlert.open" :message="errorAlert.message" />
    <!-- chat messages container -->
    <div
      id="chatMessagesContainer"
      ref="chatMessagesContainerRef"
      class="no-scrollbar relative grow overflow-y-scroll rounded-lg w-full max-w-[70rem] mx-auto"
    >
      <!-- chat messages -->
      <template v-for="message in aiChatStore.chatMessages" :key="message.id">
        <ChatToolCallResult
          :display-name="aiChatStore.assistant?.title"
          :content="message.content"
          v-if="message.type === 'tool-result'"
        />
        <ChatMessageBox
          v-if="message.type !== 'tool-call' && message.type !== 'tool-result'"
          :type="message.type"
          :content="message.content"
          :vision-contents="message.visionContent"
          :display-name="
            message.role === 'user' ? authStore.userFirstName : aiChatStore.assistant?.title
          "
          :role="message.role === 'user' ? ChatMessageRole.USER : ChatMessageRole.ASSISTANT"
        />
      </template>

      <!-- thinking message -->
      <ChatThinkingBox v-if="aiChatStore.isThinking" :display-name="aiChatStore.assistant?.title" />
      <!-- streaming message -->
      <ChatMessageChunk
        v-if="aiChatStore.joinedMessageTextChunks.length > 0"
        id="chatMessage"
        :stream-text="aiChatStore.joinedMessageTextChunks"
        :assistant-name="aiChatStore.assistant?.title"
      />
      <!-- tool call message -->
      <ChatToolCallMessage
        v-if="activeTools.length > 0"
        :display-name="aiChatStore.assistant?.title ?? 'Assistant'"
        :active-tools="activeTools"
      />
      <!-- error message -->
      <!--
      <div v-if="hasError" class="px-20 text-sm text-destructive">
        <p class="pb-2 font-semibold">{{ $t('alert.error.message') }}</p>
        <p>{{ errorMessage }}</p>
      </div>
      -->
      <div class="h-10 border-0"></div>
      <!-- scroll to bottom button -->
      <!-- div
        v-if="hasMessages"
        class="sticky bottom-2 right-1/2 opacity-95"
        style="transform: translateX(50%)"
      >
        <Button
          variant="outline"
          size="icon"
          class="group rounded-full border bg-slate-200 shadow-md"
          @click="() => scrollToBottom()"
        >
          <ArrowBigDownDashIcon
            class="size-5 stroke-1.5 group-hover:stroke-2"
          />
        </Button>
      </!-->
    </div>
    <!-- Input wrapper -->
    <div
      class="w-full max-w-[70rem] mx-auto"
      :class="{
        'px-10 -mt-10 absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2': showPresets,
        relative: !showPresets,
      }"
    >
      <div v-if="showPresets" class="h-12 border-0 font-semibold opacity-75 text-3xl text-center">
        {{ $t('chat.welcome') }}
      </div>
      <div id="chatInputWrapper" class="shrink-0 pt-1">
        <!-- Image input -->
        <div class="flex space-x-1 mb-2 ml-12">
          <ChatImageInput v-model:input-images="inputImages" />
        </div>
        <div class="flex space-x-1">
          <!-- vision input -->
          <div v-if="aiChatStore.assistantHasImageInput">
            <Button
              variant="ghost"
              size="icon"
              class="group text-slate-500"
              :class="{
                'bg-slate-100 text-green-600': isOverDropZone,
              }"
              @click="openFileDialog"
            >
              <PaperclipIcon
                class="!size-5 -rotate-45 stroke-1 group-hover:stroke-1.5"
                :class="{ 'stroke-2': isOverDropZone }"
              />
            </Button>
          </div>
          <!-- message input form -->
          <ChatInputTextarea
            :show-abort-button="aiChatStore.isThinking || aiChatStore.isStreaming"
            :submit-locked="aiChatStore.isThinking || aiChatStore.isStreaming"
            @submit-form="value => sendChatMessage({ chatId: activeChatId, inputText: value })"
            @abort="() => abortChatRequest()"
          />
          <div class="w-10"></div>
        </div>
        <div v-if="showPresets" class="pt-6">
          <ChatPresets id="chatPresets" @clicked="value => onPresetClick(value)" />
        </div>
      </div>
    </div>
    <!-- Notification -->
    <div class="absolute bottom-2 left-0 w-full text-center">
      <p class="text-slate-500" style="font-size: 0.65rem">
        {{ $t('chat.footer.info') }}
      </p>
    </div>
  </BoxContainer>
</template>
