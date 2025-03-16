<script setup lang="ts">
import { useNavBarStore } from '@/common/stores/nav-bar.store';
import { useNavBarItems } from '@/composables/nav/useNavBarItems';
import { Separator } from '@ui/separator';
import { useMousePressed } from '@vueuse/core';
import { EllipsisIcon } from 'lucide-vue-next';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
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
      <div id="spacer" class="h-2"></div>
      <div class="flex h-full flex-col">
        <ul class="space-y-4">
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
            <!-- if not path but has children then it a more menu -->
            <li v-else-if="item.children.length > 0" class="nav-item">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <div
                    class="flex flex-col items-center rounded-lg border border-transparent px-4 transition-colors group"
                  >
                    <div class="nav-icon-wrapper">
                      <EllipsisIcon class="size-4" />
                    </div>
                    <span class="truncate px-4 pt-0 text-foreground nav-icon-text">
                      {{ $t('nav.more') }}
                    </span>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="right"
                  align="start"
                  :collision-boundary="navBarRef"
                  :avoid-collisions="true"
                  :collision-padding="{ left: 16 }"
                  class="w-[5.5rem] min-w-0 p-2"
                >
                  <DropdownMenuItem
                    v-for="child in item.children"
                    :key="child.path"
                    class="nav-item-child focus:bg-transparent gap-0 cursor-pointer"
                    as-child
                  >
                    <NavLink
                      v-if="child.path"
                      :active="$route.path === child.path"
                      :to="child.path"
                      :icon="child.icon"
                      :label="child.label"
                      :label-visible="navBar.isOpen"
                    />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
