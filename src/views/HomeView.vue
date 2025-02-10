<script setup lang="ts">
import imageUrl from '@/assets/images/bg_robots.png';
import HomeFavorites from '@/components/home/HomeFavorites.vue';
import HomeQuickAccess from '@/components/home/HomeQuickAccess.vue';

const backgroundStyles = computed(() => {
  return {
    // backgroundImage: `linear-gradient(rgba(0,0,0,.20),rgba(0,0,0,.20)), url('${imageUrl}')`,
    backgroundImage: `linear-gradient(rgba(255,255,255,0.1), rgba(255,255,255,0.1)), url('${imageUrl}')`,
    // backgroundImage: `url('${imageUrl}')`,
    // opacity: 0.4,
  };
});
</script>

<template>
  <!-- Home View   -->
  <div class="h-full">
    <div class="p-4 overflow-hidden">
      <div
        class="bg-blue-50 p-5 flex items-center h-44 rounded-xl overflow-hidden bg-center bg-cover"
        :style="backgroundStyles"
      >
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
    <div class="max-w-[75rem] mx-auto">
      <!-- Home Quick Access  -->
      <HomeQuickAccess />
      <!-- Home Favorites  -->
      <div class="px-20 py-10">
        <div class="space-y-10">
          <!-- Home Favorites  -->
          <HomeFavorites />
          <!-- Home Agent Templates  -->
          <!--
          <HomeAgentTemplates />
          -->
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
