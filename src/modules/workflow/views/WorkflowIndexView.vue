<script setup lang="ts">
import ButtonLink from '@/common/components/button/ButtonLink.vue';
import HeadingTitle from '@/components/heading/HeadingTitle.vue';
import WorkflowListAll from '@/modules/workflow/components/WorkflowListAll.vue';
import Heading from '@components/heading/Heading.vue';
import SectionContainer from '@components/section/SectionContainer.vue';
import TableSkeleton from '@components/table/TableSkeleton.vue';
import bgImgUrl from '@images/bg_workflow.png?q=100&format=webp&imagetools';
import { PlusIcon } from 'lucide-vue-next';

const { t } = useI18n();

useHead({
  title: t('workflows.title'),
  meta: [
    {
      name: 'description',
      content: t('workflows.subtitle'),
    },
  ],
});
</script>

<template>
  <SectionContainer>
    <Heading :img-url="bgImgUrl" bg-position="bottom">
      <template #top>
        <HeadingTitle :title="$t('workflows.title')" :subtitle="$t('workflows.subtitle')" />
      </template>
      <template #bottom>
        <div class="flex w-full justify-between space-x-4">
          <div></div>
          <ButtonLink class="self-end" to="/workflow/create">
            {{ $t('workflow.create.button') }}
            <PlusIcon class="ml-2 size-4 stroke-1.5" />
          </ButtonLink>
        </div>
      </template>
    </Heading>
    <div class="px-10">
      <Suspense>
        <WorkflowListAll />
        <template #fallback>
          <TableSkeleton />
        </template>
      </Suspense>
    </div>
  </SectionContainer>
</template>
