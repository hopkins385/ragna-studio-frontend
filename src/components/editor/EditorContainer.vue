<script setup lang="ts">
import { useDrawerStore } from '@/stores/drawer.store';
import Document from '@tiptap/extension-document';
import { Highlight } from '@tiptap/extension-highlight';
import { Underline } from '@tiptap/extension-underline';
import { StarterKit } from '@tiptap/starter-kit';
import { BubbleMenu, Editor, EditorContent } from '@tiptap/vue-3';
import { PanelLeftIcon } from 'lucide-vue-next';
import { Button } from '../ui/button';
import EditorMenu from './EditorMenu.vue';

const drawer = useDrawerStore();

const editorContent = ref('Hello');
const editor = new Editor({
  // content: editorContent,
  extensions: [Document, StarterKit, Highlight, Underline],
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
  <div id="text-editor" class="rounded-lg bg-white overflow-hidden">
    <!-- Menu -->
    <div
      class="border-b flex justify-between items-center rounded-t-lg overflow-hidden h-13"
    >
      <!-- Left Menu -->
      <div class="px-4">
        <Button
          variant="ghost"
          size="icon"
          class="opacity-75 hover:opacity-100 cursor-pointer"
          @click="drawer.toggle('abc')"
        >
          <PanelLeftIcon class="size-5" />
        </Button>
      </div>
      <!-- Center Menu -->
      <div class="">
        <EditorMenu :editor="editor" :is-loading="false" />
      </div>
      <!-- Right Menu -->
      <div class="w-20"></div>
    </div>
    <!-- Editor Content -->
    <div class="overflow-y-auto bg-stone-50 max-h-[calc(100vh-7.5rem)]">
      <div
        class="max-w-5xl mt-8 mx-auto shadow-md border px-32 py-14 rounded-sm bg-white h-full"
      >
        <BubbleMenu
          :editor="editor"
          :tippy-options="{ duration: 100, placement: 'bottom-start' }"
          v-if="editor"
        >
          <div
            class="bg-white border border-stone-200 rounded-lg shadow-md px-4 py-2 space-x-2"
          >
            <button variant="ghost" class="px-2">Ask AI</button>
            <button variant="ghost" class="px-2">Image</button>
            <button
              @click="editor.chain().focus().toggleBold().run()"
              :class="{ 'is-active': editor.isActive('bold') }"
            >
              Bold
            </button>
            <button
              @click="editor.chain().focus().toggleItalic().run()"
              :class="{ 'is-active': editor.isActive('italic') }"
            >
              Italic
            </button>
            <button
              @click="editor.chain().focus().toggleStrike().run()"
              :class="{ 'is-active': editor.isActive('strike') }"
            >
              Strike
            </button>
          </div>
        </BubbleMenu>
        <EditorContent :editor="editor" />
      </div>
    </div>
  </div>
</template>
