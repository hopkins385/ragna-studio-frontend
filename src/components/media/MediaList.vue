<script setup lang="ts">
import { useMediaService } from '@composables/services/useMediaService';
import useForHumans from '@composables/useForHumans';
import useToast from '@composables/useToast';
import { useAuthStore } from '@stores/auth.store';
import { FileIcon, Trash2Icon } from 'lucide-vue-next';
import PaginateControls from '@components/pagniate/PaginateControls.vue';
import ErrorAlert from '@components/error/ErrorAlert.vue';
import ConfirmDialog from '@components/confirm/ConfirmDialog.vue';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@ui/table';
import { Button } from '@ui/button';

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
      <TableCaption>
        Showing from
        {{ meta.totalCount > 10 ? meta.currentPage * 10 - 10 + 1 : 1 }}
        to
        {{
          meta.totalCount > 10
            ? meta.currentPage * 10 - 10 + medias.length
            : meta.totalCount
        }}
        of total
        {{ meta.totalCount }}
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead> File </TableHead>
          <TableHead> Name </TableHead>
          <TableHead> File Size </TableHead>
          <TableHead class="text-right"> Action </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="item in medias || []" :key="item.id">
          <TableCell>
            <div
              class="flex size-8 items-center justify-center truncate rounded-full"
            >
              <FileIcon class="size-4" />
            </div>
          </TableCell>
          <TableCell>{{ item.name }}</TableCell>
          <TableCell>
            {{ getFileSizeForHumans(item.fileSize) }}
          </TableCell>
          <TableCell class="space-x-2 text-right">
            <!-- Button variant="outline" size="icon" @click="onPlusClick(item.id)">
              <PlusIcon class="size-4" />
            </!-->
            <Button variant="outline" size="icon" @click="onDelete(item.id)">
              <Trash2Icon class="size-4 stroke-1.5 text-destructive" />
            </Button>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>

    <PaginateControls
      :page="page"
      :meta="meta"
      @update:page="value => $emit('update:page', value)"
    />
  </div>
</template>
