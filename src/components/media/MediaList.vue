<script setup lang="ts">
import ConfirmDialog from '@components/confirm/ConfirmDialog.vue';
import ErrorAlert from '@components/error/ErrorAlert.vue';
import PaginateControls from '@components/pagniate/PaginateControls.vue';
import { useMediaService } from '@composables/services/useMediaService';
import useForHumans from '@composables/useForHumans';
import useToast from '@composables/useToast';
import { useAuthStore } from '@stores/auth.store';
import { Button } from '@ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@ui/table';
import { FileIcon, Trash2Icon } from 'lucide-vue-next';
import TableMetaCaption from '../table/TableMetaCaption.vue';

const props = defineProps<{
  refresh: boolean;
  page: number;
}>();

const emits = defineEmits<{
  'update:refresh': [boolean];
  'update:page': [number];
}>();

const toast = useToast();
const authStore = useAuthStore();

const { fetchAllMediaFor, deleteMedia } = useMediaService();
const { getFileSizeForHumans } = useForHumans();

const showConfirmDialog = ref(false);
const showAddToCollectionDialog = ref(false);
const deleteMediaId = ref('');
const errorAlert = reactive({ show: false, message: '' });

const mediaData = ref<any | null>(null);

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

function onDelete(id: string) {
  deleteMediaId.value = id;
  showConfirmDialog.value = true;
}

function onPlusClick(id: string) {
  showAddToCollectionDialog.value = true;
}

function handleDelete() {
  const id = deleteMediaId.value;
  deleteMedia(id)
    .then(() => {
      deleteMediaId.value = '';
      toast.success({
        description: 'Media has been deleted successfully.',
      });
      initMedia();
    })
    .catch((error: any) => {
      errorAlert.show = true;
      errorAlert.message = error?.message;
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
    <ErrorAlert v-model="errorAlert.show" :message="errorAlert.message" />
    <ConfirmDialog v-model="showConfirmDialog" @confirm="handleDelete" />
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
          <TableCell class="font-semibold">{{ media.name }}</TableCell>
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
    <PaginateControls
      :page="page"
      :meta="meta"
      @update:page="value => $emit('update:page', value)"
    />
  </div>
</template>
