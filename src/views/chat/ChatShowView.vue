<script setup lang="ts">
import ChatHistoryDrawerButton from '@/components/chat/ChatHistoryDrawerButton.vue';
import ChatPresets from '@/components/chat/ChatPresets.vue';
import ChatThinkingBox from '@/components/chat/ChatThinkingBox.vue';
import { ChatMessageRole } from '@/enums/chat-role.enum';
import { useAiChatSettingsStore } from '@/modules/ai-chat-settings/stores/ai-chat-settings.store';
import { chatInputTextSchema } from '@/schemas/chat-input-text.schema';
import { useAuthStore } from '@/stores/auth.store';
import { useChatInferenceStore } from '@/stores/chat-inference.store';
import { useWebSocketStore } from '@/stores/websocket.store';
import BoxContainer from '@components/box/BoxContainer.vue';
import ChatButtonNewChat from '@components/chat/ChatButtonNewChat.vue';
import ChatImageInput from '@components/chat/ChatImageInput.vue';
import ChatMessageBox from '@components/chat/ChatMessageBox.vue';
import ChatMessageChunk from '@components/chat/ChatMessageChunk.vue';
import ChatSettings from '@components/chat/ChatSettings.vue';
import ChatToolCallMessage from '@components/chat/ChatToolCallMessage.vue';
import { useChatImages, type ChatImage } from '@composables/chat/useChatImages';
import { useChatService } from '@composables/services/useChatService';
import { useChatTools } from '@composables/useChatTools';
import { Button } from '@ui/button';
import { Textarea } from '@ui/textarea';
import { ArrowDownIcon, PaperclipIcon, SendIcon, SquareIcon } from 'lucide-vue-next';
import ChatAssistantDetails from './ChatAssistantDetails.vue';

const socket = useWebSocketStore();
const chatStore = useChatInferenceStore();
const authStore = useAuthStore();
const settings = useAiChatSettingsStore();

const { t } = useI18n();

const {
  initChat,
  sendChatMessage,
  clearChatMessages,
  abortChatRequest,
  chat,
  chatTextChunks,
  chatAssistant: assistant,
  chatMessages,
  hasChatMessages,
  isStreaming,
  isThinking,
  hasError,
  errorMessage,
  setError,
  clearError,
} = useChatService();

const { setActiveTool, unsetActiveTool, clearActiveTools, activeTools } = useChatTools();

// activeChatId
const route = useRoute();
const activeChatId = ref('');

const setupChatIsCompleted = ref(false);

const inputMessage = ref<string | number>('');
const autoScrollLocked = ref(false);
const chatInputFormRef = ref<HTMLFormElement | null>(null);
const chatBoxContainerRef = ref<HTMLElement | null>(null);
const chatMessagesContainerRef = ref<HTMLElement | null>(null);

const showPresets = computed(() => setupChatIsCompleted.value === true && !hasChatMessages.value);
const chatTitle = computed(() => chat.value?.title);
const showAbortButton = computed(() => isThinking.value === true || isStreaming.value === true);
const streamText = computed(() => chatTextChunks.value.join(''));

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
const onSubmit = async (chatId: string) => {
  clearError();

  if (!chatId || !chatId.trim()) {
    console.error('No chatId provided');
    return;
  }
  if (!inputMessage.value.toString().trim()) {
    return;
  }

  const userMessageContent = inputMessage.value;
  inputMessage.value = '';

  // validate input
  const result = chatInputTextSchema.safeParse({ input: userMessageContent });
  if (!result.success) {
    setError(result.error.errors[0].message);
    return;
  }

  nextTick(() => {
    adjustTextareaHeight();
  });

  const hasImages = inputImages.value.some(image => image.status === 'loaded');
  const msgType = hasImages ? 'image' : 'text';
  const visionContent = getVisionContent(inputImages.value);

  clearVisionContent();

  try {
    await sendChatMessage({
      chatId,
      type: msgType,
      content: userMessageContent.toString(),
      visionContent,
    });
  } catch (e: any) {
    setError(e.message);
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

const onKeyDownEnter = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && !event.shiftKey && settings.submitOnEnter) {
    event.preventDefault();
    onSubmit(activeChatId.value);
  }
};

const onPresetClick = (value: string) => {
  inputMessage.value = value;
  onSubmit(activeChatId.value);
};

const onAbortChatRequest = () => {
  abortChatRequest();
  clearActiveTools();
};

const onResetChat = async () => {
  await clearChatMessages();
  clearActiveTools();
  clearError();
  await initChat(activeChatId.value);
};

const setupSocketListeners = (chatId: string) => {
  socket.on(`chat-${chatId}-tool-start-event`, setActiveTool);
  socket.on(`chat-${chatId}-tool-end-event`, unsetActiveTool);
};

const removeSocketListeners = (chatId: string) => {
  socket.off(`chat-${chatId}-tool-start-event`, setActiveTool);
  socket.off(`chat-${chatId}-tool-end-event`, unsetActiveTool);
};

const setupChat = async (chatId: string) => {
  // console.log('Setting up chat:', chatId);
  setupChatIsCompleted.value = false;
  activeChatId.value = chatId;
  settings.resetSettings();
  await initChat(chatId);
  removeSocketListeners(chatId);
  setupSocketListeners(chatId);
  scrollToBottom({ instant: true });
  focusInput();
  setupChatIsCompleted.value = true;
};

const { openFileDialog, readFile, inputImages, allowedFileMimeTypes } = useChatImages();

