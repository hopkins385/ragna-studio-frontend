<script setup lang="ts">
import { useNavBarItems } from '@/composables/nav/useNavBarItems';
import { Separator } from '@ui/separator';
import { EllipsisIcon } from 'lucide-vue-next';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import NavLink from './NavLink.vue';

const navBarRef = useTemplateRef('navBarRef');
const { dynamicNavItems } = useNavBarItems();
</script>

<template>
  <div
    ref="navBarRef"
    class="relative flex shrink-0 flex-col justify-between transition-all duration-300 ease-out w-[4.5rem]"
  >
    <div class="relative h-full overflow-y-hidden transition-opacity duration-200 ease-in-out">
      <div id="spacer" class="h-2"></div>
      <div class="flex h-full flex-col">
        <ul class="space-y-4 overflow-hidden">
          <template v-for="item in dynamicNavItems" :key="item.path">
            <li v-if="item.path" class="nav-item">
              <NavLink
                v-if="item.path"
                :active="$route.path === item.path"
                :to="item.path"
                :icon="item.icon"
                :label="item.label"
                :label-visible="true"
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
                      :label-visible="true"
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
