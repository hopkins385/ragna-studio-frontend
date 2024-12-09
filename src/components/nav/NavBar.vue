<script setup lang="ts">
import { useNavBarItems } from '@/composables/nav/useNavBarItems';
import { useNavBarStore } from '@/stores/nav-bar.store';
import { Separator } from '@ui/separator';
import { useMousePressed } from '@vueuse/core';
import NavLink from './NavLink.vue';

const navBarRef = ref(null);
const navBarResizerRef = ref(null);

const navBar = useNavBarStore();

const { dynamicNavItems } = useNavBarItems();

const { pressed } = useMousePressed({ target: navBarResizerRef });

watch(pressed, isPressed => {
  if (isPressed && navBar.isOpen) {
    addEventListener('mousemove', navBar.setWidth);
  } else {
    removeEventListener('mousemove', navBar.setWidth);
  }
});
</script>

<template>
  <div
    ref="navBarRef"
    class="relative flex shrink-0 flex-col justify-between transition-all duration-300 ease-out"
    :style="{ width: navBar.isFullClosed ? 0 : `${navBar.width}rem` }"
  >
    <div
      ref="navBarResizerRef"
      class="absolute right-0 top-0 z-10 h-full"
      :class="{
        'bg-blue-600': pressed && navBar.isOpen,
        'cursor-ew-resize hover:bg-blue-600': navBar.isOpen,
      }"
      style="width: 0.25rem"
    ></div>
    <div
      class="relative h-full overflow-y-hidden transition-opacity duration-200 ease-in-out"
      :class="{
        'opacity-0': navBar.isFullClosed,
      }"
    >
      <div id="spacer" class="h-1"></div>
      <div class="flex h-full flex-col">
        <ul class="space-y-2">
          <template v-for="item in dynamicNavItems" :key="item.path">
            <li v-if="item.path" class="nav-item">
              <NavLink
                v-if="item.path"
                :active="$route.path === item.path"
                :to="item.path"
                :icon="item.icon"
                :label="item.label"
                :label-visible="navBar.isOpen"
              />
              <!-- children disabled -->
            </li>
            <li v-else class="px-5">
              <Separator class="bg-stone-200" />
            </li>
          </template>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.nav-text {
  @apply text-sm;
}

.nav-item {
  @apply flex min-h-8 flex-col justify-center border-0 px-2 py-0;
  @apply nav-text;
}

.nav-item-child {
  @apply pl-4 pt-0;
}
</style>
