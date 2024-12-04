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
      <!-- -->
    </div>
    <div class="custom-shadow p-5 min-h-full">
      <div class="">
        <div class="p-4">
          <div class="pb-3">
            <h2 class="text-sm font-semibold">My Favorites</h2>
          </div>
          <div class="border h-40 rounded-lg"></div>
        </div>
        <div class="p-4 w-full">
          <div class="pb-3">
            <h2 class="text-sm font-semibold">Start with template</h2>
            <p class="text-xs opacity-75">
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Soluta,
              similique eius. Sapiente illum illo .
            </p>
          </div>
          <div class="grid grid-cols-3 gap-5">
            <div class="border w-full h-20 rounded-lg hover:shadow-md"></div>
            <div class="border w-full h-20 rounded-lg hover:shadow-md"></div>
            <div class="border w-full h-20 rounded-lg hover:shadow-md"></div>
            <div class="border w-full h-20 rounded-lg hover:shadow-md"></div>
            <div class="border w-full h-20 rounded-lg hover:shadow-md"></div>
            <div class="border w-full h-20 rounded-lg hover:shadow-md"></div>
            <div class="border w-full h-20 rounded-lg hover:shadow-md"></div>
            <div class="border w-full h-20 rounded-lg hover:shadow-md"></div>
            <div class="border w-full h-20 rounded-lg hover:shadow-md"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-shadow {
  box-shadow: 0px -5px 5px rgba(0, 0, 0, 0.1);
}
</style>
