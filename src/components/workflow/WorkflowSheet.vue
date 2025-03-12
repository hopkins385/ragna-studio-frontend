<script setup lang="ts">
import { assistantService } from '@/modules/assistant/assistant.service';
import { workflowStepService } from '@/modules/workflow-step/workflow-step.service';
import type { Workflow } from '@/modules/workflow/interfaces';
import { workflowService } from '@/modules/workflow/workflow.service';
import { useResizeSheet } from '@composables/useResizeSheet';
import useToast from '@composables/useToast';
import { useWebSocketStore } from '@stores/websocket.store';
import { Button } from '@ui/button';
import { Checkbox } from '@ui/checkbox';
import { vOnClickOutside } from '@vueuse/components';
import { useDebounceFn, useEventListener } from '@vueuse/core';
import {
  AlignLeftIcon,
  LoaderIcon,
  PlusIcon,
  Trash2Icon,
  TriangleAlertIcon,
  WorkflowIcon,
} from 'lucide-vue-next';
import StepManagementCard from './step/StepManagementCard.vue';
import WorkflowCellCard from './WorkflowCellCard.vue';
import WorkflowExportSidebar from './WorkflowExportSidebar.vue';
import WorkflowNameEditable from './WorkflowNameEditable.vue';
import WorkflowSettingsSidebar from './WorkflowSettingsSidebar.vue';

interface ICellCard {
  show: boolean;
  teleportTo: { x: number; y: number };
  stepId: string;
  itemId: string;
  content: string;
  width?: number;
  heigth?: number;
}

const props = defineProps<{
  workflowId: string;
  refreshData?: boolean;
}>();

const MAX_ROW_COUNT = 10;
const MAX_COLUMN_COUNT = 10;

const sideBarOpen = ref(false);
const sheetRef = ref<HTMLElement | null>(null);

const toast = useToast();
const socket = useWebSocketStore();
const { t } = useI18n();

const stepCard = reactive({
  show: false,
  teleportTo: 0,
  workflowStepId: '',
});

const cellCard = reactive<ICellCard>({
  show: false,
  teleportTo: {
    x: 0,
    y: 0,
  },
  itemId: '',
  content: '',
  stepId: '',
  width: undefined,
  heigth: undefined,
});

const cellActive = ref<{ x: number; y: number; rowHeight: number }>({
  x: 0,
  y: 0,
  rowHeight: 0,
});

const { resizeRowListener, resizeColumnListener, initSheetDimensions } = useResizeSheet();

const flowProgress = reactive({
  show: false,
  completed: 0,
  total: 0,
});

const workflow = ref<Workflow | null>(null);
const workflowId = computed(() => props.workflowId);

const steps = computed(() => workflow.value?.steps || []);
const rowCount = computed(() => steps.value[0]?.document.documentItems.length || 0);
const columnCount = computed(() => steps.value.length);
const totalCellCount = computed(() => rowCount.value * columnCount.value);

const workflowStepCardActive = computed(() => {
  return steps.value.find((step: any) => step.id === stepCard.workflowStepId);
});

const initWorkflow = async () => {
  const { workflow: data } = await workflowService.fetchFullWorkflow(props.workflowId);
  workflow.value = data;
  nextTick(() => {
    initSheetDimensions(props.workflowId);
  });
};

async function onAddWorkflowStep() {
  const stepCount = steps.value.length;
  if (stepCount >= MAX_COLUMN_COUNT) {
    toast.info({ description: `Max ${MAX_COLUMN_COUNT} steps reached` });
    return;
  }
  const result = await assistantService.fetchAllAssistants({ page: 1, limit: 1 });
  const assistant = result.assistants[0];
  if (!assistant || !assistant?.id) {
    console.error('No assistant found');
    return;
  }
  await workflowStepService.createWorkflowStep(props.workflowId, {
    assistantId: assistant.id,
    name: t('workflow.create.new_step_name'),
    description: t('workflow.create.new_step_description'),
    orderColumn: columnCount.value,
    rowCount: rowCount.value,
  });

  await initWorkflow();
}

