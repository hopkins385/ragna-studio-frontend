<script setup lang="ts">
import NavBarTeam from '@/components/nav/NavBarTeam.vue';
import NavHelpMenu from '@/components/nav/NavHelpMenu.vue';
import { Bell, Expand } from 'lucide-vue-next';
import BrandLogo from '../brand/BrandLogo.vue';
import NavTopPopover from './NavTopPopover.vue';
import NavUserMenu from './NavUserMenu.vue';

const onExpandClick = () => {
  const rootNode = document.documentElement;
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else {
    rootNode.requestFullscreen();
  }
};
</script>

<template>
  <div class="flex h-14 items-center justify-between border-0">
    <div class="flex">
      <div class="px-6 mt-1">
        <NavTopPopover />
      </div>
      <div class="pl-2 flex items-center space-x-2 text-sm">
        <div class="">
          <BrandLogo class="" :text-visible="true" />
        </div>
        <div></div>

        <div>
          <NavBarTeam />
        </div>

        <div></div>
        <!--
        <div>
          <NavBarProject />
        </div>
        -->
      </div>
    </div>
    <div class="flex h-full items-center space-x-5">
      <button>
        <Bell class="size-5 stroke-1 hover:stroke-1.5" />
      </button>
      <div>
        <NavHelpMenu />
      </div>
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
