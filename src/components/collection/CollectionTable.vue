<script setup lang="ts">
// Imports
import { useConfirmDialog } from '@/composables/useConfirmDialog';
import { useErrorAlert } from '@/composables/useErrorAlert';
import ButtonLink from '@components/button/ButtonLink.vue';
import ConfirmDialog from '@components/confirm/ConfirmDialog.vue';
import ErrorAlert from '@components/error/ErrorAlert.vue';
import PaginateControls from '@components/pagniate/PaginateControls.vue';
import TableMetaCaption from '@components/table/TableMetaCaption.vue';
import useCollectionService, {
  type CollectionsPaginatedResponse,
} from '@composables/services/useCollectionService';
import useToast from '@composables/useToast';
import { Button } from '@ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@ui/tooltip';
import { DatabaseIcon, FolderClosedIcon, Trash2Icon } from 'lucide-vue-next';

// Props
// Emits
// Refs

const route = useRoute();
const router = useRouter();
const toast = useToast();

const page = ref(route.query.page ? parseInt(route.query.page.toString(), 10) : 1);
const limit = ref(route.query.limit ? parseInt(route.query.limit.toString(), 10) : 10);
const deleteCollectionId = ref('');
const allCollections = ref<CollectionsPaginatedResponse | null>(null);

// Composables
const { t } = useI18n();
const { fetchAllPaginated, deleteCollection } = useCollectionService();
const { errorAlert, setErrorAlert, unsetErrorAlert } = useErrorAlert();
const { confirmDialog, setConfirmDialog, unsetConfirmDialog } = useConfirmDialog();

// Computed
const collections = computed(() => allCollections.value?.collections || []);
const collectionsLength = computed(() => collections.value.length);
const meta = computed(() => {
  return {
    totalCount: allCollections.value?.meta?.totalCount || 0,
    currentPage: allCollections.value?.meta?.currentPage || 0,
  };
});

// Functions
function onDelete(id: string) {
  unsetErrorAlert();
  deleteCollectionId.value = id;
  setConfirmDialog({
    title: t('collection.confirm.delete.title'),
    description: t('collection.confirm.delete.description'),
    confirmButtonText: t('collection.confirm.delete.confirm'),
    onConfirm: handleDelete,
  });
}

async function handleDelete() {
  try {
    await deleteCollection(deleteCollectionId.value);
    deleteCollectionId.value = '';
    toast.success({
      description: 'Collection deleted.',
    });
    await initCollections();
  } catch (error) {
    setErrorAlert(error);
  } finally {
    unsetConfirmDialog();
  }
}

const onUpdatePage = async (val: number) => {
  page.value = val;
  const query = { ...route.query, page: page.value }; // limit: limit.value
  router.push({ query });
  await initCollections();
};

const initCollections = async () => {
  allCollections.value = await fetchAllPaginated({
    page: page.value,
    limit: limit.value,
  });
};

await initCollections();
</script>

<template>
  <div v-if="collectionsLength > 0">
    <ErrorAlert v-model="errorAlert.open" v-bind="errorAlert" />
    <ConfirmDialog v-model="confirmDialog.open" v-bind="confirmDialog" />

    <Table>
      <TableHeader>
        <TableRow>
          <TableHead></TableHead>
          <TableHead>{{ $t('table.name') }}</TableHead>
          <TableHead>{{ $t('table.description') }}</TableHead>
          <TableHead>{{ $t('table.records') }}</TableHead>
          <TableHead class="text-right">{{ $t('table.actions') }}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="collection in collections" :key="collection.id">
          <TableCell class="w-12">
            <DatabaseIcon class="size-4 stroke-1.5" />
          </TableCell>
          <TableCell class="max-w-sm truncate font-semibold text-sm">
            {{ collection.name }}
          </TableCell>
          <TableCell class="max-w-lg truncate">
            {{ collection.description }}
          </TableCell>
          <TableCell>
            {{ collection?.records.length }}
          </TableCell>
          <TableCell class="space-x-2 text-right">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger as-child>
                  <ButtonLink
                    class="group"
                    variant="outline"
                    size="icon"
                    :to="`/collection/${collection.id}`"
                  >
                    <FolderClosedIcon class="size-4 stroke-1.5 text-primary group-hover:stroke-2" />
                  </ButtonLink>
                </TooltipTrigger>
                <TooltipContent>
                  <p class="max-w-xs text-sm">
                    {{ $t('collection.tooltip.view') }}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger as-child>
                  <Button
                    class="group"
                    variant="outline"
                    size="icon"
                    @click="onDelete(collection.id)"
                  >
                    <Trash2Icon class="size-4 stroke-1.5 text-destructive group-hover:stroke-2" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p class="max-w-xs text-sm">
                    {{ $t('collection.tooltip.delete') }}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </TableCell>
        </TableRow>
      </TableBody>
      <!-- Meta Caption -->
      <TableMetaCaption :itemsLength="collectionsLength" :meta="meta" />
    </Table>
    <div class="pb-10">
      <!-- Pagination Controls -->
      <PaginateControls
        v-if="meta.totalCount > 10"
        :page="page"
        :meta="meta"
        :limit="limit"
        @update:page="onUpdatePage"
      />
    </div>
  </div>
  <div v-else>
    <div class="flex items-center justify-center h-[20rem]">
      <p class="text-base text-slate-500">{{ $t('collection.empty.title') }}</p>
    </div>
  </div>
</template>
