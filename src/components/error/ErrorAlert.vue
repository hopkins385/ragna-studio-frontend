<script setup lang="ts">
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircleIcon, XIcon } from 'lucide-vue-next';

defineProps<{
  modelValue: boolean;
  message: string;
}>();

defineEmits<{
  'update:modelValue': [boolean];
}>();
</script>

<template>
  <div v-if="modelValue" class="-mt-10 p-10">
    <Alert variant="destructive" class="bg-white shadow-md">
      <button
        class="absolute right-0 top-0 cursor-pointer p-3 opacity-60 hover:opacity-100"
        @click="$emit('update:modelValue', false)"
      >
        <XIcon class="size-4" />
      </button>
      <AlertCircleIcon class="size-4" />
      <AlertTitle>{{ $t('alert.error.title') }}</AlertTitle>
      <AlertDescription>
        {{ message }}
      </AlertDescription>
    </Alert>
  </div>
</template>
