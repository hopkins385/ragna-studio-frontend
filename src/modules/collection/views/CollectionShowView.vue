<script setup lang="ts">
/**
 * Collection Index - Show a collection
 * Route: /collection/:id
 */
import HeadingTitle from '@/components/heading/HeadingTitle.vue';
import { useRagnaClient } from '@/composables/useRagnaClient';
import CollectionEditSheet from '@/modules/collection/components/CollectionEditSheet.vue';
import RecordAllTable from '@/modules/record/components/RecordAllTable.vue';
import RecordCreateModal from '@/modules/record/components/RecordCreateModal.vue';
import BoxContainer from '@components/box/BoxContainer.vue';
import Heading from '@components/heading/Heading.vue';
import SectionContainer from '@components/section/SectionContainer.vue';
import bgImgUrl from '@images/bg_databases.png?q=100&format=webp&imagetools';
import type { Collection } from '@hopkins385/ragna-sdk';

const client = useRagnaClient();
const route = useRoute();
const refresh = ref(false);

const collectionId = route.params.id.toString();
const collectionData = ref<Collection | null>(null);

const { t } = useI18n();

const initCollection = async () => {
  const response = await client.collection.fetchFirst(collectionId);
  collectionData.value = response.collection;
};

async function onRefresh() {
  refresh.value = true;
  await nextTick();
  refresh.value = false;
}

onMounted(() => {
  initCollection();
});

useHead({
  title: t('collection.title'),
  meta: [
    {
      name: 'description',
      content: t('collection.subtitle'),
    },
  ],
});
</script>

<template>
  <SectionContainer>
    <Heading :img-url="bgImgUrl" bg-position="bottom">
      <template #top>
        <HeadingTitle
          :title="collectionData?.name ?? ''"
          :subtitle="collectionData?.description ?? ''"
        />
      </template>
      <template #bottom>
        <div class="flex w-full justify-between space-x-4">
          <div></div>
          <div class="flex space-x-2">
            <RecordCreateModal
              v-if="collectionData"
              :collection-id="collectionData.id"
              @refresh="onRefresh"
            />
            <CollectionEditSheet
              v-if="collectionData"
              :collection-id="collectionData.id"
              :collection-name="collectionData.name"
              :collection-description="collectionData.description"
              @refresh="initCollection"
            />
          </div>
        </div>
      </template>
    </Heading>
    <BoxContainer>
      <Suspense>
        <RecordAllTable :collection-id="collectionId" :refresh="refresh" />
      </Suspense>
    </BoxContainer>
  </SectionContainer>
</template>
