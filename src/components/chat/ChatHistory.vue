<script setup lang="ts">
import { useProviderIcons } from '@/composables/useProviderIcons';
import useToast from '@/composables/useToast';
import ButtonLink from '@components/button/ButtonLink.vue';
import ConfirmDialog from '@components/confirm/ConfirmDialog.vue';
import ErrorAlert from '@components/error/ErrorAlert.vue';
import PaginateControls from '@components/pagniate/PaginateControls.vue';
import TableMetaCaption from '@components/table/TableMetaCaption.vue';
import {
  useChatService,
  type ChatsPaginated,
} from '@composables/services/useChatService';
import useForHumans from '@composables/useForHumans';
import { Button } from '@ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@ui/table';
import {
  MessageCircleMoreIcon,
  MessagesSquareIcon,
  Trash2Icon,
} from 'lucide-vue-next';

interface ChatHistoryProps {
  page: number;
  limit?: number;
  search?: string;
}

interface ChatHistoryEmits {
  'update:page': [number];
}

const props = defineProps<ChatHistoryProps>();
const emit = defineEmits<ChatHistoryEmits>();

const data = ref<ChatsPaginated | null>(null);

const { success } = useToast();
const { getDateTimeForHumans } = useForHumans();
const { fetchAllChatsPaginated, deleteChat } = useChatService();
const { getProviderIcon } = useProviderIcons();

const queryPage = computed(() => props.page || 1);

const chats = computed(() => data.value?.chats || []);
const chatsLength = computed(() => chats.value.length);
const meta = computed(() => {
  return {
    totalCount: data.value?.meta?.totalCount || 0,
    currentPage: data.value?.meta?.currentPage || 0,
  };
});

const errorAlert = reactive({
  show: false,
  message: '',
});
const showConfirmDialog = ref(false);
const chatIdToDelete = ref('');

const initChatHistory = async ({ page }: { page: number }) => {
  try {
    data.value = await fetchAllChatsPaginated({ page });
  } catch (error: any) {
    errorAlert.show = true;
    errorAlert.message = error?.message ?? 'Unknown error occurred';
  }
};

function onDelete(chatId: string) {
  showConfirmDialog.value = true;
  chatIdToDelete.value = chatId;
}

async function handleDelete() {
  showConfirmDialog.value = false;
  try {
    const result = await deleteChat(chatIdToDelete.value);
    success({ description: 'Chat deleted' });
  } catch (error: any) {
    errorAlert.show = true;
    errorAlert.message = error?.message ?? 'Unknown error occurred';
  }
  chatIdToDelete.value = '';
  await initChatHistory({ page: props.page });
}

const updatePage = async (value: number) => {
  emit('update:page', value);
  await initChatHistory({ page: value });
};

watch(
  () => props.search,
  value => {
    throw new Error('Not implemented');
    // setSearchQuery(value);
  },
);

await initChatHistory({ page: queryPage.value });
</script>

<template>
  <div v-if="chats.length > 0">
    <ErrorAlert v-model="errorAlert.show" :message="errorAlert.message" />
    <ConfirmDialog v-model="showConfirmDialog" @confirm="handleDelete" />
    <div class="mb-4 rounded-xl p-10">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead></TableHead>
            <TableHead>{{ $t('table.title') }}</TableHead>
            <TableHead>{{ $t('table.assistant') }}</TableHead>
            <TableHead>{{ $t('table.ai_model') }}</TableHead>
            <TableHead>{{ $t('table.updated_at') }}</TableHead>
            <TableHead class="text-right">{{ $t('table.actions') }}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="chat in data?.chats || []" :key="chat.id">
            <TableCell class="w-12">
              <MessagesSquareIcon class="size-4 stroke-1.5" />
            </TableCell>
            <TableCell class="min-w-[20rem] font-semibold">
              {{ chat.title }}
            </TableCell>
            <TableCell class="max-w-[10rem] truncate">
              {{ chat.assistant?.title }}
            </TableCell>
            <TableCell>
              <div class="flex items-center space-x-2">
                <div class="" v-if="chat.assistant?.llm.provider">
                  <component
                    :is="getProviderIcon(chat.assistant?.llm.provider)"
                    class="size-4 text-slate-500"
                  />
                </div>
                <span>{{ chat.assistant?.llm.displayName }}</span>
              </div>
            </TableCell>
            <TableCell>
              {{ getDateTimeForHumans(chat.updatedAt) }}
            </TableCell>
            <TableCell class="space-x-2 whitespace-nowrap text-right">
              <ButtonLink
                :to="`/chat/${chat.id}`"
                class="group"
                variant="outline"
                size="icon"
              >
                <MessageCircleMoreIcon class="size-4 stroke-1.5 text-primary" />
              </ButtonLink>
              <Button
                variant="outline"
                size="icon"
                class="group"
                @click="onDelete(chat.id)"
              >
                <Trash2Icon
                  class="size-4 stroke-1.5 text-destructive group-hover:stroke-1.5"
                />
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
        <!-- Meta Caption -->
        <TableMetaCaption :itemsLength="chatsLength" :meta="meta" />
      </Table>
    </div>
    <!-- Pagination Controls -->
    <PaginateControls :page="page" :meta="meta" @update:page="updatePage" />
  </div>
  <div v-else class="w-full rounded-lg border p-10">
    <div class="">No chats found</div>
  </div>
</template>
