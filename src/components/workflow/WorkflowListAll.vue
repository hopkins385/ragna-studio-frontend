<script setup lang="ts">
import { useUserFavoriteService } from '@/composables/services/useUserFavoriteService';
import useToast from '@/composables/useToast';
import {
  useWorkflowService,
  type WorkflowsPaginatedResponse,
} from '@composables/services/useWorkflowService';
import Button from '@ui/button/Button.vue';
import Table from '@ui/table/Table.vue';
import TableBody from '@ui/table/TableBody.vue';
import TableCaption from '@ui/table/TableCaption.vue';
import TableCell from '@ui/table/TableCell.vue';
import TableHead from '@ui/table/TableHead.vue';
import TableHeader from '@ui/table/TableHeader.vue';
import TableRow from '@ui/table/TableRow.vue';
import {
  SquareArrowOutUpRightIcon,
  StarIcon,
  Trash2Icon,
} from 'lucide-vue-next';
import ButtonLink from '../button/ButtonLink.vue';
import ConfirmDialog from '../confirm/ConfirmDialog.vue';
import ErrorAlert from '../error/ErrorAlert.vue';
import PaginateControls from '../pagniate/PaginateControls.vue';

const toast = useToast();

const page = ref(1);
const data = ref<WorkflowsPaginatedResponse | null>(null);
const workflowFavorites = ref<any>([]); // TODO: type

const workflows = computed(() => data.value?.workflows || []);
const meta = computed(() => {
  return {
    totalCount: data.value?.meta?.totalCount || 0,
    currentPage: data.value?.meta?.currentPage || 0,
  };
});

const { fetchWorkflowsPaginated } = useWorkflowService();

const initWorkflows = async () => {
  data.value = await fetchWorkflowsPaginated();
};

const errorAlert = reactive({ show: false, message: '' });
const showConfirmDialog = ref(false);

function onDelete(id: string) {
  showConfirmDialog.value = true;
}

async function setPage(value: number) {
  page.value = value;
}

function handleDelete() {
  throw new Error('Not implemented');
}

// favorite
const { addFavorite, deleteFavorite, fetchAllFavoritesByType } =
  useUserFavoriteService();

const onAddFavorite = async (workflowId: string) => {
  try {
    await addFavorite({ id: workflowId, type: 'workflow' });
    toast.success({
      description: 'Workflow has been added to favorites.',
    });
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
    toast.success({
      description: 'Workflow has been removed from favorites.',
    });
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
      <!-- TODO: fix total count (meta on multi projects and flatMap) -->
      <TableCaption class="hidden">
        Showing from
        {{ meta.totalCount > 10 ? meta.currentPage * 10 - 10 + 1 : 1 }}
        to
        {{
          meta.totalCount > 10
            ? meta.currentPage * 10 - 10 + workflows.length
            : meta.totalCount
        }}
        of total
        {{ meta.totalCount }}
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead> Favorite </TableHead>
          <TableHead> Name </TableHead>
          <TableHead class="text-right"> Action </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="workflow in workflows || []" :key="workflow.id">
          <TableCell>
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
          <TableCell>
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
    </Table>

    <PaginateControls :page="page" :meta="meta" @update:page="setPage" />
  </div>
</template>
