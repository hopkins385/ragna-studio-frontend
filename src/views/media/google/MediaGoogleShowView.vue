<script setup lang="ts">
import BoxContainer from '@/components/box/BoxContainer.vue';
import SectionContainer from '@/components/section/SectionContainer.vue';
import SectionHeading from '@/components/section/SectionHeading.vue';
import TableSkeleton from '@/components/table/TableSkeleton.vue';
</script>

<template>
  <SectionContainer>
    <SectionHeading title="Google Drive" />
    <BoxContainer>
      <Suspense>
        <GoogleDriveTable :id="$route.params?.id" />
        <template #fallback>
          <TableSkeleton />
        </template>
      </Suspense>
    </BoxContainer>
  </SectionContainer>
</template>
