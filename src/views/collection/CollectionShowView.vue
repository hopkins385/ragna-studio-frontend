<script setup lang="ts">
/**
 * Collection Index - Show a collection
 * Route: /collection/:id
 */
import HeadingTitle from '@/components/heading/HeadingTitle.vue';
import BoxContainer from '@components/box/BoxContainer.vue';
import CollectionEditSheet from '@components/collection/CollectionEditSheet.vue';
import Heading from '@components/heading/Heading.vue';
import RecordAllTable from '@components/record/RecordAllTable.vue';
import RecordCreateModal from '@components/record/RecordCreateModal.vue';
import SectionContainer from '@components/section/SectionContainer.vue';
import useCollectionService, {
  type Collection,
} from '@composables/services/useCollectionService';
import bgImgUrl from '@images/bg_databases.png?q=100&format=webp&imagetools';

const route = useRoute();
const refresh = ref(false);

const collectionId = route.params.id.toString();
const collection = ref<Collection | null>(null);

const { t } = useI18n();
const { fetchFirst } = useCollectionService();

const initCollection = async () => {
  const response = await fetchFirst(collectionId);
  collection.value = response.collection;
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
          :title="collection?.name ?? ''"
          :subtitle="collection?.description ?? ''"
        />
      </template>
      <template #bottom>
        <div class="flex w-full justify-between space-x-4">
          <div></div>
          <div class="flex space-x-2">
            <RecordCreateModal
              v-if="collection"
              :collection-id="collection.id"
              @refresh="onRefresh"
            />
            <CollectionEditSheet
              v-if="collection"
              :collection-id="collection.id"
              :collection-name="collection.name"
              :collection-description="collection.description"
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
