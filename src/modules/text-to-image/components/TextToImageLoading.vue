<script setup lang="ts">
import { Loader2Icon } from 'lucide-vue-next';

// Imports

// Props
const props = defineProps<{
  prompt: string;
  imageCount: number;
}>();
// Emits

// Refs

// Composables

// Computed
// Functions

// Hooks
</script>

<template>
  <div class="flex">
    <div class="grid shrink-0 grid-cols-4">
      <div
        v-for="(count, index) in props.imageCount"
        :key="index"
        class="mx-1 flex size-64 animate-pulse rounded-lg bg-stone-100 items-center justify-center"
      >
        <!-- size-56 -->
        <span>
          <Loader2Icon class="size-6 stroke-1.5 animate-spin text-slate-500" />
        </span>
      </div>
    </div>
    <div class="group flex grow flex-col border-0 px-5">
      <div class="rounded-lg p-1 hover:bg-slate-100">
        <p class="line-clamp-4 max-h-40 min-h-5 break-words text-sm opacity-75 hover:opacity-100">
          {{ props.prompt }}
        </p>
      </div>
    </div>
  </div>
</template>
