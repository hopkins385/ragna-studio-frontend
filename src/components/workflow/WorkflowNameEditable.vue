<script setup lang="ts">
import { workflowService } from '@/modules/workflow/services/workflow.service';
import { workflowNameSchema } from '@/schemas/workflow-settings.schema';
import { FormControl, FormField, FormItem, FormMessage } from '@ui/form';
import { Input } from '@ui/input';
import { toTypedSchema } from '@vee-validate/zod';

const props = defineProps<{
  workflowId: string;
  workflowName: string;
}>();

const emit = defineEmits<{
  refresh: [void];
}>();

const showForm = ref(false);

const { handleSubmit } = useForm({
  validationSchema: toTypedSchema(workflowNameSchema),
  initialValues: {
    name: props.workflowName,
  },
});

const onSubmit = handleSubmit(async values => {
  try {
    await workflowService.updateWorkflow(props.workflowId, { name: values.name });
  } catch (error) {
    console.error(error);
  } finally {
    showForm.value = false;
    emit('refresh');
  }
});

const toggleShowForm = () => {
  showForm.value = !showForm.value;
  // Focus on the input field when the form is shown
  if (showForm.value) {
    nextTick(() => {
      const input = document.getElementById('wfNameInput') as HTMLInputElement;
      input.focus();
    });
  }
};

const closeForm = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    showForm.value = false;
  }
};

const removeListener = useEventListener('keydown', closeForm);

onUnmounted(() => {
  removeListener();
});
</script>

<template>
  <div class="text-base font-semibold">
    <h1 v-if="!showForm" @click="toggleShowForm" class="">
      <span>{{ workflowName }}</span>
    </h1>
    <form v-show="showForm" @submit.prevent="onSubmit">
      <FormField v-slot="{ componentField }" name="name">
        <FormItem>
          <FormControl>
            <Input
              id="wfNameInput"
              type="text"
              placeholder="Workflow Name"
              autocomplete="off"
              v-bind="componentField"
            />
          </FormControl>
          <FormMessage class="text-xs" />
        </FormItem>
      </FormField>
    </form>
  </div>
</template>
