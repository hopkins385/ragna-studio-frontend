<script setup lang="ts">
// Imports
import { useRagnaClient } from '@/composables/useRagnaClient';
import { useAiChatSettingsStore } from '@/modules/ai-chat-settings/stores/ai-chat-settings.store';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@ui/select';
import type { Assistant } from 'ragna-sdk';

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
const client = useRagnaClient();

// Computed
const selectDisabled = computed(() => {
  return selectLocked;
});
// Functions
const initAllAssistants = async () => {
  const response = await client.assistant.fetchAllAssistants({ page: 1, limit: 100 });
  assistants.value = response.assistants;
};

// Hooks

onMounted(() => {
  initAllAssistants();
});

onBeforeUnmount(() => {
  // aborts fetchAllAssistants request
  client.assistant.abortRequest();
});
</script>

<template>
  <Select v-model="aiChatSettings.selectedAssistantId" class="w-full" :disabled="selectDisabled">
    <SelectTrigger
      class="h-7 text-xs bg-transparent border-0 focus:ring-0 focus:ring-offset-0 max-w-52"
    >
      <SelectValue :placeholder="$t('assistant.select.placeholder')" />
    </SelectTrigger>
    <SelectContent class="min-w-48">
      <SelectItem
        v-for="assistant in assistants"
        :key="assistant.id"
        :value="assistant.id"
        class="text-xs"
      >
        <p class="max-w-60 overflow-hidden truncate">
          <span class="opacity-90">{{ assistant.title }}</span>
        </p>
      </SelectItem>
    </SelectContent>
  </Select>
</template>
