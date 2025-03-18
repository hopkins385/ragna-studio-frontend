<script setup lang="ts">
import { useDrawerStore } from '@/common/stores/drawer.store';
import type { Component } from 'vue';

interface ComponentMap {
  [key: string]: Component;
}

const drawer = useDrawerStore();

const components: ComponentMap = {
  'chat-history': defineAsyncComponent(
    () => import('@/modules/ai-chat/components/ChatHistoryDrawer.vue'),
  ),
};
</script>

<template>
  <Transition name="slide" mode="out-in">
    <div v-if="drawer.leftIsVisible" id="drawer-panel" class="overflow-hidden w-[18rem] shrink-0">
      <div
        v-if="drawer.leftComponent"
        id="drawer-content"
        class="border-l px-6 overflow-y-auto relative h-full"
      >
        <component :is="components[drawer.leftComponent]" />
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
