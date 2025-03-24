<script setup lang="ts">
import ChatCopyButton from '@/modules/ai-chat/components/ChatCopyButton.vue';
import { ChatMessageRole } from '@/modules/ai-chat/enums/chat-role.enum';
import { markdownService } from '@/modules/markdown/services/markdown.service';
import hljs from 'highlight.js/lib/core';
import 'highlight.js/styles/stackoverflow-light.min.css';
import type { ChatMessageContent, ChatMessageType, ChatMessageVisionContent } from 'ragna-sdk';
import { render } from 'vue';
import ChatMessageBoxWrapper from './ChatMessageBoxWrapper.vue';

interface ChatMessageBoxProps {
  role: ChatMessageRole;
  type: ChatMessageType;
  content: ChatMessageContent[];
  displayName?: string;
  visionContents?: ChatMessageVisionContent[] | null;
}
defineProps<ChatMessageBoxProps>();

const chatMessageContentRef = useTemplateRef('chat-message-content');

function formatJSON(obj: unknown): string {
  try {
    return JSON.stringify(obj, null, 2);
  } catch (e) {
    return String(obj);
  }
}

// Add this function to highlight code
function highlightCode(code: string) {
  return hljs.highlight(code, { language: 'json' }).value;
}

function addCopyButtons() {
  const pres = chatMessageContentRef.value?.querySelectorAll('pre');

  pres?.forEach(pre => {
    const code = pre.querySelector('code');
    if (code) {
      // Create a container for the button
      const container = document.createElement('div');
      pre.appendChild(container);

      // Render the Vue component
      const vnode = h(ChatCopyButton, {
        text: code.innerText,
      });
      render(vnode, container);
    }
  });
}

onMounted(() => {
  // Add copy buttons to code blocks
  addCopyButtons();
});
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
      ref="chat-message-content"
      v-if="role === ChatMessageRole.ASSISTANT && (type === 'text' || type === 'image')"
      v-dompurify-html="markdownService.toHtml(content?.[0]?.text.toString() ?? '')"
      class="w-full pr-10 relative"
    ></div>
    <div
      v-else-if="role === ChatMessageRole.USER && (type === 'text' || type === 'image')"
      class="whitespace-pre-line"
    >
      {{ content?.[0]?.text.toString() ?? '' }}
    </div>
    <!-- TODO Properly display tool calls -->
    <div v-else-if="role === ChatMessageRole.ASSISTANT && type === 'tool-result'">
      <div>Tool Calls</div>
      <template v-for="(con, index) in content" :key="index">
        <div class="w-full pr-10 relative mb-2">
          <div class="font-medium mb-1 hidden">Args:</div>
          <pre class="">
          <code class="hljs language-json" v-dompurify-html="highlightCode(formatJSON(con))"></code>
        </pre>
        </div>
        <!--
        <div class="mb-4 hidden">
          <div class="font-medium mb-1">Result:</div>
          <pre class="">
          <code class="hljs language-json" v-dompurify-html="highlightCode(formatJSON(con?.result))"></code>
        </pre>
        </div>
        -->
      </template>
    </div>
  </ChatMessageBoxWrapper>
</template>
