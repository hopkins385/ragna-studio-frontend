<script setup lang="ts">
import BoxContainer from '@/components/box/BoxContainer.vue';
import Heading from '@/components/heading/Heading.vue';
import HeadingTitle from '@/components/heading/HeadingTitle.vue';
import SectionContainer from '@/components/section/SectionContainer.vue';
import TableSkeleton from '@/components/table/TableSkeleton.vue';
import Button from '@/components/ui/button/Button.vue';
import { authProviderService } from '@/modules/auth/services/auth-provider.service';
import GoogleDriveTable from '@/modules/google-drive/components/GoogleDriveTable.vue';

const isLoading = ref(true);
const hasAccess = ref(false);

const init = async () => {
  try {
    const response = await authProviderService.fetchUserHasAccess('google');
    hasAccess.value = response.hasAccess;
  } catch (error: any) {
    console.error('[fetch google drive access]', error);
  } finally {
    isLoading.value = false;
  }
};

async function onConnectClick() {
  const { url } = await authProviderService.fetchConsentURL('google');
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