const { isOverDropZone } = useDropZone(chatBoxContainerRef, {
  onDrop: files => {
    if (!chatStore.modelWithVision) return;
    const file = files?.[0];
    readFile(file);
  },
  dataTypes: allowedFileMimeTypes,
});

/**
 * Adjusts the height of the textarea based on its content.
 */
const adjustTextareaHeight = () => {
  const maxHeight = 364;
  const textarea = chatInputFormRef.value?.querySelector('textarea');
  if (textarea) {
    // Reset height to auto to calculate the new height
    textarea.style.height = 'auto';
    // Set the height to match the scrollHeight
    textarea.style.height = `${Math.min(maxHeight, textarea.scrollHeight)}px`;
  }
};

const focusInput = () => {
  const textarea = chatInputFormRef.value?.querySelector('textarea');
  if (textarea) textarea.focus();
};

// SCROLL

const { arrivedState } = useScroll(chatMessagesContainerRef);

const showScrollToBottomButton = ref(false);

// observer
useMutationObserver(
  chatMessagesContainerRef,
  mutations => {
    if (!autoScrollLocked.value && mutations.length > 0) scrollToBottom();
  },
  {
    childList: true,
    subtree: true,
    characterData: true,
  },
);

useEventListener(
  chatMessagesContainerRef,
  'wheel',
  () => {
    // Disable auto-scroll when the user scrolls up and re-enable it when back at the bottom
    if (arrivedState.bottom) {
      autoScrollLocked.value = false;
      return;
    }
    autoScrollLocked.value = true;
  },
  {
    passive: true,
  },
);

// watch route changes and setup chat onMount
// onMounted setupChat is not required, because the watcher is immediate
watch(
  () => route.params.id.toString(),
  async id => await setupChat(id),
  { immediate: true },
);

onBeforeUnmount(() => {
  removeSocketListeners(activeChatId.value);
});

useHead({
  title: t('chat.title'),
  meta: [
    {
      name: 'description',
      content: t('chat.subtitle'),
    },
  ],
});
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
          :chat-title="chatTitle"
          :llm-provider="assistant?.llm.provider"
          :llm-name="assistant?.llm.displayName"
          :title="assistant?.title"
        />
        <ChatSettings :assistant-id="assistant?.id" @reset-chat="onResetChat" />
      </div>
    </div>

    <!-- chat messages container -->
    <div
      id="chatMessagesContainer"
      ref="chatMessagesContainerRef"
      class="no-scrollbar relative grow overflow-y-scroll rounded-lg w-full max-w-[70rem] mx-auto"
    >
      <!-- chat messages -->
      <ChatMessageBox
        v-for="(message, index) in chatMessages"
        :key="index"
        :type="message.type"
        :content="message.content"
        :vision-contents="message.visionContent"
        :display-name="message.role === 'user' ? authStore.userFirstName : assistant?.title"
        :role="message.role === 'user' ? ChatMessageRole.USER : ChatMessageRole.ASSISTANT"
      />
      <!-- thinking message -->
      <ChatThinkingBox v-if="isThinking" :display-name="assistant?.title" />
      <!-- streaming message -->
      <ChatMessageChunk
        v-if="streamText.length > 0"
        id="chatMessage"
        :stream-text="streamText"
        :assistant-name="assistant?.title"
      />
      <!-- tool call message -->
      <ChatToolCallMessage
        v-if="activeTools.length > 0"
        :display-name="assistant?.title ?? 'Assistant'"
        :active-tools="activeTools"
      />
      <!-- error message -->
      <div v-if="hasError" class="px-20 text-sm text-destructive">
        <p class="pb-2 font-semibold">{{ $t('alert.error.message') }}</p>
        <p>{{ errorMessage }}</p>
      </div>
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
          <div v-if="chatStore.modelWithVision">
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
          <form
            id="chatInputForm"
            ref="chatInputFormRef"
            class="relative flex w-full items-center space-x-2 border-0"
            @submit.prevent="() => onSubmit(activeChatId)"
          >
            <div class="relative z-10 max-h-96 w-full">
              <div
                v-if="showScrollToBottomButton"
                class="absolute -top-6 left-1/2 w-fit -translate-x-1/2 text-center bg-transparent"
              >
                <Button
                  variant="outline"
                  size="icon"
                  class="group rounded-full border shadow-md size-8"
                  @click="() => scrollToBottom({ instant: true })"
                >
                  <ArrowDownIcon class="!size-4 stroke-2 group-hover:stroke-2" />
                </Button>
              </div>
              <Textarea
                v-model="inputMessage"
                :placeholder="$t('chat.input.placeholder')"
                resize="none"
                class="no-scrollbar resize-none rounded-2xl py-4 pr-14 focus:shadow-lg bg-stone-50"
                @keydown.enter="onKeyDownEnter"
                @input="adjustTextareaHeight"
              />
            </div>
            <Button
              v-if="showAbortButton"
              variant="outline"
              size="icon"
              class="group absolute bottom-3 right-3 z-20 mr-1 size-8 rounded-full bg-slate-100"
              @click="onAbortChatRequest"
            >
              <SquareIcon class="!size-4 stroke-1.5 text-slate-500 group-hover:text-slate-900" />
            </Button>
            <Button
              v-else
              class="absolute bottom-2 right-2 z-10 size-9"
              type="submit"
              size="icon"
              variant="ghost"
              :disabled="!inputMessage"
            >
              <SendIcon class="!size-5 stroke-1.5" />
            </Button>
          </form>
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
