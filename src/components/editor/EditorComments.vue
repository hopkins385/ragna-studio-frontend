<script setup lang="ts">
// Imports
import { useEditorStore } from '@/stores/editor.store';
import { computed, ref, watch } from 'vue';
import type { Comment } from './extensions/comments-extension';

// Props
// Emits

// Composables

// Stores
const editorStore = useEditorStore();

// Injections
const editor = editorStore.getEditor();

// Refs
const newCommentText = ref('');

// Computed
const comments = computed<Comment[]>(() => {
  return editor.storage.comments.comments || [];
});

// Functions
const addComment = async () => {
  if (editor && newCommentText.value) {
    const { from, to } = editor.state.selection;
    const newComment: Comment = {
      id: Date.now().toString(),
      text: newCommentText.value,
      from,
      to,
    };
    console.log('Adding comment:', newComment);
    editor.chain().focus(to).setOneComment(newComment).run();
    newCommentText.value = '';
    await syncCommentsWithBackend();
  }
};

const deleteComment = async (id: string) => {
  if (editor) {
    console.log('Deleting comment with id:', id);
    editor.chain().focus().removeOneComment(id).run();
    await syncCommentsWithBackend();
  }
};

const syncCommentsWithBackend = async () => {
  // Sync comments with backend
};

// Hooks
watch(comments, syncCommentsWithBackend, { deep: true });
</script>

<template>
  <div class="comment-ui">
    {{ editor.storage.comments }}
    <div v-for="comment in comments" :key="comment.id" class="comment">
      <p>{{ comment.text }}</p>
      <button @click="deleteComment(comment.id)">Delete</button>
    </div>
    <div class="add-comment">
      <input v-model="newCommentText" placeholder="Add a comment" />
      <button @click="addComment">Add</button>
    </div>
  </div>
</template>
