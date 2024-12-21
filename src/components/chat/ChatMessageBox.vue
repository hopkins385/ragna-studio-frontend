<script setup lang="ts">
import type { ChatMessageVisionContent } from '@/composables/services/useChatService';
import useMarkdown from '@/composables/useMarkdown';
import 'highlight.js/styles/stackoverflow-light.min.css';
import ChatMessageBoxWrapper from './ChatMessageBoxWrapper.vue';

defineProps<{
  type: 'text' | 'image' | 'video' | 'audio' | null | undefined;
  content: string;
  displayName?: string;
  visionContents?: ChatMessageVisionContent[] | null;
}>();

const { parseMarkdown } = useMarkdown();
</script>

<template>
  <ChatMessageBoxWrapper :display-name="displayName || ''">
    <div v-if="visionContents?.length">
      <div
        v-for="(visionContent, index) in visionContents"
        :key="index"
        class="max-h-96 max-w-xl overflow-hidden rounded-lg"
      >
        <img
          v-if="visionContent.type === 'image'"
          :src="visionContent.url"
          class="rounded-lg max-w-xl max-h-96 object-contain"
          crossorigin=""
        />
      </div>
    </div>
    <div v-dompurify-html="parseMarkdown(content)" class="w-full pr-10"></div>
  </ChatMessageBoxWrapper>
</template>
