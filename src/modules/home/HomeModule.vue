<script setup lang="ts">
import imageUrl from '@/assets/images/home8.jpg?q=100&imagetools';
import HomeEditImageDialog from '@/modules/home/components/HomeEditImageDialog.vue';
import HomeFavorites from './components/HomeFavorites.vue';
import HomeQuickAccess from './components/HomeQuickAccess.vue';

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
        class="bg-blue-50 p-5 flex items-center h-44 rounded-xl overflow-hidden bg-center bg-cover relative group"
        :style="backgroundStyles"
      >
        <div class="absolute bottom-2 right-2">
          <HomeEditImageDialog />
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

.glass {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}
</style>
