<script setup lang="ts">
// Imports
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Props
// Emits

// Refs
const selected = ref('default');

// Composables

// Computed
// Functions

// Hooks
</script>

<template>
  <Select v-model:model-value="selected">
    <SelectTrigger class="w-40 opacity-75 h-7 text-xs">
      <SelectValue placeholder="Select a project" />
    </SelectTrigger>
    <SelectContent class="w-40">
      <SelectGroup class="">
        <SelectLabel class="text-xs">Projects</SelectLabel>
        <SelectItem class="text-xs" value="default">First Project</SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>
</template>
