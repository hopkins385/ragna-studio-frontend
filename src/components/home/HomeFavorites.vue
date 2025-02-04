<script setup lang="ts">
import { useChatService } from '@/composables/services/useChatService';
import {
  useUserFavoriteService,
  type UserFavorite,
} from '@/composables/services/useUserFavoriteService';
import { RouteName } from '@/router/enums/route-names.enum';
import { Star } from 'lucide-vue-next';

/*
Example of the response from the fetchAllFavorites method:
{
    "favorites": [
        {
            "id": "wgvctinqjptokgf3eq1247fv",
            "favoriteId": "or83svu5u799yu7uw2up8ag1",
            "favoriteType": "assistant",
            "detail": {
                "id": "or83svu5u799yu7uw2up8ag1",
                "title": "Project Assistant",
                "description": "The assistant"
            }
        },
        {
            "id": "khaxvv3i80b2vuc32ft7h5bg",
            "favoriteId": "zx0f3xbdpmoly8dhhijspaug",
            "favoriteType": "assistant",
            "detail": {
                "id": "zx0f3xbdpmoly8dhhijspaug",
                "title": "Velit eligendi totam",
                "description": "Fuga Quasi quo volu"
            }
        },
        {
            "id": "i7ajvre5ctwgu3lk3hhw34ei",
            "favoriteId": "gt2qyyrzo8r9280c9dkiavjz",
            "favoriteType": "assistant",
            "detail": {
                "id": "gt2qyyrzo8r9280c9dkiavjz",
                "title": "Gemini",
                "description": "Gemini"
            }
        }
    ]
}
*/

const myFavorites = ref<UserFavorite[]>();
const favoriteAssistants = computed(() => {
  return (
    myFavorites.value
      ?.filter(fav => fav.favoriteType === 'assistant')
      .map(fav => fav.detail) ?? []
  );
});
const hasFavoriteAssistants = computed(
  () => favoriteAssistants.value.length > 0,
);
const favoriteWorkflows = computed(() => {
  return (
    myFavorites.value
      ?.filter(fav => fav.favoriteType === 'workflow')
      .map(fav => fav.detail) ?? []
  );
});
const hasFavoriteWorkflows = false; // computed(() => favoriteWorkflows.value.length > 0);

const router = useRouter();

const { fetchAllFavorites } = useUserFavoriteService();
const { createChat } = useChatService();

const onStartChat = async (assistantId: string) => {
  try {
    const { chat } = await createChat(assistantId);
    if (!chat) {
      return;
    }
    router.push({ name: RouteName.CHAT_SHOW, params: { id: chat.id } });
  } catch (error) {
    console.error(error);
  }
};

onMounted(async () => {
  const { favorites } = await fetchAllFavorites();
  myFavorites.value = favorites;
});
</script>

<template>
  <div class="flex flex-col">
    <div v-if="hasFavoriteAssistants" class="rounded-xl w-full">
      <div class="pb-4 flex items-center space-x-2">
        <Star class="size-5 stroke-1.5" />
        <h2 class="text-2xl font-semibold">
          {{ $t('favorites.title') }}
        </h2>
      </div>
      <div class="overflow-hidden w-full relative">
        <!--
        <div
          id="endGradient"
          class="absolute right-0 top-0 w-2 h-full bg-gradient-to-l from-white/80 to-transparent"
        ></div>
        -->
        <div class="flex flex-wrap gap-4 pb-4">
          <div
            v-for="fav in favoriteAssistants"
            :key="fav.id"
            class="border shrink-0 rounded-2xl w-80 h-40 p-4 flex space-x-2 hover:shadow-md"
          >
            <div class="py-1 flex flex-col justify-between w-52">
              <div class="space-y-1">
                <p class="text-sm font-medium truncate">{{ fav?.title }}</p>
                <p class="text-xs truncate">{{ fav?.description }}</p>
              </div>
              <div>
                <button
                  @click="() => onStartChat(fav.id)"
                  class="text-xs border px-2 py-1 rounded-lg hover:bg-stone-200"
                >
                  {{ $t('chat.button.start') }}
                </button>
              </div>
            </div>
          </div>
        </div>
        <!--
        <AssistantFavoritesTable
          :assistants="favoriteAssistants"
          @start-chat="onStartChat"
        />
        -->
      </div>
    </div>
    <div v-if="hasFavoriteWorkflows" class="rounded-xl w-full p-6">
      <div class="pb-4 flex items-center space-x-2">
        <Star class="size-6 stroke-1.5" />
        <h2 class="text-2xl font-semibold">
          {{ $t('favorites.title') }}
        </h2>
      </div>
      <div class="overflow-hidden w-full relative">
        <div
          id="endGradient"
          class="absolute right-0 top-0 w-2 h-full bg-gradient-to-l from-white/80 to-transparent"
        ></div>
        <div class="flex space-x-2 overflow-x-auto no-scrollbar w-full">
          <div
            v-for="fav in favoriteAssistants"
            :key="fav.id"
            class="bg-stone-50 shrink-0 rounded-2xl w-96 h-36 p-4 flex space-x-2"
          >
            <div>
              <div class="rounded-xl h-full w-24 bg-stone-200/50"></div>
            </div>
            <div class="py-1 flex flex-col justify-between w-36">
              <div class="space-y-1">
                <p class="text-sm font-medium truncate">{{ fav?.title }}</p>
                <p class="text-xs truncate">{{ fav?.description }}</p>
              </div>
              <div>
                <button
                  @click="() => onStartChat(fav.id)"
                  class="text-xs border px-2 py-1 rounded-lg hover:shadow-md"
                >
                  {{ $t('chat.button.start') }}
                </button>
              </div>
            </div>
          </div>
        </div>
        <!--
        <AssistantFavoritesTable
          :assistants="favoriteAssistants"
          @start-chat="onStartChat"
        />
        -->
      </div>
    </div>
  </div>
  <!--
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
    -->
</template>
