<script setup lang="ts">
// Imports
import type { Editor } from '@tiptap/vue-3';
import { computed, ref, watch } from 'vue';
import type { Comment } from './extensions/comments-extension';

// Props
const props = defineProps<{
  editor: Editor;
}>();

// Emits

// Refs
const newCommentText = ref('');

// Composables

// Computed
const comments = computed<Comment[]>(() => {
  return props.editor.storage.comments.comments || [];
});

// Functions
const addComment = async () => {
  if (props.editor && newCommentText.value) {
    const { from, to } = props.editor.state.selection;
    const newComment: Comment = {
      id: Date.now().toString(),
      text: newCommentText.value,
      from,
      to,
    };
    console.log('Adding comment:', newComment);
    props.editor.chain().focus(to).setOneComment(newComment).run();
    newCommentText.value = '';
    await syncCommentsWithBackend();
  }
};

const deleteComment = async (id: string) => {
  if (props.editor) {
    console.log('Deleting comment with id:', id);
    props.editor.chain().focus().removeOneComment(id).run();
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
    {{ props.editor.storage.comments }}
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
