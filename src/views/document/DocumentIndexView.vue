<script setup lang="ts">
import EditorComments from '@/components/editor/EditorComments.vue';
import EditorContainer from '@/components/editor/EditorContainer.vue';
import { useDrawerStore } from '@/stores/drawer.store';

const drawer = useDrawerStore();

onMounted(() => {
  // drawer.show('abc');
});
</script>

<template>
  <div class="flex items-center justify-center h-full">
    <div class="size-full">
      <EditorContainer />
    </div>
    <div class="w-96 border-l h-full p-4">
      <EditorComments />
    </div>
    <!-- mt-[7.5rem] -->
  </div>
</template>
