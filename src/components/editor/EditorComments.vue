<script setup lang="ts">
// Imports
import CommentAddForm from '@/components/comment/CommentAddForm.vue';
import { Button } from '@/components/ui/button';
import { useEditorStore } from '@/stores/editor.store';
import { XIcon } from 'lucide-vue-next';

// Props
// Emits

// Composables

// Stores
const editorStore = useEditorStore();

// Injections
const editor = editorStore.getEditor();

// Refs

// Computed

// Functions

// Comment Extension

// Hooks
</script>

<template>
  <transition name="slide">
    <div
      v-if="editorStore.showComments"
      class="comments-panel h-full overflow-x-hidden overflow-y-scroll shrink-0"
    >
      <div class="border-l h-full p-4 space-y-5">
        <div class="flex items-center space-x-1">
          <div>
            <Button variant="ghost" size="icon" @click="editorStore.toggleShowComments">
              <XIcon class="size-4" />
            </Button>
          </div>
          <div>
            <h3 class="font-semibold text-base">Comments</h3>
          </div>
        </div>
        <div>
          <CommentAddForm @submit="editorStore.addComment" />
        </div>
        <div class="pb-5 space-y-5">
          <div v-for="comment in editorStore.comments" :key="comment.id">
            <div
              class="border p-2 text-sm rounded-md"
              :class="{
                'bg-gray-100': comment.id === editorStore.selectedCommentId,
              }"
            >
              <p>{{ comment.text }}</p>
              <button @click="() => editorStore.deleteComment(comment.id)">Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.comments-panel {
  width: 24rem;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
  width: 0;
  opacity: 0;
}

.slide-enter-to,
.slide-leave-from {
  transform: translateX(0);
  width: 24rem;
  opacity: 1;
}
</style>
