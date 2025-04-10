<script setup lang="ts">
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useClipboard } from '@vueuse/core';
import { CheckIcon, CopyIcon } from 'lucide-vue-next';

// Imports

// Props
const props = defineProps<{
  link: string;
}>();
const modelValue = defineModel<boolean>({ required: true });
// Emits
const emit = defineEmits<{
  success: [void];
}>();

// Refs

// Composables
const { copy, copied } = useClipboard();

// Computed
// Functions
const onSubmitClick = async () => {
  modelValue.value = false;
  emit('success');
};

const onCancelClick = () => {
  modelValue.value = false;
};

const onCopyClick = () => copy(props.link);

// Hooks
</script>

<template>
  <AlertDialog :open="modelValue">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{{ $t('admin.user.invite_dialog.title') }}</AlertDialogTitle>
        <AlertDialogDescription>
          {{ $t('admin.user.invite_dialog.description') }}
        </AlertDialogDescription>
      </AlertDialogHeader>
      <div class="flex space-x-2 items-center">
        <Input type="text" :default-value="props.link" readonly />
        <Button variant="outline" size="icon" @click="onCopyClick">
          <CopyIcon v-if="!copied" class="size-4" />
          <CheckIcon v-else class="size-4" />
        </Button>
      </div>
      <AlertDialogFooter>
        <AlertDialogAction as-child>
          <Button @click="onSubmitClick">
            {{ $t('admin.user.invite_dialog.done') }}
          </Button>
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
