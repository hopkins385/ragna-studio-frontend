<script setup lang="ts">
// Imports
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAiChatSettingsStore } from '@/modules/ai-chat-settings/stores/ai-chat-settings.store';
import { SendHorizontalIcon, SquareIcon } from 'lucide-vue-next';

interface Props {
  showAbortButton?: boolean;
  submitLocked?: boolean;
}

// Props
const modelValue = defineModel<string | undefined>();
const { showAbortButton = false, submitLocked = false } = defineProps<Props>();

// Emits
const emit = defineEmits<{
  submitForm: [void];
  abort: [void];
}>();

// Refs
const chatInputFormRef = useTemplateRef('chat-input-form');

// Stores
const aiChatSettings = useAiChatSettingsStore();

// Composables
// Computed
const submitReleased = computed(() => {
  return !submitLocked && modelValue.value;
});

// Functions
/**
 * Adjusts the height of the textarea based on its content.
 */
const adjustTextareaHeight = () => {
  const maxHeight = 364;
  const textarea = chatInputFormRef.value?.querySelector('textarea');
  if (textarea) {
    // Reset height to auto to calculate the new height
    textarea.style.height = 'auto';
    // Set the height to match the scrollHeight
    textarea.style.height = `${Math.min(maxHeight, textarea.scrollHeight)}px`;
  }
};

const focusTextarea = () => {
  const textarea = chatInputFormRef.value?.querySelector('textarea');
  if (textarea) {
    textarea.focus();
  }
};

const onKeyDownEnter = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && !event.shiftKey && aiChatSettings.submitOnEnter) {
    event.preventDefault();
    emit('submitForm');
  }
  adjustTextareaHeight();
  focusTextarea();
};

const submitForm = () => {
  if (submitReleased.value) {
    emit('submitForm');
  }
  adjustTextareaHeight();
  focusTextarea();
};

const abortRequest = () => {
  emit('abort');
  adjustTextareaHeight();
};

// Hooks
</script>

<template>
  <form
    id="chat-input-form"
    ref="chat-input-form"
    class="relative flex w-full items-center space-x-2"
    @submit.prevent="submitForm"
  >
    <div class="relative z-0 max-h-96 w-full">
      <Textarea
        v-model="modelValue"
        :placeholder="$t('chat.input.placeholder')"
        resize="none"
        class="no-scrollbar resize-none rounded-lg py-3 pr-14 focus:shadow-lg bg-stone-50"
        @keydown.enter="onKeyDownEnter"
        @input="adjustTextareaHeight"
      />
    </div>

    <Button
      v-if="showAbortButton"
      variant="outline"
      size="icon"
      class="group absolute bottom-[0.6rem] right-3 z-20 mr-1 size-5 rounded-full bg-slate-100"
      @click="abortRequest"
    >
      <SquareIcon class="!size-3 stroke-1.5 text-slate-500 group-hover:text-slate-900" />
    </Button>
    <Button
      v-else
      class="absolute z-10 bottom-1 right-2 size-8"
      type="submit"
      size="icon"
      variant="ghost"
      :disabled="!submitReleased"
    >
      <SendHorizontalIcon
        class="size-4 stroke-1.5"
        :class="{
          'opacity-100': submitReleased,
          'opacity-85': !submitReleased,
        }"
      />
    </Button>
  </form>
</template>
