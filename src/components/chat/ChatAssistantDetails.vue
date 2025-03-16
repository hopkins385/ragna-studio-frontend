<script setup lang="ts">
import { useProviderIcons } from '@composables/useProviderIcons';

interface AssistantDetailsProps {
  chatTitle?: string;
  llmProvider?: string;
  llmName?: string;
  title?: string;
}

defineProps<AssistantDetailsProps>();

const { getProviderIcon } = useProviderIcons();
</script>

<template>
  <div
    class="border rounded-full px-4 py-2 bg-white relative flex items-center space-x-2"
  >
    <div class="text-xs flex space-x-1 truncate">
      <p class="truncate max-w-xs">{{ chatTitle ?? 'Chat' }}</p>
      <p class="">/</p>
      <p class="truncate max-w-40">{{ title ?? 'Assistant' }}</p>
      <p class="">/</p>
    </div>
    <div class="flex items-center space-x-1 shrink-0" v-if="llmProvider">
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
