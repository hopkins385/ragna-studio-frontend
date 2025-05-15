<script setup lang="ts">
import TooltipWrapper from '@/components/tooltip/TooltipWrapper.vue';
import { Button } from '@/components/ui/button';
import { CheckIcon, CopyIcon } from 'lucide-vue-next';

// Imports

// Props
const props = defineProps<{
  label: string;
  content: string;
}>();
// Emits

// Refs

// Composables
const { copy, copied } = useClipboard();
// Computed
// Functions
const handleClick = () => copy(props.content.trim());
// Hooks
</script>

<template>
  <TooltipWrapper :content="label" :delay-duration="100">
    <Button
      @click="handleClick"
      class="absolute top-2 right-2 bg-transparent"
      size="icon"
      variant="ghost"
    >
      <span class="opacity-60">
        <CopyIcon v-if="!copied" class="size-4" />
        <CheckIcon v-else class="size-4" />
      </span>
    </Button>
  </TooltipWrapper>
</template>
