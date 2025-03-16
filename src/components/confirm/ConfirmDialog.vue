<script setup lang="ts">
import ButtonLoading from '@/common/components/button/ButtonLoading.vue';
import type { ConfirmDialogOptions } from '@/composables/useConfirmDialog';
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
import { Button } from '../ui/button';

const props = defineProps<ConfirmDialogOptions>();
const modelValue = defineModel<boolean>({ required: true });

const isLoading = ref(false);

const onSubmitClick = async () => {
  isLoading.value = true;
  try {
    await props.onConfirm?.();
  } finally {
    modelValue.value = false;
    isLoading.value = false;
  }
};

const onCancelClick = () => {
  modelValue.value = false;
};

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    onCancelClick();
  }
};

onMounted(() => {
  window.addEventListener('keydown', onKeydown);
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown);
});
</script>

<template>
  <AlertDialog :open="modelValue">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{{ title ?? $t('confirm.title') }}</AlertDialogTitle>
        <AlertDialogDescription>
          {{ description ?? $t('confirm.description') }}
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel as-child>
          <Button variant="outline" @click="onCancelClick">
            {{ $t('confirm.button.cancel') }}
          </Button>
        </AlertDialogCancel>
        <AlertDialogAction as-child>
          <ButtonLoading :loading="isLoading" @click="onSubmitClick">
            {{ confirmButtonText ?? $t('confirm.button.confirm') }}
          </ButtonLoading>
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
