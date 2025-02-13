<script setup lang="ts">
import { useEditorService } from '@/composables/services/useEditorService';
import useMarkdown from '@/composables/useMarkdown';
import type { Editor } from '@tiptap/vue-3';
import { Button } from '@ui/button';
import { Textarea } from '@ui/textarea';
import { RefreshCcwIcon, SquareIcon, Trash2Icon } from 'lucide-vue-next';
import ButtonLoading from '../button/ButtonLoading.vue';

const props = defineProps<{
  editor: Editor;
}>();

const emit = defineEmits<{
  close: [void];
  refreshPosition: [void];
}>();

const { fetchPromptCompletion, abortCompletion } = useEditorService();
const { parseMarkdown } = useMarkdown();

const input = ref('');
const isLoading = ref(false);
const originalTextBetween = ref('');
const rawCompletion = ref('');

const textareaContainerRef = ref<HTMLDivElement | null>(null);

const hasInput = computed(() => input.value.length > 1);
const hasRawCompletion = computed(() => !!rawCompletion.value);
const disableInput = computed(() => isLoading.value || !hasInput.value);

const runCompletion = async () => {
  if (disableInput.value) {
    return;
  }
  isLoading.value = true;
  const { from, to } = props.editor.state.selection;
  const textBetween = props.editor.state.doc.textBetween(from, to);

  originalTextBetween.value = textBetween;

  const completionPayload = {
    // lang,
    context: props.editor.getHTML(),
    selectedText: textBetween,
    prompt: input.value,
  };

  try {
    const { completion } = await fetchPromptCompletion(completionPayload);
    if (!completion) {
      return;
    }
    rawCompletion.value = completion;

    // parse markdown
    const parsed = parseMarkdown(completion);

    // insert the completion into the editor
    props.editor
      .chain()
      .deleteRange({ from, to }) // First delete the existing content
      .insertContent(parsed, {
        parseOptions: {
          // preserveWhitespace: 'full',
        },
      })
      // add again the selection so the text is highlighted
      .setSelection({ from, to: from + completion.trim().length })
      // .focus()
      .run();
    //
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
    emit('refreshPosition');
  }
};

const resetCompletionVars = () => {
  rawCompletion.value = '';
};

const discardChanges = () => {
  resetCompletionVars();
  props.editor.chain().focus().undo().run();
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
  discardChanges();
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
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyDown);
});
</script>

<template>
  <div
    class="bg-white border border-stone-200 rounded-lg shadow-md p-4 space-y-2 w-[35rem]"
  >
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
      <ButtonLoading
        :disabled="disableInput"
        :loading="isLoading"
        @click="() => handleGenerate()"
      >
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
        <Trash2Icon
          class="size-4 stroke-1.5 group-hover:stroke-2 group-hover:text-destructive"
        />
      </Button>
    </div>
  </div>
</template>
