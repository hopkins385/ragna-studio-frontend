<script setup lang="ts">
import ButtonLink from '@/common/components/button/ButtonLink.vue';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@ui/tooltip';
import { SquarePen } from 'lucide-vue-next';
</script>

<template>
  <TooltipProvider :delay-duration="300">
    <Tooltip>
      <TooltipTrigger as-child>
        <ButtonLink to="/assistant" variant="outline" size="icon" class="group">
          <SquarePen class="size-4 stroke-1.5 group-hover:stroke-2" />
        </ButtonLink>
      </TooltipTrigger>
      <TooltipContent>
        <p class="text-sm">{{ $t('chat.create.tooltip.new') }}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>
