<script setup lang="ts">
import type { PaginateDto } from '@/common/interfaces/paginate.interface';
import { useDrawerStore } from '@/common/stores/drawer.store';
import useForHumans from '@/composables/useForHumans';
import {
  groupByOptions,
  useAiChatSettingsStore,
} from '@/modules/ai-chat-settings/stores/ai-chat-settings.store';
import type { GroupByOption } from '@/modules/ai-chat-settings/types/ai-chat-settings.type';
import type { ChatsPaginatedResponse } from '@/modules/ai-chat/interfaces/chat.interfaces';
import { aiChatService } from '@/modules/ai-chat/services/ai-chat.service';
import { RouteName } from '@/router/enums/route-names.enum';
import { Button } from '@ui/button';
import { Separator } from '@ui/separator';
import { CalendarIcon, XIcon } from 'lucide-vue-next';

const router = useRouter();
const drawer = useDrawerStore();
const chatSettings = useAiChatSettingsStore();

const data = ref<ChatsPaginatedResponse | null>(null);
const selectedGroupBy = ref<GroupByOption>(chatSettings.getHistoryGroupBy);
const chats = computed(() => data.value?.chats || []);

const initChatHistory = async ({ page, limit }: PaginateDto) => {
  data.value = await aiChatService.fetchAllChatsPaginated({ page, limit });
};

const { getDateForHumans } = useForHumans();

const groupedChats = computed(() => {
  const grouped = chats.value.reduce(
    (acc, chat) => {
      let key;

      switch (selectedGroupBy.value) {
        case 'month':
          key = chat.updatedAt.substring(0, 7); // YYYY-MM
          break;
        case 'year':
          key = chat.updatedAt.substring(0, 4); // YYYY
          break;
        case 'day':
        default:
          key = chat.updatedAt.split('T')[0]; // YYYY-MM-DD
      }

      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(chat);
      return acc;
    },
    {} as Record<string, ChatsPaginatedResponse['chats']>,
  );

  return Object.entries(grouped).map(([date, chats]) => ({
    date: getDateForHumans(date, {
      year: selectedGroupBy.value === 'year' ? 'numeric' : undefined,
      month: selectedGroupBy.value === 'year' ? undefined : 'long',
      day: selectedGroupBy.value === 'day' ? 'numeric' : undefined,
    }),
    chats,
  }));
});

const toggleGroupBy = () => {
  const currentIndex = groupByOptions.indexOf(selectedGroupBy.value ?? 'day');
  const nextIndex = (currentIndex + 1) % groupByOptions.length;
  selectedGroupBy.value = groupByOptions[nextIndex];
  chatSettings.setHistoryGroupBy(selectedGroupBy.value);
};

// watch route changes and if the route changes away from anything different than the chat show path, close the drawer
watch(
  () => router.currentRoute.value.name?.toString(),
  name => {
    if (!name?.startsWith(RouteName.CHAT_SHOW)) {
      drawer.hide();
    }
  },
  { immediate: true },
);

onMounted(() => {
  initChatHistory({ page: 1, limit: 60 });
});

/*
Example API response
        {
            "id": "hsv7o7obfgx4drjob85nzpz8",
            "title": "Chat",
            "createdAt": "2024-12-30T12:12:53.694Z",
            "updatedAt": "2024-12-30T12:12:53.694Z",
            "assistant": {
                "id": "or83svu5u799yu7uw2up8ag1",
                "title": "Project Assistant",
                "llm": {
                    "provider": "anthropic",
                    "displayName": "Claude 3.5 Sonnet"
                }
            }
        },
*/
</script>

<template>
  <div class="">
    <div class="py-2 flex justify-between items-center">
      <h1 class="">
        {{ $t('chat.history.title') }}
      </h1>
      <div class="flex items-center">
        <Button variant="ghost" size="icon" class="group" @click="toggleGroupBy">
          <CalendarIcon class="size-4 stroke-1.5 group-hover:stroke-2 opacity-75" />
        </Button>
        <Button variant="ghost" size="icon" class="group" @click="() => drawer.hide()">
          <XIcon class="size-4 stroke-2 group-hover:stroke-2 opacity-75" />
        </Button>
      </div>
    </div>
    <Separator />
    <div class="relative">
      <div v-for="chatGroup in groupedChats" :key="chatGroup.date" class="my-6 rounded-lg">
        <div class="sticky top-0">
          <div class="text-sm font-semibold py-2 bg-primary-foreground">
            {{ chatGroup.date }}
          </div>
        </div>
        <ul>
          <li v-for="chat in chatGroup.chats" :key="chat.id">
            <router-link
              :title="chat.title"
              :to="{ name: RouteName.CHAT_SHOW, params: { id: chat.id } }"
              class="cursor-pointer hover:bg-stone-200 rounded-lg block p-2 truncate"
              :class="{
                'font-semibold bg-stone-200': chat.id === $route.params.id?.toString(),
              }"
            >
              <span class="text-sm">{{ chat.title }}</span>
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
