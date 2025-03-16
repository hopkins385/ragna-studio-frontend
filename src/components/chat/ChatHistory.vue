<script setup lang="ts">
// Imports
import { useConfirmDialog } from '@/composables/useConfirmDialog';
import { useErrorAlert } from '@/composables/useErrorAlert';
import { useProviderIcons } from '@/composables/useProviderIcons';
import useToast from '@/composables/useToast';
import type { ChatsPaginatedResponse } from '@/modules/ai-chat/interfaces/chat.interfaces';
import { aiChatService } from '@/modules/ai-chat/services/ai-chat.service';
import ButtonLink from '@components/button/ButtonLink.vue';
import ConfirmDialog from '@components/confirm/ConfirmDialog.vue';
import ErrorAlert from '@components/error/ErrorAlert.vue';
import PaginateControls from '@components/pagniate/PaginateControls.vue';
import TableMetaCaption from '@components/table/TableMetaCaption.vue';
import useForHumans from '@composables/useForHumans';
import { Button } from '@ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@ui/table';
import { MessageCircleMoreIcon, MessagesSquareIcon, Trash2Icon } from 'lucide-vue-next';

// Props
const props = defineProps<{
  page: number;
  limit?: number;
  search?: string;
}>();

// Emits
const emit = defineEmits<{
  'update:page': [number];
}>();

// Refs
const data = ref<ChatsPaginatedResponse | null>(null);

// Composables
const toast = useToast();
const { t } = useI18n();
const { getDateTimeForHumans } = useForHumans();
const { getProviderIcon } = useProviderIcons();
const { errorAlert, setErrorAlert, unsetErrorAlert } = useErrorAlert();
const { confirmDialog, setConfirmDialog } = useConfirmDialog();

// Computed
const queryPage = computed(() => props.page || 1);
const chats = computed(() => data.value?.chats || []);
const chatsLength = computed(() => chats.value.length);
const meta = computed(() => {
  return {
    totalCount: data.value?.meta?.totalCount || 0,
    currentPage: data.value?.meta?.currentPage || 0,
  };
});

// Functions
const initChatHistory = async ({ page }: { page: number }) => {
  try {
    data.value = await aiChatService.fetchAllChatsPaginated({ page });
  } catch (error) {
    return setErrorAlert(error);
  }
};

const handleDelete = async (chatId: string) => {
  try {
    await aiChatService.deleteChat(chatId);
    await initChatHistory({ page: props.page });
    toast.success({ description: t('chat.delete.success') });
  } catch (error) {
    return setErrorAlert(error);
  }
};

function onDelete(chatId: string) {
  unsetErrorAlert();
  setConfirmDialog({
    title: t('chat.delete.confirm.title'),
    description: t('chat.delete.confirm.description'),
    confirmButtonText: t('chat.delete.confirm.submit'),
    onConfirm: () => handleDelete(chatId),
  });
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
    <ErrorAlert v-model="errorAlert.open" :message="errorAlert.message" />
    <ConfirmDialog v-model="confirmDialog.open" v-bind="confirmDialog" />
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
            <ButtonLink :to="`/chat/${chat.id}`" class="group" variant="outline" size="icon">
              <MessageCircleMoreIcon class="size-4 stroke-1.5 text-primary" />
            </ButtonLink>
            <Button variant="outline" size="icon" class="group" @click="onDelete(chat.id)">
              <Trash2Icon class="size-4 stroke-1.5 text-destructive group-hover:stroke-1.5" />
            </Button>
          </TableCell>
        </TableRow>
      </TableBody>
      <!-- Meta Caption -->
      <TableMetaCaption :itemsLength="chatsLength" :meta="meta" />
    </Table>
    <div class="pb-10">
      <!-- Pagination Controls -->
      <PaginateControls :page="page" :meta="meta" @update:page="updatePage" />
    </div>
  </div>
  <div v-else class="w-full rounded-lg border p-10">
    <div class="">No chats found</div>
  </div>
</template>
