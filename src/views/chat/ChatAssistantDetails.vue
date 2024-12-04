<script setup lang="ts">
import { useProviderIcons } from '@composables/useProviderIcons';

defineProps<{
  llmProvider?: string;
  llmName?: string;
  title?: string;
}>();

const { getProviderIcon } = useProviderIcons();
</script>

<template>
  <div
    class="border rounded-full px-4 py-2 max-w-xs bg-white relative flex items-center space-x-2"
  >
    <p class="text-xs truncate">{{ title ?? 'Assistant' }} /</p>
    <div class="flex items-center space-x-1" v-if="llmProvider">
      <component
        :is="getProviderIcon(llmProvider)"
        class="size-4 text-slate-500"
      />
      <span class="text-xs">
        {{ llmName }}
      </span>
    </div>
  </div>
</template>
