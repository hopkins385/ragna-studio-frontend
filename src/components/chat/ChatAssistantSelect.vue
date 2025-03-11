<script setup lang="ts">
// Imports
import useAssistantService from '@/composables/services/useAssistantService';
import type { Assistant } from '@/composables/services/useChatService';
import { useAiChatStore } from '@/modules/ai-chat/stores/ai-chat.store';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@ui/select';

// Props
// Emits

// Refs
const assistants = ref<Assistant[]>([]);

// Stores
const aiChatStore = useAiChatStore();

// Composables
const { fetchAllAssistants } = useAssistantService();

// Computed
// Functions
const initAllAssistants = async () => {
  const { assistants: data } = await fetchAllAssistants({ page: 1, limit: 100 });
  assistants.value = data as any;
};
// Hooks
onMounted(() => {
  initAllAssistants();
});
</script>

<template>
  <Select v-model="aiChatStore.assistantId" class="w-full">
    <SelectTrigger
      class="h-7 text-xs bg-transparent border-0 focus:ring-0 focus:ring-offset-0 opacity-90"
    >
      <SelectValue placeholder="Select an agent" />
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
