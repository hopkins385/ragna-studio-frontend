<script setup lang="ts">
// Imports
import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useAiChatSettingsStore } from '@/modules/ai-chat-settings/stores/ai-chat-settings.store';
import { chatInputFormSchema } from '@/modules/ai-chat/schemas/chat-input-text.schema';
import { SendHorizontalIcon, SquareIcon } from 'lucide-vue-next';

type TextareaClass = string | string[] | Record<string, boolean>;
type TextareaSize = 'sm' | 'default';

interface Props {
  showAbortButton?: boolean;
  submitLocked?: boolean;
  textareaClass?: TextareaClass;
  textareaSize?: TextareaSize;
}

// Props
const {
  showAbortButton = false,
  submitLocked = false,
  textareaSize = 'default',
  textareaClass,
} = defineProps<Props>();

// Emits
const emit = defineEmits<{
  submitForm: [string];
  abort: [void];
}>();

// Refs
const chatInputFormRef = useTemplateRef('chat-input-form');
const input = ref<string>('');

// Stores
const aiChatSettings = useAiChatSettingsStore();

// Composables
const {
  handleSubmit,
  values: formValues,
  resetForm,
} = useForm({
  validationSchema: chatInputFormSchema,
});

// Computed
const submitReleased = computed(() => {
  return !submitLocked && formValues.input && formValues.input.length > 0;
});
const textAreaClass = computed(() => {
  return cn(
    'no-scrollbar resize-none rounded-lg py-3 pr-14 focus:shadow-lg bg-stone-50 shadow-inner',
    textareaClass,
    aiChatSettings.getPrivacyNerActive ? 'focus-visible:ring-blue-600' : '',
  );
});

// Functions
/**
 * Adjusts the height of the textarea based on its content.
 */
const adjustTextareaHeight = () => {
  const maxHeight = 364;
  requestAnimationFrame(() => {
    const textarea = chatInputFormRef.value?.querySelector('textarea');
    if (!textarea) return;

    // Temporarily collapse to get the correct scrollHeight
    textarea.style.height = '0px';

    // Get the computed line-height to ensure proper calculation
    const computedStyle = window.getComputedStyle(textarea);
    const lineHeight = parseInt(computedStyle.lineHeight) || 20;

    // Calculate new height (minimum of one line)
    const newHeight = Math.max(lineHeight, Math.min(maxHeight, textarea.scrollHeight));

    textarea.style.height = `${newHeight}px`;
  });
};

const focusTextarea = () => {
  const textarea = chatInputFormRef.value?.querySelector('textarea');
  if (textarea) {
    textarea.focus();
  }
};

const onKeyDownEnter = (event: KeyboardEvent) => {
  if (!submitReleased.value) {
    return;
  }

  // allow line breaks
  if (event.key === 'Enter' && (event.shiftKey || event.metaKey || event.ctrlKey)) {
    return;
  }

  if (event.key === 'Enter' && aiChatSettings.submitOnEnter) {
    event.preventDefault();
    submitForm();
  }
};

const submitForm = handleSubmit(values => {
  if (submitReleased.value) {
    emit('submitForm', values.input);
    resetForm();
    adjustTextareaHeight();
    input.value = '';
  }
  focusTextarea();
});

const abortRequest = () => {
  emit('abort');
  adjustTextareaHeight();
};

let resizeObserver: ResizeObserver | null = null;
// Hooks
onMounted(() => {
  const textarea = chatInputFormRef.value?.querySelector('textarea');
  if (textarea) {
    resizeObserver = new ResizeObserver(() => {
      adjustTextareaHeight();
    });
    resizeObserver.observe(textarea);
  }
});

// Cleanup
onUnmounted(() => {
  resizeObserver?.disconnect();
});
</script>

<template>
  <form
    id="chat-input-form"
    ref="chat-input-form"
    class="relative flex w-full items-center space-x-2"
    @submit.prevent="submitForm"
  >
    <div class="relative z-0 max-h-96 w-full">
      <FormField v-slot="{ componentField }" name="input">
        <FormItem>
          <FormMessage />
          <FormControl>
            <Textarea
              resize="none"
              v-bind="componentField"
              v-model="input"
              :placeholder="$t('chat.input.placeholder')"
              :class="textAreaClass"
              @keydown.enter="onKeyDownEnter"
              @update:model-value="adjustTextareaHeight"
            />
          </FormControl>
        </FormItem>
      </FormField>
    </div>

    <Button
      v-if="showAbortButton"
      variant="outline"
      size="icon"
      class="group absolute bottom-[0.6rem] right-3 z-20 mr-1 rounded-full bg-stone-50 border-stone-400 shadow-sm hover:border-stone-500 hover:scale-110 transition-colors duration-200 ease-in-out"
      :class="{
        'size-6': textareaSize === 'default',
        'size-5': textareaSize === 'sm',
      }"
      @click="abortRequest"
    >
      <SquareIcon
        class="stroke-1.5 text-slate-500 group-hover:text-slate-900 group-hover:fill-stone-500 fill-stone-500"
        :class="{
          '!size-3': textareaSize === 'default',
          '!size-2': textareaSize === 'sm',
        }"
      />
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
        class="stroke-1.5"
        :class="{
          '!size-5': textareaSize === 'default',
          '!size-4': textareaSize === 'sm',
          'opacity-100': submitReleased,
          'opacity-85': !submitReleased,
        }"
      />
    </Button>
  </form>
</template>
