<script setup lang="ts">
// const homeImageSrc = '@/assets/images/home.jpg&q=100&format=webp&imagetools';
import imageUrl from '@/assets/images/home2.jpg?q=100&format=webp&imagetools';

const backgroundStyles = computed(() => {
  return {
    // backgroundImage: `linear-gradient(rgba(0,0,0,.20),rgba(0,0,0,.20)), url('${imageUrl}')`,
    backgroundImage: `linear-gradient(rgba(255,255,255,0.4), rgba(255,255,255,0.4)), url('${imageUrl}')`,
    backgroundSize: 'cover',
    // opacity: 0.4,
  };
});
</script>

<template>
  <div class="bg-muted/50 rounded-2xl h-full">
    <div class="h-60 bg-blue-200 p-5 bg-center" :style="backgroundStyles">
      <div class="flex justify-center items-center h-full">
        <h1 class="text-4xl text-black font-bold hidden">
          Welcome to our website
        </h1>
      </div>
    </div>
    <div class="custom-shadow p-5 min-h-full">
      <div v-if="$ability.can('create', 'Assistant')">Yes u can</div>
    </div>
  </div>
</template>

<style scoped>
.custom-shadow {
  box-shadow: 0px -5px 5px rgba(0, 0, 0, 0.1);
}
</style>
