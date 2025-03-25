<script setup lang="ts">
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@ui/tooltip';

interface TooltipWrapperProps {
  content: string;
  delayDuration?: number;
}

defineProps<TooltipWrapperProps>();
</script>

<template>
  <TooltipProvider :delay-duration="delayDuration ?? 300">
    <Tooltip>
      <TooltipTrigger as-child>
        <slot />
      </TooltipTrigger>
      <TooltipContent>{{ content }}</TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>
