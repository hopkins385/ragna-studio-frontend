<script setup lang="ts">
// Imports
import Illustration from '@/assets/illustrations/empty-comments.svg';
import ChatAssistantSelect from '@/components/chat/ChatAssistantSelect.vue';
import ChatInputTextarea from '@/components/chat/ChatInputTextarea.vue';
import EditorSidePanel from '@/components/editor/EditorSidePanel.vue';
import { useAutoScroll } from '@/composables/useAutoScroll';
import { useAiChatSettingsStore } from '@/modules/ai-chat-settings/stores/ai-chat-settings.store';
import { useAiChatStore } from '@/modules/ai-chat/stores';
import { useEditorStore } from '@/modules/editor/stores/editor.store';
import { markdownService } from '@/modules/markdown/markdown.service';

// Props
// Emits

// Refs
const chatContainer = useTemplateRef('chatContainerRef');
const textareaInput = ref<string | undefined>(undefined);

// Stores
const editorStore = useEditorStore();
const aiChatStore = useAiChatStore();
const aiChatSettings = useAiChatSettingsStore();

// Injections
// Composables
const { isAutoScrolling } = useAutoScroll(chatContainer);

// Computed
const submitLocked = computed<boolean>(() => {
  return !aiChatSettings.hasSelectedAssistant || aiChatStore.isThinking || aiChatStore.isStreaming;
});
// Functions
async function submitForm(args_0?: void | undefined) {
  const userMessageContent = textareaInput.value?.trim();
  if (!userMessageContent || userMessageContent.length < 1) {
    console.warn('Input is empty or chatId is not set');
    return;
  }

  if (submitLocked.value !== false) {
    console.warn('Submit is locked');
    return;
  }

  // Clear the textarea input
  textareaInput.value = undefined;

  // Check if chat is set, if not create a new chat on first message
  if (!aiChatStore.hasChat) {
    if (!aiChatSettings.selectedAssistantId) {
      throw new Error('Select an assistant to start a new chat');
    }
    await aiChatStore.createNewChat({ assistantId: aiChatSettings.selectedAssistantId });
  }

  // Creates a new message and streams the response via chatTextChunks
  await aiChatStore.sendChatMessage({
    chatId: aiChatStore.chat?.id,
    type: 'text',
    content: userMessageContent,
  });
}

onBeforeUnmount(() => {
  aiChatStore.resetStore();
});
</script>

<template>
  <EditorSidePanel title="Chat" v-model="editorStore.showAiChat">
    <div class="flex flex-col h-[calc(100vh-9rem)]">
      <!-- Chat scroll container -->
      <div ref="chatContainerRef" class="no-scrollbar relative grow overflow-y-scroll">
        <div class="h-full space-y-2">
          <!-- Empty Chat Placeholder -->
          <div v-if="!aiChatStore.hasChatMessages">
            <div class="px-20 pt-20 pb-10">
              <Illustration />
            </div>
            <div class="px-14 text-center text-sm space-y-4">
              <p class="opacity-75 font-bold">{{ $t('chat.empty.title') }}</p>
              <p class="opacity-75">
                {{ $t('chat.empty.subtitle') }}
              </p>
            </div>
          </div>
          <!-- Chat messages -->
          <div
            v-for="(message, index) in aiChatStore.chatMessages"
            :key="index"
            class="border p-2 rounded-md text-sm"
            v-dompurify-html="markdownService.toHtml(message.content)"
          ></div>
          <div v-if="aiChatStore.isThinking">...</div>
          <!-- Chat messages stream chunks -->
          <div
            v-if="aiChatStore.isStreaming"
            class="border p-2 rounded-md text-sm"
            v-dompurify-html="markdownService.toHtml(aiChatStore.joinedChatTextChunks)"
          ></div>
          <div class="h-4"></div>
        </div>
      </div>
      <!-- Chat input -->
      <div class="relative pt-1">
        <ChatInputTextarea
          v-model="textareaInput"
          :submit-locked="submitLocked"
          @submit-form="submitForm"
        />
        <div class="absolute bottom-[0.3rem] z-10 right-8">
          <ChatAssistantSelect />
        </div>
      </div>
    </div>
  </EditorSidePanel>
</template>
