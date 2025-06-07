<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import TextToImageCountPopover from '@/modules/text-to-image/components/TextToImageCountPopover.vue';
import TextToImageMimeTypePopover from '@/modules/text-to-image/components/TextToImageMimeTypePopover.vue';
import TextToImagePricingPopover from '@/modules/text-to-image/components/TextToImagePricingPopover.vue';
import TextToImageProviderPopover from '@/modules/text-to-image/components/TextToImageProviderPopover.vue';
import TextToImageSettings from '@/modules/text-to-image/components/TextToImageSettings.vue';
import TextToImageSizePopover from '@/modules/text-to-image/components/TextToImageSizePopover.vue';
import { useImgGenSettingsStore } from '@/modules/text-to-image/stores/image-gen-settings.store';
import { Loader2Icon, SendIcon } from 'lucide-vue-next';

// Props
const props = defineProps<{
  focusTextarea: boolean;
  isLoading?: boolean;
  placeholder?: string;
  disabled?: boolean;
}>();

// Emits
const emit = defineEmits<{
  (e: 'submit', prompt: string): void;
}>();

const modelValue = defineModel<string>(); // prompt input model

// Refs
const promptFormRef = useTemplateRef('promptFormRef');

// Composables
const settings = useImgGenSettingsStore();

// Computed
// Functions

/**
 * Adjusts the height of the textarea based on its content.
 */
const adjustTextareaHeight = () => {
  const maxHeight = 364;
  const textarea = promptFormRef.value?.querySelector('textarea');
  if (textarea) {
    // Reset height to auto to calculate the new height
    textarea.style.height = 'auto';
    // Set the height to match the scrollHeight
    textarea.style.height = `${Math.min(maxHeight, textarea.scrollHeight)}px`;
  }
};

/**
 * Handles the paste event to clean pasted text by removing excessive empty lines.
 */
const handlePaste = (event: ClipboardEvent) => {
  // Prevent the default paste behavior
  event.preventDefault();

  const clipboardData = event.clipboardData;
  if (clipboardData) {
    // Retrieve the plain text from the clipboard
    let pastedText = clipboardData.getData('text/plain');

    // Process the pasted text:
    // Replace multiple consecutive empty lines with a single empty line
    // This regex replaces 3 or more consecutive newline characters with 2
    pastedText = pastedText.replace(/(\r?\n){3,}/g, '\n\n');

    // Alternatively, to remove all empty lines, use:
    // pastedText = pastedText.replace(/^\s*[\r\n]/gm, '');

    const textarea = promptFormRef.value?.querySelector('textarea');
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const before = modelValue.value?.substring(0, start);
      const after = modelValue.value?.substring(end);

      // Insert the cleaned pasted text at the cursor position
      modelValue.value = before + pastedText + after;

      // Move the cursor to the end of the inserted text
      nextTick(() => {
        const cursorPosition = start + pastedText.length;
        textarea.selectionStart = textarea.selectionEnd = cursorPosition;
        adjustTextareaHeight();
      });
    }
  }
};

const onSubmit = () => {
  if (!modelValue.value) return;
  // Emit the modelValue value to the parent component
  emit('submit', modelValue.value);
  // Clear the modelValue after submission
  modelValue.value = '';
  adjustTextareaHeight();
};

const onKeydownEnter = (event: KeyboardEvent) => {
  if (!modelValue.value || !modelValue.value.trim() || props.isLoading) {
    return;
  }
  if (event.key === 'Enter' && !event.shiftKey && settings.getSubmitOnEnter) {
    event.preventDefault();
    onSubmit();
  }
};

// Hooks
let observer: ResizeObserver | null = null;

onMounted(() => {
  const textarea = promptFormRef.value?.querySelector('textarea');
  if (textarea && props.focusTextarea === true) {
    textarea.focus();
  }
  adjustTextareaHeight();
  const section = document.getElementById('sectionContainer');
  if (section) {
    observer = new ResizeObserver(() => {
      adjustTextareaHeight();
    });
    observer.observe(section);
  }
});

onUnmounted(() => {
  if (observer) {
    observer.disconnect();
  }
});
</script>

<template>
  <div class="flex flex-col h-fit w-full space-x-4 rounded-b-lg bg-white/95 pb-1">
    <form ref="promptFormRef" class="relative grow space-y-2" @submit.prevent="onSubmit">
      <Textarea
        v-model="modelValue"
        type="text"
        :placeholder="$t(placeholder || 'textToImage.placeholder')"
        rows="1"
        resize="none"
        class="no-scrollbar min-h-[48px] resize-none rounded-2xl bg-white py-4 pl-4 pr-16 shadow-sm focus:shadow-lg"
        @keydown.enter="onKeydownEnter"
        @input="adjustTextareaHeight"
        @paste="handlePaste"
      />
      <div class="absolute bottom-1/2 translate-y-1/2 right-10 p-1">
        <Button
          class="z-10"
          type="submit"
          size="icon"
          variant="ghost"
          :disabled="!modelValue || isLoading || props.disabled"
          aria-label="Generate image"
        >
          <Loader2Icon v-if="isLoading" class="!size-5 animate-spin stroke-1.5 opacity-75" />
          <SendIcon v-else class="!size-5 stroke-1.5 opacity-75" />
        </Button>
      </div>
      <div id="settings" class="absolute bottom-1/2 translate-y-1/2 right-2">
        <TextToImageSettings />
      </div>
    </form>
    <div class="bg-white py-2 space-x-2">
      <TextToImageCountPopover />
      <TextToImageSizePopover />
      <TextToImageMimeTypePopover />
      <TextToImageProviderPopover />
      <TextToImagePricingPopover />
    </div>
  </div>
</template>
