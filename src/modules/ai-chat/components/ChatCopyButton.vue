<script setup lang="ts">
import { Button } from '@/components/ui/button';

// Imports

// Props
const props = defineProps<{
  text: string;
}>();
// Emits

// Refs

// Composables
const { copy, copied } = useClipboard();
// Computed
// Functions

// Hooks

const handleClick = () => {
  copy(props.text.trim());
};
</script>

<template>
  <Button @click="handleClick" class="absolute top-2 right-2" size="sm" variant="outline">
    <!--
    <CheckIcon v-if="copied" class="size-4" />
    <CopyIcon v-else class="size-4" />
    -->
    {{ copied ? 'Copied!' : 'Copy' }}
  </Button>
</template>
