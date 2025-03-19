<script setup lang="ts">
import type { ChatMessageRole } from '@/modules/ai-chat/enums/chat-role.enum';
import { markdownService } from '@/modules/markdown/services/markdown.service';
import 'highlight.js/styles/stackoverflow-light.min.css';
import type { ChatMessageVisionContent } from 'ragna-sdk';
import ChatMessageBoxWrapper from './ChatMessageBoxWrapper.vue';

interface ChatMessageBoxProps {
  role: ChatMessageRole;
  type: 'text' | 'image' | 'video' | 'audio' | null | undefined;
  text: string;
  displayName?: string;
  visionContents?: ChatMessageVisionContent[] | null;
}

defineProps<ChatMessageBoxProps>();
</script>

<template>
  <ChatMessageBoxWrapper :display-name="displayName || ''" :role="role">
    <!-- Vision Content -->
    <div v-if="visionContents?.length" class="pb-4">
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
    <!-- Text Content -->
    <div
      v-if="role === 'assistant'"
      v-dompurify-html="markdownService.toHtml(text)"
      class="w-full pr-10"
    ></div>
    <div v-else class="whitespace-pre-line">{{ text }}</div>
  </ChatMessageBoxWrapper>
</template>
