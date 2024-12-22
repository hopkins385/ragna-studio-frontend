<script setup lang="ts">
import ErrorAlert from '@components/error/ErrorAlert.vue';
import PaginateControls from '@components/pagniate/PaginateControls.vue';
import TableMetaCaption from '@components/table/TableMetaCaption.vue';
import { useMediaService } from '@composables/services/useMediaService';
import {
  useRecordService,
  type RecordsPaginatedResponse,
} from '@composables/services/useRecordService';
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

const props = defineProps<{
  collectionId: string | undefined;
}>();

const emits = defineEmits<{
  success: [void];
}>();

const { fetchAllPaginated, createRecord } = useRecordService();
const { fetchAllMediaFor } = useMediaService();
const { getFileSizeForHumans } = useForHumans();

const toast = useToast();
const authStore = useAuthStore();

const page = ref(1);

const errorAlert = reactive({ show: false, message: '' });
const pendingUpdateId = ref<string | null>(null);

const mediaData = ref<any | null>(null);

const medias = computed(() => mediaData.value?.medias || []);
const meta = computed(() => {
  return {
    totalCount: mediaData.value?.meta?.totalCount || 0,
    currentPage: mediaData.value?.meta?.currentPage || 0,
  };
});

const recordData = ref<RecordsPaginatedResponse | null>(null);

const records = computed(() => recordData.value?.records || []);
const recordsLength = computed(() => records.value.length);
const recordsMeta = computed(() => {
  return {
    totalCount: recordData.value?.meta?.totalCount || 0,
    currentPage: recordData.value?.meta?.currentPage || 0,
  };
});

const mediaIds = computed(
  () => records.value?.map(record => record.media?.id) || [],
);

const initRecords = async () => {
  if (!props.collectionId) {
    throw new Error('Collection ID is required');
  }
  recordData.value = await fetchAllPaginated(props.collectionId, {
    page: page.value,
  });
};

const initMedia = async () => {
  if (!authStore.user?.id) {
    throw new Error('User ID is required');
  }
  const userModel = {
    id: authStore.user.id,
    type: 'user',
  };
  mediaData.value = await fetchAllMediaFor(userModel, {
    page: page.value,
  });
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
    await initRecords();
  } catch (error: any) {
    pendingUpdateId.value = null;
    errorAlert.show = true;
    errorAlert.message = error?.message || 'An error occurred';
  }
}

function setPage(page: number) {
  page = page;
}

onMounted(() => {
  initRecords();
  initMedia();
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
            <Button
              variant="outline"
              size="icon"
              :disabled="
                pendingUpdateId == item.id || mediaIds.includes(item.id)
              "
              @click="onAdd(item.id)"
            >
              <span v-if="pendingUpdateId == item.id" class="animate-spin">
                <Loader2Icon class="size-4" />
              </span>
              <span v-else>
                <CheckIcon v-if="mediaIds.includes(item.id)" class="size-4" />
                <PlusIcon v-else class="size-4" />
              </span>
            </Button>
          </TableCell>
        </TableRow>
      </TableBody>
      <!-- Meta Caption -->
      <TableMetaCaption :itemsLength="recordsLength" :meta="meta" />
    </Table>
    <!-- Pagination Controls -->
    <PaginateControls :page="page" :meta="meta" @update:page="setPage" />
  </div>
</template>
