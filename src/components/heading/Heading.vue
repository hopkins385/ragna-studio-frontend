<script setup lang="ts">
import BoxContainer from '@components/box/BoxContainer.vue';
import imgUrl from '@images/bg_2.jpg?w=2000&q=100&format=webp&imagetools';

const backgroundStyles = computed(() => {
  return { backgroundImage: `url('${imgUrl}')` };
});
</script>

<template>
  <BoxContainer class="mb-4 p-2">
    <div
      class="flex min-h-20 overflow-hidden rounded-lg bg-cover bg-top bg-no-repeat"
      :style="backgroundStyles"
    >
      <slot name="top" />
    </div>
    <div class="mt-1 flex overflow-hidden rounded-lg bg-gray-50">
      <slot name="bottom" />
    </div>
  </BoxContainer>
</template>
