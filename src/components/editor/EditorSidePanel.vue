<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { XIcon } from 'lucide-vue-next';

// Imports

// Props
const props = defineProps<{
  title: string;
}>();
const modelValue = defineModel();
// Emits

// Refs

// Composables

// Computed
// Functions

// Hooks
</script>

<template>
  <transition name="sidepanel-slide">
    <div v-if="modelValue" class="w-96 h-full overflow-x-hidden overflow-y-scroll shrink-0">
      <div class="border-l h-full p-4 space-y-5">
        <div class="flex items-center space-x-1">
          <div>
            <Button variant="ghost" size="icon" @click="() => $emit('update:modelValue', false)">
              <XIcon class="size-4" />
            </Button>
          </div>
          <div>
            <h3 class="font-semibold text-base">{{ props.title }}</h3>
          </div>
        </div>
        <!-- Content -->
        <slot />
      </div>
    </div>
  </transition>
</template>

<style scoped lang="css">
.sidepanel-slide-enter-active,
.sidepanel-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.sidepanel-slide-enter-from,
.sidepanel-slide-leave-to {
  transform: translateX(100%);
  width: 0;
  opacity: 0;
}

.sidepanel-slide-enter-to,
.sidepanel-slide-leave-from {
  transform: translateX(0);
  width: 24rem;
  opacity: 1;
}
</style>
