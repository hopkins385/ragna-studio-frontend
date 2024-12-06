<script setup lang="ts">
import { useChatService } from '@/composables/services/useChatService';
import {
  useUserFavoriteService,
  type UserFavorite,
} from '@/composables/services/useUserFavoriteService';
import { MessageCircle, Star } from 'lucide-vue-next';
import { Button } from '../ui/button';

const myFavorites = ref<UserFavorite[]>();
const favoriteAssistants = computed(() => {
  return myFavorites.value?.filter(fav => fav.favoriteType === 'assistant');
});
const favoriteWorkflows = computed(() => {
  return myFavorites.value?.filter(fav => fav.favoriteType === 'workflow');
});

const router = useRouter();

const { fetchAllFavorites } = useUserFavoriteService();
const { createChat } = useChatService();

const onStartChat = async (assistantId: string) => {
  const { chat } = await createChat(assistantId);
  if (!chat) {
    return;
  }
  router.push({ name: 'chat.show', params: { id: chat.id } });
};

onMounted(async () => {
  const { favorites } = await fetchAllFavorites();
  myFavorites.value = favorites;
});
</script>

<template>
  <div class="p-4">
    <div class="pb-3 flex items-center space-x-2">
      <Star class="size-4 stroke-1.5" />
      <h2 class="text-sm font-semibold">{{ $t('favorites.title') }}</h2>
    </div>
    <div class="border-0 min-h-40 rounded-lg grid grid-cols-3 gap-4">
      <ul class="w-full space-y-3">
        <li
          v-for="fav in favoriteAssistants"
          :key="fav.favoriteId"
          class="p-4 border rounded-lg text-sm flex items-center justify-between min-h-20 bg-white hover:shadow-md cursor-pointer"
          @click="onStartChat(fav.favoriteId)"
        >
          <div class="overflow-hidden pr-5">
            <h3 class="truncate font-medium">
              {{ fav.detail?.title ?? 'Agent' }}
            </h3>
            <p class="text-xs opacity-75 truncate">
              {{ fav.detail?.description ?? 'Description' }}
            </p>
          </div>
          <Button variant="ghost" size="icon" class="shrink-0">
            <MessageCircle />
          </Button>
        </li>
      </ul>
      <ul class="w-full space-y-3">
        <li
          v-for="fav in favoriteWorkflows"
          :key="fav.favoriteId"
          class="p-4 border rounded-lg text-sm flex items-center justify-between min-h-20 bg-white"
        >
          <div class="overflow-hidden pr-5">
            <h3 class="truncate font-medium">
              {{ fav.detail?.name ?? 'Workflow' }}
            </h3>
            <p class="text-xs opacity-75 truncate">
              {{ fav.detail?.description ?? 'Description' }}
            </p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
