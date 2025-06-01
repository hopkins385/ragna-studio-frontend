<script setup lang="ts">
import { ChevronLeftCircle, ChevronRightCircle } from 'lucide-vue-next';

// Imports

// Props
// Emits
defineEmits<{
  (e: 'navigate', direction: 'back' | 'center' | 'next'): void;
}>();

// Refs

// Composables

// Computed
// Functions

// Hooks
</script>

<template>
  <div class="size-full flex">
    <div
      class="hover:bg-white/30 w-10 flex items-center justify-center group cursor-pointer select-none"
      @click="$emit('navigate', 'back')"
    >
      <span class="group-hover:block hidden">
        <ChevronLeftCircle class="w-6 h-6 text-white stroke-1.5" />
      </span>
    </div>
    <div class="grow select-none" @click="$emit('navigate', 'center')"></div>
    <div
      class="hover:bg-white/30 w-10 flex items-center justify-center group cursor-pointer select-none"
      @click="$emit('navigate', 'next')"
    >
      <span class="group-hover:block hidden">
        <ChevronRightCircle class="w-6 h-6 text-white stroke-1.5" />
      </span>
    </div>
  </div>
</template>
