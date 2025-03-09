<script setup lang="ts">
// Imports
import CommentAddForm from '@/components/comment/CommentAddForm.vue';
import EditorCommentMenu from '@/components/editor/EditorCommentMenu.vue';
import EditorSidePanel from '@/components/editor/EditorSidePanel.vue';
import { useEditorStore } from '@/stores/editor.store';

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
  <EditorSidePanel
    title="Review"
    :model-value="editorStore.showComments"
    @update:modelValue="editorStore.toggleShowComments"
  >
    <div>
      <CommentAddForm @submit="editorStore.addComment" />
    </div>
    <div class="pb-5 space-y-5">
      <div v-for="comment in editorStore.comments" :key="comment.id">
        <!-- Comment Box -->
        <div
          class="border p-2 text-sm rounded-md relative min-h-12"
          :class="{
            'bg-gray-100': comment.id === editorStore.selectedCommentId,
          }"
        >
          <!-- Comment Text -->
          <p>{{ comment.text }}</p>
          <!-- Comment Menu -->
          <div class="absolute top-2 right-3">
            <EditorCommentMenu @delete="() => editorStore.deleteComment(comment.id)" />
          </div>
        </div>
      </div>
    </div>
  </EditorSidePanel>
</template>
