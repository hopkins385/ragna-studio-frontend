<script setup lang="ts">
import { useDateTime } from '@/composables/useDateTime';
import { useRagnaClient } from '@/composables/useRagnaClient';
import { RouteName } from '@/router/enums/route-names.enum';
import type { ChatsPaginatedResponse, PaginateParams } from '@hopkins385/ragna-sdk';
import { Button } from '@ui/button';
import { Separator } from '@ui/separator';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@ui/sheet';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@ui/tooltip';
import { History, SettingsIcon } from 'lucide-vue-next';

const groupByOptions = ['day', 'month', 'year'] as const;
type GroupByOption = (typeof groupByOptions)[number];

const data = ref<ChatsPaginatedResponse | null>(null);
const selectedGroupBy = ref<GroupByOption>('month');
const chats = computed(() => data.value?.chats || []);

const sheetIsOpen = ref(false);
const sheetDisplaySide = 'left';

const client = useRagnaClient();
const router = useRouter();

const initChatHistory = async ({ page, limit }: PaginateParams) => {
  data.value = await client.aiChat.fetchAllChatsPaginated({ page, limit });
};

const navigateToChat = (chatId: string) => {
  router.push({ name: RouteName.CHAT_SHOW, params: { id: chatId } });
};

const openSheet = () => {
  initChatHistory({ page: 1, limit: 20 });
  sheetIsOpen.value = true;
};

const { getDateForHumans } = useDateTime();

const groupedChats = computed(() => {
  const grouped = chats.value.reduce(
    (acc, chat) => {
      let key;

      switch (selectedGroupBy.value) {
        case 'month':
          key = chat.createdAt.substring(0, 7); // YYYY-MM
          break;
        case 'year':
          key = chat.createdAt.substring(0, 4); // YYYY
          break;
        case 'day':
        default:
          key = chat.createdAt.split('T')[0]; // YYYY-MM-DD
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
  const currentIndex = groupByOptions.indexOf(selectedGroupBy.value);
  const nextIndex = (currentIndex + 1) % groupByOptions.length;
  selectedGroupBy.value = groupByOptions[nextIndex];
};

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
  <Sheet v-model:open="sheetIsOpen" :modal="false">
    <SheetTrigger as-child>
      <TooltipProvider :delay-duration="300">
        <Tooltip>
          <TooltipTrigger as-child>
            <Button variant="outline" size="icon" class="group" @click="openSheet">
              <History class="size-4 stroke-1.5 group-hover:stroke-2" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p class="text-sm">{{ $t('chat.history.tooltip.show') }}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </SheetTrigger>
    <SheetContent
      @open-auto-focus="e => e.preventDefault()"
      :side="sheetDisplaySide"
      class="w-[300px] bg-white h-full !p-0"
    >
      <SheetHeader class="bg-stone-100 px-4 pt-4 pb-1">
        <SheetTitle class="pl-2">
          {{ $t('chat.history.title') }}
        </SheetTitle>
        <SheetDescription> </SheetDescription>
      </SheetHeader>
      <Separator />
      <div class="px-4 overflow-y-auto h-[calc(100%-4rem)] relative">
        <div class="absolute top-0 right-0 z-10 p-2">
          <Button variant="ghost" size="icon" class="group" @click="toggleGroupBy">
            <SettingsIcon class="size-4 stroke-1.5 group-hover:stroke-2 opacity-75" />
          </Button>
        </div>
        <div v-for="chatGroup in groupedChats" :key="chatGroup.date" class="mt-8">
          <div class="sticky top-0 bg-white">
            <div class="text-sm font-medium p-2">{{ chatGroup.date }}</div>
          </div>
          <ul class="space-y-0">
            <li
              v-for="chat in chatGroup.chats"
              :key="chat.id"
              class="border-0 cursor-pointer hover:bg-stone-200 p-2 rounded-lg truncate"
              :class="{
                // 'font-semibold ': chat.id === $route.params.id.toString(),
              }"
              @click="() => navigateToChat(chat.id)"
            >
              <span class="text-sm">{{ chat?.title }}</span>
            </li>
          </ul>
        </div>
      </div>
    </SheetContent>
  </Sheet>
</template>
