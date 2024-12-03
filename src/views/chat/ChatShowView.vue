<script setup lang="ts">
import BoxContainer from '@components/box/BoxContainer.vue';
import ChatButtonNewChat from '@components/chat/ChatButtonNewChat.vue';
import ChatHistorySidebar from '@components/chat/ChatHistorySidebar.vue';
import ChatImageInput from '@components/chat/ChatImageInput.vue';
import ChatMessageBox from '@components/chat/ChatMessageBox.vue';
import ChatMessageChunk from '@components/chat/ChatMessageChunk.vue';
import ChatPresets from '@components/chat/ChatPresets.vue';
import ChatSettings from '@components/chat/ChatSettings.vue';
import ChatToolCallMessage from '@components/chat/ChatToolCallMessage.vue';
import { useChatImages, type ChatImage } from '@composables/chat/useChatImages';
import { useChatService } from '@composables/services/useChatService';
import { useChatTools } from '@composables/useChatTools';
import { useWebsocketGlobal } from '@composables/websocket/useWebsocketGlobal';
import { useChatSettingsStore } from '@stores/chat-settings.store';
import { useChatStore } from '@stores/chat.store';
import { Button } from '@ui/button';
import { Textarea } from '@ui/textarea';
import { PaperclipIcon, SendIcon, SquareIcon } from 'lucide-vue-next';
import ChatAssistantDetails from './ChatAssistantDetails.vue';

useHead({
  title: 'Chat',
});

const socket = useWebsocketGlobal();
const chatStore = useChatStore();
const settings = useChatSettingsStore();

const {
  initChat,
  sendChatMessage,
  clearChatMessages,
  abortChatRequest,
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

const { setActiveTool, unsetActiveTool, activeTools } = useChatTools();

// ChatId
const route = useRoute();
const chatId = route.params.id.toString();

const inputMessage = ref('');
const chatTitle = ref('');

const autoScrollLocked = ref(false);

const chatInputFormRef = ref<HTMLFormElement | null>(null);
const chatBoxContainerRef = ref<HTMLElement | null>(null);
const chatMessagesContainerRef = ref<HTMLElement | null>(null);

const showAbortButton = computed(
  () => isThinking.value === true || isStreaming.value === true,
);
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
const onSubmit = async () => {
  if (!inputMessage.value.trim()) return;
  const userMessageContent = inputMessage.value;
  inputMessage.value = '';

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
      content: userMessageContent,
      visionContent,
    });
  } catch (e) {
    console.error('Failed to send message:', e);
  }
};

const onKeyDownEnter = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && !event.shiftKey && settings.submitOnEnter) {
    event.preventDefault();
    onSubmit();
  }
};

const onPresetClick = (value: string) => {
  inputMessage.value = value;
  onSubmit();
};

const scrollToBottom = (options: { instant: boolean } = { instant: false }) => {
  nextTick(() => {
    chatMessagesContainerRef.value?.scrollTo({
      top: chatMessagesContainerRef.value.scrollHeight,
      behavior: options.instant ? 'instant' : 'smooth',
    });
  });
};

const { openFileDialog, readFile, inputImages, allowedFileMimeTypes } =
  useChatImages();

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

const { arrivedState } = useScroll(chatMessagesContainerRef);

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

// watch route changes
watch(
  () => route.params.id,
  async value => {
    await initChat(value.toString());
    scrollToBottom({ instant: true });
  },
);

onMounted(async () => {
  await initChat(chatId);
  scrollToBottom({ instant: true });
  focusInput();
});

onMounted(() => {
  socket.on(`chat-${chatId}-tool-start-event`, setActiveTool);
  socket.on(`chat-${chatId}-tool-end-event`, unsetActiveTool);
});

onBeforeUnmount(() => {
  socket.off(`chat-${chatId}-tool-start-event`, setActiveTool);
  socket.off(`chat-${chatId}-tool-end-event`, unsetActiveTool);
});
</script>

<template>
  <BoxContainer
    id="chatWrapper"
    ref="chatBoxContainerRef"
    class="relative flex size-full flex-col border-0 px-10 pb-8 pt-16"
    :class="{
      'md:px-20 2xl:px-40': !settings.sideBarOpen,
    }"
  >
    <!-- chat header -->
    <!-- left quick controls -->
    <div class="absolute left-7 top-5 border-0 z-10">
      <div class="space-y-3 border-0 flex flex-col p-2 rounded-lg">
        <ChatButtonNewChat />
        <ChatHistorySidebar />
      </div>
    </div>
    <!-- right quick controls -->
    <div class="absolute right-10 top-5 border-0 z-10">
      <div class="flex justify-center items-center shrink-0 space-x-5">
        <ChatAssistantDetails
          :provider="assistant?.llm.provider"
          :title="assistant?.title"
        />
        <ChatSettings
          :assistant-id="assistant?.id"
          @delete-all-messages="clearChatMessages"
        />
      </div>
    </div>

    <!-- chat messages container -->
    <div
      id="chatMessagesContainer"
      ref="chatMessagesContainerRef"
      class="no-scrollbar relative grow overflow-y-scroll rounded-lg"
    >
      <ChatPresets
        v-if="!hasChatMessages"
        id="chatPresets"
        class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border-0"
        style="width: 100%; max-width: 800px; max-height: 80%"
        @clicked="value => onPresetClick(value)"
      />
      <!-- chat messages -->
      <ChatMessageBox
        v-for="(message, index) in chatMessages"
        :key="index"
        :type="message.type"
        :content="message.content"
        :vision-contents="message.visionContent"
        :display-name="message.role === 'user' ? 'User' : assistant?.title"
      />
      <!-- thinking message -->
      <ChatMessageBox
        v-if="isThinking"
        type="text"
        :display-name="assistant?.title"
        content="..."
      />
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
        <p class="pb-2 font-semibold">Ups, something went wrong:</p>
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
    <div id="chatInputWrapper" class="relative shrink-0 pt-1">
      <!-- Image input -->
      <ChatImageInput v-model:input-images="inputImages" />
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
          @submit.prevent="onSubmit"
        >
          <div class="relative z-10 max-h-96 w-full">
            <Textarea
              v-model="inputMessage"
              placeholder="Your message..."
              rows="1"
              resize="none"
              class="no-scrollbar min-h-[52px] resize-none rounded-2xl py-4 pr-14 focus:shadow-lg"
              @keydown.enter="onKeyDownEnter"
              @input="adjustTextareaHeight"
            />
          </div>
          <Button
            v-if="showAbortButton"
            variant="outline"
            size="icon"
            class="group absolute bottom-2 right-3 z-20 mr-1 size-9 rounded-full bg-slate-100"
            @click="() => abortChatRequest()"
          >
            <SquareIcon
              class="!size-4 stroke-1.5 text-slate-500 group-hover:text-slate-900"
            />
          </Button>
          <Button
            v-else
            class="absolute bottom-[0.4rem] right-2 z-10 size-9"
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
    </div>
    <!-- Notification -->
    <div class="absolute bottom-2 left-0 w-full text-center">
      <p class="text-slate-500" style="font-size: 0.65rem">
        Conversation with artifical intelligence. It can make mistakes. Please
        verify important information.
      </p>
    </div>
  </BoxContainer>
</template>
