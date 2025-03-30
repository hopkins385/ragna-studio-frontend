<script setup lang="ts">
import { useRagnaClient } from '@/composables/useRagnaClient';
import useToast from '@/composables/useToast';
import ConfirmDialog from '@components/confirm/ConfirmDialog.vue';
import PaginateControls from '@components/pagniate/PaginateControls.vue';
import TableMetaCaption from '@components/table/TableMetaCaption.vue';
import { Button } from '@ui/button';
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@ui/table';
import Table from '@ui/table/Table.vue';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@ui/tooltip';
import { FileIcon, LoaderIcon, Trash2Icon } from 'lucide-vue-next';
import type { RecordsPaginatedResponse } from '@hopkins385/ragna-sdk';

const props = defineProps<{
  collectionId: string | undefined;
  refresh: boolean;
}>();

const client = useRagnaClient();
const toast = useToast();
const page = ref(1);

const data = ref<RecordsPaginatedResponse | null>(null);

const initRecords = async () => {
  if (!props.collectionId) return;
  data.value = await client.record.fetchAllPaginated({
    collectionId: props.collectionId,
    params: { page: page.value },
  });
};

const records = computed(() => {
  return data.value?.records || [];
});
const recordsLength = computed(() => {
  return records.value.length;
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
    await client.record.deleteRecord(deleteRecordId.value);
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
    <TableHeader>
      <TableRow>
        <TableHead>{{ $t('table.file') }}</TableHead>
        <TableHead>{{ $t('table.name') }}</TableHead>
        <TableHead>{{ $t('table.chunks') }} </TableHead>
        <TableHead class="text-right">{{ $t('table.actions') }}</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow v-for="record in records || []" :key="record?.id">
        <TableCell class="w-12">
          <FileIcon class="size-4 stroke-1.5" />
        </TableCell>
        <TableCell class="max-w-sm truncate font-semibold">
          {{ record?.media?.name }}
        </TableCell>
        <TableCell> {{ record?.chunks?.length ?? 0 }} </TableCell>
        <TableCell class="space-x-2 text-right">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger as-child>
                <Button class="group" variant="outline" size="icon" @click="onDelete(record.id)">
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
    <!-- Meta Caption -->
    <TableMetaCaption :itemsLength="recordsLength" :meta="meta" />
  </Table>
  <!-- Paginate Controls -->
  <PaginateControls :page="page" :meta="meta" @update:page="setPage" />
</template>
