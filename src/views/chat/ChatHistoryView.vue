<script setup lang="ts">
import BoxContainer from '@components/box/BoxContainer.vue';
import ChatHistory from '@components/chat/ChatHistory.vue';
import SectionContainer from '@components/section/SectionContainer.vue';
import SectionHeading from '@components/section/SectionHeading.vue';
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
    <SectionHeading
      :title="$t('chat.history.title')"
      :subtitle="$t('chat.history.subtitle')"
    />
    <div class="pb-6 hidden">
      <Input v-model="search" placeholder="Search chat title ..." />
    </div>
    <Suspense>
      <ChatHistory :search="search" :page="page" @update:page="setRoutePage" />
      <template #fallback>
        <BoxContainer>
          <TableSkeleton />
        </BoxContainer>
      </template>
    </Suspense>
  </SectionContainer>
</template>
