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

interface ConfirmDialogEmits {
  confirm: [boolean];
}

const modelValue = defineModel<boolean>();

defineEmits<ConfirmDialogEmits>();
</script>

<template>
  <AlertDialog v-model:open="modelValue">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{{ $t('confirm.title') }}</AlertDialogTitle>
        <AlertDialogDescription>
          {{ $t('confirm.description') }}
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>
          {{ $t('confirm.button.cancel') }}
        </AlertDialogCancel>
        <AlertDialogAction @click="$emit('confirm', true)">
          {{ $t('confirm.button.confirm') }}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
