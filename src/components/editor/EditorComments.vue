<script setup lang="ts">
// Imports
import Illustration from '@/assets/illustrations/empty-comments.svg';
import CommentAddForm from '@/components/comment/CommentAddForm.vue';
import EditorCommentMenu from '@/components/editor/EditorCommentMenu.vue';
import EditorSidePanel from '@/components/editor/EditorSidePanel.vue';
import { useEditorStore } from '@/modules/editor/stores/editor.store';

// Props
// Emits

// Composables

// Stores
const editorStore = useEditorStore();

// Injections
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
      <CommentAddForm @submit="editorStore.addCommentToSelection" />
    </div>
    <!-- Empty Comments Placeholder -->
    <div v-if="!editorStore.hasComments">
      <div class="px-20 pt-20 pb-10">
        <Illustration />
      </div>
      <div class="px-14 text-center text-sm space-y-4">
        <p class="opacity-75 font-bold">{{ $t('comment.empty.title') }}</p>
        <p class="opacity-75">
          {{ $t('comment.empty.subtitle') }}
        </p>
      </div>
    </div>
    <!-- Comments List -->
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
