<script setup lang="ts">
import Heading from '@/components/heading/Heading.vue';
import HeadingTitle from '@/components/heading/HeadingTitle.vue';
import { assistantToolService } from '@/modules/assistant-tool/assistant-tool.service';
import type { AssistantTool } from '@/modules/assistant-tool/interfaces/assistant-tool.interfaces';
import { assistantService } from '@/modules/assistant/assistant.service';
import type { Assistant } from '@/modules/assistant/interfaces/assistant.interfaces';
import AssistantEditForm from '@components/assistant/AssistantEditForm.vue';
import SectionContainer from '@components/section/SectionContainer.vue';
import type { Collection } from '@composables/services/useCollectionService';
import useCollectionService from '@composables/services/useCollectionService';
import bgImgUrl from '@images/bg_robots.png?q=100&format=webp&imagetools';

const assistant = ref<Assistant | null>(null);
const assistantTools = ref<AssistantTool[]>([]);
const collections = ref<Collection[]>([]);

const assistantIsLoading = ref(true);

// assistantId
const route = useRoute();
const assistantId = route.params.id.toString();

const { t } = useI18n();
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
    const { assistant: rAss } = await assistantService.fetchAssistant(assistantId);
    assistant.value = rAss;
  } catch (error) {
    console.error(error);
  }
};

const initAssistantTools = async () => {
  try {
    const { tools } = await assistantToolService.fetchAllTools();
    assistantTools.value = tools;
  } catch (error) {
    console.error(error);
  }
};

const headingTitle = computed(() => `${assistant.value?.title} - ${t('assistant.edit.title')}`);

// noasync = Non-blocking, allows component to render before data is fetched
onMounted(async () => {
  await initAssistant();
  await initAssistantTools();
  await initCollections();
  assistantIsLoading.value = false;
});

useHead({
  title: t('assistant.edit.title'),
  meta: [
    {
      name: 'description',
      content: t('assistant.edit.subtitle'),
    },
  ],
});
</script>

<template>
  <SectionContainer>
    <Heading :img-url="bgImgUrl" bg-position="bottom">
      <template #top>
        <HeadingTitle :title="headingTitle" :subtitle="$t('assistant.edit.subtitle')" />
      </template>
      <template #bottom> </template>
    </Heading>
    <div class="px-10">
      <AssistantEditForm
        v-if="assistant && assistantTools.length"
        :assistant="assistant"
        :assistantTools="assistantTools"
        :collections="collections"
        @refresh-collections="async () => await initCollections()"
        @refresh-assistant="async () => await initAssistant()"
      />
      <div v-else-if="assistantIsLoading">Loading ...</div>
      <div v-else>Assistant Not Found</div>
    </div>
  </SectionContainer>
</template>
