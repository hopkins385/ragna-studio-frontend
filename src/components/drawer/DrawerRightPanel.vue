<script setup lang="ts">
import { useDrawerStore } from '@/common/stores/drawer.store';
import type { Component } from 'vue';

interface ComponentMap {
  [key: string]: Component;
}

const drawer = useDrawerStore();

const components: ComponentMap = {
  'editor-sidebar': defineAsyncComponent(
    () => import('@/modules/editor/components/EditorSideNav.vue'),
  ),
};
</script>

<template>
  <Transition name="slide" mode="out-in">
    <div v-if="drawer.rightIsVisible" id="drawer-panel" class="overflow-hidden w-14 shrink-0">
      <div
        v-if="drawer.rightComponent"
        id="drawer-content"
        class="px-0 overflow-y-auto relative h-full"
      >
        <component :is="components[drawer.rightComponent]" />
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
