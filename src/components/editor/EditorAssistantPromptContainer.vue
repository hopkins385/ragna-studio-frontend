<script setup lang="ts">
import { useEditorService } from '@/composables/services/useEditorService';
import useMarkdown from '@/composables/useMarkdown';
import type { Editor } from '@tiptap/vue-3';
import { Button } from '@ui/button';
import { Textarea } from '@ui/textarea';
import { SquareIcon } from 'lucide-vue-next';
import ButtonLoading from '../button/ButtonLoading.vue';

const props = defineProps<{
  editor: Editor;
}>();

const emit = defineEmits<{
  close: [void];
}>();

const { fetchPromptCompletion, abortCompletion } = useEditorService();
const { parseMarkdown } = useMarkdown();

const input = ref('');
const textareaContainerRef = ref<HTMLDivElement | null>(null);
const isLoading = ref(false);

const disableInput = computed(() => isLoading.value || !input.value);

const reApplySelection = () => {
  const { from, to } = props.editor.state.selection;
  props.editor.chain().setSelection({ from, to }).focus().run();
};

const onSubmit = async () => {
  isLoading.value = true;
  const { from, to } = props.editor.state.selection;
  const textBetween = props.editor.state.doc.textBetween(from, to);

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
      .focus()
      .run();
    //
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
    input.value = '';
  }
};

const handleTextareaKeyDownEnter = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    onSubmit();
  }
};

const handleAbort = () => {
  abortCompletion();
  input.value = '';
};

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    emit('close');
  }
};

const handleTextareaFocus = () => {};

const handleTextareaBlur = () => {};

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
    <div ref="textareaContainerRef" class="">
      <Textarea
        placeholder="Schildern Sie, was Sie verbessern möchten ..."
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
        @click="onSubmit"
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
    </div>
  </div>
</template>
