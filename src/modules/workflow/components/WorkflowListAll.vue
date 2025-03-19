<script setup lang="ts">
// Imports
import { useConfirmDialog } from '@/composables/useConfirmDialog';
import { useErrorAlert } from '@/composables/useErrorAlert';
import { useRagnaClient } from '@/composables/useRagnaClient';
import useToast from '@/composables/useToast';
import ConfirmDialog from '@components/confirm/ConfirmDialog.vue';
import ErrorAlert from '@components/error/ErrorAlert.vue';
import PaginateControls from '@components/pagniate/PaginateControls.vue';
import TableMetaCaption from '@components/table/TableMetaCaption.vue';
import Button from '@ui/button/Button.vue';
import ButtonLink from '@ui/button/ButtonLink.vue';
import Table from '@ui/table/Table.vue';
import TableBody from '@ui/table/TableBody.vue';
import TableCell from '@ui/table/TableCell.vue';
import TableHead from '@ui/table/TableHead.vue';
import TableHeader from '@ui/table/TableHeader.vue';
import TableRow from '@ui/table/TableRow.vue';
import { StarIcon, Trash2Icon, WorkflowIcon } from 'lucide-vue-next';
import type { WorkflowsPaginatedResponse } from 'ragna-sdk';

// Props
// Emits

// Refs
const page = ref(1);
const data = ref<WorkflowsPaginatedResponse | null>(null);
const workflowFavorites = ref<any>([]); // TODO: type

// Composables
const client = useRagnaClient();
const toast = useToast();
const { t } = useI18n();
const { errorAlert, setErrorAlert, unsetErrorAlert } = useErrorAlert();
const { confirmDialog, setConfirmDialog } = useConfirmDialog();

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
  data.value = await client.workflow.fetchWorkflowsPaginated();
};

const setPage = (value: number) => {
  page.value = value;
};

const handleDelete = async (workflowId: string) => {
  try {
    await client.workflow.deleteWorkflow(workflowId);
    await initWorkflows();
    toast.success({ description: t('workflow.delete.success') });
  } catch (error: unknown) {
    return setErrorAlert(error);
  }
};

const onDelete = (workflowId: string) => {
  unsetErrorAlert();
  setConfirmDialog({
    title: t('workflow.delete.confirm.title'),
    description: t('workflow.delete.confirm.description'),
    confirmButtonText: t('workflow.delete.confirm.submit'),
    onConfirm: () => handleDelete(workflowId),
  });
};

const onAddFavorite = async (workflowId: string) => {
  try {
    await client.userFavorite.addFavorite({ id: workflowId, type: 'workflow' });
    await initWorkflowFavorites();
  } catch (error: any) {
    return setErrorAlert(error);
  }
};

const onDeleteFavorite = async (workflowId: string) => {
  const entityId = workflowFavorites.value.find((f: any) => f.favoriteId === workflowId).id;
  try {
    await client.userFavorite.deleteFavorite({ entityId, favoriteType: 'workflow' });
    await initWorkflowFavorites();
  } catch (error: any) {
    return setErrorAlert(error);
  }
};

const initWorkflowFavorites = async () => {
  const { favorites: all } = await client.userFavorite.fetchAllFavoritesByType('workflow');
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
