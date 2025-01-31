<script setup lang="ts">
import { useDrawerStore } from '@/stores/drawer.store';
import { Highlight } from '@tiptap/extension-highlight';
import { Underline } from '@tiptap/extension-underline';
import { StarterKit } from '@tiptap/starter-kit';
import { Editor, EditorContent } from '@tiptap/vue-3';
import { PanelLeftIcon } from 'lucide-vue-next';
import { Button } from '../ui/button';
import EditorMenu from './EditorMenu.vue';

const drawer = useDrawerStore();

const editorContent = ref('');
const editor = new Editor({
  content: editorContent,
  extensions: [
    StarterKit,
    Highlight,
    Underline,
    // AI.configure({
    //   lang: 'en',
    //   completionHandler: runCompletion
    // })
  ],
  onUpdate: ({ editor }) => {
    // emits('update:modelValue', editor.getHTML())
  },
  autofocus: 'end',
});
</script>

<template>
  <div id="text-editor" class="space-y-8 rounded-lg bg-white overflow-hidden">
    <!-- Menu -->
    <div
      class="border-b flex justify-between items-center rounded-t-lg overflow-hidden"
    >
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
      <div class="">
        <EditorMenu :editor="editor" :is-loading="false" />
      </div>
      <div class="w-20"></div>
    </div>
    <div class="max-w-4xl mx-auto">
      <EditorContent :editor="editor" />
    </div>
  </div>
</template>
