<script setup lang="ts">
import useToast from '@/composables/useToast';
import { FolderClosedIcon, Trash2Icon } from 'lucide-vue-next';
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@ui/tooltip';
import ButtonLink from '@components/button/ButtonLink.vue';
import { Button } from '@ui/button';
import PaginateControls from '@components/pagniate/PaginateControls.vue';
import useCollectionService, {
  type CollectionsPaginatedResponse,
} from '@/composables/services/useCollectionService';

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
  <div v-if="collections.length > 0">
    <ErrorAlert v-model="errorAlert.show" :message="errorAlert.message" />
    <ConfirmDialog v-model="showConfirmDialog" @confirm="handleDelete" />

    <Table>
      <TableCaption>
        Showing from
        {{ meta.totalCount > 10 ? meta.currentPage * 10 - 10 + 1 : 1 }}
        to
        {{
          meta.totalCount > 10
            ? meta.currentPage * 10 - 10 + collections.length
            : meta.totalCount
        }}
        of total
        {{ meta.totalCount }}
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead> Name </TableHead>
          <TableHead> Description </TableHead>
          <TableHead> Records </TableHead>
          <TableHead class="text-right"> Actions </TableHead>
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
            {{ collection.records.length }}
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
                  <p class="max-w-xs text-sm">View Collection</p>
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
                  <p class="max-w-xs text-sm">Delete Collection</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>

    <PaginateControls
      v-if="meta.totalCount > 10"
      :page="page"
      :meta="meta"
      :limit="limit"
      @update:page="onUpdatePage"
    />
  </div>
</template>
