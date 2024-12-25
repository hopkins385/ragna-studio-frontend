<script setup lang="ts">
import { useWorkflowService } from '@/composables/services/useWorkflowService';
import useToast from '@/composables/useToast';
import { Button } from '@ui/button';
import Separator from '@ui/separator/Separator.vue';
import { SheetContent, SheetHeader, SheetTrigger } from '@ui/sheet';
import Sheet from '@ui/sheet/Sheet.vue';
import SheetDescription from '@ui/sheet/SheetDescription.vue';
import SheetTitle from '@ui/sheet/SheetTitle.vue';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@ui/tooltip';
import { ShareIcon } from 'lucide-vue-next';
import ExcelIcon from '~icons/vscode-icons/file-type-excel';

const props = defineProps<{
  workflowId: string;
}>();

const emit = defineEmits<{
  refresh: [void];
}>();

const toast = useToast();

const sheetIsOpen = ref(false);

const { exportWorkflow } = useWorkflowService();

const onClick = () => {
  sheetIsOpen.value = true;
};

const onExcelClick = async () => {
  const response = await exportWorkflow(props.workflowId, 'xlsx');

  const url = window.URL.createObjectURL(response);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${props.workflowId}.xlsx`;
  a.click();
  window.URL.revokeObjectURL(url);
  a.remove();
};
</script>

<template>
  <Sheet v-model:open="sheetIsOpen" :modal="false" :destroy="false">
    <SheetTrigger as-child>
      <TooltipProvider :delay-duration="300">
        <Tooltip>
          <TooltipTrigger as-child>
            <Button variant="ghost" size="icon" class="group" @click="onClick">
              <ShareIcon
                class="stroke-1.5 opacity-75 group-hover:opacity-100"
              />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p class="text-sm">{{ $t('workflow.export.tooltip') }}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </SheetTrigger>
    <SheetContent
      @open-auto-focus="e => e.preventDefault()"
      side="right"
      class=""
    >
      <SheetHeader class="">
        <SheetTitle class="text-base flex items-center space-x-2">
          <ShareIcon class="size-5 stroke-1.5" />
          <span>{{ $t('workflow.export.title') }}</span>
        </SheetTitle>
        <SheetDescription> </SheetDescription>
      </SheetHeader>
      <div class="h-1"></div>
      <Separator class="" />
      <div class="mt-10">
        <div class="text-center w-20 ml-5">
          <button
            class="size-20 border hover:shadow-md rounded-lg flex justify-center items-center"
            @click="onExcelClick"
          >
            <ExcelIcon class="size-10 mr-1" />
          </button>
          <span class="text-xs"> Excel </span>
        </div>
      </div>
    </SheetContent>
  </Sheet>
</template>
