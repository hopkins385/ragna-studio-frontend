<script setup lang="ts">
import { SettingsIcon } from 'lucide-vue-next';
import { Button } from '../ui/button';
import Sheet from '../ui/sheet/Sheet.vue';
import { SheetContent, SheetHeader, SheetTrigger } from '../ui/sheet';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import SheetTitle from '../ui/sheet/SheetTitle.vue';
import SheetDescription from '../ui/sheet/SheetDescription.vue';

defineProps<{
  workflowId: string;
}>();

const sheetIsOpen = ref(false);

const onClick = () => {
  sheetIsOpen.value = true;
};
</script>

<template>
  <Sheet v-model:open="sheetIsOpen" :modal="false">
    <SheetTrigger as-child>
      <TooltipProvider :delay-duration="300">
        <Tooltip>
          <TooltipTrigger as-child>
            <Button variant="ghost" size="icon" class="" @click="onClick">
              <SettingsIcon class="stroke-1.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p class="text-sm">Settings</p>
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
        <SheetTitle class="text-base"> Workflow Settings </SheetTitle>
        <SheetDescription> </SheetDescription>
      </SheetHeader>
      <Separator />
      <div class="px-4 pt-2"></div>
    </SheetContent>
  </Sheet>
</template>
