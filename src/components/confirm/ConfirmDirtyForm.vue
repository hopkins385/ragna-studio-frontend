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

const modelValue = defineModel<boolean>({ required: true });

defineEmits<ConfirmDialogEmits>();
</script>

<template>
  <AlertDialog v-model:open="modelValue">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{{
          $t('confirm.dirty_form.title')
        }}</AlertDialogTitle>
        <AlertDialogDescription>
          {{ $t('confirm.dirty_form.description') }}
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>
          {{ $t('confirm.dirty_form.button.cancel') }}
        </AlertDialogCancel>
        <AlertDialogAction @click="$emit('confirm', true)">
          {{ $t('confirm.dirty_form.button.confirm') }}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
