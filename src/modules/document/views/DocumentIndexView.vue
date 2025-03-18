<script setup lang="ts">
import { useDrawerStore } from '@/common/stores/drawer.store';
import EditorChat from '@/modules/editor/components/EditorChat.vue';
import EditorComments from '@/modules/editor/components/EditorComments.vue';
import EditorContainer from '@/modules/editor/components/EditorContainer.vue';

const drawer = useDrawerStore();

onMounted(() => {
  drawer.toggleRightDrawer('editor-sidebar');
});

onBeforeUnmount(() => {
  drawer.hideRightDrawer();
});
</script>

<template>
  <div class="flex items-center justify-center h-full">
    <div class="size-full">
      <EditorContainer />
    </div>
    <EditorComments />
    <EditorChat />
  </div>
</template>
