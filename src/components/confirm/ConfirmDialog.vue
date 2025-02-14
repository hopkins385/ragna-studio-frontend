<script setup lang="ts">
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@ui/alert-dialog';

defineProps<{
  title?: string;
  description?: string;
  confirmButtonText?: string;
  onConfirm: () => void;
}>();

const modelValue = defineModel<boolean>({ required: true });
</script>

<template>
  <AlertDialog v-model:open="modelValue">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{{ title ?? $t('confirm.title') }}</AlertDialogTitle>
        <AlertDialogDescription>
          {{ description ?? $t('confirm.description') }}
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>
          {{ $t('confirm.button.cancel') }}
        </AlertDialogCancel>
        <AlertDialogAction @click="onConfirm()">
          {{ confirmButtonText ?? $t('confirm.button.confirm') }}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
