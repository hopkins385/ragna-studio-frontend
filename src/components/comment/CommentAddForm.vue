<script setup lang="ts">
// Imports
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useEditorStore } from '@/stores/editor.store';
import { FormControl, FormField, FormMessage } from '@ui/form';
import FormItem from '@ui/form/FormItem.vue';

// Props
// Emits
const emit = defineEmits<{
  cancel: [void];
  submit: [value: string];
}>();

// Refs
const newCommentText = ref('');
const showControls = ref(false);

// Composables

// Stores
const editorStore = useEditorStore();
// Injections

// Computed
const submitLocked = computed(() => {
  return !editorStore.hasTextSelected || newCommentText.value.length < 1;
});

// Functions
const onSubmit = () => {
  emit('submit', newCommentText.value);
  newCommentText.value = '';
  showControls.value = false;
};

const onCancel = () => {
  emit('cancel');
  newCommentText.value = '';
  showControls.value = false;
};

const onFocus = () => {
  console.log('Textarea focused');
  showControls.value = true;
};

const onBlur = () => {
  // Handle blur event
  console.log('Textarea blurred');
  if (submitLocked.value !== false) showControls.value = false;
};

// Hooks
</script>

<template>
  <form @submit.prevent="onSubmit">
    <FormField v-slot="{ componentField }" name="textarea" :defaultValue="newCommentText">
      <FormItem>
        <FormControl>
          <div class="relative">
            <Textarea
              type="text"
              placeholder="Add a comment"
              class="min-h-5"
              :class="['rounded-md border', showControls ? 'min-h-20' : '']"
              v-model="newCommentText"
              @focus="onFocus"
              @blur="onBlur"
            />
            <div v-if="showControls" class="absolute bottom-2 right-2 flex items-center">
              <Button
                type="button"
                @click="onCancel"
                variant="ghost"
                class="opacity-75 hover:opacity-100 cursor-pointer h-7 px-2"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                :disabled="submitLocked"
                variant="ghost"
                class="opacity-75 hover:opacity-100 cursor-pointer h-7 px-2"
              >
                Post
              </Button>
            </div>
          </div>
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
  </form>
</template>
