<script setup lang="ts">
// Imports
import ButtonLink from '@/common/components/button/ButtonLink.vue';
import { useConfirmDialog } from '@/composables/useConfirmDialog';
import { useErrorAlert } from '@/composables/useErrorAlert';
import { aiChatService } from '@/modules/ai-chat/services/ai-chat.service';
import { assistantService } from '@/modules/assistant/services/assistant.service';
import { userFavoriteService } from '@/modules/user-favorite/services/user-favorite.service';
import { RouteName } from '@/router/enums/route-names.enum';
import ConfirmDialog from '@components/confirm/ConfirmDialog.vue';
import ErrorAlert from '@components/error/ErrorAlert.vue';
import PaginateControls from '@components/pagniate/PaginateControls.vue';
import TableMetaCaption from '@components/table/TableMetaCaption.vue';
import { useProviderIcons } from '@composables/useProviderIcons';
import useToast from '@composables/useToast';
import { Button } from '@ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@ui/table';
import { MessageSquareIcon, SettingsIcon, StarIcon, Trash2Icon } from 'lucide-vue-next';

// Props
const props = defineProps<{
  limit?: number;
  search?: string;
}>();

// Emits
const emit = defineEmits<{
  newChat: [string];
}>();

// Refs
const data = ref();
const assistantFavorites = ref<any>([]); // TODO: type
const page = defineModel<number>('page');

// Composables
const router = useRouter();
const toast = useToast();
const { t } = useI18n();
const { getProviderIcon } = useProviderIcons();
const { errorAlert, setErrorAlert, unsetErrorAlert } = useErrorAlert();
const { confirmDialog, setConfirmDialog } = useConfirmDialog();

// Computed
const assistants = computed(() => data.value?.assistants || []);
const assistantsLength = computed(() => assistants.value.length);
const meta = computed(() => {
  return {
    totalCount: data.value?.meta?.totalCount || 0,
    currentPage: data.value?.meta?.currentPage || 0,
  };
});

// Functions
const initAllAssistants = async ({ page }: { page: number }) => {
  data.value = await assistantService.fetchAllAssistants({ page });
};

const handleDelete = async (assistantId: string) => {
  try {
    await assistantService.deleteAssistant(assistantId);
    await initAllAssistants({ page: page.value ?? 1 });
    toast.success({ description: t('assistant.delete.success') });
  } catch (error: unknown) {
    return setErrorAlert(error);
  }
};

const onStart = async (assistantId: string) => {
  const { chat } = await aiChatService.createChat({ assistantId });
  if (!chat) {
    return setErrorAlert('Failed to create chat');
  }
  emit('newChat', chat.id);
  router.push({ name: RouteName.CHAT_SHOW, params: { id: chat.id } });
};

const onDelete = (assistantId: string) => {
  unsetErrorAlert();
  setConfirmDialog({
    title: t('assistant.delete.confirm.title'),
    description: t('assistant.delete.confirm.description'),
    confirmButtonText: t('assistant.delete.confirm.submit'),
    onConfirm: () => handleDelete(assistantId),
  });
};

const onUpdatePage = async (currentPage: number) => {
  page.value = currentPage;
  await initAllAssistants({ page: currentPage });
};

watch(
  () => props.search,
  async value => {
    // setSearchQuery(value);
    throw new Error('Not implemented');
  },
);

// favorite
const onAddFavorite = async (assistantId: string) => {
  unsetErrorAlert();
  try {
    await userFavoriteService.addFavorite({ id: assistantId, type: 'assistant' });
    await initAssistantFavorites();
  } catch (error) {
    return setErrorAlert(error);
  }
};

const onDeleteFavorite = async (assistantId: string) => {
  unsetErrorAlert();
  const entityId = assistantFavorites.value.find((f: any) => f.favoriteId === assistantId).id;
  try {
    await userFavoriteService.deleteFavorite({ entityId, favoriteType: 'assistant' });
    await initAssistantFavorites();
  } catch (error) {
    return setErrorAlert(error);
  }
};

const initAssistantFavorites = async () => {
  const { favorites: all } = await userFavoriteService.fetchAllFavoritesByType('assistant');
  assistantFavorites.value = all;
};

await initAllAssistants({ page: page.value ?? 1 });
await initAssistantFavorites();

onBeforeUnmount(() => {
  assistantService.abortRequest();
});
</script>

<template>
  <div v-if="assistants && assistants.length > 0">
    <ErrorAlert v-model="errorAlert.open" :message="errorAlert.message" />
    <ConfirmDialog v-model="confirmDialog.open" v-bind="confirmDialog" />
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{{ $t('table.favorit') }}</TableHead>
          <TableHead>{{ $t('table.avatar') }}</TableHead>
          <TableHead>{{ $t('table.title') }}</TableHead>
          <TableHead class="whitespace-nowrap">
            {{ $t('table.ai_model') }}
          </TableHead>
          <TableHead class="text-right">{{ $t('table.actions') }}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="assistant in data?.assistants || []" :key="assistant.id">
          <TableCell class="w-12">
            <div class="border-0">
              <Button
                v-if="assistantFavorites.some((f: any) => f.favoriteId === assistant.id)"
                variant="ghost"
                size="icon"
                @click="() => onDeleteFavorite(assistant.id)"
              >
                <StarIcon class="!size-6 stroke-1.5 stroke-none fill-blue-500" />
              </Button>
              <Button v-else variant="ghost" size="icon" @click="() => onAddFavorite(assistant.id)">
                <StarIcon class="!size-5 stroke-1.5 stroke-stone-400" />
              </Button>
            </div>
          </TableCell>
          <TableCell>
            <div class="size-8 rounded-full bg-slate-200"></div>
          </TableCell>
          <TableCell class="">
            <div class="text-sm font-semibold">
              {{ assistant.title }}
            </div>
          </TableCell>
          <TableCell class="whitespace-nowrap">
            <div class="flex space-x-2 items-center">
              <component :is="getProviderIcon(assistant.llm.provider)" class="stroke-1.5 size-4" />
              <span>{{ assistant.llm.displayName }}</span>
            </div>
          </TableCell>
          <TableCell class="flex justify-end space-x-2 whitespace-nowrap text-right">
            <Button variant="outline" @click="() => onStart(assistant.id)">
              Chat
              <MessageSquareIcon class="ml-2 size-4 shrink-0 stroke-1.5 text-primary" />
            </Button>
            <ButtonLink
              v-if="$ability.can('edit', 'Assistant')"
              :to="`/assistant/${assistant.id}/edit`"
              variant="outline"
              size="icon"
            >
              <SettingsIcon class="size-4 stroke-1.5 text-primary" />
            </ButtonLink>
            <Button
              v-if="$ability.can('delete', 'Assistant')"
              variant="outline"
              size="icon"
              @click="onDelete(assistant.id)"
            >
              <Trash2Icon class="size-4 stroke-1.5 text-destructive" />
            </Button>
          </TableCell>
        </TableRow>
      </TableBody>
      <!-- Meta Caption -->
      <TableMetaCaption :itemsLength="assistantsLength" :meta="meta" />
    </Table>
  </div>
  <div class="pb-10">
    <!-- Pagination Controls -->
    <PaginateControls
      v-if="meta.totalCount > 10"
      :page="page || 1"
      :meta="meta"
      :limit="10"
      @update:page="onUpdatePage"
    />
  </div>
</template>
