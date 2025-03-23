<script setup lang="ts">
import { ChatMessageRole } from '@/modules/ai-chat/enums/chat-role.enum';
import { markdownService } from '@/modules/markdown/services/markdown.service';
import 'highlight.js/styles/stackoverflow-light.min.css';
import type { ChatMessageContent, ChatMessageType, ChatMessageVisionContent } from 'ragna-sdk';
import ChatMessageBoxWrapper from './ChatMessageBoxWrapper.vue';

interface ChatMessageBoxProps {
  role: ChatMessageRole;
  type: ChatMessageType;
  content: ChatMessageContent[];
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
      v-if="role === ChatMessageRole.ASSISTANT && (type === 'text' || type === 'image')"
      v-dompurify-html="markdownService.toHtml(content[0].text.toString())"
      class="w-full pr-10"
    ></div>
    <div
      v-else-if="role === ChatMessageRole.USER && (type === 'text' || type === 'image')"
      class="whitespace-pre-line"
    >
      {{ content[0].text.toString() }}
    </div>
    <div v-else>{{ content.toString() }}</div>
  </ChatMessageBoxWrapper>
</template>
