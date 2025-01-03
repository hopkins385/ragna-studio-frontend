<script setup lang="ts">
// const homeImageSrc = '@/assets/images/home.jpg&q=100&format=webp&imagetools';
import imageUrl from '@/assets/images/home2.jpg?q=100&format=webp&imagetools';
import HomeFavorites from '@/components/home/HomeFavorites.vue';
import HomeQuickAccess from '@/components/home/HomeQuickAccess.vue';
import { Bot, Workflow } from 'lucide-vue-next';

const backgroundStyles = computed(() => {
  return {
    // backgroundImage: `linear-gradient(rgba(0,0,0,.20),rgba(0,0,0,.20)), url('${imageUrl}')`,
    backgroundImage: `linear-gradient(rgba(255,255,255,0.3), rgba(255,255,255,0.3)), url('${imageUrl}')`,
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
        class="bg-blue-200 p-5 bg-center flex items-center h-44 rounded-xl overflow-hidde"
        :style="backgroundStyles"
      >
        <!-- Image Overlay -->
        <div
          class="hidden h-20 border-0 w-full flex items-center justify-center"
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
      <div class="space-y-4">
        <HomeFavorites />
        <div class="w-full border p-5 rounded-xl bg-white hidden">
          <div class="pb-3 flex space-x-2">
            <Bot class="size-4 stroke-1.5 mt-1" />
            <div>
              <h2 class="text-sm font-semibold">
                {{ $t('agents.template.title') }}
              </h2>
              <p class="text-xs opacity-75">
                {{ $t('agents.template.description') }}
              </p>
            </div>
          </div>
          <div class="grid grid-cols-3 gap-5">
            <div
              class="border w-full bg-white h-24 rounded-lg hover:shadow-md"
            ></div>
            <div
              class="border w-full bg-white h-24 rounded-lg hover:shadow-md"
            ></div>
            <div
              class="border w-full bg-white h-24 rounded-lg hover:shadow-md"
            ></div>
            <div
              class="border w-full bg-white h-24 rounded-lg hover:shadow-md"
            ></div>
            <div
              class="border w-full bg-white h-24 rounded-lg hover:shadow-md"
            ></div>
            <div
              class="border w-full bg-white h-24 rounded-lg hover:shadow-md"
            ></div>
            <div
              class="border w-full bg-white h-24 rounded-lg hover:shadow-md"
            ></div>
          </div>
        </div>
        <div class="w-full border p-5 rounded-2xl bg-white hidden">
          <div class="pb-3 flex space-x-2">
            <Workflow class="size-4 stroke-1.5 mt-1" />
            <div>
              <h2 class="text-sm font-semibold">
                {{ $t('workflows.template.title') }}
              </h2>
              <p class="text-xs opacity-75">
                {{ $t('workflows.template.description') }}
              </p>
            </div>
          </div>
          <div class="grid grid-cols-3 gap-5">
            <div
              class="border w-full bg-white h-24 rounded-lg hover:shadow-md"
            ></div>
            <div
              class="border w-full bg-white h-24 rounded-lg hover:shadow-md"
            ></div>
            <div
              class="border w-full bg-white h-24 rounded-lg hover:shadow-md"
            ></div>
            <div
              class="border w-full bg-white h-24 rounded-lg hover:shadow-md"
            ></div>
            <div
              class="border w-full bg-white h-24 rounded-lg hover:shadow-md"
            ></div>
            <div
              class="border w-full bg-white h-24 rounded-lg hover:shadow-md"
            ></div>
            <div
              class="border w-full bg-white h-24 rounded-lg hover:shadow-md"
            ></div>
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
