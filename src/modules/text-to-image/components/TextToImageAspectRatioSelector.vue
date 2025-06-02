<script setup lang="ts">
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useImgGenSettingsStore } from '@/modules/text-to-image/stores/image-gen-settings.store';

// Imports
const aspectRatios = [
  { label: '1:1', value: '1:1' },
  { label: '4:3', value: '4:3' },
  { label: '16:9', value: '16:9' },
  { label: '2:1', value: '2:1' },
  { label: '3:2', value: '3:2' },
] as const;

const settings = useImgGenSettingsStore();

// Props
// Emits

// Refs

// Composables

// Computed
// Functions

// Hooks
</script>

<template>
  <Select v-model="settings.imageAspectRatio">
    <SelectTrigger>
      <SelectValue placeholder="Select an ratio" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem v-for="ratio in aspectRatios" :key="ratio.value" :value="ratio.value">
        {{ ratio.label }}
      </SelectItem>
    </SelectContent>
  </Select>
</template>
