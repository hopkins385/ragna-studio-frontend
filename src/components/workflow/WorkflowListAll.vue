<script setup lang="ts">
import {
  useWorkflowService,
  type WorkflowsPaginatedResponse,
} from '@composables/services/useWorkflowService';
import { SquareArrowOutUpRightIcon, Trash2Icon } from 'lucide-vue-next';
import PaginateControls from '../pagniate/PaginateControls.vue';
import ErrorAlert from '../error/ErrorAlert.vue';
import ConfirmDialog from '../confirm/ConfirmDialog.vue';
import Table from '@ui/table/Table.vue';
import TableCaption from '@ui/table/TableCaption.vue';
import TableHeader from '@ui/table/TableHeader.vue';
import TableRow from '@ui/table/TableRow.vue';
import TableHead from '@ui/table/TableHead.vue';
import TableBody from '@ui/table/TableBody.vue';
import TableCell from '@ui/table/TableCell.vue';
import Button from '@ui/button/Button.vue';
import ButtonLink from '../button/ButtonLink.vue';

const { fetchWorkflowsPaginated } = useWorkflowService();

const page = ref(1);
const data = ref<WorkflowsPaginatedResponse | null>(null);

const workflows = computed(() => data.value?.workflows || []);
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

function onDelete(id: string) {
  showConfirmDialog.value = true;
}

async function setPage(value: number) {
  page.value = value;
}

function handleDelete() {
  throw new Error('Not implemented');
}
onMounted(() => {
  initWorkflows();
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
          <TableHead> Name </TableHead>
          <TableHead class="text-right"> Action </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="item in workflows || []" :key="item.id">
          <TableCell>
            {{ item.name }}
          </TableCell>
          <TableCell class="space-x-2 text-right">
            <ButtonLink
              class="group"
              variant="outline"
              size="icon"
              :to="`workflow/${item.id}`"
            >
              <SquareArrowOutUpRightIcon
                class="size-4 stroke-1.5 text-primary group-hover:stroke-2"
              />
            </ButtonLink>
            <Button variant="outline" size="icon" @click="onDelete(item.id)">
              <Trash2Icon class="size-4 stroke-1.5 text-destructive" />
            </Button>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>

    <PaginateControls :page="page" :meta="meta" @update:page="setPage" />
  </div>
</template>
