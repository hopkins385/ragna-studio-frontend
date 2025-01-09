<script setup lang="ts">
import HeadingTitle from '@/components/heading/HeadingTitle.vue';
import BoxContainer from '@components/box/BoxContainer.vue';
import ButtonLink from '@components/button/ButtonLink.vue';
import CollectionTable from '@components/collection/CollectionTable.vue';
import Heading from '@components/heading/Heading.vue';
import SectionContainer from '@components/section/SectionContainer.vue';
import TableSkeleton from '@components/table/TableSkeleton.vue';
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
    <Heading>
      <template #top>
        <HeadingTitle
          :title="$t('collections.title')"
          :subtitle="$t('collections.subtitle')"
        />
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
    <BoxContainer class="!p-0">
      <Suspense>
        <CollectionTable />
        <template #fallback>
          <TableSkeleton />
        </template>
      </Suspense>
    </BoxContainer>
  </SectionContainer>
</template>