async function onAddWorkflowRow() {
  const rowCount = steps.value[0]?.document.documentItems.length || 0;
  if (rowCount >= MAX_ROW_COUNT) {
    toast.info({ description: t('workflow.toast.error_max_rows') });
    return;
  }
  const items = workflow.value?.steps.map((step: any) => {
    return {
      documentId: step.document.id,
      orderColumn: step.document.documentItems.length,
      content: '',
      status: 'draft',
      type: 'text',
    };
  });
  await workflowStepService.createWorkflowRow(props.workflowId, { items: items ?? [] });
  await initWorkflow();
}

function toggleStepCard(id: number, stepId: string) {
  // only if click again on the same step, close the card if it is open
  if (stepCard.show && stepCard.teleportTo === id) {
    stepCard.show = false;
    return;
  }
  stepCard.teleportTo = id;
  stepCard.workflowStepId = stepId;
  stepCard.show = true;
}

function onCloseStepCard() {
  stepCard.show = false;
  stepCard.teleportTo = 0;
  stepCard.workflowStepId = '';
}

function toggleCellCard(
  x: number,
  y: number,
  content: string,
  id: string,
  width?: number,
  height?: number,
) {
  // if click again on the same item, ignore
  if (cellCard.show && cellCard.teleportTo.x === x && cellCard.teleportTo.y === y) {
    return;
  }
  const rowHeight = sheetRef.value?.querySelector(`#row_${y}`)?.clientHeight || 0;
  cellCard.teleportTo.x = Number(x);
  cellCard.teleportTo.y = Number(y);
  cellCard.stepId = steps.value[x].id; // TODO: check if this is correct
  cellCard.itemId = id;
  cellCard.content = content;
  cellCard.show = true;
  cellCard.width = width;
  cellCard.heigth = height || Number(rowHeight);
}

function onCloseCellCard() {
  cellCard.show = false;
  cellCard.teleportTo = { x: 0, y: 0 };
  cellCard.stepId = '';
  cellCard.itemId = '';
  cellCard.content = '';
  cellCard.width = undefined;
  cellCard.heigth = undefined;
}

async function onInputStepsUpdated(payload: { inputSteps: string[]; stepId: string }) {
  await workflowStepService.updateInputSteps(payload.stepId, { inputStepIds: payload.inputSteps });
  await initWorkflow();
}

const debouncedRefresh = useDebounceFn(async () => {
  await initWorkflow();
}, 250);

const selectedRows = ref<number[]>([]);
const hasSelectedRows = computed(() => selectedRows.value.length > 0);
function onRowSelected(rowIndex: number) {
  if (selectedRows.value.includes(rowIndex)) {
    selectedRows.value = selectedRows.value.filter(row => row !== rowIndex);
  } else {
    // push and sort
    selectedRows.value = [...selectedRows.value, rowIndex].sort((a, b) => a - b);
  }
}

function onAllRowsSelected() {
  selectedRows.value = Array.from({ length: rowCount.value }, (_, i) => i);
}

async function onDeleteSelectedRows() {
  await workflowService.deleteWorkflowRows(props.workflowId, selectedRows.value);
  deselectAllRows();
  await initWorkflow();
}

function deselectAllRows() {
  selectedRows.value = [];
}

function onNoRowsSelected() {
  deselectAllRows();
}

function toggleAllRowsSelected() {
  if (hasSelectedRows.value) {
    onNoRowsSelected();
  } else {
    onAllRowsSelected();
  }
}

function setCellActive(columnIndex: number, rowIndex: number) {
  const rowHeight = sheetRef.value?.querySelector(`#row_${rowIndex}`)?.clientHeight;
  cellActive.value = { x: columnIndex, y: rowIndex, rowHeight: rowHeight || 0 };
}

const onRunFlow = async () => {
  flowProgress.show = true;
  flowProgress.completed = 0;
  flowProgress.total = totalCellCount.value;
  await workflowService.executeWorkflow(props.workflowId);
};

