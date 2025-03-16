<script setup lang="ts">
import Heading from '@/components/heading/Heading.vue';
import HeadingTitle from '@/components/heading/HeadingTitle.vue';
import ChatHistory from '@/modules/ai-chat/components/ChatHistory.vue';
import BoxContainer from '@components/box/BoxContainer.vue';
import SectionContainer from '@components/section/SectionContainer.vue';
import TableSkeleton from '@components/table/TableSkeleton.vue';
import { Input } from '@ui/input';

const router = useRouter();
const route = useRoute();
const page = ref(route.query.page ? parseInt(route.query.page as string) : 1);
const search = ref('');

const { t } = useI18n();

function setRoutePage(value: number) {
  page.value = value;
  const query = { ...route.query, page: value.toString() };
  router.push({ query });
}

useHead({
  title: t('chat.history.title'),
  meta: [
    {
      name: 'description',
      content: t('chat.history.subtitle'),
    },
  ],
});
</script>

<template>
  <SectionContainer>
    <Heading>
      <template #top>
        <HeadingTitle :title="$t('chat.history.title')" :subtitle="$t('chat.history.subtitle')" />
      </template>
      <template #bottom> </template>
    </Heading>
    <div class="pb-6 hidden">
      <Input v-model="search" placeholder="Search chat title ..." />
    </div>
    <div class="px-10">
      <Suspense>
        <ChatHistory :search="search" :page="page" @update:page="setRoutePage" />
        <template #fallback>
          <BoxContainer>
            <TableSkeleton />
          </BoxContainer>
        </template>
      </Suspense>
    </div>
  </SectionContainer>
</template>
