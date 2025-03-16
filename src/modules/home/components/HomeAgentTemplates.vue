<script setup lang="ts">
import type { AssistantTemplate } from '@/modules/assistant-template/interfaces/assistant-template.interfaces';
import { assistantTemplateService } from '@/modules/assistant-template/services/assistant-template.service';
import TemplatePreviewDialog from '@/modules/assistant/components/TemplatePreviewDialog.vue';
import { useTemplatePreview } from '@/modules/assistant/composables/useTemplatePreview';
import { BotIcon } from 'lucide-vue-next';

const { previewDialog, openPreviewDialog } = useTemplatePreview();

const templates = ref<AssistantTemplate[]>([]);

const initTemplates = async () => {
  const { templates: data } = await assistantTemplateService.fetchRandomTemplates({ limit: 9 });
  templates.value = data;
};

onMounted(() => {
  initTemplates();
});
</script>

<template>
  <TemplatePreviewDialog v-model="previewDialog.open" v-bind="previewDialog" />
  <div class="w-full bg-white">
    <div class="pb-4 flex space-x-2">
      <BotIcon class="size-5 stroke-1.5 mt-1" />
      <div>
        <h2 class="text-2xl font-semibold">
          {{ $t('templates.title_short') }}
        </h2>
        <p class="text-xs opacity-75 hidden">
          {{ $t('templates.description') }}
        </p>
      </div>
    </div>
    <div class="flex flex-wrap gap-4">
      <div
        v-for="template in templates"
        :key="template.id"
        class="border bg-white w-60 h-40 rounded-2xl hover:shadow-md cursor-pointer"
        @click="() => openPreviewDialog(template)"
      >
        <h2 class="p-4 font-medium">{{ template.title }}</h2>
      </div>
    </div>
  </div>
</template>
