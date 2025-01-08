<script setup lang="ts">
import ErrorAlert from '@components/error/ErrorAlert.vue';
import PaginateControls from '@components/pagniate/PaginateControls.vue';
import TableMetaCaption from '@components/table/TableMetaCaption.vue';
import { useMediaService } from '@composables/services/useMediaService';
import { useRecordService } from '@composables/services/useRecordService';
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
import { CheckIcon, FileIcon, Loader2Icon, PlusIcon } from 'lucide-vue-next';

interface IMediaData {
  medias: any[];
  meta: {
    totalCount: number;
    currentPage: number;
  };
}

const props = defineProps<{
  collectionId: string | undefined;
}>();

const emits = defineEmits<{
  success: [void];
}>();

const { fetchAll, createRecord } = useRecordService();
const { fetchAllMediaFor } = useMediaService();
const { getFileSizeForHumans } = useForHumans();

const toast = useToast();
const authStore = useAuthStore();

const page = ref(1);

const errorAlert = reactive({ show: false, message: '' });
const pendingUpdateId = ref<string | null>(null);

const mediaData = reactive<IMediaData>({
  medias: [],
  meta: {
    totalCount: 0,
    currentPage: 0,
  },
});

const allRecords = ref<any[]>([]);

const allRecordsMediaIds = computed(() => {
  return allRecords.value.map(record => record.media.id);
});

const initAllRecords = async () => {
  if (!props.collectionId) {
    throw new Error('Collection ID is required');
  }

  const data = await fetchAll({
    collectionId: props.collectionId.toString(),
  });

  allRecords.value = data.records;
};

const initMedia = async () => {
  if (!authStore.user?.id) {
    throw new Error('User ID is required');
  }
  const userModel = {
    id: authStore.user.id,
    type: 'user',
  };
  const data = await fetchAllMediaFor(userModel, {
    page: page.value,
  });

  mediaData.medias = data.medias;
  mediaData.meta = {
    totalCount: data.meta.totalCount,
    currentPage: data.meta.currentPage,
  };
};

async function onAdd(id: string) {
  if (!props.collectionId) {
    throw new Error('Collection ID is required');
  }
  pendingUpdateId.value = id;
  errorAlert.show = false;
  try {
    await createRecord({
      collectionId: props.collectionId.toString(),
      mediaId: id,
    });
    pendingUpdateId.value = null;
    toast.success({ description: 'Record created successfully' });
    emits('success');
    await initAllRecords();
  } catch (error: any) {
    pendingUpdateId.value = null;
    errorAlert.show = true;
    errorAlert.message = error?.message || 'An error occurred';
  }
}

function setPage(newPage: number) {
  page.value = newPage;
}

watch(page, async () => {
  await initMedia();
});

onMounted(async () => {
  await initAllRecords();
  await initMedia();
});
</script>

<template>
  <div>
    <ErrorAlert v-model="errorAlert.show" :message="errorAlert.message" />

    <Table class="rounded-lg border bg-white">
      <TableHeader>
        <TableRow>
          <TableHead>{{ $t('table.file') }}</TableHead>
          <TableHead>{{ $t('table.name') }}</TableHead>
          <TableHead>{{ $t('table.file_size') }}</TableHead>
          <TableHead class="text-right">{{ $t('table.actions') }}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="media in mediaData.medias || []" :key="media.id">
          <TableCell>
            <div
              class="flex size-8 items-center justify-center truncate rounded-full"
            >
              <FileIcon class="size-4" />
            </div>
          </TableCell>
          <TableCell class="truncate max-w-sm">{{ media.name }}</TableCell>
          <TableCell>
            {{ getFileSizeForHumans(media.fileSize) }}
          </TableCell>
          <TableCell class="space-x-2 text-right">
            <Button
              variant="outline"
              size="icon"
              :disabled="
                pendingUpdateId == media.id ||
                allRecordsMediaIds.includes(media.id)
              "
              @click="onAdd(media.id)"
            >
              <span v-if="pendingUpdateId == media.id" class="animate-spin">
                <Loader2Icon class="size-4" />
              </span>
              <span v-else>
                <CheckIcon
                  v-if="allRecordsMediaIds.includes(media.id)"
                  class="size-4"
                />
                <PlusIcon v-else class="size-4" />
              </span>
            </Button>
          </TableCell>
        </TableRow>
      </TableBody>
      <!-- Meta Caption -->
      <TableMetaCaption
        :itemsLength="mediaData.medias.length"
        :meta="mediaData.meta"
      />
    </Table>
    <!-- Pagination Controls -->
    <PaginateControls
      :page="page"
      :meta="mediaData.meta"
      @update:page="setPage"
    />
  </div>
</template>
