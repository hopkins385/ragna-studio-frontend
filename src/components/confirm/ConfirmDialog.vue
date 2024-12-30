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
} from '@/components/ui/alert-dialog';

defineProps<{
  modelValue: boolean;
}>();

defineEmits<{
  'update:modelValue': [boolean];
  confirm: [boolean];
}>();
</script>

<template>
  <AlertDialog
    :open="modelValue"
    @update:open="(val: boolean) => $emit('update:modelValue', val)"
  >
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
