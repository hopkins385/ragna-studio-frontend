<script setup lang="ts">
// Imports
import TableMetaCaption from '@/components/table/TableMetaCaption.vue';
import { useConfirmDialog } from '@/composables/useConfirmDialog';
import { useErrorAlert } from '@/composables/useErrorAlert';
import { useRagnaClient } from '@/composables/useRagnaClient';
import { useAuthStore } from '@/modules/auth/stores/auth.store';
import { getFileSizeForHumans } from '@/utils/file-size.util';
import ConfirmDialog from '@components/confirm/ConfirmDialog.vue';
import ErrorAlert from '@components/error/ErrorAlert.vue';
import PaginateControls from '@components/pagniate/PaginateControls.vue';
import useToast from '@composables/useToast';
import { Button } from '@ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@ui/table';
import { FileIcon, Trash2Icon } from 'lucide-vue-next';

// Props
const props = defineProps<{
  refresh: boolean;
  page: number;
}>();

// Emits
const emits = defineEmits<{
  'update:refresh': [boolean];
  'update:page': [number];
}>();

// Refs
const mediaData = shallowRef<any | null>(null);
const showAddToCollectionDialog = ref(false);

// Composables
const client = useRagnaClient();
const toast = useToast();
const authStore = useAuthStore();
const { errorAlert, setErrorAlert } = useErrorAlert();
const { confirmDialog, setConfirmDialog } = useConfirmDialog();

// Computed
const medias = computed(() => mediaData.value?.medias || []);
const mediasLength = computed(() => medias.value.length);
const meta = computed(() => {
  return {
    totalCount: mediaData.value?.meta?.totalCount || 0,
    currentPage: mediaData.value?.meta?.currentPage || 0,
  };
});

// Functions
const initMedia = async (payload: { page: number }) => {
  if (!authStore.user?.activeTeamId) {
    setErrorAlert({
      title: 'media.error.no_team',
      description: 'media.error.no_team_description',
    });
    return;
  }
  const model = { id: authStore.user.activeTeamId, type: 'team' };
  console.log('model', model);
  const response = await client.media.fetchAllMediaFor(model, { page: payload.page });
  mediaData.value = response;
};

function onEdit(id: string) {
  //
}

function onPlusClick(id: string) {
  showAddToCollectionDialog.value = true;
}

const handleDelete = async (mediaId: string) => {
  try {
    await client.media.deleteMedia(mediaId);
    await initMedia({ page: props.page });
    toast.success({ description: 'media.delete.success' });
  } catch (error: unknown) {
    return setErrorAlert(error);
  }
};

function onDelete(mediaId: string) {
  setConfirmDialog({
    title: 'media.delete.confirm.title',
    description: 'media.delete.confirm.description',
    confirmButtonText: 'media.delete.confirm.submit',
    onConfirm: () => handleDelete(mediaId),
  });
}

watch(
  () => props.refresh,
  async value => {
    if (value) {
      await initMedia({ page: props.page });
      emits('update:refresh', false);
    }
  },
);

watchEffect(async () => {
  await initMedia({ page: props.page });
});
</script>

<template>
  <div>
    <ErrorAlert v-model="errorAlert.open" v-bind="errorAlert" />
    <ConfirmDialog v-model="confirmDialog.open" v-bind="confirmDialog" />
    <RecordAddFileDialog v-model="showAddToCollectionDialog" />

    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{{ $t('table.file') }}</TableHead>
          <TableHead>{{ $t('table.name') }}</TableHead>
          <TableHead>{{ $t('table.file_size') }}</TableHead>
          <TableHead class="text-right">{{ $t('table.actions') }}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="media in medias || []" :key="media.id">
          <TableCell class="w-12">
            <div class="flex items-center justify-center">
              <FileIcon class="size-4 stroke-1.5" />
            </div>
          </TableCell>
          <TableCell class="max-w-sm truncate font-semibold">
            {{ decodeURIComponent(media.name) }}
          </TableCell>
          <TableCell>
            {{ getFileSizeForHumans(media.fileSize) }}
          </TableCell>
          <TableCell class="space-x-2 text-right">
            <!-- Button variant="outline" size="icon" @click="onPlusClick(item.id)">
              <PlusIcon class="size-4" />
            </!-->
            <Button variant="outline" size="icon" @click="onDelete(media.id)">
              <Trash2Icon class="size-4 stroke-1.5 text-destructive" />
            </Button>
          </TableCell>
        </TableRow>
      </TableBody>
      <!-- Meta Caption -->
      <TableMetaCaption :itemsLength="mediasLength" :meta="meta" />
    </Table>
    <!-- Pagination Controls -->
    <div class="pb-10">
      <PaginateControls
        :page="page"
        :meta="meta"
        @update:page="value => $emit('update:page', value)"
      />
    </div>
  </div>
</template>
