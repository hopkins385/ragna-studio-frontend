<script setup lang="ts">
// Imports
import { useAiChatSettingsStore } from '@/modules/ai-chat-settings/stores/ai-chat-settings.store';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@ui/select';

// Props
const { selectLocked = false } = defineProps<{
  selectLocked?: boolean;
}>();
// Emits

// Refs
const tasks = ref<any[]>([
  {
    id: 'task1',
    title: 'Fragen',
  },
  {
    id: 'task2',
    title: 'Editieren',
  },
]);

const selectedTask = ref<string>(tasks.value[1].id);

// Stores
const aiChatSettings = useAiChatSettingsStore();

// Composables
// Computed
const selectDisabled = computed(() => {
  return selectLocked;
});
// Functions
// Hooks
</script>

<template>
  <Select v-model="selectedTask" class="w-full" :disabled="selectDisabled">
    <SelectTrigger
      class="h-7 text-xs bg-transparent border-0 focus:ring-0 focus:ring-offset-0 max-w-52"
    >
      <SelectValue :placeholder="$t('assistant.task.placeholder')" />
    </SelectTrigger>
    <SelectContent class="min-w-32">
      <SelectItem v-for="task in tasks" :key="task.id" :value="task.id" class="text-xs">
        <p class="max-w-60 overflow-hidden truncate">
          <span class="opacity-90">{{ task.title }}</span>
        </p>
      </SelectItem>
    </SelectContent>
  </Select>
</template>
