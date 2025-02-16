<script setup lang="ts">
// Imports
import { useEditorService } from '@/composables/services/useEditorService';
import useMarkdown from '@/composables/useMarkdown';
import type { Editor } from '@tiptap/vue-3';
import { Button } from '@ui/button';
import { Textarea } from '@ui/textarea';
import { RefreshCcwIcon, SquareIcon, Trash2Icon } from 'lucide-vue-next';
import ButtonLoading from '../button/ButtonLoading.vue';

// Props
const props = defineProps<{
  editor: Editor;
}>();

// Emits
const emit = defineEmits<{
  close: [];
  refreshPosition: [];
}>();

// Refs
const input = ref('');
const isLoading = ref(false);
const originalTextBetween = ref('');
const rawCompletion = ref('');
const originalSelection = ref({ from: 0, to: 0 });
const textareaContainerRef = ref<HTMLDivElement | null>(null);

// Composables
const { fetchPromptCompletion, abortCompletion } = useEditorService();
const { parseMarkdown } = useMarkdown();

// Computed
const hasInput = computed(() => input.value.length > 1);
const hasRawCompletion = computed(() => !!rawCompletion.value);
const disableInput = computed(() => isLoading.value || !hasInput.value);

// Functions
const runCompletion = async () => {
  if (disableInput.value) {
    return;
  }
  isLoading.value = true;

  try {
    const completionPayload = {
      context: props.editor.getHTML(),
      selectedText: originalTextBetween.value,
      prompt: input.value,
    };

    const { completion } = await fetchPromptCompletion(completionPayload);
    if (!completion) {
      return;
    }
    rawCompletion.value = completion;

    // parse markdown to html
    const htmlContent = parseMarkdown(completion);

    // Create a temporary div to calculate the actual text length
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    const actualTextLength = tempDiv.textContent?.length || 0;
    tempDiv.remove();

    // Store the current position before deletion
    const startPos = originalSelection.value.from;

    // Replace text at the original selection range and select the new content
    props.editor
      .chain()
      .deleteRange({
        from: startPos,
        to: originalSelection.value.to,
      })
      .insertContent(htmlContent)
      .setTextSelection({
        from: startPos,
        to: startPos + actualTextLength - 1,
      })
      .focus()
      .run();

    emit('refreshPosition');
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

const resetCompletionVars = () => {
  rawCompletion.value = '';
};

const discardChanges = () => {
  resetCompletionVars();
  props.editor
    .chain()
    .focus()
    .undo()
    .setTextSelection({
      from: originalSelection.value.from,
      to: originalSelection.value.to,
    })
    .run();
};

// HANDLERS

const handleGenerate = async () => {
  resetCompletionVars();
  await runCompletion();
};

const handleDiscard = () => discardChanges();

const handleAbort = () => {
  abortCompletion();
  // input.value = '';
};

const handleReGenerate = () => {
  // First restore original selection before regenerating
  props.editor
    .chain()
    .focus()
    .undo()
    .setTextSelection({
      from: originalSelection.value.from,
      to: originalSelection.value.to,
    })
    .run();

  runCompletion();
};

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    emit('close');
  }
};

const handleTextareaKeyDownEnter = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    runCompletion();
  }
};

const handleTextareaFocus = () => {};
const handleTextareaBlur = () => {};

//

const focusInput = () => {
  nextTick(() => {
    textareaContainerRef.value?.querySelector('textarea')?.focus();
  });
};

onMounted(() => {
  focusInput();
  window.addEventListener('keydown', handleKeyDown);
  // Store initial selection range
  const { from, to } = props.editor.state.selection;
  originalSelection.value = { from, to };
  originalTextBetween.value = props.editor.state.doc.textBetween(from, to);
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyDown);
});
</script>

<template>
  <div class="bg-white border border-stone-200 rounded-lg shadow-md p-4 space-y-2 w-[35rem]">
    <div ref="textareaContainerRef">
      <Textarea
        placeholder="Schilder kurz, was du erreichen möchtest ..."
        v-model="input"
        :disabled="isLoading"
        @focus="handleTextareaFocus"
        @blur="handleTextareaBlur"
        @keydown.enter="handleTextareaKeyDownEnter"
      />
    </div>
    <div class="flex items-center space-x-2">
      <ButtonLoading :disabled="disableInput" :loading="isLoading" @click="() => handleGenerate()">
        Generieren
      </ButtonLoading>
      <Button
        v-if="isLoading"
        variant="outline"
        size="icon"
        class="rounded-full"
        @click="() => handleAbort()"
      >
        <SquareIcon class="size-4 fill-black" />
      </Button>
      <Button
        v-if="hasRawCompletion"
        variant="outline"
        size="icon"
        class="group"
        @click="() => handleReGenerate()"
      >
        <RefreshCcwIcon
          class="size-4 stroke-1.5 group-hover:stroke-2 group-hover:text-destructive"
        />
      </Button>
      <Button
        v-if="hasRawCompletion"
        variant="outline"
        size="icon"
        class="group"
        @click="() => handleDiscard()"
      >
        <Trash2Icon class="size-4 stroke-1.5 group-hover:stroke-2 group-hover:text-destructive" />
      </Button>
    </div>
  </div>
</template>
