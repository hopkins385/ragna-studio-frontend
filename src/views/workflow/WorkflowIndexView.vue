<script setup lang="ts">
import BoxContainer from '@/components/box/BoxContainer.vue';
import ButtonLink from '@/components/button/ButtonLink.vue';
import Heading from '@/components/heading/Heading.vue';
import SectionContainer from '@/components/section/SectionContainer.vue';
import SectionHeading from '@/components/section/SectionHeading.vue';
import TableSkeleton from '@/components/table/TableSkeleton.vue';
import WorkflowListAll from '@/components/workflow/WorkflowListAll.vue';
import { PlusIcon } from 'lucide-vue-next';
</script>

<template>
  <SectionContainer>
    <SectionHeading
      title="Workflows"
      subtitle="Create, edit, and manage workflows"
    />
    <Heading>
      <template #top> </template>
      <template #bottom>
        <div class="flex w-full justify-between px-3 pb-2 pt-14">
          <div></div>
          <ButtonLink class="self-end" to="/workflow/create">
            New Workflow
            <PlusIcon class="ml-2 size-4 stroke-1.5" />
          </ButtonLink>
        </div>
      </template>
    </Heading>
    <BoxContainer>
      <Suspense>
        <WorkflowListAll />
        <template #fallback>
          <TableSkeleton />
        </template>
      </Suspense>
    </BoxContainer>
  </SectionContainer>
</template>
