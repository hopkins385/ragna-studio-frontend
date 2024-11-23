<script setup lang="ts">
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Grip } from 'lucide-vue-next';
import { useNavBarItems } from '@/composables/nav/useNavBarItems';

const { getDefaultItems } = useNavBarItems();
</script>

<template>
  <Popover>
    <PopoverTrigger class="h-full">
      <Grip class="nav-icon stroke-1.5" />
    </PopoverTrigger>
    <PopoverContent align="start" class="size-96 p-5">
      <div class="grid grid-cols-3 gap-5">
        <RouterLink
          v-for="item in getDefaultItems()"
          :to="item.path"
          :key="item.path"
          class="size-20 border-0 flex flex-col items-center justify-center space-y-2"
        >
          <div
            class="size-12 border rounded-sm flex flex-col items-center justify-center"
          >
            <component :is="item.icon" class="stroke-1.5 size-5" />
          </div>
          <span class="text-xs">
            {{ item.label }}
          </span>
        </RouterLink>
      </div>
    </PopoverContent>
  </Popover>
</template>

<style scoped>
.nav-icon {
  width: 1.4rem;
  height: 1.4rem;
}
</style>
