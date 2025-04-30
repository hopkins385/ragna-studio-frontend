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
      <!--
      <span class="opacity-50 flex">
        <span class="bounce-dot"></span>
        <span class="bounce-dot animation-delay-200"></span>
        <span class="bounce-dot animation-delay-400"></span>
      </span>
      -->
    </div>
  </ChatMessageBoxWrapper>
</template>

<style scoped>
.bounce-dot {
  @apply bg-current inline-block size-1 rounded-full mx-0.5;
  animation: bounce 1.4s infinite ease-in-out both;
}

.animation-delay-200 {
  animation-delay: 0.2s;
}

.animation-delay-400 {
  animation-delay: 0.4s;
}

@keyframes bounce {
  0%,
  80%,
  100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-6px);
  }
}
</style>
