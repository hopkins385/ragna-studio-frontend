<script setup lang="ts">
import Heading from '@/components/heading/Heading.vue';
import HeadingTitle from '@/components/heading/HeadingTitle.vue';
import SectionContainer from '@/components/section/SectionContainer.vue';
import TableSkeleton from '@/components/table/TableSkeleton.vue';
import ButtonLink from '@/components/ui/button/ButtonLink.vue';
import AdminTeamAllTable from '@/modules/admin/components/team/AdminTeamAllTable.vue';
import bgImgUrl from '@images/bg_workflow.png?q=100&format=webp&imagetools';
import { PlusIcon } from 'lucide-vue-next';
</script>

<template>
  <SectionContainer>
    <Heading :img-url="bgImgUrl" bg-position="bottom">
      <template #top>
        <HeadingTitle :title="$t('admin.team.title')" :subtitle="$t('admin.team.subtitle')" />
      </template>
      <template #bottom>
        <div class="flex w-full justify-end space-x-4">
          <div class="whitespace-nowrap">
            <ButtonLink v-if="$ability.can('create', 'Team')" to="/admin/user/create">
              {{ $t('admin.team.create.button') }}
              <PlusIcon class="ml-2 size-4 stroke-2" />
            </ButtonLink>
          </div>
        </div>
      </template>
    </Heading>
    <div class="rounded-lg px-10">
      <Suspense>
        <template #default>
          <AdminTeamAllTable />
        </template>
        <template #fallback>
          <TableSkeleton />
        </template>
      </Suspense>
    </div>
  </SectionContainer>
</template>
