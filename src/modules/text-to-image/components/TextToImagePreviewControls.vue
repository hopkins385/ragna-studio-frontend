<script setup lang="ts">
import { ChevronLeftCircle, ChevronRightCircle } from 'lucide-vue-next';

// Imports

// Props
// Emits
const emit = defineEmits<{
  (e: 'navigate', direction: 'back' | 'center' | 'next'): void;
}>();

// Refs

// Composables

// Computed
// Functions
onKeyStroke(['ArrowLeft', 'ArrowRight'], e => {
  e.preventDefault();
  switch (e.key) {
    case 'ArrowLeft':
      emit('navigate', 'back');
      break;
    case 'ArrowRight':
      emit('navigate', 'next');
      break;
    default:
      return;
  }
});

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
