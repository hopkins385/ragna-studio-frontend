<script setup lang="ts">
import { Alert, AlertDescription, AlertTitle } from '@ui/alert';
import { AlertCircleIcon, XIcon } from 'lucide-vue-next';

defineProps<{
  title: string | null;
  description: string | null;
}>();

const modelValue = defineModel<boolean>();
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
      <AlertTitle>{{ title ? $t(title) : $t('alert.error.default.title') }}</AlertTitle>
      <AlertDescription>
        {{ description ? $t(description) : $t('alert.error.default.description') }}
      </AlertDescription>
    </Alert>
  </div>
</template>
