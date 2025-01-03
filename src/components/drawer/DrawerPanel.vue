<script setup lang="ts">
import ChatHistory from '@components/chat/ChatHistoryDrawer.vue';
import { useDrawerStore } from '@stores/drawer.store';

const drawer = useDrawerStore();

// Register components
const components = {
  ChatHistory,
};
</script>

<template>
  <Transition name="slide" mode="out-in">
    <div
      v-if="drawer.isVisible"
      id="drawer-panel"
      class="overflow-hidden w-[18rem] shrink-0"
    >
      <div
        id="drawer-content"
        class="border-l px-6 overflow-y-auto relative h-full"
      >
        <component
          :is="components[drawer.currentComponent as keyof typeof components]"
        />
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
