<script setup lang="ts">
import imageUrl from '@/assets/images/home2.jpg?q=100&format=webp&imagetools';
import HomeAgentTemplates from '@/components/home/HomeAgentTemplates.vue';
import HomeFavorites from '@/components/home/HomeFavorites.vue';
import HomeQuickAccess from '@/components/home/HomeQuickAccess.vue';

const backgroundStyles = computed(() => {
  return {
    // backgroundImage: `linear-gradient(rgba(0,0,0,.20),rgba(0,0,0,.20)), url('${imageUrl}')`,
    backgroundImage: `linear-gradient(rgba(255,255,255,0.3), rgba(255,255,255,0.3)), url('${imageUrl}')`,
    // backgroundImage: `url('${imageUrl}')`,
    backgroundSize: 'cover',
    // opacity: 0.4,
  };
});
</script>

<template>
  <!-- Home View   -->
  <div class="h-full">
    <div class="p-4 overflow-hidden">
      <div
        class="bg-blue-200 p-5 bg-center flex items-center h-44 rounded-xl overflow-hidden"
        :style="backgroundStyles"
      >
        <!-- Image Overlay -->
        <div
          v-if="false"
          class="h-20 border-0 w-full flex items-center justify-center"
        >
          <p class="text-4xl text-white font-semibold">
            Was gestaltest du heute?
          </p>
        </div>
      </div>
    </div>
    <!-- Home Quick Access  -->
    <HomeQuickAccess />
    <!-- Home Favorites  -->
    <div class="p-4">
      <div class="">
        <HomeFavorites />
        <HomeAgentTemplates />
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-shadow {
  box-shadow: 0px -5px 5px rgba(0, 0, 0, 0.1);
}
</style>
