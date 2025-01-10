<script setup lang="ts">
import { useUserFavoriteService } from '@/composables/services/useUserFavoriteService';
import useToast from '@/composables/useToast';
import ButtonLink from '@components/button/ButtonLink.vue';
import ConfirmDialog from '@components/confirm/ConfirmDialog.vue';
import ErrorAlert from '@components/error/ErrorAlert.vue';
import PaginateControls from '@components/pagniate/PaginateControls.vue';
import TableMetaCaption from '@components/table/TableMetaCaption.vue';
import {
  useWorkflowService,
  type WorkflowsPaginatedResponse,
} from '@composables/services/useWorkflowService';
import Button from '@ui/button/Button.vue';
import Table from '@ui/table/Table.vue';
import TableBody from '@ui/table/TableBody.vue';
import TableCell from '@ui/table/TableCell.vue';
import TableHead from '@ui/table/TableHead.vue';
import TableHeader from '@ui/table/TableHeader.vue';
import TableRow from '@ui/table/TableRow.vue';
import {
  SquareArrowOutUpRightIcon,
  StarIcon,
  Trash2Icon,
} from 'lucide-vue-next';

const { t } = useI18n();
const { fetchWorkflowsPaginated, deleteWorkflow } = useWorkflowService();
const { addFavorite, deleteFavorite, fetchAllFavoritesByType } =
  useUserFavoriteService();

const toast = useToast();

const page = ref(1);
const data = ref<WorkflowsPaginatedResponse | null>(null);
const workflowFavorites = ref<any>([]); // TODO: type

const workflows = computed(() => data.value?.workflows || []);
const workflowsLength = computed(() => workflows.value.length);
const meta = computed(() => {
  return {
    totalCount: data.value?.meta?.totalCount || 0,
    currentPage: data.value?.meta?.currentPage || 0,
  };
});

const initWorkflows = async () => {
  data.value = await fetchWorkflowsPaginated();
};

const errorAlert = reactive({ show: false, message: '' });
const showConfirmDialog = ref(false);
const deleteId = ref('');

const setPage = (value: number) => {
  page.value = value;
};

const onDelete = (id: string) => {
  showConfirmDialog.value = true;
  deleteId.value = id;
};

const handleDelete = async () => {
  if (!deleteId.value) return;
  try {
    await deleteWorkflow(deleteId.value);
    await initWorkflows();
    toast.success({
      description: t('workflow.delete.success'),
    });
  } catch (error: any) {
    errorAlert.show = true;
    errorAlert.message = error?.message;
  } finally {
    showConfirmDialog.value = false;
    deleteId.value = '';
  }
};

const onAddFavorite = async (workflowId: string) => {
  try {
    await addFavorite({ id: workflowId, type: 'workflow' });
    await initWorkflowFavorites();
  } catch (error: any) {
    errorAlert.show = true;
    errorAlert.message = error?.message;
  }
};

const onDeleteFavorite = async (workflowId: string) => {
  const entityId = workflowFavorites.value.find(
    (f: any) => f.favoriteId === workflowId,
  ).id;
  try {
    await deleteFavorite({ entityId, favoriteType: 'workflow' });
    await initWorkflowFavorites();
  } catch (error: any) {
    errorAlert.show = true;
    errorAlert.message = error?.message;
  }
};

const initWorkflowFavorites = async () => {
  const { favorites: all } = await fetchAllFavoritesByType('workflow');
  workflowFavorites.value = all;
};

onMounted(() => {
  initWorkflows();
  initWorkflowFavorites();
});
</script>

<template>
  <div>
    <ErrorAlert v-model="errorAlert.show" :message="errorAlert.message" />
    <ConfirmDialog v-model="showConfirmDialog" @confirm="handleDelete" />

    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{{ $t('table.favorit') }}</TableHead>
          <TableHead>{{ $t('table.name') }}</TableHead>
          <TableHead class="text-right">{{ $t('table.actions') }}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="workflow in workflows || []" :key="workflow.id">
          <TableCell class="w-12">
            <Button
              v-if="workflowFavorites.some(f => f.favoriteId === workflow.id)"
              variant="ghost"
              size="icon"
              @click="onDeleteFavorite(workflow.id)"
            >
              <StarIcon class="!size-6 stroke-1.5 stroke-none fill-blue-500" />
            </Button>
            <Button
              v-else
              variant="ghost"
              size="icon"
              @click="onAddFavorite(workflow.id)"
            >
              <StarIcon class="!size-5 stroke-1.5 stroke-stone-400" />
            </Button>
          </TableCell>
          <TableCell class="font-semibold">
            {{ workflow.name }}
          </TableCell>
          <TableCell class="space-x-2 text-right">
            <ButtonLink
              class="group"
              variant="outline"
              size="icon"
              :to="`workflow/${workflow.id}`"
            >
              <SquareArrowOutUpRightIcon
                class="size-4 stroke-1.5 text-primary group-hover:stroke-2"
              />
            </ButtonLink>
            <Button
              variant="outline"
              size="icon"
              @click="onDelete(workflow.id)"
            >
              <Trash2Icon class="size-4 stroke-1.5 text-destructive" />
            </Button>
          </TableCell>
        </TableRow>
      </TableBody>
      <!-- Meta Caption -->
      <TableMetaCaption :itemsLength="workflowsLength" :meta="meta" />
    </Table>
    <!-- Pagination Controls -->
    <PaginateControls :page="page" :meta="meta" @update:page="setPage" />
  </div>
</template>
