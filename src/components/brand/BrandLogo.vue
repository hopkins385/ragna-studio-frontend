<script setup lang="ts">
import IconRagna from '@assets/icons/ragna.svg?component';

defineProps<{
  textVisible: boolean;
}>();
</script>

<template>
  <RouterLink to="/">
    <div class="flex h-8 items-center justify-center space-x-3">
      <div class="opacity-100">
        <IconRagna class="size-7 drop-shadow-sm" />
      </div>
      <div v-if="textVisible" class="whitespace-nowrap text-sm opacity-95">
        <span class="font-semibold tracking-wide">RAGNA</span>&nbsp;Studio
      </div>
    </div>
  </RouterLink>
</template>
