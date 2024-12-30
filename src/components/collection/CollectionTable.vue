<script setup lang="ts">
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@ui/tooltip';
import { FolderClosedIcon, Trash2Icon } from 'lucide-vue-next';

const route = useRoute();
const router = useRouter();

const page = ref(
  route.query.page ? parseInt(route.query.page.toString(), 10) : 1,
);
const limit = ref(
  route.query.limit ? parseInt(route.query.limit.toString(), 10) : 10,
);

const showConfirmDialog = ref(false);
const errorAlert = reactive({
  show: false,
  message: '',
});
const deleteCollectionId = ref('');

const allCollections = ref<CollectionsPaginatedResponse | null>(null);

const toast = useToast();

const { fetchAllPaginated, deleteCollection } = useCollectionService();

const collections = computed(() => allCollections.value?.collections || []);
const collectionsLength = computed(() => collections.value.length);
const meta = computed(() => {
  return {
    totalCount: allCollections.value?.meta?.totalCount || 0,
    currentPage: allCollections.value?.meta?.currentPage || 0,
  };
});

function onDelete(id: string) {
  deleteCollectionId.value = id;
  showConfirmDialog.value = true;
}

async function handleDelete() {
  try {
    await deleteCollection(deleteCollectionId.value);
    deleteCollectionId.value = '';
    toast.success({
      description: 'Collection deleted.',
    });
    await initCollections();
  } catch (error: any) {
    errorAlert.show = true;
    errorAlert.message = error?.message;
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
    <ErrorAlert v-model="errorAlert.show" :message="errorAlert.message" />
    <ConfirmDialog v-model="showConfirmDialog" @confirm="handleDelete" />

    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{{ $t('table.name') }}</TableHead>
          <TableHead>{{ $t('table.description') }}</TableHead>
          <TableHead>{{ $t('table.records') }}</TableHead>
          <TableHead class="text-right">{{ $t('table.actions') }}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="collection in collections" :key="collection.id">
          <TableCell class="max-w-xl truncate">
            {{ collection.name }}
          </TableCell>
          <TableCell class="max-w-xl truncate">{{
            collection.description
          }}</TableCell>
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
                    <FolderClosedIcon
                      class="size-4 stroke-1.5 text-primary group-hover:stroke-2"
                    />
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
                    <Trash2Icon
                      class="size-4 stroke-1.5 text-destructive group-hover:stroke-2"
                    />
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
    <!-- Pagination Controls -->
    <PaginateControls
      v-if="meta.totalCount > 10"
      :page="page"
      :meta="meta"
      :limit="limit"
      @update:page="onUpdatePage"
    />
  </div>
</template>
