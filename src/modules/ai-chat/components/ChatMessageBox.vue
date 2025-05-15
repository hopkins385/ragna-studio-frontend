<script setup lang="ts">
import TooltipWrapper from '@/components/tooltip/TooltipWrapper.vue';
import { Button } from '@/components/ui/button';
import ChatCopyButton from '@/modules/ai-chat/components/ChatCopyButton.vue';
import { ChatMessageRole } from '@/modules/ai-chat/enums/chat-role.enum';
import { markdownService } from '@/modules/markdown/services/markdown.service';
import type {
  ChatMessageContent,
  ChatMessageType,
  ChatMessageVisionContent,
} from '@hopkins385/ragna-sdk';
import 'highlight.js/styles/stackoverflow-light.min.css';
import { CheckIcon, CopyIcon, ThumbsDownIcon, ThumbsUpIcon } from 'lucide-vue-next';
import { render } from 'vue';
import ChatMessageBoxWrapper from './ChatMessageBoxWrapper.vue';

const props = defineProps<{
  role: ChatMessageRole;
  type: ChatMessageType;
  content: ChatMessageContent[];
  displayName?: string;
  visionContents?: ChatMessageVisionContent[] | null;
}>();

const chatMessageContentRef = useTemplateRef('chat-message-content');
const copied = ref(false);

const { t } = useI18n();

function addCodeCopyButtons() {
  const pres = chatMessageContentRef.value?.querySelectorAll('pre');

  pres?.forEach(pre => {
    const codeContainer = pre.querySelector('code');
    if (!codeContainer) return;
    // Create a container for the button
    const buttonDivContainer = document.createElement('div');
    pre.appendChild(buttonDivContainer);

    // Render the Vue component
    const vnode = h(ChatCopyButton, {
      label: t('form.button.copy'),
      content: codeContainer.innerText,
    });
    render(vnode, buttonDivContainer);
  });
}

const setCopied = () => {
  copied.value = true;
  setTimeout(() => {
    copied.value = false;
  }, 2000);
};

const onCopyMessage = async () => {
  const htmlContent = chatMessageContentRef.value?.innerHTML.trim();
  const message = props.content?.[0]?.text.toString().trim();

  if (!message || !htmlContent) {
    console.error('No message to copy');
    return;
  }

  if (!navigator.clipboard || !navigator.clipboard.write) {
    console.error('Clipboard API not supported');
    return;
  }

  try {
    // Create a clipboard item with both plain text and HTML
    const clipboardItem = new ClipboardItem({
      'text/plain': new Blob([message], { type: 'text/plain' }),
      'text/html': new Blob([htmlContent], { type: 'text/html' }),
    });

    await navigator.clipboard.write([clipboardItem]);
    setCopied();
    return;
  } catch (err) {
    console.error('Failed to copy to clipboard:', err);
  }
};

onMounted(() => {
  // Add copy buttons to code blocks
  addCodeCopyButtons();
});
</script>

<template>
  <ChatMessageBoxWrapper :display-name="displayName || ''" :role="role">
    <template #default>
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
    </template>
    <template #controls>
      <div
        v-if="role == ChatMessageRole.ASSISTANT"
        class="absolute -bottom-7 left-12 z-10 p-1 hidden group-hover:block"
      >
        <TooltipWrapper :content="$t('form.button.copy')" :delay-duration="100">
          <Button
            variant="ghost"
            size="icon"
            @click="onCopyMessage"
            class="opacity-50 hover:opacity-100"
          >
            <span>
              <CheckIcon v-if="copied" class="size-4" />
              <CopyIcon v-else class="size-4" />
            </span>
          </Button>
        </TooltipWrapper>
        <TooltipWrapper content="Like" :delay-duration="100">
          <Button variant="ghost" size="icon" class="opacity-50 hover:opacity-100">
            <span>
              <ThumbsUpIcon class="size-4" />
            </span>
          </Button>
        </TooltipWrapper>
        <TooltipWrapper content="Dislike" :delay-duration="100">
          <Button variant="ghost" size="icon" class="opacity-50 hover:opacity-100">
            <span>
              <ThumbsDownIcon class="size-4" />
            </span>
          </Button>
        </TooltipWrapper>
      </div>
    </template>
  </ChatMessageBoxWrapper>
</template>
