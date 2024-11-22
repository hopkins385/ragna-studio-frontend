<script setup lang="ts">
import useToast from '@/composables/useToast';
import { FileIcon, LoaderIcon, Trash2Icon } from 'lucide-vue-next';
import ConfirmDialog from '../confirm/ConfirmDialog.vue';
import Table from '../ui/table/Table.vue';
import TableCaption from '../ui/table/TableCaption.vue';
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import { Button } from '../ui/button';
import PaginateControls from '../pagniate/PaginateControls.vue';
import {
  useRecordService,
  type RecordsPaginatedResponse,
} from '@/composables/services/useRecordService';

const props = defineProps<{
  collectionId: string | undefined;
  refresh: boolean;
}>();

const toast = useToast();
const page = ref(1);

const data = ref<RecordsPaginatedResponse | null>(null);

const { fetchAllPaginated, deleteRecord } = useRecordService();

const initRecords = async () => {
  if (!props.collectionId) return;
  data.value = await fetchAllPaginated(props.collectionId, {
    page: page.value,
  });
};

const records = computed(() => {
  return data.value?.records || [];
});

const meta = computed(() => {
  return {
    totalCount: data.value?.meta?.totalCount || 0,
    currentPage: data.value?.meta?.currentPage || 0,
  };
});

const showConfirmDialog = ref(false);
const deleteRecordId = ref('');
const isLoadingIds = ref<string[]>([]);

const addIsLoading = (id: string) => {
  isLoadingIds.value.push(id);
};

const deleteIsLoading = (id: string) => {
  isLoadingIds.value = isLoadingIds.value.filter(i => i !== id);
};

const onDelete = async (id: string) => {
  showConfirmDialog.value = true;
  deleteRecordId.value = id;
};

const handleDelete = async () => {
  addIsLoading(deleteRecordId.value);
  showConfirmDialog.value = false;
  try {
    await deleteRecord(deleteRecordId.value);
    toast.success({
      description: 'Record deleted.',
    });
    await initRecords();
  } catch (error: any) {
    toast.error({
      description: 'Failed to delete record.',
    });
  } finally {
    deleteRecordId.value = '';
    deleteIsLoading(deleteRecordId.value);
  }
};

const setPage = (newPage: number) => {
  page.value = newPage;
  initRecords();
};

watchEffect(() => {
  if (props.refresh) {
    initRecords();
  }
});

onMounted(() => {
  initRecords();
});
</script>

<template>
  <ConfirmDialog v-model="showConfirmDialog" @confirm="handleDelete" />
  <Table>
    <TableCaption>
      Showing from
      {{ meta.totalCount > 10 ? meta.currentPage * 10 - 10 + 1 : 1 }}
      to
      {{
        meta.totalCount > 10
          ? meta.currentPage * 10 - 10 + records.length
          : meta.totalCount
      }}
      of total
      {{ meta.totalCount }}
    </TableCaption>
    <TableHeader>
      <TableRow>
        <TableHead> File </TableHead>
        <TableHead> Name </TableHead>
        <TableHead> Chunks </TableHead>
        <TableHead class="text-right"> Action </TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow v-for="record in records || []" :key="record?.id">
        <TableCell>
          <div
            class="flex size-8 items-center justify-center truncate rounded-full"
          >
            <FileIcon class="size-4" />
          </div>
        </TableCell>
        <TableCell class="truncate">{{ record?.media?.name }}</TableCell>
        <TableCell> {{ record?.chunks?.length ?? 0 }} </TableCell>
        <TableCell class="space-x-2 text-right">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger as-child>
                <Button
                  class="group"
                  variant="outline"
                  size="icon"
                  @click="onDelete(record.id)"
                >
                  <LoaderIcon
                    v-if="isLoadingIds.includes(record.id)"
                    class="size-4 animate-spin stroke-1.5 text-primary group-hover:stroke-2"
                  />
                  <Trash2Icon
                    v-else
                    class="size-4 stroke-1.5 text-destructive group-hover:stroke-2"
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p class="max-w-xs text-sm">Remove File from Collection</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>

  <PaginateControls :page="page" :meta="meta" @update:page="setPage" />
</template>
