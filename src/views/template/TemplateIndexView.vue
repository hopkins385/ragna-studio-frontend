<script setup lang="ts">
import {
  useAssistantTemplateService,
  type AssistantTemplateCategory,
} from '@/composables/services/useAssistantTemplateService';
import Heading from '@components/heading/Heading.vue';
import HeadingTitle from '@components/heading/HeadingTitle.vue';
import SectionContainer from '@components/section/SectionContainer.vue';
import bgImgUrl from '@images/bg_template_2.png?q=100&format=webp&imagetools';

const { t } = useI18n();
const { fetchAllCategories } = useAssistantTemplateService();

const categories = ref<AssistantTemplateCategory[]>([]);

const initTemplateCategories = async () => {
  const { categories: cats } = await fetchAllCategories();
  categories.value = cats;
};

onMounted(() => {
  initTemplateCategories();
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
  </SectionContainer>
</template>
