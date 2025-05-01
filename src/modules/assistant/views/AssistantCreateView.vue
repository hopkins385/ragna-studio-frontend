<script setup lang="ts">
import Heading from '@/components/heading/Heading.vue';
import HeadingTitle from '@/components/heading/HeadingTitle.vue';
import { useRagnaClient } from '@/composables/useRagnaClient';
import AssistantCreateForm from '@/modules/assistant/components/AssistantCreateForm.vue';
import SectionContainer from '@components/section/SectionContainer.vue';
import type { AssistantTool } from '@hopkins385/ragna-sdk';
import bgImgUrl from '@images/bg_robots.png?q=100&format=webp&imagetools';

const client = useRagnaClient();
const { t } = useI18n();

// tools
const assistantTools = ref<AssistantTool[]>([]);

const getTools = async () => {
  try {
    const { tools } = await client.assistantTool.fetchAllTools();
    assistantTools.value = tools;
  } catch (error) {
    console.error(error);
  }
};

onMounted(() => getTools());

useHead({
  title: t('assistant.create.title'),
  meta: [
    {
      name: 'description',
      content: t('assistant.create.subtitle'),
    },
  ],
});
</script>

<template>
  <SectionContainer>
    <Heading :img-url="bgImgUrl" bg-position="bottom">
      <template #top>
        <HeadingTitle
          :title="$t('assistant.create.title')"
          :subtitle="$t('assistant.create.subtitle')"
        />
      </template>
      <template #bottom> </template>
    </Heading>
    <div class="px-14">
      <AssistantCreateForm />
    </div>
  </SectionContainer>
</template>
