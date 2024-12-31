<script setup lang="ts">
import AssistantAllTable from '@components/assistant/AssistantAllTable.vue';
import BoxContainer from '@components/box/BoxContainer.vue';
import ButtonLink from '@components/button/ButtonLink.vue';
import Heading from '@components/heading/Heading.vue';
import SectionContainer from '@components/section/SectionContainer.vue';
import SectionHeading from '@components/section/SectionHeading.vue';
import TableSkeleton from '@components/table/TableSkeleton.vue';
import { PlusIcon } from 'lucide-vue-next';

const route = useRoute();
const router = useRouter();

const search = ref('');
const page = ref(
  route.query.page ? parseInt(route.query.page as string, 10) : 1,
);

function setRoutePage(value: number) {
  page.value = value;
  const query = { ...route.query, page: value.toString() };
  router.push({ query });
}

const { t } = useI18n();

useHead({
  title: t('assistants.title'),
  meta: [
    {
      name: 'description',
      content: t('assistants.subtitle'),
    },
  ],
});
</script>

<template>
  <SectionContainer>
    <SectionHeading
      :title="$t('assistants.title')"
      :subtitle="$t('assistants.subtitle')"
    />
    <Heading>
      <template #top> </template>
      <template #bottom>
        <div class="flex w-full justify-between space-x-4 px-3 pb-2 pt-14">
          <div></div>
          <!--
          <div class="w-full">
            <Input v-model="search" placeholder="Search assistant title ..." />
          </div>
          -->
          <div class="whitespace-nowrap">
            <ButtonLink
              v-if="$ability.can('create', 'Assistant')"
              to="/assistant/create"
            >
              {{ $t('assistant.create.button') }}
              <PlusIcon class="ml-2 size-4 stroke-2" />
            </ButtonLink>
          </div>
        </div>
      </template>
    </Heading>

    <BoxContainer>
      <div>
        <Suspense>
          <AssistantAllTable
            :page="page"
            :search="search"
            @update:page="setRoutePage"
          />
          <template #fallback>
            <TableSkeleton />
          </template>
        </Suspense>
      </div>
    </BoxContainer>
  </SectionContainer>
</template>
