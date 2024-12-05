<script setup lang="ts">
import {
  useUserFavoriteService,
  type UserFavorite,
} from '@/composables/services/useUserFavoriteService';

const myFavorites = ref<UserFavorite[]>();
const favoriteAssistants = computed(() => {
  return myFavorites.value?.filter(fav => fav.favoriteType === 'assistant');
});
const favoriteWorkflows = computed(() => {
  return myFavorites.value?.filter(fav => fav.favoriteType === 'workflow');
});

const { fetchAllFavorites } = useUserFavoriteService();

onMounted(async () => {
  const { favorites } = await fetchAllFavorites();
  myFavorites.value = favorites;
});
</script>

<template>
  <div class="p-4">
    <div class="pb-3">
      <h2 class="text-sm font-semibold">My Favorites</h2>
    </div>
    <div class="border h-40 rounded-lg bg-white flex">
      <ul class="w-60 p-2 space-y-3">
        <li
          v-for="fav in favoriteAssistants"
          :key="fav.favoriteId"
          class="p-2 border rounded-lg text-sm"
        >
          {{ fav.detail?.title ?? 'Agent' }}
        </li>
      </ul>
      <ul class="w-60 p-2 space-y-3">
        <li
          v-for="fav in favoriteWorkflows"
          :key="fav.favoriteId"
          class="p-2 border rounded-lg text-sm"
        >
          {{ fav.detail?.name ?? 'Workflow' }}
        </li>
      </ul>
    </div>
  </div>
</template>
