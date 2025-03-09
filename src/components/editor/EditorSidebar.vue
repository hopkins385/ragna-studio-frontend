<script setup lang="ts">
// Imports
import { useEditorStore } from '@/stores/editor.store';
import { Button } from '@ui/button';
import { BookmarkIcon, BotMessageSquare, MessageCircleIcon } from 'lucide-vue-next';

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
  <div class="w-14 z-10 h-full p-2 shrink-0">
    <div class="flex flex-col items-center h-full space-y-1 pt-2">
      <Button variant="ghost" size="icon" @click="() => editorStore.toggleShowAiChat()">
        <BotMessageSquare class="size-5" />
      </Button>
      <Button variant="ghost" size="icon" @click="() => editorStore.toggleShowComments()">
        <MessageCircleIcon class="size-5" />
      </Button>
      <Button variant="ghost" size="icon">
        <BookmarkIcon class="size-5" />
      </Button>
    </div>
  </div>
</template>
