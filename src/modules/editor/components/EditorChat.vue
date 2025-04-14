<script setup lang="ts">
// Imports
import Illustration from '@/assets/illustrations/undraw_saying.svg';
import TooltipWrapper from '@/components/tooltip/TooltipWrapper.vue';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAutoScroll } from '@/composables/useAutoScroll';
import { useAiChatSettingsStore } from '@/modules/ai-chat-settings/stores/ai-chat-settings.store';
import ChatAssistantSelect from '@/modules/ai-chat/components/ChatAssistantSelect.vue';
import ChatAssistantTaskSelect from '@/modules/ai-chat/components/ChatAssistantTaskSelect.vue';
import ChatInputTextarea from '@/modules/ai-chat/components/ChatInputTextarea.vue';
import { useAiChatStore } from '@/modules/ai-chat/stores';
import { transformEditorJsonContent } from '@/modules/editor/helpers/transform-json-payload.helper';
import { useEditorStore } from '@/modules/editor/stores/editor.store';
import { markdownService } from '@/modules/markdown/services/markdown.service';
import { RouteName } from '@/router/enums/route-names.enum';
import { EllipsisIcon, HistoryIcon, PlusIcon } from 'lucide-vue-next';
import EditorSidePanel from './EditorSidePanel.vue';

// Props
// Emits

// Refs
const chatContainer = useTemplateRef('chatContainerRef');

// Stores
const editorStore = useEditorStore();
const aiChatStore = useAiChatStore();
const aiChatSettings = useAiChatSettingsStore();

// Injections
// Composables
const router = useRouter();
useAutoScroll(chatContainer);

// Computed
const submitLocked = computed<boolean>(() => {
  return !aiChatSettings.hasSelectedAssistant || aiChatStore.isThinking || aiChatStore.isStreaming;
});

// Functions
async function submitForm(inputText: string) {
  const userMessageContent = inputText.trim();
  if (!userMessageContent || userMessageContent.length < 1) {
    console.warn('Input is empty or chatId is not set');
    return;
  }

  // Check if chat is set, if not create a new chat on first message
  if (!aiChatStore.hasChat) {
    if (!aiChatSettings.selectedAssistantId) {
      throw new Error('Select an assistant to start a new chat');
    }
    await aiChatStore.createNewChat({ assistantId: aiChatSettings.selectedAssistantId });
  }

  const rawJsonContent = editorStore.getJSONContent();
  const transformedJsonContent = transformEditorJsonContent(rawJsonContent?.content ?? []);

  // console.log('rawJsonContent:', rawJsonContent);
  // console.log('Transformed JSON content:', transformedJsonContent);
  // return;

  await aiChatStore.createAndStreamUserChatMessage({
    chatId: aiChatStore.chat?.id,
    type: 'text',
    content: [
      {
        type: 'text',
        text: userMessageContent,
      },
    ],
    context: JSON.stringify(transformedJsonContent),
  });
}

const onSubmitTextareaForm = async (inputText: string) => {
  if (submitLocked.value !== false) {
    console.warn('Submit is locked');
    return;
  }
  await submitForm(inputText);
};

const createEmptyChat = async () => {
  aiChatStore.resetChat();
};

const redirectToChat = () => {
  if (!aiChatStore.chat || !aiChatStore.chat.id) {
    console.warn('No chat found');
    return;
  }
  router.push({
    name: RouteName.CHAT_SHOW,
    params: {
      id: aiChatStore.chat.id,
    },
  });
};

const redirectToChatHistory = () => {
  router.push({
    name: RouteName.CHAT_HISTORY,
  });
};

const abortRequest = () => {
  aiChatStore.abortChatRequest();
};

// Hooks
onBeforeUnmount(() => {
  aiChatStore.resetStore();
});
</script>

<template>
  <EditorSidePanel
    :panel-id="'chat'"
    :resizable="true"
    :show-reset-button="true"
    :title="$t('chat.title')"
    v-model="editorStore.showAiChat"
  >
    <template #header>
      <div class="flex items-center">
        <div>
          <TooltipWrapper :content="$t('chat.create.tooltip.new')">
            <Button
              variant="ghost"
              size="icon"
              class="opacity-75 hover:opacity-100 -ml-1"
              @click="createEmptyChat"
            >
              <PlusIcon class="size-4" />
            </Button>
          </TooltipWrapper>
        </div>
        <div>
          <TooltipWrapper :content="$t('chat.history.tooltip.show')">
            <Button
              variant="ghost"
              size="icon"
              class="opacity-75 hover:opacity-100 -ml-1"
              @click="redirectToChatHistory"
            >
              <HistoryIcon class="size-4" />
            </Button>
          </TooltipWrapper>
        </div>
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <Button variant="ghost" size="icon" class="opacity-75 hover:opacity-100 -ml-1">
                <EllipsisIcon class="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent :avoid-collisions="true" side="bottom" align="end">
              <DropdownMenuItem @click="redirectToChat" class="cursor-pointer">
                Open Chat in Window
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </template>
    <div class="flex flex-col h-[calc(100vh-9rem)]">
      <!-- Chat scroll container -->
      <div
        ref="chatContainerRef"
        class="chatbox__text-box no-scrollbar relative grow overflow-y-scroll"
      >
        <div class="h-full space-y-2">
          <!-- Empty Chat Placeholder -->
          <div v-if="!aiChatStore.hasChatMessages" class="pt-20">
            <div class="w-32 mx-auto">
              <Illustration />
            </div>
            <div class="px-14 pt-10 text-center text-sm space-y-4">
              <p class="opacity-75 font-bold">{{ $t('chat.empty.title') }}</p>
              <p class="opacity-75">
                {{ $t('chat.empty.subtitle') }}
              </p>
            </div>
          </div>
          <!-- Chat messages -->
          <template v-for="(message, index) in aiChatStore.chatMessages" :key="index">
            <div
              v-if="message.type === 'text'"
              class="p-2 rounded-md text-sm"
              v-dompurify-html="markdownService.toHtml(message.content?.[0]?.text.toString())"
            ></div>
          </template>
          <div v-if="aiChatStore.isThinking">...</div>
          <!-- Chat messages stream chunks -->
          <div
            v-if="aiChatStore.isStreaming"
            class="p-2 rounded-md text-sm"
            v-dompurify-html="markdownService.toHtml(aiChatStore.joinedMessageTextChunks)"
          ></div>
          <div class="h-4"></div>
        </div>
      </div>
      <!-- Chat input -->
      <div class="relative pt-1">
        <ChatInputTextarea
          textarea-class="pb-10 pr-3"
          textarea-size="sm"
          :show-abort-button="aiChatStore.isThinking || aiChatStore.isStreaming"
          :submit-locked="submitLocked"
          @submit-form="onSubmitTextareaForm"
          @abort="abortRequest"
        />
        <div class="absolute bottom-[0.3rem] z-10 right-8 flex items-center -space-x-3">
          <ChatAssistantTaskSelect :select-locked="aiChatStore.isLoading" />
          <ChatAssistantSelect :select-locked="aiChatStore.hasChat" />
        </div>
      </div>
    </div>
  </EditorSidePanel>
</template>
