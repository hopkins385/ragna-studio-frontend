<script setup lang="ts">
import { useAuthStore } from '@/stores/auth.store';
import { Bell, Expand } from 'lucide-vue-next';
import BrandLogo from '../brand/BrandLogo.vue';
import NavTopPopover from './NavTopPopover.vue';
import NavUserMenu from './NavUserMenu.vue';

const authStore = useAuthStore();

const userCredits = computed(() => {
  return authStore.userCredits;
});

const onExpandClick = () => {
  const elem = document.documentElement;
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else {
    elem.requestFullscreen();
  }
};
</script>

<template>
  <div class="flex h-14 items-center justify-between">
    <div class="flex">
      <div class="px-6 mt-1">
        <NavTopPopover />
      </div>
      <div class="pl-2">
        <BrandLogo class="" :text-visible="true" />
      </div>
    </div>
    <div class="flex h-full items-center space-x-5">
      <div class="hidden">
        <div class="py-1 px-2 border-0 rounded-sm bg-parent">
          <span class="text-sm">{{ userCredits }}</span>
        </div>
      </div>
      <button>
        <Bell class="size-5 stroke-1 hover:stroke-1.5" />
      </button>
      <button @click="onExpandClick">
        <Expand class="size-5 stroke-1 hover:stroke-1.5" />
      </button>
      <div class="pr-5">
        <NavUserMenu :size-full="false" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.nav-icon {
  width: 1.4rem;
  height: 1.4rem;
}
</style>
