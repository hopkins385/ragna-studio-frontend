<script setup lang="ts">
import type { ChatMessageVisionContent } from '@/composables/services/useChatService';
import type { ChatMessageRole } from '@/enums/chat-role.enum';
import { markdownService } from '@/modules/markdown/markdown.service';
import 'highlight.js/styles/stackoverflow-light.min.css';
import ChatMessageBoxWrapper from './ChatMessageBoxWrapper.vue';

interface ChatMessageBoxProps {
  role: ChatMessageRole;
  type: 'text' | 'image' | 'video' | 'audio' | null | undefined;
  content: string;
  displayName?: string;
  visionContents?: ChatMessageVisionContent[] | null;
}

defineProps<ChatMessageBoxProps>();
</script>

<template>
  <ChatMessageBoxWrapper :display-name="displayName || ''" :role="role">
    <!-- Vision Content -->
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
    <!-- Text Content -->
    <div v-dompurify-html="markdownService.toHtml(content)"></div>
  </ChatMessageBoxWrapper>
</template>
