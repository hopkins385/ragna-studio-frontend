<script setup lang="ts">
// Imports
import { useAiChatSettingsStore } from '@/modules/ai-chat-settings/stores/ai-chat-settings.store';
import { assistantService } from '@/modules/assistant/assistant.service';
import type { Assistant } from '@/modules/assistant/interfaces/assistant.interfaces';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@ui/select';

// Props
const { selectLocked = false } = defineProps<{
  selectLocked?: boolean;
}>();
// Emits

// Refs
const assistants = ref<Assistant[]>([]);

// Stores
const aiChatSettings = useAiChatSettingsStore();

// Composables

// Computed
const selectDisabled = computed(() => {
  return selectLocked;
});
// Functions
const initAllAssistants = async () => {
  const response = await assistantService.fetchAllAssistants({ page: 1, limit: 100 });
  assistants.value = response.assistants;
};

// Hooks

onMounted(() => {
  initAllAssistants();
});

onBeforeUnmount(() => {
  assistantService.abortRequest();
});
</script>

<template>
  <Select v-model="aiChatSettings.selectedAssistantId" class="w-full" :disabled="selectDisabled">
    <SelectTrigger
      class="h-7 text-xs bg-transparent border-0 focus:ring-0 focus:ring-offset-0 opacity-90"
    >
      <SelectValue :placeholder="$t('assistant.select.placeholder')" />
    </SelectTrigger>
    <SelectContent class="min-w-96">
      <SelectItem
        v-for="assistant in assistants"
        :key="assistant.id"
        :value="assistant.id"
        class="text-xs"
      >
        <span class="opacity-80">{{ assistant.title }}</span>
      </SelectItem>
    </SelectContent>
  </Select>
</template>
