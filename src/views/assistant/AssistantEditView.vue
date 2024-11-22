<script setup lang="ts">
import AssistantEditForm from '@components/assistant/AssistantEditForm.vue';
import SectionContainer from '@components/section/SectionContainer.vue';
import SectionHeading from '@components/section/SectionHeading.vue';
import useAssistantService, {
  type Assistant,
} from '@composables/services/useAssistantService';
import {
  useAssistantToolsService,
  type AssistantTool,
} from '@composables/services/useAssistantToolsService';
import useCollectionService, {
  type Collection,
} from '@composables/services/useCollectionService';

const assistant = ref<Assistant | null>(null);
const assistantTools = ref<AssistantTool[]>([]);
const collections = ref<Collection[]>([]);

// assistantId
const route = useRoute();
const assistantId = route.params.id.toString();

const { fetchAssistant } = useAssistantService();
const { fetchAllTools } = useAssistantToolsService();
const { fetchAllFor } = useCollectionService();

const initCollections = async () => {
  const model = {
    type: 'assistant',
    id: assistantId,
  };
  const response = await fetchAllFor({ model });
  collections.value = response.collections;
};

const initAssistant = async () => {
  try {
    const response = await fetchAssistant(assistantId);
    assistant.value = response.assistant;
  } catch (error) {
    console.error(error);
  }
};

const initAssistantTools = async () => {
  const { tools } = await fetchAllTools();
  assistantTools.value = tools;
};

// noasync = Non-blocking, allows component to render before data is fetched
onMounted(() => {
  initAssistant();
  initAssistantTools();
  initCollections();
});
</script>

<template>
  <SectionContainer>
    <SectionHeading
      title="Update Assistant"
      subtitle="Updating an existing assistant does only affect new conversations and workflows."
    />
    <div class="rounded-lg border bg-white p-10">
      <AssistantEditForm
        v-if="assistant && assistantTools.length"
        :assistant="assistant"
        :assistantTools="assistantTools"
        :collections="collections"
        @refreshCollections="initCollections"
      />
    </div>
  </SectionContainer>
</template>
