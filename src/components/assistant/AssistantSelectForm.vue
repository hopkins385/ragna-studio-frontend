<script setup lang="ts">
import { useWorkflowStepService } from '@/composables/services/useWorkflowStepService';
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import { z } from 'zod';
import { FormControl, FormField, FormItem, FormMessage } from '@ui/form';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@ui/select';

const props = defineProps<{
  assistantId: string | null | undefined;
  workflowStepId: string;
  assistants: any;
}>();

const emit = defineEmits<{
  refresh: [void];
}>();

const formSchema = toTypedSchema(
  z.object({
    assistantId: z.string(),
  }),
);

const { handleSubmit } = useForm({
  validationSchema: formSchema,
  initialValues: {
    assistantId: props.assistantId || '',
  },
});

const onSubmit = handleSubmit(async values => {
  /*const { updateWorkflowStepAssistant } = useWorkflowStepService();
  await updateWorkflowStepAssistant({
    workflowStepId: props.workflowStepId,
    assistantId: values.assistantId,
  });*/
  throw new Error('Not implemented');
  emit('refresh');
});
</script>

<template>
  <FormField
    v-slot="{ componentField }"
    :value="assistantId"
    name="assistantId"
    @update:model-value="() => onSubmit()"
  >
    <FormItem>
      <Select v-bind="componentField">
        <FormControl>
          <SelectTrigger class="text-xs focus:ring-0">
            <SelectValue class="truncate" placeholder="Set Assistant" />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          <SelectGroup>
            <SelectItem
              v-for="assistant in assistants"
              :key="assistant?.id"
              :value="assistant?.id"
              class="text-xs"
            >
              <div class="max-w-40 truncate">{{ assistant?.title }}</div>
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  </FormField>
</template>
