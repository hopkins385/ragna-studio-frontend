<script setup lang="ts">
import { Popover, PopoverTrigger } from '@/components/ui/popover';
import PopoverContent from '@/components/ui/popover/PopoverContent.vue';
import { HelpCircleIcon } from 'lucide-vue-next';

// Imports
const version = import.meta.env.VITE_APP_VERSION;

// Props
// Emits

// Refs

// Composables

// Computed
// Functions

// Hooks
</script>

<template>
  <Popover>
    <PopoverTrigger as-child class="flex">
      <button>
        <HelpCircleIcon class="size-5 stroke-1 hover:stroke-1.5" />
      </button>
    </PopoverTrigger>
    <PopoverContent class="w-[14rem] rounded-2xl overflow-hidden p-0" side="bottom">
      <div class="p-5">
        <p class="text-xs opacity-75">App Version: {{ version }}</p>
      </div>
    </PopoverContent>
  </Popover>
</template>
