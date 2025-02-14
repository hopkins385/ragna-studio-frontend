<script setup lang="ts">
import HeadingTitle from '@/components/heading/HeadingTitle.vue';
import ButtonLink from '@components/button/ButtonLink.vue';
import CollectionTable from '@components/collection/CollectionTable.vue';
import Heading from '@components/heading/Heading.vue';
import SectionContainer from '@components/section/SectionContainer.vue';
import TableSkeleton from '@components/table/TableSkeleton.vue';
import bgImgUrl from '@images/bg_databases.png?q=100&format=webp&imagetools';
import { PlusIcon } from 'lucide-vue-next';

const { t } = useI18n();

useHead({
  title: t('collections.title'),
  meta: [
    {
      name: 'description',
      content: t('collections.subtitle'),
    },
  ],
});
</script>

<template>
  <SectionContainer>
    <!-- Header -->
    <Heading :img-url="bgImgUrl" bg-position="bottom">
      <template #top>
        <HeadingTitle :title="$t('collections.title')" :subtitle="$t('collections.subtitle')" />
      </template>
      <template #bottom>
        <div class="flex w-full justify-between space-x-4">
          <div></div>
          <ButtonLink class="self-end" to="/collection/create">
            {{ $t('collection.button.create') }}
            <PlusIcon class="ml-2 size-4 stroke-2" />
          </ButtonLink>
        </div>
      </template>
    </Heading>
    <!-- Table -->
    <div class="px-10">
      <Suspense>
        <CollectionTable />
        <template #fallback>
          <TableSkeleton />
        </template>
      </Suspense>
    </div>
  </SectionContainer>
</template>
