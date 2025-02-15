<script setup lang="ts">
// Imports
import { useConfirmDialog } from '@/composables/useConfirmDialog';
import { useErrorAlert } from '@/composables/useErrorAlert';
import ConfirmDialog from '@components/confirm/ConfirmDialog.vue';
import ErrorAlert from '@components/error/ErrorAlert.vue';
import PaginateControls from '@components/pagniate/PaginateControls.vue';
import { useMediaService } from '@composables/services/useMediaService';
import useForHumans from '@composables/useForHumans';
import useToast from '@composables/useToast';
import { useAuthStore } from '@stores/auth.store';
import { Button } from '@ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@ui/table';
import { FileIcon, Trash2Icon } from 'lucide-vue-next';
import TableMetaCaption from '../table/TableMetaCaption.vue';

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
const mediaData = ref<any | null>(null);
const showAddToCollectionDialog = ref(false);

// Composables
const toast = useToast();
const authStore = useAuthStore();
const { t } = useI18n();
const { fetchAllMediaFor, deleteMedia } = useMediaService();
const { getFileSizeForHumans } = useForHumans();
const { errorAlert, setErrorAlert, unsetErrorAlert } = useErrorAlert();
const { confirmDialog, setConfirmDialog } = useConfirmDialog();

// Computed

// Functions
const initMedia = async () => {
  if (!authStore.user?.id) return;
  const response = await fetchAllMediaFor(
    { id: authStore.user.id, type: 'user' },
    { page: props.page },
  );
  mediaData.value = response;
};

const medias = computed(() => mediaData.value?.medias || []);
const mediasLength = computed(() => medias.value.length);
const meta = computed(() => {
  return {
    totalCount: mediaData.value?.meta?.totalCount || 0,
    currentPage: mediaData.value?.meta?.currentPage || 0,
  };
});

function onEdit(id: string) {
  //
}

function onPlusClick(id: string) {
  showAddToCollectionDialog.value = true;
}

const handleDelete = async (mediaId: string) => {
  try {
    await deleteMedia(mediaId);
    await initMedia();
    toast.success({ description: t('media.delete.success') });
  } catch (error) {
    return setErrorAlert(error);
  }
};

function onDelete(mediaId: string) {
  setConfirmDialog({
    title: t('media.delete.confirm.title'),
    description: t('media.delete.confirm.description'),
    confirmButtonText: t('media.delete.confirm.submit'),
    onConfirm: () => handleDelete(mediaId),
  });
}

watch(
  () => props.refresh,
  async value => {
    if (value) {
      await initMedia();
      emits('update:refresh', false);
    }
  },
);

watch(
  () => props.page,
  async value => {
    await initMedia();
  },
);

// async function setPage(value: number) {
//   emits('update:page', value);
//   // await initMedia();
// }

onMounted(() => {
  initMedia();
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
