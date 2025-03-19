<script setup lang="ts">
import Heading from '@/components/heading/Heading.vue';
import HeadingTitle from '@/components/heading/HeadingTitle.vue';
import { useRagnaClient } from '@/composables/useRagnaClient';
import type { AssistantTool } from '@/modules/assistant-tool/interfaces/assistant-tool.interfaces';
import { assistantToolService } from '@/modules/assistant-tool/services/assistant-tool.service';
import AssistantEditForm from '@/modules/assistant/components/AssistantEditForm.vue';
import type { Collection } from '@/modules/collection/interfaces';
import { collectionService } from '@/modules/collection/services/collection.service';
import SectionContainer from '@components/section/SectionContainer.vue';
import bgImgUrl from '@images/bg_robots.png?q=100&format=webp&imagetools';
import type { Assistant } from 'ragna-sdk';

const assistant = ref<Assistant | null>(null);
const assistantTools = ref<AssistantTool[]>([]);
const collections = ref<Collection[]>([]);

const assistantIsLoading = ref(true);

const client = useRagnaClient();
// assistantId
const route = useRoute();
const assistantId = route.params.id.toString();

const { t } = useI18n();

const initCollections = async () => {
  const model = {
    type: 'assistant',
    id: assistantId,
  };
  try {
    const { collections: resultCollections } = await collectionService.fetchAllCollectionsFor({
      model,
    });
    collections.value = resultCollections;
  } catch (error) {
    console.error(error);
  }
};

const initAssistant = async () => {
  try {
    const { assistant: rAss } = await client.assistant.fetchAssistant(assistantId);
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
