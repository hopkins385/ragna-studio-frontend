<script setup lang="ts">
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { EllipsisIcon, Trash2Icon } from 'lucide-vue-next';

// Imports

// Props
// Emits
defineEmits<{
  delete: [void];
}>();

// Refs

// Composables

// Computed
// Functions

// Hooks
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger class="group">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger as-child class="outline-none">
            <EllipsisIcon class="size-4 opacity-70 group-hover:opacity-100 cursor-pointer" />
          </TooltipTrigger>
          <TooltipContent>
            <p>Menu</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuItem class="group cursor-pointer" @click="$emit('delete')">
        <div class="flex items-center space-x-2">
          <Trash2Icon class="size-4 opacity-70 group-hover:text-destructive cursor-pointer" />
          <span class="text-sm">{{ $t('form.button.delete') }}</span>
        </div>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
