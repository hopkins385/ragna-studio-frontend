<script setup lang="ts">
import AssistantEditForm from '@components/assistant/AssistantEditForm.vue';
import SectionContainer from '@components/section/SectionContainer.vue';
import SectionHeading from '@components/section/SectionHeading.vue';
import type { Assistant } from '@composables/services/useAssistantService';
import useAssistantService from '@composables/services/useAssistantService';
import type { AssistantTool } from '@composables/services/useAssistantToolsService';
import { useAssistantToolsService } from '@composables/services/useAssistantToolsService';
import type { Collection } from '@composables/services/useCollectionService';
import useCollectionService from '@composables/services/useCollectionService';

const assistant = ref<Assistant | null>(null);
const assistantTools = ref<AssistantTool[]>([]);
const collections = ref<Collection[]>([]);

// assistantId
const route = useRoute();
const assistantId = route.params.id.toString();

const { fetchAssistant } = useAssistantService();
const { fetchAllTools } = useAssistantToolsService();
const { fetchAllCollectionsFor } = useCollectionService();

const initCollections = async () => {
  const model = {
    type: 'assistant',
    id: assistantId,
  };
  try {
    const { collections: resultCollections } = await fetchAllCollectionsFor({
      model,
    });
    collections.value = resultCollections;
  } catch (error) {
    console.error(error);
  }
};

const initAssistant = async () => {
  try {
    const { assistant: rAss } = await fetchAssistant(assistantId);
    assistant.value = rAss;
  } catch (error) {
    console.error(error);
  }
};

const initAssistantTools = async () => {
  try {
    const { tools } = await fetchAllTools();
    assistantTools.value = tools;
  } catch (error) {
    console.error(error);
  }
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
      :title="$t('assistant.edit.title')"
      :subtitle="$t('assistant.edit.subtitle')"
    />
    <div class="px-5">
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
