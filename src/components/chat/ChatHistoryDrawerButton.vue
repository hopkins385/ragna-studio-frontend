<script setup lang="ts">
import { useDrawerStore } from '@stores/drawer.store';
import { Button } from '@ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@ui/tooltip';
import { HistoryIcon } from 'lucide-vue-next';

const drawer = useDrawerStore();
</script>

<template>
  <TooltipProvider :delay-duration="300">
    <Tooltip>
      <TooltipTrigger as-child>
        <Button
          variant="outline"
          size="icon"
          class="group"
          @click="drawer.toggle('ChatHistory')"
        >
          <HistoryIcon class="size-4 stroke-1.5 group-hover:stroke-2" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p class="text-sm">{{ $t('chat.history.tooltip.show') }}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>
