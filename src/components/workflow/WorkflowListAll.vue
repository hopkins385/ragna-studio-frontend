<script setup lang="ts">
// Imports
import { useUserFavoriteService } from '@/composables/services/useUserFavoriteService';
import { useConfirmDialog } from '@/composables/useConfirmDialog';
import { useErrorAlert } from '@/composables/useErrorAlert';
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
import { StarIcon, Trash2Icon, WorkflowIcon } from 'lucide-vue-next';

// Props
// Emits

// Refs
const page = ref(1);
const data = ref<WorkflowsPaginatedResponse | null>(null);
const workflowFavorites = ref<any>([]); // TODO: type
const deleteId = ref('');

// Composables
const { t } = useI18n();
const { success } = useToast();
const { fetchWorkflowsPaginated, deleteWorkflow } = useWorkflowService();
const { addFavorite, deleteFavorite, fetchAllFavoritesByType } = useUserFavoriteService();
const { errorAlert, setErrorAlert, unsetErrorAlert } = useErrorAlert();
const { confirmDialog, setConfirmDialog, unsetConfirmDialog } = useConfirmDialog();

// Computed
const workflows = computed(() => data.value?.workflows || []);
const workflowsLength = computed(() => workflows.value.length);
const meta = computed(() => {
  return {
    totalCount: data.value?.meta?.totalCount || 0,
    currentPage: data.value?.meta?.currentPage || 0,
  };
});

// Functions
const initWorkflows = async () => {
  data.value = await fetchWorkflowsPaginated();
};

const setPage = (value: number) => {
  page.value = value;
};

const handleDelete = async () => {
  if (!deleteId.value) return;
  try {
    await deleteWorkflow(deleteId.value);
  } catch (error) {
    return setErrorAlert(error);
  } finally {
    unsetConfirmDialog();
  }

  deleteId.value = '';
  success({
    description: t('workflow.toast.deleted'),
  });
  await initWorkflows();
};

const onDelete = (id: string) => {
  unsetErrorAlert();
  deleteId.value = id;
  setConfirmDialog({
    title: t('workflow.confirm.delete.title'),
    description: t('workflow.confirm.delete.description'),
    confirmButtonText: t('workflow.confirm.delete.confirm'),
    onConfirm: handleDelete,
  });
};

const onAddFavorite = async (workflowId: string) => {
  try {
    await addFavorite({ id: workflowId, type: 'workflow' });
    await initWorkflowFavorites();
  } catch (error: any) {
    return setErrorAlert(error);
  }
};

const onDeleteFavorite = async (workflowId: string) => {
  const entityId = workflowFavorites.value.find((f: any) => f.favoriteId === workflowId).id;
  try {
    await deleteFavorite({ entityId, favoriteType: 'workflow' });
    await initWorkflowFavorites();
  } catch (error: any) {
    return setErrorAlert(error);
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
  <div v-if="workflows && workflows.length > 0">
    <ErrorAlert v-model="errorAlert.open" :message="errorAlert.message" />
    <ConfirmDialog v-model="confirmDialog.open" v-bind="confirmDialog" />
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
              v-if="workflowFavorites.some((f: any) => f.favoriteId === workflow.id)"
              variant="ghost"
              size="icon"
              @click="onDeleteFavorite(workflow.id)"
            >
              <StarIcon class="!size-6 stroke-1.5 stroke-none fill-blue-500" />
            </Button>
            <Button v-else variant="ghost" size="icon" @click="onAddFavorite(workflow.id)">
              <StarIcon class="!size-5 stroke-1.5 stroke-stone-400" />
            </Button>
          </TableCell>
          <TableCell class="font-semibold">
            {{ workflow.name }}
          </TableCell>
          <TableCell class="space-x-2 text-right">
            <ButtonLink class="group" variant="outline" size="icon" :to="`workflow/${workflow.id}`">
              <WorkflowIcon class="size-4 stroke-1.5 text-primary group-hover:stroke-2" />
            </ButtonLink>
            <Button variant="outline" size="icon" @click="onDelete(workflow.id)">
              <Trash2Icon class="size-4 stroke-1.5 text-destructive" />
            </Button>
          </TableCell>
        </TableRow>
      </TableBody>
      <!-- Meta Caption -->
      <TableMetaCaption :itemsLength="workflowsLength" :meta="meta" />
    </Table>

    <div class="pb-10">
      <!-- Pagination Controls -->
      <PaginateControls :page="page" :meta="meta" @update:page="setPage" />
    </div>
  </div>
  <div v-else>
    <div class="flex items-center justify-center h-96">
      <p class="text-base text-slate-500">{{ $t('workflow.empty.title') }}</p>
    </div>
  </div>
</template>
