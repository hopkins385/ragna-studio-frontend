<script setup lang="ts">
import BoxContainer from '@/components/box/BoxContainer.vue';
import ButtonLink from '@/components/button/ButtonLink.vue';
import CollectionTable from '@/components/collection/CollectionTable.vue';
import Heading from '@/components/heading/Heading.vue';
import SectionContainer from '@/components/section/SectionContainer.vue';
import SectionHeading from '@/components/section/SectionHeading.vue';
import TableSkeleton from '@/components/table/TableSkeleton.vue';
import { PlusIcon } from 'lucide-vue-next';
</script>

<template>
  <SectionContainer>
    <SectionHeading
      :title="$t('collections.title')"
      :subtitle="$t('collections.subtitle')"
    />
    <Heading>
      <template #top> </template>
      <template #bottom>
        <div class="flex w-full justify-between px-3 pb-2 pt-14">
          <div></div>
          <ButtonLink class="self-end" to="/collection/create">
            {{ $t('collection.button.create') }}
            <PlusIcon class="ml-2 size-4 stroke-2" />
          </ButtonLink>
        </div>
      </template>
    </Heading>
    <BoxContainer>
      <Suspense>
        <CollectionTable />
        <template #fallback>
          <TableSkeleton />
        </template>
      </Suspense>
    </BoxContainer>
  </SectionContainer>
</template>
