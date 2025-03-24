<script setup lang="ts">
// Imports
import { useEditorStore } from '@/modules/editor/stores/editor.store';
import { Button } from '@ui/button';

// Props
// Emits

// Refs
// Stores
const editorStore = useEditorStore();
// Composables

// Computed
// Functions

// Hooks
</script>

<template>
  <div class="p-2">
    <div class="flex flex-col items-center h-full space-y-1 pt-2">
      <Button
        v-for="(btn, idx) in editorStore.sidebarButtons"
        :key="idx"
        variant="ghost"
        size="icon"
        @click="() => btn.action()"
        :title="btn.tooltip"
      >
        <component :is="btn.icon" class="size-5" />
      </Button>
    </div>
  </div>
</template>