const onRefresh = async () => {
  await initWorkflow();
};

const onWorkflowUpdateEvent = async (data: any) => {
  if (data?.cellCompleted == true) {
    flowProgress.completed++;
  }
  if (data?.rowCompleted == true) {
    flowProgress.completed++;
  }
  debouncedRefresh();
};

watch(
  () => flowProgress.completed,
  (completedCount, prevCount) => {
    if (completedCount === totalCellCount.value) {
      setTimeout(() => {
        flowProgress.show = false;
        flowProgress.completed = 0;
        flowProgress.total = 0;
      }, 500);
    }
  },
);

useEventListener('keydown', event => {
  if (event.key === 'Escape') {
    onCloseCellCard();
    onCloseStepCard();
    setCellActive(0, 0);
  }
});

onMounted(() => {
  initSheetDimensions(props.workflowId);
  socket.on(`workflow-update:${props.workflowId}`, onWorkflowUpdateEvent);
});

onBeforeUnmount(() => {
  socket.off(`workflow-update:${props.workflowId}`, onWorkflowUpdateEvent);
  assistantService.abortRequest();
});

await initWorkflow();
</script>

<template>
  <div class="min-h-screen overflow-scroll">
    <!-- Sheet Header -->
    <div class="h-14 border-b flex items-center justify-between sticky top-0 left-0 bg-white z-10">
      <!-- Workflow Name -->
      <div class="flex items-center">
        <div class="px-4 flex items-center justify-center border-0">
          <div class="rounded-lg p-2 bg-blue-50">
            <WorkflowIcon class="size-5 stroke-1.5 text-blue-800" />
          </div>
        </div>
        <WorkflowNameEditable
          :workflow-id="workflowId"
          :workflow-name="workflow?.name ?? ''"
          @refresh="onRefresh"
        />
        <div class="pl-5" v-if="flowProgress.show">
          <div class="flex items-center space-x-2">
            <LoaderIcon class="size-3 animate-spin stroke-1.5" />
            <!-- Loading ProgressBar -->
            <div class="w-40 h-2 bg-neutral-100 rounded-lg">
              <div
                class="h-full bg-blue-500 rounded-lg"
                :style="{
                  width: `${(flowProgress.completed / flowProgress.total) * 100}%`,
                }"
              ></div>
            </div>
          </div>
        </div>
      </div>
      <!-- controls -->
      <div class="pr-10 flex items-center space-x-2">
        <WorkflowExportSidebar :workflow-id="props.workflowId" />
        <WorkflowSettingsSidebar
          :workflow-id="props.workflowId"
          :workflow-name="workflow?.name ?? ''"
          :workflow-description="workflow?.description ?? ''"
          @refresh="onRefresh"
        />
        <Button variant="ghost" class="" @click="onRefresh">
          {{ $t('workflow.button.refresh') }}
        </Button>
        <Button variant="outline" class="" @click="onRunFlow">
          {{ $t('workflow.button.run') }}
        </Button>
      </div>
    </div>
    <div v-if="!workflow" class="p-4 text-sm">
      Ups something went wrong.<br />The Data you are looking for is not available.
    </div>
    <!-- Sheet Content -->
    <div
      id="workflowSheet"
      ref="sheetRef"
      v-on-click-outside="() => setCellActive(0, 0)"
      class="no-scrollbar flex overflow-visible bg-white pb-10 border-t border-l text-xs"
    >
      <!-- Row Index -->
      <div id="column_0" class="column">
        <div id="row_0_cell_x0_y1" class="index relative flex items-center justify-center">
          <Checkbox
            :checked="hasSelectedRows"
            class="size-3.5 border-stone-500"
            @update:checked="toggleAllRowsSelected"
          />
        </div>
        <div
          v-for="(count, rowIndex) in rowCount"
          :id="`row_${rowIndex + 1}`"
          :key="rowIndex"
          class="relative"
        >
          <div
            :id="`row_${rowIndex + 1}_cell_x0_y${rowIndex + 1}`"
            class="index group flex flex-col items-center justify-between"
          >
            <div class="flex h-full items-center justify-center opacity-60">
              <div
                class="pt-2 group-hover:hidden"
                :class="{
                  hidden: selectedRows.includes(rowIndex),
                }"
              >
                {{ rowIndex + 1 }}
              </div>
              <div
                class="group-hover:block"
                :class="{
                  block: selectedRows.includes(rowIndex),
                  hidden: !selectedRows.includes(rowIndex),
                }"
              >
                <Checkbox
                  :checked="selectedRows.includes(rowIndex)"
                  class="mt-2 size-3.5"
                  @update:checked="() => onRowSelected(rowIndex)"
                />
              </div>
            </div>
            <!-- Resize Row -->
            <div
              class="group/icon flex h-3 w-full cursor-ns-resize items-center px-2"
              @mousedown="event => resizeRowListener(event, rowIndex + 1, workflowId)"
            >
              <div
                class="h-1 w-full shrink-0 rounded-lg group-hover/icon:bg-slate-400 group-hover:bg-slate-200"
              ></div>
            </div>
          </div>
        </div>
        <!-- Add new Row -->
        <div id="" class="index index-last plus-button" @click="onAddWorkflowRow">
          <PlusIcon class="size-3 stroke-1.5" />
        </div>
      </div>
      <!-- WorkflowSteps as Columns -->
      <div
        v-for="(step, columnIndex) in steps"
        :id="`column_${columnIndex}`"
        :key="columnIndex"
        class="column relative"
      >
        <!-- Teleport Anker -->
        <div :id="`step_teleport_anker_${columnIndex}`" class="absolute left-0 top-8 z-10"></div>
        <!-- Heading Column -->
        <div
          :id="`row_0_cell_${columnIndex}`"
          class="cell group flex items-center justify-between px-2 py-1 hover:bg-slate-100"
        >
          <!-- Heading Text -->
          <div
            class="flex w-full cursor-pointer overflow-hidden"
            @click.stop="() => toggleStepCard(columnIndex, step.id)"
          >
            <AlignLeftIcon class="mr-2 size-4 shrink-0 stroke-1.5" />
            <span class="truncate">{{ step.name }}</span>
          </div>
          <!-- Resize Column -->
          <div class="-mr-1 h-full opacity-0 group-hover:opacity-100">
            <div
              class="h-full w-1 shrink-0 cursor-ew-resize rounded-lg bg-slate-300 hover:bg-slate-400"
              @mousedown="event => resizeColumnListener(event, columnIndex, workflowId)"
            ></div>
          </div>
        </div>
        <!-- DocumentItems as Rows -->
        <div
          v-for="(docItem, rowIndex) in step.document.documentItems"
          :id="`row_${rowIndex + 1}_cell_${columnIndex}`"
          :key="rowIndex"
          class="cell group relative"
          :class="{
            'border border-black': cellActive.x === columnIndex && cellActive.y === rowIndex + 1,
          }"
          @click="() => setCellActive(columnIndex, rowIndex + 1)"
          @dblclick="() => toggleCellCard(columnIndex, rowIndex + 1, docItem.content, docItem.id)"
        >
          <!-- Cell State -->
          <div
            v-if="docItem.processingStatus && docItem.processingStatus !== 'completed'"
            class="absolute right-1 top-0 z-10 rounded-lg border shadow-sm"
          >
            <div
              v-if="docItem.processingStatus === 'failed'"
              class="rounded-lg bg-red-50 p-2 font-bold text-destructive"
            >
              <TriangleAlertIcon class="size-3 stroke-1.5" />
            </div>
            <div v-if="docItem.processingStatus === 'pending'" class="rounded-lg bg-green-100 p-2">
              <LoaderIcon class="size-3 animate-spin stroke-1.5" />
            </div>
          </div>
          <!-- Cell content -->
          <div :id="`cell_content_${docItem.id}`" class="cell-content">
            {{ docItem.content }}
          </div>
          <!-- Row Detail Link -->
          <!--
          <div
            v-if="columnIndex === 0"
            class="group/link absolute right-1 top-1 z-10 opacity-0 group-hover:opacity-100"
            @click="e => e.stopPropagation()"
          >
            <RouterLink
              :to="`/workflow/${workflow?.id}/detail?row=${rowIndex}`"
              class="flex items-center justify-center rounded-lg border bg-white p-1 shadow-md group-hover/link:bg-slate-100"
            >
              <LayoutDashboard class="size-3 stroke-1" />
            </RouterLink>
          </div>
          -->
          <!-- Cellcard teleport anker -->
          <div
            :id="`cellcard_teleport_anker_x${columnIndex}_y${rowIndex + 1}`"
            class="absolute left-0 top-0 z-20"
          ></div>
        </div>
        <!-- Last Cells -->
        <div class="cell cell-last"></div>
      </div>
      <!-- Last Column -->
      <div id="column_last" class="column">
        <!-- Add Column -->
        <div class="index plus-button" @click="onAddWorkflowStep">
          <PlusIcon class="size-3 stroke-1.5" />
        </div>
        <div
          v-for="(count, index) in rowCount"
          :id="`row_${index + 1}_cell_last`"
          :key="index"
          class="index"
        ></div>
        <div class="index index-last">
          <!-- div @mousedown="(e) => resizeAllListener(e, workflowId)">h</!-->
        </div>
      </div>
    </div>
  </div>
  <!-- StepManagement Card -->
  <Teleport v-if="stepCard.show" :to="`#step_teleport_anker_${stepCard.teleportTo}`">
    <StepManagementCard
      :key="stepCard.teleportTo"
      v-on-click-outside.bubble="onCloseStepCard"
      :workflow-id="workflow?.id ?? ''"
      :all-workflow-steps="steps"
      :workflow-step="workflowStepCardActive"
      @refresh="onRefresh"
      @close="onCloseStepCard"
      @show-settings="() => (sideBarOpen = true)"
      @prev-steps-updated="obj => onInputStepsUpdated(obj)"
    />
  </Teleport>
  <!-- CellCard -->
  <Teleport
    v-if="cellCard.show"
    :to="`#cellcard_teleport_anker_x${cellCard.teleportTo.x}_y${cellCard.teleportTo.y}`"
  >
    <WorkflowCellCard
      :key="`x${cellCard.teleportTo.x}_y${cellCard.teleportTo.y}`"
      :workflow-id="workflow?.id ?? ''"
      :step-id="cellCard.stepId"
      :item-id="cellCard.itemId"
      :content="cellCard.content"
      :width="cellCard.width"
      :height="cellCard.heigth"
      @close="onCloseCellCard"
      @refresh="onRefresh"
    />
  </Teleport>

  <Teleport v-if="hasSelectedRows" to="body">
    <div class="absolute bottom-5 left-1/2 -translate-x-1/2">
      <div class="rounded-lg bg-neutral-50 px-3 py-0 text-xs shadow-md">
        <span class="pl-2 font-semibold">{{ selectedRows.length }}</span>
        <Button
          variant="ghost"
          size="icon"
          class="bg-parent ml-3 hover:scale-110 hover:bg-transparent"
          @click="onDeleteSelectedRows"
        >
          <Trash2Icon class="size-3 stroke-2 text-destructive" />
        </Button>
      </div>
    </div>
  </Teleport>
</template>

<style>
.column {
  @apply grid w-fit border-0;
}

.index {
  @apply h-8 w-10 border-b border-l;
}

.index-last {
  @apply !border-b-0;
}

.cell {
  @apply relative h-8 w-40 border-b border-l p-2;
}

.cell-content {
  @apply relative overflow-hidden whitespace-pre-line break-words;
}

.cell-last {
  @apply !border-b-0;
}

.cell-content {
  @apply h-full w-full overflow-hidden text-ellipsis break-words;
}

.plus-button {
  @apply flex cursor-pointer items-center justify-center opacity-60 hover:bg-slate-100 hover:opacity-100;
}
</style>
