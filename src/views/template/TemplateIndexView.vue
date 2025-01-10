<script setup lang="ts">
import {
  useAssistantTemplateService,
  type AssistantTemplate,
} from '@/composables/services/useAssistantTemplateService';
import Heading from '@components/heading/Heading.vue';
import HeadingTitle from '@components/heading/HeadingTitle.vue';
import SectionContainer from '@components/section/SectionContainer.vue';

const { t } = useI18n();
const { fetchRandomTemplates } = useAssistantTemplateService();

const templates = ref<AssistantTemplate[]>([]);

const initTemplates = async () => {
  const { templates: rf } = await fetchRandomTemplates({ limit: 5 });
  templates.value = rf;
};

onMounted(() => {
  initTemplates();
});
</script>

<template>
  <SectionContainer>
    <Heading>
      <template #top>
        <HeadingTitle
          :title="$t('templates.title')"
          :subtitle="$t('templates.subtitle')"
        />
      </template>
      <template #bottom> </template>
    </Heading>
    <div class="px-10">
      <ul>
        <li v-for="template in templates" :key="template.id" class="py-2">
          {{ $t(template.title) }}
        </li>
      </ul>
      {{ templates }}
    </div>
  </SectionContainer>
</template>
