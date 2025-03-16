<script setup lang="ts">
import TemplatePreviewDialog from '@/components/template/TemplatePreviewDialog.vue';
import { useTemplatePreview } from '@/composables/useTemplatePreview';
import type {
  AssistantTemplateCategory,
  CategoryWithTemplates,
} from '@/modules/assistant-template/interfaces/assistant-template.interfaces';
import { assistantTemplateService } from '@/modules/assistant-template/services/assistant-template.service';
import Heading from '@components/heading/Heading.vue';
import HeadingTitle from '@components/heading/HeadingTitle.vue';
import SectionContainer from '@components/section/SectionContainer.vue';
import bgImgUrl from '@images/bg_template_2.png?q=100&format=webp&imagetools';

const { previewDialog, getBgColorClass, openPreviewDialog } = useTemplatePreview();

const categories = ref<AssistantTemplateCategory[]>([]);
const catsWithTemplates = ref<CategoryWithTemplates[]>([]);

const initTemplateCategories = async () => {
  const { categories: cats } = await assistantTemplateService.fetchAllCategories();
  categories.value = cats;
};

const getTemplatesByCategoryIds = async (payload: { categoryIds: string[] }) => {
  const { categories } = await assistantTemplateService.fetchTemplatesByCategoryIds(payload);
  catsWithTemplates.value = categories;
};

onMounted(async () => {
  await initTemplateCategories();
  if (categories.value.length > 0) {
    const ids = categories.value.map(cat => cat.id);
    await getTemplatesByCategoryIds({
      categoryIds: ids,
    });
  }
});
</script>

<template>
  <TemplatePreviewDialog v-model="previewDialog.open" v-bind="previewDialog" />
  <SectionContainer>
    <Heading :img-url="bgImgUrl" bg-position="center">
      <template #top>
        <HeadingTitle
          :title="$t('assistant.templates.title')"
          :subtitle="$t('assistant.templates.subtitle')"
        />
      </template>
      <template #bottom> </template>
    </Heading>
    <div class="px-10">
      <ul class="flex flex-wrap space-x-10">
        <li v-for="(category, index) in categories" :key="category.id" class="py-2">
          <div
            class="text-sm px-3 pb-2"
            :class="{
              'border-b-2 border-purple-700 font-semibold': index === 0,
            }"
          >
            {{ $t(category.name) }}
          </div>
        </li>
      </ul>
    </div>
    <div>
      <div v-for="cat in catsWithTemplates" :key="cat.id" class="p-10 flex flex-col">
        <h2 class="text-xl font-semibold pb-2">{{ $t(cat.name) }}</h2>
        <div class="flex overflow-x-scroll space-x-4 no-scrollbar pb-5">
          <div
            v-for="template in cat.templates"
            :key="template.id"
            class="border h-60 w-60 p-4 shrink-0 rounded-lg hover:shadow-lg cursor-pointer"
            :class="getBgColorClass(template.config.color)"
            @click="() => openPreviewDialog(template)"
          >
            {{ template.config.color }}
            <h3 class="text-2xl font-bold uppercase">
              {{ template.title }}
            </h3>
            {{ template.config.free ? '' : 'Pro' }}
          </div>
        </div>
      </div>
    </div>
  </SectionContainer>
</template>
