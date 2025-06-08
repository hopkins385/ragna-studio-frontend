<script setup lang="ts">
import BrandIcon from '@/components/brand/BrandIcon.vue';

defineProps<{
  textVisible: boolean;
}>();
</script>

<template>
  <RouterLink to="/">
    <div class="flex h-8 items-center justify-center space-x-3">
      <div class="bg-inherit">
        <BrandIcon class="size-7" />
      </div>
      <div v-if="textVisible" class="whitespace-nowrap text-sm opacity-95">
        <span class="font-semibold tracking-wide">RAGNA</span>&nbsp;Studio
      </div>
    </div>
  </RouterLink>
</template>
