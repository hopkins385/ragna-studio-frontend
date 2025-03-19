<script setup lang="ts">
import { useRagnaClient } from '@/composables/useRagnaClient';
import { FormControl, FormField, FormItem, FormMessage } from '@ui/form';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@ui/select';
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import { z } from 'zod';

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

const client = useRagnaClient();

const { handleSubmit } = useForm({
  validationSchema: formSchema,
  initialValues: {
    assistantId: props.assistantId || '',
  },
});

const onSubmit = handleSubmit(async values => {
  await client.workflowStep.updateWorkflowStepAssistant(props.workflowStepId, {
    assistantId: values.assistantId,
  });
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
