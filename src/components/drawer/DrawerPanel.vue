<script setup lang="ts">
import { useDrawerStore } from '@/common/stores/drawer.store';
import ChatHistoryDrawer from '@/modules/ai-chat/components/ChatHistoryDrawer.vue';
import type { Component } from 'vue';

const drawer = useDrawerStore();

// Register components
const components = {
  ChatHistory: ChatHistoryDrawer,
} as Record<string, Component>;
</script>

<template>
  <Transition name="slide" mode="out-in">
    <div v-if="drawer.isVisible" id="drawer-panel" class="overflow-hidden w-[18rem] shrink-0">
      <div
        v-if="drawer.currentComponent"
        id="drawer-content"
        class="border-l px-6 overflow-y-auto relative h-full"
      >
        <component :is="components[drawer.currentComponent]" />
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition:
    width 0.3s ease,
    opacity 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  width: 0;
  opacity: 0;
}
</style>
