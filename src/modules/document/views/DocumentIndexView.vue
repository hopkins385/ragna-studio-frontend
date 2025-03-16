<script setup lang="ts">
import EditorChat from '@/modules/editor/compontents/EditorChat.vue';
import EditorComments from '@/modules/editor/compontents/EditorComments.vue';
import EditorContainer from '@/modules/editor/compontents/EditorContainer.vue';
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
