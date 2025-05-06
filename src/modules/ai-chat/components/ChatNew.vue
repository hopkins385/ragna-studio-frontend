<script setup lang="ts">
import ErrorAlert from '@/components/error/ErrorAlert.vue';
import { useErrorAlert } from '@/composables/useErrorAlert';
import { useAiChatSettingsStore } from '@/modules/ai-chat-settings/stores/ai-chat-settings.store';
import ChatAssistantSelect from '@/modules/ai-chat/components/ChatAssistantSelect.vue';
import ChatHistoryDrawerButton from '@/modules/ai-chat/components/ChatHistoryDrawerButton.vue';
import ChatInputTextarea from '@/modules/ai-chat/components/ChatInputTextarea.vue';
import ChatPresets from '@/modules/ai-chat/components/ChatPresets.vue';
import { useAiChatStore } from '@/modules/ai-chat/stores';
import { RouteName } from '@/router/enums/route-names.enum';

const showPresets = true;

// Props
// Emits

// Refs

// Composables
const router = useRouter();
const aiChatStore = useAiChatStore();
const aiChatSettings = useAiChatSettingsStore();
const { errorAlert, setErrorAlert, unsetErrorAlert } = useErrorAlert();

// Computed

// Functions
const createNewChatAndMessage = async ({ inputText }: { inputText: string }) => {
  // reset error alert
  unsetErrorAlert();

  // check if assistant is selected
  if (!aiChatSettings.selectedAssistantId) {
    setErrorAlert('chat.error.no_assistant_selected');
    return;
  }

  try {
    // create new chat
    const chat = await aiChatStore.createNewChat({
      assistantId: aiChatSettings.selectedAssistantId,
    });
    if (!chat || !chat.id) {
      setErrorAlert('chat.error.chat_creation_failed');
      return;
    }
    // navigate to new chat
    await router.push({ name: RouteName.CHAT_SHOW, params: { id: chat.id } });
    await nextTick();

    // start new message stream (and do not await to not block the UI)
    aiChatStore.createAndStreamUserChatMessage({
      chatId: chat.id,
      type: 'text',
      content: [
        {
          type: 'text',
          text: inputText,
        },
      ],
    });
  } catch (error) {
    console.error('Error creating new chat and message:', error);
    setErrorAlert('chat.error.chat_creation_failed');
  }
};

const onSubmitTextareaForm = async (input: string) => {
  if (!input) return;
  await createNewChatAndMessage({ inputText: input });
};

const onPresetClick = async (prompt: string) => {
  if (!prompt) return;
  await createNewChatAndMessage({ inputText: prompt });
};

// Hooks
</script>

<template>
  <div class="relative flex size-full flex-col px-14 lg:px-32 pb-8 pt-16">
    <!-- chat error alert -->
    <ErrorAlert v-model="errorAlert.open" v-bind="errorAlert" />
    <!-- left quick controls -->
    <div class="absolute left-7 top-5 border-0 z-10">
      <div class="space-y-3 border-0 flex flex-col p-2 rounded-lg">
        <ChatHistoryDrawerButton />
      </div>
    </div>
    <!-- Input wrapper -->
    <div
      class="w-full max-w-[70rem] mx-auto"
      :class="{
        'px-10 -mt-10 absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2': showPresets,
        relative: !showPresets,
      }"
    >
      <div class="h-12 border-0 font-semibold opacity-75 text-3xl text-center">
        {{ $t('chat.welcome') }}
      </div>
      <div id="chatInputWrapper" class="shrink-0 pt-1">
        <!-- Image input -->
        <div class="flex space-x-1 relative">
          <!-- vision input -->

          <!-- message input form -->
          <ChatInputTextarea
            :show-abort-button="aiChatStore.isThinking || aiChatStore.isStreaming"
            :submit-locked="aiChatStore.isThinking || aiChatStore.isStreaming"
            :textarea-class="{
              'min-h-28': showPresets,
            }"
            @submit-form="input => onSubmitTextareaForm(input)"
          />
          <div class="absolute bottom-[0.5rem] z-10 right-20 flex items-center -space-x-3">
            <ChatAssistantSelect :select-locked="aiChatStore.hasChat" />
          </div>
        </div>
        <div class="pt-6">
          <ChatPresets id="chatPresets" @clicked="value => onPresetClick(value)" />
        </div>
      </div>
    </div>
  </div>
</template>
