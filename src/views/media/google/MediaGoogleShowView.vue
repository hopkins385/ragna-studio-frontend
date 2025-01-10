<script setup lang="ts">
import BoxContainer from '@/components/box/BoxContainer.vue';
import GoogleDriveTable from '@/components/google/GoogleDriveTable.vue';
import Heading from '@/components/heading/Heading.vue';
import HeadingTitle from '@/components/heading/HeadingTitle.vue';
import SectionContainer from '@/components/section/SectionContainer.vue';
import TableSkeleton from '@/components/table/TableSkeleton.vue';
</script>

<template>
  <SectionContainer>
    <Heading>
      <template #top>
        <HeadingTitle title="Google Drive" />
      </template>
      <template #bottom> </template>
    </Heading>
    <BoxContainer>
      <Suspense>
        <GoogleDriveTable />
        <template #fallback>
          <TableSkeleton />
        </template>
      </Suspense>
    </BoxContainer>
  </SectionContainer>
</template>
