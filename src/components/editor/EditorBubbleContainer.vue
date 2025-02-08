<script setup lang="ts">
import useEditorActions from '@composables/editor/useEditorActions';
import type { Editor } from '@tiptap/vue-3';
import { Button } from '@ui/button';
import { Input } from '@ui/input';
import Separator from '@ui/separator/Separator.vue';
import { BoldIcon, ImageIcon, ItalicIcon } from 'lucide-vue-next';

const props = defineProps<{
  editor: Editor;
  isLoading: boolean;
}>();

const input = ref('');
const inputRef = ref<HTMLDivElement | null>(null);

const { onCustomActionClick, onBoldClick, onItalicClick } = useEditorActions(
  props.editor,
);

const preserveSelection = () => {};

const restoreSelection = () => {};

const focusInput = async () => {
  await nextTick();
  inputRef.value?.focus();
};

const onSubmit = (event: KeyboardEvent) => {
  event.preventDefault();
  onCustomActionClick(input.value);
  input.value = '';
};

onMounted(() => {
  focusInput();
});
</script>

<template>
  <div
    class="bg-white border border-stone-200 rounded-lg shadow-md px-4 py-2 space-y-2 w-96"
  >
    <div ref="inputRef" class="">
      <Input
        placeholder="Ask Ai"
        v-model="input"
        :disabled="isLoading"
        @focus="preserveSelection"
        @blur="restoreSelection"
        @keydown.enter="onSubmit"
      />
    </div>
    <Separator />
    <div class="space-x-0">
      <Button variant="ghost" size="icon">
        <ImageIcon class="size-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        :class="{
          'is-active': editor.isActive('bold'),
        }"
        @click="onBoldClick()"
      >
        <BoldIcon class="size-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        :class="{
          'is-active': editor.isActive('italic'),
        }"
        @click="onItalicClick()"
      >
        <ItalicIcon class="size-4" />
      </Button>
    </div>
  </div>
</template>
