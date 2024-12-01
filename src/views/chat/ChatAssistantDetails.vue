<script setup lang="ts">
import { useProviderIcons } from '@composables/useProviderIcons';

defineProps<{
  provider?: string;
  title?: string;
}>();

const { getProviderIcon } = useProviderIcons();
</script>

<template>
  <div
    class="border rounded-full px-4 py-2 max-w-xs bg-white relative flex items-center space-x-2"
  >
    <p class="text-sm truncate">{{ title ?? 'Assistant' }}</p>
    <div class="" v-if="provider">
      <component
        :is="getProviderIcon(provider)"
        class="size-4 text-slate-500"
      />
    </div>
  </div>
</template>
