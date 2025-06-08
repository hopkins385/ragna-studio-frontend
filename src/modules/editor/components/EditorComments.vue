<script setup lang="ts">
import { useEditorStore } from '@/modules/editor/stores/editor.store';
import UndrawComments from '~icons/illustrations/empty-comments';
import EditorCommentAddForm from './EditorCommentAddForm.vue';
import EditorCommentMenu from './EditorCommentMenu.vue';
import EditorSidePanel from './EditorSidePanel.vue';

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
    :resizable="true"
    :show-reset-button="true"
    :panel-id="'comments'"
    :model-value="editorStore.showComments"
    @update:modelValue="editorStore.toggleShowComments"
  >
    <div>
      <EditorCommentAddForm @submit="editorStore.addCommentToSelection" />
    </div>
    <!-- Empty Comments Placeholder -->
    <div v-if="!editorStore.hasComments" class="pt-20">
      <div class="w-40 mx-auto">
        <UndrawComments class="size-40" />
      </div>
      <div class="px-14 pt-10 text-center text-sm space-y-4">
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
          class="border p-3 text-sm rounded-md relative min-h-12"
          :class="{
            'bg-gray-100': comment.id === editorStore.selectedCommentId,
          }"
        >
          <!-- Comment Text -->
          <p class="pr-8">{{ comment.text }}</p>
          <!-- Comment Menu -->
          <div class="absolute top-2 right-3">
            <EditorCommentMenu @delete="() => editorStore.deleteComment(comment.id)" />
          </div>
        </div>
      </div>
    </div>
  </EditorSidePanel>
</template>
