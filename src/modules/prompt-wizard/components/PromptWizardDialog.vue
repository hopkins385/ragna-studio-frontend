<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@ui/dialog';
import SocialPost from '~icons/illustrations/social_post';
import PromptWizardForm from './PromptWizardForm.vue';

// External
defineProps<{
  inputPrompt: string;
}>();

const emit = defineEmits<{
  updatePrompt: [string];
}>();

// Internal
const dialogIsOpen = ref(false);

const onUpdatePrompt = (prompt: string) => {
  emit('updatePrompt', prompt);
  dialogIsOpen.value = false;
};
</script>

<template>
  <Dialog v-model:open="dialogIsOpen">
    <DialogTrigger>
      <div class="size-52 border rounded-lg hover:shadow-md">
        <div class="p-6">
          <h2 class="text-sm font-semibold">Prompt Wizard</h2>
          <div class="p-8">
            <SocialPost class="size-full" />
          </div>
        </div>
      </div>
    </DialogTrigger>
    <DialogContent class="min-w-[50rem]">
      <DialogHeader>
        <DialogTitle>Prompt Wizard</DialogTitle>
        <DialogDescription>
          {{ $t('prompt_wizard.description') }}
        </DialogDescription>
      </DialogHeader>
      <!-- Form -->
      <PromptWizardForm :input-prompt="inputPrompt" @updatePrompt="onUpdatePrompt" />
    </DialogContent>
  </Dialog>
</template>
