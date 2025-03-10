<script setup lang="ts">
// Imports
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { SendIcon } from 'lucide-vue-next';

// Props
const modelValue = defineModel<string | undefined>();

// Emits
const emit = defineEmits<{
  submit: [void];
  keyDownEnter: [KeyboardEvent];
}>();

// Refs
const chatInputFormRef = useTemplateRef('chatInputFormRef');

// Composables

// Computed
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

const onKeyDownEnter = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    // && settings.submitOnEnter
    event.preventDefault();
    emit('keyDownEnter', event);
  }
};

// Hooks
</script>

<template>
  <form
    id="chatInputForm"
    ref="chatInputFormRef"
    class="relative flex w-full items-center space-x-2"
    @submit.prevent="() => $emit('submit')"
  >
    <div class="relative z-0 max-h-96 w-full">
      <Textarea
        v-model="modelValue"
        :placeholder="$t('chat.input.placeholder')"
        resize="none"
        class="no-scrollbar resize-none rounded-lg py-4 pr-14 focus:shadow-lg bg-stone-50"
        @keydown.enter="onKeyDownEnter"
        @input="adjustTextareaHeight"
      />
    </div>
    <!--
    <Button
      v-if="showAbortButton"
      variant="outline"
      size="icon"
      class="group absolute bottom-3 right-3 z-20 mr-1 size-8 rounded-full bg-slate-100"
      @click="onAbortChatRequest"
    >
      <SquareIcon class="!size-4 stroke-1.5 text-slate-500 group-hover:text-slate-900" />
    </Button>
    -->
    <Button
      class="absolute z-10 bottom-1 right-2 size-8"
      type="submit"
      size="icon"
      variant="ghost"
      :disabled="!modelValue"
    >
      <SendIcon
        class="size-4 stroke-1.5 rotate-45"
        :class="{
          'opacity-100': modelValue,
          'opacity-85': !modelValue,
        }"
      />
    </Button>
  </form>
</template>
