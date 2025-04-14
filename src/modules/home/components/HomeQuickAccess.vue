<script setup lang="ts">
import { useHomeStore } from '@/modules/home/stores/home.store';
import { LayoutGridIcon } from 'lucide-vue-next';
import type { SortableOptions } from 'sortablejs';
import { Sortable } from 'sortablejs-vue3';

const homeStore = useHomeStore();

const sortableOptions = computed(() => {
  const options: SortableOptions = {
    sort: homeStore.quickAccessIsSortable,
    handle: '.drag-handle',
    animation: 200,
    ghostClass: '.ghost',
  };
  return options;
});
</script>

<template>
  <div class="px-20 pt-5">
    <div class="flex items-center space-x-2">
      <div @click="() => homeStore.toggleQuickAccessIsSortable()" class="cursor-pointer group">
        <LayoutGridIcon class="size-5 stroke-1.5 group-hover:scale-110 group-hover:stroke-2" />
      </div>
      <h2 class="text-2xl font-semibold">
        {{ $t('quickaccess.title') }}
      </h2>
    </div>
  </div>
  <div class="px-20 py-5">
    <Sortable
      :options="sortableOptions"
      :list="homeStore.quickAccessItems"
      class="flex flex-wrap gap-4"
      item-key="route"
      @end="e => homeStore.moveQuickAccessItem(e.oldIndex, e.newIndex)"
    >
      <template #item="{ element }">
        <router-link :to="element.route" class="flex flex-col">
          <div
            class="w-60 h-40 border-0 rounded-2xl p-5 group hover:shadow-md space-y-2 drag-handle"
            :class="[element.class, { 'cursor-move wiggle': homeStore.quickAccessIsSortable }]"
          >
            <component
              :is="element.icon"
              class="size-6 stroke-1.5 group-hover:stroke-2 !bg-transparent"
              :class="element.class"
            />
            <p class="text-xs font-medium group-hover:font-semibold">
              {{ $t(element.label) }}
            </p>
          </div>
        </router-link>
      </template>
    </Sortable>
  </div>
</template>

<style scoped>
.ghost {
  @apply opacity-75;
}

.wiggle {
  animation: wiggle 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) infinite;
  transform-origin: center center;
}

@keyframes wiggle {
  0% {
    transform: rotate(0deg);
  }

  50% {
    transform: rotate(-1.2deg);
  }

  100% {
    transform: rotate(1.2deg);
  }
}
</style>
