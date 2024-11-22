<script setup lang="ts">
import imageSrc from '@/assets/images/bg_1.jpeg?h=2000&q=80&format=webp&imagetools';

const backgroundStyles = computed(() => {
  return {
    backgroundImage: `linear-gradient(rgba(0,0,0,.20),rgba(0,0,0,.20)), url('${imageSrc}')`,
    backgroundSize: 'cover',
  };
});
</script>

<template>
  <section>
    <div :style="backgroundStyles" class="h-60"></div>
    <div class="-mt-60 h-screen p-10">
      <slot />
    </div>
  </section>
</template>
