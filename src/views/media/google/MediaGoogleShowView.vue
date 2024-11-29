<script setup lang="ts">
import BoxContainer from '@/components/box/BoxContainer.vue';
import GoogleDriveTable from '@/components/google/GoogleDriveTable.vue';
import SectionContainer from '@/components/section/SectionContainer.vue';
import SectionHeading from '@/components/section/SectionHeading.vue';
import TableSkeleton from '@/components/table/TableSkeleton.vue';
</script>

<template>
  <SectionContainer>
    <SectionHeading title="Google Drive" />
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
