<script setup lang="ts">
import EditorSidePanel from '@/components/editor/EditorSidePanel.vue';
import { useEditorStore } from '@/stores/editor.store';

// Imports

// Props
// Emits

// Refs

// Stores
const editorStore = useEditorStore();

// Injections
// const editor = editorStore.getEditor();

// Composables

// Computed
// Functions

// Hooks
</script>

<template>
  <EditorSidePanel title="Chat" v-model="editorStore.showAiChat">
    <div>some</div>
  </EditorSidePanel>
</template>
