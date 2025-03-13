<script setup lang="ts">
// Imports
import ChatAssistantSelect from '@/components/chat/ChatAssistantSelect.vue';
import ChatInputTextarea from '@/components/chat/ChatInputTextarea.vue';
import EditorSidePanel from '@/components/editor/EditorSidePanel.vue';
import { useAiChatStore } from '@/modules/ai-chat/stores';
import { markdownService } from '@/modules/markdown/markdown.service';
import { useEditorStore } from '@/stores/editor.store';

// Props
// Emits

// Refs
const textareaInput = ref<string | undefined>(undefined);

// Stores
const editorStore = useEditorStore();
const aiChatStore = useAiChatStore();

// Injections
// Composables

// Computed
// Functions
async function onInputSubmit() {
  const userMessageContent = textareaInput.value?.trim();
  if (!userMessageContent || userMessageContent.length < 1) {
    console.warn('Input is empty or chatId is not set');
    return;
  }

  // Clear the textarea input
  textareaInput.value = undefined;

  // Check if chat is set, if not create a new chat on first message
  if (!aiChatStore.hasChat) {
    await aiChatStore.createNewChat({ assistantId: 'default' });
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
      <div class="no-scrollbar relative grow overflow-y-scroll">
        <div class="h-full space-y-2">
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
        </div>
      </div>
      <!-- Chat input -->
      <div class="relative">
        <ChatInputTextarea v-model="textareaInput" @submit="onInputSubmit" />
        <div class="absolute bottom-[0.3rem] z-10 right-8">
          <ChatAssistantSelect />
        </div>
      </div>
    </div>
  </EditorSidePanel>
</template>
