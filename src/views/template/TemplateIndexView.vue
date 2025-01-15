<script setup lang="ts">
import TemplatePreviewDialog from '@/components/template/TemplatePreviewDialog.vue';
import {
  useAssistantTemplateService,
  type AssistantTemplateCategory,
  type CategoryWithTemplates,
} from '@/composables/services/useAssistantTemplateService';
import Heading from '@components/heading/Heading.vue';
import HeadingTitle from '@components/heading/HeadingTitle.vue';
import SectionContainer from '@components/section/SectionContainer.vue';
import bgImgUrl from '@images/bg_template_2.png?q=100&format=webp&imagetools';

type ColorMap = {
  [key: string]: string;
};

const colorMap: ColorMap = {
  lime: 'bg-lime-50',
  orange: 'bg-orange-50',
  violet: 'bg-violet-50',
  cyan: 'bg-cyan-50',
  red: 'bg-red-50',
  blue: 'bg-blue-50',
  green: 'bg-green-50',
  yellow: 'bg-yellow-50',
  purple: 'bg-purple-50',
  pink: 'bg-pink-50',
  indigo: 'bg-indigo-50',
  teal: 'bg-teal-50',
  gray: 'bg-gray-50',
};

const { t } = useI18n();
const { fetchAllCategories, fetchTemplatesByCategoryIds } =
  useAssistantTemplateService();

const categories = ref<AssistantTemplateCategory[]>([]);
const catsWithTemplates = ref<CategoryWithTemplates[]>([]);

const previewDialog = reactive({
  open: false,
  title: '',
  description: '',
  bgColor: '',
});

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

const getBgColor = (colorName: string) => {
  return colorMap[colorName];
};

const showPreviewDialog = (template: any) => {
  previewDialog.title = template.title;
  previewDialog.description = template.description;
  previewDialog.bgColor = getBgColor(template.config.color);
  previewDialog.open = true;
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
        <h2 class="text-xl font-semibold pb-2">{{ $t(cat.name) }}</h2>
        <div class="flex overflow-x-scroll space-x-4 no-scrollbar pb-5">
          <div
            v-for="template in cat.templates"
            :key="template.id"
            class="border h-60 w-60 p-4 shrink-0 rounded-lg hover:shadow-lg cursor-pointer"
            :class="getBgColor(template.config.color)"
            @click="() => showPreviewDialog(template)"
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
