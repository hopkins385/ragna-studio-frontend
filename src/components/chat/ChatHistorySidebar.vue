<script setup lang="ts">
import { Button } from '@ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@ui/tooltip';
import { History } from 'lucide-vue-next';

import {
  useChatService,
  type ChatsPaginated,
} from '@/composables/services/useChatService';
import { RouteName } from '@/router/enums/route-names.enum';
import { Separator } from '@ui/separator';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@ui/sheet';

const data = ref<ChatsPaginated | null>(null);
const chats = computed(() => data.value?.chats || []);

const sheetIsOpen = ref(false);
const sheetDisplaySide = 'left';

const router = useRouter();

// const chatSettingStore = useChatSettingsStore();

const { fetchAllChatsPaginated } = useChatService();

const openSheet = () => {
  sheetIsOpen.value = true;
  // chatSettingStore.setHistorySideBarOpen(true);
  initChatHistory({ page: 1, limit: 20 });
};

const initChatHistory = async ({
  page,
  limit,
}: {
  page: number;
  limit: number;
}) => {
  data.value = await fetchAllChatsPaginated({ page, limit });
};

const navigateToChat = (chatId: string) => {
  router.push({ name: RouteName.CHAT_SHOW, params: { id: chatId } });
};
</script>

<template>
  <Sheet v-model:open="sheetIsOpen" :modal="false">
    <SheetTrigger as-child>
      <TooltipProvider :delay-duration="300">
        <Tooltip>
          <TooltipTrigger as-child>
            <Button
              variant="outline"
              size="icon"
              class="group"
              @click="openSheet"
            >
              <History class="size-4 stroke-1.5 group-hover:stroke-2" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p class="text-sm">History</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </SheetTrigger>
    <SheetContent
      @open-auto-focus="e => e.preventDefault()"
      :side="sheetDisplaySide"
      class="w-[300px] bg-white h-full overflow-y-auto !p-0"
    >
      <SheetHeader class="sticky top-0 bg-stone-100 px-4 pt-4 pb-1">
        <SheetTitle class="pl-2"> Chat History </SheetTitle>
        <SheetDescription> </SheetDescription>
      </SheetHeader>
      <Separator />
      <div class="px-4 pt-2">
        <ul class="space-y-0">
          <li
            v-for="chat in chats"
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
    </SheetContent>
  </Sheet>
</template>
