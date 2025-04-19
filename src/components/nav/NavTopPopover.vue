<script setup lang="ts">
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useNavBarItems } from '@/composables/nav/useNavBarItems';
import { Grip } from 'lucide-vue-next';

const open = ref(false);

const { getDefaultItems } = useNavBarItems();

const setClose = () => (open.value = false);
</script>

<template>
  <Popover v-model:open="open">
    <PopoverTrigger class="h-full group">
      <Grip
        class="nav-icon stroke-1.5 group-hover:stroke-2 group-hover:scale-105 transition-transform"
      />
    </PopoverTrigger>
    <PopoverContent align="start" class="size-96 p-5">
      <div class="grid grid-cols-3 gap-5">
        <template v-for="item in getDefaultItems()" :key="item.path">
          <RouterLink
            v-if="item.path"
            :to="item.path"
            class="size-20 border-0 flex flex-col items-center justify-center space-y-2"
            @click="setClose"
          >
            <div class="size-12 border rounded-sm flex flex-col items-center justify-center">
              <component :is="item.icon" class="stroke-1.5 size-5" />
            </div>
            <span class="text-xs">
              {{ $t(item.label) }}
            </span>
          </RouterLink>
        </template>
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
