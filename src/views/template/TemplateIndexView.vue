<script setup lang="ts">
import {
  useAssistantTemplateService,
  type AssistantTemplateCategory,
  type CategoryWithTemplates,
} from '@/composables/services/useAssistantTemplateService';
import Heading from '@components/heading/Heading.vue';
import HeadingTitle from '@components/heading/HeadingTitle.vue';
import SectionContainer from '@components/section/SectionContainer.vue';
import bgImgUrl from '@images/bg_template_2.png?q=100&format=webp&imagetools';

const { t } = useI18n();
const { fetchAllCategories, fetchTemplatesByCategoryIds } =
  useAssistantTemplateService();

const categories = ref<AssistantTemplateCategory[]>([]);
const catsWithTemplates = ref<CategoryWithTemplates[]>([]);

const initTemplateCategories = async () => {
  const { categories: cats } = await fetchAllCategories();
  categories.value = cats;
};

const getTemplatesByCategoryIds = async (payload: {
  categoryIds: string[];
}) => {
  const { categories } = await fetchTemplatesByCategoryIds(payload);
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
  <SectionContainer>
    <Heading :img-url="bgImgUrl" bg-position="center">
      <template #top>
        <HeadingTitle
          :title="$t('templates.title')"
          :subtitle="$t('templates.subtitle')"
        />
      </template>
      <template #bottom> </template>
    </Heading>
    <div class="px-10">
      <ul class="flex flex-wrap space-x-10">
        <li
          v-for="(category, index) in categories"
          :key="category.id"
          class="py-2"
        >
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
      <div
        v-for="cat in catsWithTemplates"
        :key="cat.id"
        class="p-10 flex flex-col"
      >
        <div class="text-lg font-semibold">{{ $t(cat.name) }}</div>
        <div class="flex overflow-x-scroll space-x-4">
          <div
            v-for="template in cat.templates"
            :key="template.id"
            class="border h-60 w-60 p-4 shrink-0"
          >
            {{ template.title }}
          </div>
        </div>
      </div>
    </div>
  </SectionContainer>
</template>
