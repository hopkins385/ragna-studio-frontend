<script setup lang="ts">
import Heading from '@/components/heading/Heading.vue';
import HeadingTitle from '@/components/heading/HeadingTitle.vue';
import { useRagnaClient } from '@/composables/useRagnaClient';
import AssistantEditForm from '@/modules/assistant/components/AssistantEditForm.vue';
import SectionContainer from '@components/section/SectionContainer.vue';
import type { Assistant, AssistantTool, Collection } from '@hopkins385/ragna-sdk';
import bgImgUrl from '@images/bg_robots.png?q=100&format=webp&imagetools';

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
    const { collections: resultCollections } = await client.collection.fetchAllCollectionsFor({
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
    const { tools } = await client.assistantTool.fetchAllTools();
    assistantTools.value = tools;
  } catch (error) {
    console.error(error);
  }
};

const headingTitle = computed(() => `${assistant.value?.title} - ${t('assistant.edit.title')}`);

// noasync = Non-blocking, allows component to render before data is fetched
onBeforeMount(async () => {
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
    <div class="px-16">
      <AssistantEditForm
        v-if="assistant && assistantTools.length"
        :assistant="assistant"
        :assistantTools="assistantTools"
        :collections="collections"
        @refresh-collections="async () => await initCollections()"
        @refresh-assistant="async () => await initAssistant()"
      />
      <div v-else-if="assistantIsLoading"></div>
      <div v-else>Assistant Not Found</div>
    </div>
  </SectionContainer>
</template>
