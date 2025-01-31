<script setup lang="ts">
import EditorContainer from '@/components/editor/EditorContainer.vue';
import { useDrawerStore } from '@/stores/drawer.store';

const drawer = useDrawerStore();

onMounted(() => {
  // drawer.show('abc');
});
</script>

<template>
  <div class="flex flex-col items-center justify-center space-y-8">
    <div class="w-full">
      <EditorContainer />
    </div>
  </div>
</template>
