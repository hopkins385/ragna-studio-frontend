<script setup lang="ts">
import useMarkdown from '@/composables/useMarkdown';
import { ChatMessageRole } from '@/enums/chat-role.enum';
import ChatMessageBoxWrapper from './ChatMessageBoxWrapper.vue';

defineProps<{
  streamText: string;
  assistantName?: string;
}>();

const role = ChatMessageRole.ASSISTANT;

const { parseMarkdown } = useMarkdown();
</script>

<template>
  <ChatMessageBoxWrapper
    :display-name="assistantName ?? 'Assistant'"
    :role="role"
  >
    <div
      v-dompurify-html="parseMarkdown(streamText)"
      class="w-full pr-10"
    ></div>
  </ChatMessageBoxWrapper>
</template>
