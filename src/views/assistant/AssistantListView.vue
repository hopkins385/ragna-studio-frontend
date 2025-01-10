<script setup lang="ts">
import HeadingTitle from '@/components/heading/HeadingTitle.vue';
import AssistantAllTable from '@components/assistant/AssistantAllTable.vue';
import BoxContainer from '@components/box/BoxContainer.vue';
import ButtonLink from '@components/button/ButtonLink.vue';
import Heading from '@components/heading/Heading.vue';
import SectionContainer from '@components/section/SectionContainer.vue';
import TableSkeleton from '@components/table/TableSkeleton.vue';
import bgImgUrl from '@images/bg_robots.png?q=100&format=webp&imagetools';
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
    <Heading :img-url="bgImgUrl" bg-position="bottom">
      <template #top>
        <HeadingTitle
          :title="$t('assistants.title')"
          :subtitle="$t('assistants.subtitle')"
        />
      </template>
      <template #bottom>
        <div class="flex w-full justify-end space-x-4">
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
    <BoxContainer class="px-10">
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
