<script setup lang="ts">
import AdminUserAllTable from '@/components/admin/user/AdminUserAllTable.vue';
import Heading from '@/components/heading/Heading.vue';
import HeadingTitle from '@/components/heading/HeadingTitle.vue';
import SectionContainer from '@/components/section/SectionContainer.vue';
import TableSkeleton from '@/components/table/TableSkeleton.vue';
import bgImgUrl from '@images/bg_workflow.png?q=100&format=webp&imagetools';
</script>

<template>
  <SectionContainer>
    <Heading :img-url="bgImgUrl" bg-position="bottom">
      <template #top>
        <HeadingTitle
          :title="$t('admin.user.title')"
          :subtitle="$t('admin.user.subtitle')"
        />
      </template>
      <template #bottom> </template>
    </Heading>
    <div class="rounded-lg px-10">
      <Suspense>
        <template #default>
          <AdminUserAllTable />
        </template>
        <template #fallback>
          <TableSkeleton />
        </template>
      </Suspense>
    </div>
  </SectionContainer>
</template>
