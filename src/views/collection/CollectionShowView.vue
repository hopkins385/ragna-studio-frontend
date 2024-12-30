<script setup lang="ts">
/**
 * Collection Index - Show a collection
 * Route: /collection/:id
 */
import BoxContainer from '@/components/box/BoxContainer.vue';
import ButtonLink from '@/components/button/ButtonLink.vue';
import Heading from '@/components/heading/Heading.vue';
import RecordAllTable from '@/components/record/RecordAllTable.vue';
import RecordCreateModal from '@/components/record/RecordCreateModal.vue';
import SectionContainer from '@/components/section/SectionContainer.vue';
import SectionHeading from '@/components/section/SectionHeading.vue';
import useCollectionService, {
  type Collection,
} from '@/composables/services/useCollectionService';
import { SettingsIcon } from 'lucide-vue-next';

const route = useRoute();
const refresh = ref(false);

const collectionId = route.params.id.toString();
const collection = ref<Collection | null>(null);

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
</script>

<template>
  <SectionContainer>
    <SectionHeading
      :title="collection?.name"
      :subtitle="collection?.description"
    />
    <Heading>
      <template #top> </template>
      <template #bottom>
        <div class="flex w-full justify-between px-3 pb-2 pt-14">
          <div></div>
          <div class="flex flex-col space-y-2">
            <RecordCreateModal
              v-if="collection"
              :collection-id="collection.id"
              @refresh="onRefresh"
            />
            <ButtonLink
              class="self-end"
              :to="`/collections/${collectionId}/edit`"
            >
              {{ $t('collection.button.settings') }}
              <SettingsIcon class="ml-2 size-4 stroke-2" />
            </ButtonLink>
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
