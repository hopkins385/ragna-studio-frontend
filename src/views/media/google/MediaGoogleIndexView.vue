<script setup lang="ts">
import BoxContainer from '@/components/box/BoxContainer.vue';
import GoogleDriveTable from '@/components/google/GoogleDriveTable.vue';
import Heading from '@/components/heading/Heading.vue';
import HeadingTitle from '@/components/heading/HeadingTitle.vue';
import SectionContainer from '@/components/section/SectionContainer.vue';
import TableSkeleton from '@/components/table/TableSkeleton.vue';
import Button from '@/components/ui/button/Button.vue';
import { useProviderAuthService } from '@/composables/services/useProviderAuthService';

const isLoading = ref(true);
const hasAccess = ref(false);

const { fetchUserHasAccess, fetchConsentURL } = useProviderAuthService();

const init = async () => {
  try {
    const { hasAccess: val } = await fetchUserHasAccess('google');
    hasAccess.value = val;
  } catch (error: any) {
    console.error('[fetch google drive access]', error);
  } finally {
    isLoading.value = false;
  }
};

async function onConnectClick() {
  const { url } = await fetchConsentURL('google');
  if (!url) return;
  window.open(url, '_self');
}

onBeforeMount(init);
</script>

<template>
  <SectionContainer>
    <Heading>
      <template #top>
        <HeadingTitle title="Google Drive" />
      </template>
      <template #bottom> </template>
    </Heading>
    <div class="px-2">
      <div v-if="isLoading">Loading ...</div>
      <BoxContainer v-else-if="hasAccess">
        <Suspense>
          <GoogleDriveTable />
          <template #fallback>
            <TableSkeleton />
          </template>
        </Suspense>
      </BoxContainer>
      <BoxContainer v-else>
        <div class="flex">
          <Button @click="onConnectClick"> Connect Google Drive </Button>
        </div>
      </BoxContainer>
    </div>
  </SectionContainer>
</template>
