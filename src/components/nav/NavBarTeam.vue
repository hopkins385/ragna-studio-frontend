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
import { useAuthStore } from '@/modules/auth/stores/auth.store';

// Props
// Emits

// Refs
const selected = ref('');

// Composables
const authStore = useAuthStore();

// Computed
// Functions

// Hooks
onMounted(() => {
  // set default value
  selected.value = authStore.user?.teams[0]?.name || '';
});
</script>

<template>
  <Select v-model:model-value="selected">
    <SelectTrigger class="w-36 opacity-75 h-7 text-xs">
      <SelectValue placeholder="Select a team" />
    </SelectTrigger>
    <SelectContent class="w-40">
      <SelectGroup class="">
        <SelectLabel class="text-xs">Teams</SelectLabel>
        <template v-for="team in authStore.user?.teams" :key="team.id">
          <SelectItem class="text-xs" :value="team.name">{{ team.name }}</SelectItem>
        </template>
      </SelectGroup>
    </SelectContent>
  </Select>
</template>
