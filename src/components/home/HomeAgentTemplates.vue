<script setup lang="ts">
import {
  useAssistantTemplateService,
  type AssistantTemplate,
} from '@/composables/services/useAssistantTemplateService';
import { BotIcon } from 'lucide-vue-next';

const templates = ref<AssistantTemplate[]>([]);

const { t } = useI18n();
const { fetchRandomTemplates } = useAssistantTemplateService();

const initTemplates = async () => {
  const { templates: data } = await fetchRandomTemplates({ limit: 9 });
  templates.value = data;
};

onMounted(() => {
  initTemplates();
});
</script>

<template>
  <div class="w-full p-5 bg-white">
    <div class="pb-4 flex space-x-2">
      <BotIcon class="size-6 stroke-1.5 mt-1" />
      <div>
        <h2 class="text-2xl font-semibold">
          {{ $t('templates.assistants.title') }}
        </h2>
        <p class="text-xs opacity-75 hidden">
          {{ $t('templates.assistants.description') }}
        </p>
      </div>
    </div>
    <div class="grid grid-cols-3 gap-5">
      <div
        v-for="template in templates"
        :key="template.id"
        class="border w-full bg-white h-24 rounded-lg hover:shadow-md"
      >
        {{ template.title }}
      </div>
    </div>
  </div>
</template>
