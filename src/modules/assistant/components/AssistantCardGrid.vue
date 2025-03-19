<script setup lang="ts">
import { useRagnaClient } from '@/composables/useRagnaClient';
import type { AssistantsPaginatedResponse } from 'ragna-sdk';
import AssistantCard from './AssistantCard.vue';
import AssistantEmptyList from './AssistantEmptyList.vue';

const client = useRagnaClient();

const data = ref<AssistantsPaginatedResponse>();

const assistants = computed(() => data.value?.assistants || []);
const meta = computed(() => data.value?.meta || '');

onMounted(async () => {
  data.value = await client.assistant.fetchAllAssistants({ page: 1, limit: 10 });
});

onBeforeUnmount(() => {
  client.assistant.abortRequest();
});
</script>

<template>
  <div v-if="assistants && assistants.length > 0" class="grid grid-cols-3 gap-5">
    <AssistantCard v-for="assistant in assistants" :key="assistant.id" :assistant="assistant" />
    <div class="hidden p-5 text-sm text-slate-300">{{ meta }}</div>
  </div>
  <div v-else>
    <AssistantEmptyList />
  </div>
</template>
