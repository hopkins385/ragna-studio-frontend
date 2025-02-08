<script setup lang="ts">
import useRunCompletion from '@/composables/editor/useRunCompletion';
import { useDrawerStore } from '@/stores/drawer.store';
import { Highlight } from '@tiptap/extension-highlight';
import { TextAlign } from '@tiptap/extension-text-align';
import { Underline } from '@tiptap/extension-underline';
import { StarterKit } from '@tiptap/starter-kit';
import { Editor, EditorContent } from '@tiptap/vue-3';
import EditorMenu from './EditorMenu.vue';
import { AI } from './extensions/ai-extension';

const { runCompletion, isLoading } = useRunCompletion();

const drawer = useDrawerStore();

const editorContent = ref('');
const editor = new Editor({
  content: editorContent.value,
  extensions: [
    StarterKit,
    Highlight,
    Underline,
    TextAlign.configure({
      types: ['heading', 'paragraph', 'listItem'],
    }),
    AI.configure({
      completionHandler: runCompletion,
    }),
  ],
  onUpdate: ({ editor }) => {
    // emits('update:modelValue', editor.getHTML())
  },
  autofocus: 'end',
});

onBeforeUnmount(() => {
  editor.destroy();
});
</script>

<template>
  <div id="text-editor" class="rounded-lg bg-white overflow-hidden h-full">
    <!-- Menu -->
    <div
      class="border-b flex justify-between items-center rounded-t-lg overflow-hidden h-13"
    >
      <!-- Left Menu -->
      <div class="px-4">
        <!--
        <Button
          variant="ghost"
          size="icon"
          class="opacity-75 hover:opacity-100 cursor-pointer"
          @click="drawer.toggle('abc')"
        >
          <PanelLeftIcon class="size-5" />
        </Button>
        -->
      </div>
      <!-- Center Menu -->
      <div class="">
        <EditorMenu :editor="editor" :is-loading="false" />
      </div>
      <!-- Right Menu -->
      <div class="w-20"></div>
    </div>
    <!-- Editor Content -->
    <!--
    min-h-full max-h-[calc(100vh-7.5rem)]
    -->
    <div class="overflow-y-auto bg-stone-50 h-[calc(100vh-7.5rem)] pb-5">
      <div
        class="max-w-5xl mt-8 mx-auto shadow-md border px-32 py-14 rounded-sm bg-white min-h-full"
      >
        <!--
        <BubbleMenu
          v-if="editor"
          :editor="editor"
          :tippy-options="{ duration: 100, placement: 'bottom-start' }"
        >
          <EditorBubbleContainer :is-loading="isLoading" :editor="editor" />
        </BubbleMenu>
        -->
        <EditorContent :editor="editor" />
      </div>
    </div>
  </div>
</template>
