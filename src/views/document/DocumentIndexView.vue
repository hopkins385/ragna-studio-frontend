<script setup lang="ts">
import EditorComments from '@/components/editor/EditorComments.vue';
import EditorContainer from '@/components/editor/EditorContainer.vue';
import { Button } from '@/components/ui/button';
import { useDrawerStore } from '@/stores/drawer.store';
import { useEditorStore } from '@/stores/editor.store';
import { MessageCircle } from 'lucide-vue-next';

const drawer = useDrawerStore();
const editorStore = useEditorStore();

onMounted(() => {
  // drawer.show('abc');
});
</script>

<template>
  <div class="flex items-center justify-center h-full">
    <div class="size-full">
      <EditorContainer />
    </div>

    <EditorComments />

    <div class="w-16 z-10 border-l h-full p-2 shrink-0 bg-white">
      <Button variant="ghost" size="icon" @click="() => editorStore.toggleShowComments()">
        <MessageCircle class="size-5" />
      </Button>
    </div>
    <!-- mt-[7.5rem] -->
  </div>
</template>
