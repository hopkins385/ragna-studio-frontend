<script setup lang="ts">
import { ChatMessageRole } from '@/enums/chat-role.enum';
import { markdownService } from '@/modules/markdown/markdown.service';
import ChatMessageBoxWrapper from './ChatMessageBoxWrapper.vue';

defineProps<{
  streamText: string;
  assistantName?: string;
}>();

const role = ChatMessageRole.ASSISTANT;
</script>

<template>
  <ChatMessageBoxWrapper :display-name="assistantName ?? 'Assistant'" :role="role">
    <div v-dompurify-html="markdownService.toHtml(streamText)" class="w-full pr-10"></div>
  </ChatMessageBoxWrapper>
</template>
