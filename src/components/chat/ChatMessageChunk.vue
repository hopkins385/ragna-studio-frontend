<script setup lang="ts">
import useMarkdown from '@/composables/useMarkdown';
import ChatMessageBoxWrapper from './ChatMessageBoxWrapper.vue';

defineProps<{
  streamText: string;
  assistantName?: string;
}>();

const { parseMarkdown } = useMarkdown();
</script>

<template>
  <ChatMessageBoxWrapper :display-name="assistantName ?? 'Assistant'">
    <div
      v-dompurify-html="parseMarkdown(streamText)"
      class="w-full pr-10"
    ></div>
  </ChatMessageBoxWrapper>
</template>
