<script setup lang="ts">
// Imports
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useEditorStore } from '@/modules/editor/stores/editor.store';
import { FormControl, FormField, FormMessage } from '@ui/form';
import FormItem from '@ui/form/FormItem.vue';
import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';

// Schemas
const formSchema = toTypedSchema(
  z.object({
    comment: z.string().trim().min(2).max(50),
  }),
);

// Props
// Emits
const emit = defineEmits<{
  cancel: [void];
  submit: [{ commentText: string }];
}>();

// Refs
const showSubmitButtons = ref(false);

// Composables
const form = useForm({
  validationSchema: formSchema,
  initialValues: {
    comment: '',
  },
});

// Stores
const editorStore = useEditorStore();
// Injections

// Computed
const submitLocked = computed(() => {
  return !editorStore.hasTextSelected;
});

// Functions
const onSubmit = form.handleSubmit(values => {
  emit('submit', { commentText: values.comment });
  form.resetForm();
  showSubmitButtons.value = false;
});

const onCancel = () => {
  form.resetForm();
  showSubmitButtons.value = false;
  emit('cancel');
};

const onTextareaFocus = () => {
  showSubmitButtons.value = true;
};

const onTextareaBlur = () => {
  if (submitLocked.value !== false) showSubmitButtons.value = false;
};

// Hooks
</script>

<template>
  <form @submit.prevent="onSubmit">
    <FormField v-slot="{ componentField }" name="comment" type="text">
      <FormItem>
        <FormControl>
          <div class="relative">
            <Textarea
              type="text"
              :placeholder="$t('comment.placeholder')"
              class="rounded-md border min-h-5"
              :class="[showSubmitButtons ? 'min-h-20' : '']"
              v-bind="componentField"
              @focus="onTextareaFocus"
              @blur="onTextareaBlur"
            />
            <div v-if="showSubmitButtons" class="absolute bottom-2 right-2 flex items-center">
              <Button
                type="button"
                @click="onCancel"
                variant="ghost"
                class="opacity-75 hover:opacity-100 cursor-pointer h-7 px-2"
              >
                {{ $t('form.button.cancel') }}
              </Button>
              <Button
                type="submit"
                :disabled="submitLocked"
                variant="ghost"
                class="opacity-75 hover:opacity-100 cursor-pointer h-7 px-2"
              >
                {{ $t('form.button.add') }}
              </Button>
            </div>
          </div>
        </FormControl>
        <FormMessage class="text-xs" />
      </FormItem>
    </FormField>
  </form>
</template>
