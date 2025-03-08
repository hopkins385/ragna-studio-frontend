<script setup lang="ts">
import EditorComments from '@/components/editor/EditorComments.vue';
import EditorContainer from '@/components/editor/EditorContainer.vue';
</script>

<template>
  <div class="flex items-center justify-center h-full">
    <div class="size-full">
      <EditorContainer />
    </div>
    <EditorComments />
  </div>
</template>
