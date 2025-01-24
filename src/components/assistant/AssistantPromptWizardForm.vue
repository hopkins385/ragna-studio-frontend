<script setup lang="ts">
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@ui/form';
import { Textarea } from '@ui/textarea';
import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';

const promptWizardSchema = z.object({
  inputPrompt: z.string().trim().min(1, 'Input prompt is required'),
});

// form
const { handleSubmit } = useForm({
  validationSchema: toTypedSchema(promptWizardSchema),
  initialValues: {
    inputPrompt: '',
  },
});

const onSubmit = handleSubmit(async values => {});
</script>

<template>
  <form @click.prevent="onSubmit">
    <FormField v-slot="{ componentField }" name="inputPrompt">
      <FormItem>
        <FormLabel>{{ $t('assistant.behavior.label') }}</FormLabel>
        <FormDescription>
          {{ $t('assistant.behavior.description') }}
        </FormDescription>
        <FormControl>
          <Textarea rows="10" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
    <FormField v-slot="{ componentField }" name="outputPrompt">
      <FormItem>
        <FormLabel>{{ $t('assistant.behavior.label') }}</FormLabel>
        <FormDescription>
          {{ $t('assistant.behavior.description') }}
        </FormDescription>
        <FormControl>
          <Textarea rows="10" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
  </form>
</template>
