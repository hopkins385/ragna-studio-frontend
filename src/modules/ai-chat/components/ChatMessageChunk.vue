<script setup lang="ts">
import { ChatMessageRole } from '@/modules/ai-chat/enums/chat-role.enum';
import { markdownService } from '@/modules/markdown/services/markdown.service';
import { Loader2Icon } from 'lucide-vue-next';
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
    <div class="w-full pr-10 pt-3">
      <Loader2Icon class="animate-spin size-5 opacity-50" />
    </div>
  </ChatMessageBoxWrapper>
</template>
