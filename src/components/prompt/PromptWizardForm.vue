<script setup lang="ts">
import { promptWizardService } from '@/modules/prompt-wizard/services/prompt-wizard.service';
import ButtonLoading from '@ui/button/ButtonLoading.vue';
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
import { Loader2Icon } from 'lucide-vue-next';
import { z } from 'zod';
import { Button } from '../ui/button';

const props = defineProps<{
  inputPrompt: string;
}>();

const emit = defineEmits<{
  updatePrompt: [string];
}>();

const isLoading = ref<boolean>(false);
const generatedPrompt = ref<string>('');

const promptWizardSchema = z.object({
  input: z.string().trim().min(1, 'Input prompt is required').max(4000, 'Input prompt is too long'),
});

// form
const { handleSubmit } = useForm({
  validationSchema: toTypedSchema(promptWizardSchema),
  initialValues: {
    input: props.inputPrompt,
  },
});

const initSubmit = () => {
  isLoading.value = true;
  generatedPrompt.value = '';
};

const handleSubmitError = (error: unknown) => {
  console.error(error);
};

const handleSubmitFinished = () => {
  isLoading.value = false;
};

const handleSubmitSuccess = (prompt: string) => {
  generatedPrompt.value = prompt;
};

const onTakePrompt = () => {
  emit('updatePrompt', generatedPrompt.value);
};

const onSubmit = handleSubmit(async values => {
  const payload = {
    input: values.input,
  };
  if (!payload.input) return;
  if (isLoading.value) return;
  initSubmit();
  try {
    const { prompt } = await promptWizardService.createPrompt(payload);
    handleSubmitSuccess(prompt);
  } catch (error) {
    handleSubmitError(error);
  } finally {
    handleSubmitFinished();
  }
});
</script>

<template>
  <div class="space-y-4">
    <form @submit.prevent="onSubmit">
      <FormField v-slot="{ componentField }" name="input">
        <FormItem>
          <FormLabel>{{ $t('prompt_wizard.input.label') }}</FormLabel>
          <FormDescription>
            {{ $t('prompt_wizard.input.description') }}
          </FormDescription>
          <FormControl>
            <Textarea rows="5" v-bind="componentField" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <div class="flex justify-end mt-4">
        <ButtonLoading type="submit" :loading="isLoading">
          {{ $t('prompt_wizard.button.generate') }}
        </ButtonLoading>
      </div>
    </form>
    <div class="space-y-4">
      <div class="h-72 border rounded-md p-3 relative overflow-auto">
        <div v-if="isLoading" class="absolute inset-0 p-2 bg-white border rounded-md">
          <Loader2Icon class="animate-spin size-5 opacity-75" />
        </div>
        <p class="text-sm whitespace-pre-line">{{ generatedPrompt }}</p>
      </div>
      <div class="flex justify-end">
        <Button :disabled="!generatedPrompt" @click="onTakePrompt">
          {{ $t('prompt_wizard.button.take') }}
        </Button>
      </div>
    </div>
  </div>
</template>
