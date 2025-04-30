<script setup lang="ts">
import { getToolDisplayName } from '@/modules/assistant-tool/helpers/tool-display-name.helper';
import { ChevronDownIcon, SparklesIcon } from 'lucide-vue-next';

// Imports

// Props
const props = defineProps<{
  toolName: string;
  toolResult: string | Record<string, any>;
  hasMore?: boolean;
}>();
// Emits

// Refs

// Composables
const showDetails = defineModel({
  required: false,
  default: false,
});

// Computed
// Functions
const getToolResult = (toolResult: string | Record<string, any>) => {
  if (typeof toolResult === 'string') {
    return toolResult;
  }
  if (typeof toolResult === 'object') {
    const jsonString = JSON.stringify(toolResult, null, 2);
    return jsonString;
  }
  return '';
};

// Hooks
</script>

<template>
  <div
    class="border border-sky-100 shadow-sm mb-2 p-6 rounded-lg space-y-3 cursor-pointer bg-sky-100 min-h-20 min-w-96"
  >
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-2">
        <span><SparklesIcon class="size-4 stroke-2" /></span>
        <span class="font-semibold">{{ $t(getToolDisplayName({ rawName: props.toolName })) }}</span>
      </div>
      <div v-if="props.hasMore">
        <ChevronDownIcon class="size-4 stroke-1.5" :class="{ 'rotate-180': showDetails }" />
      </div>
    </div>
    <div class="max-w-[40rem]">
      <p class="opacity-95 whitespace-pre-line line-clamp-6 overflow-hidden">
        {{ getToolResult(props.toolResult) }}
      </p>
    </div>
  </div>
</template>
