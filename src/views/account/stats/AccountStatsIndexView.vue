<script setup lang="ts">
// Imports
import AccountStatsBarChart from '@/components/account/stats/AccountStatsBarChart.vue';
import { useAuthStore } from '@/stores/auth.store';
import Heading from '@components/heading/Heading.vue';
import HeadingTitle from '@components/heading/HeadingTitle.vue';
import SectionContainer from '@components/section/SectionContainer.vue';
import bgImgUrl from '@images/bg_robots.png?q=100&format=webp&imagetools';

// Props
// Emits

// Refs

// Composables
const authStore = useAuthStore();

// Computed
// Functions

// Hooks
</script>

<template>
  <SectionContainer>
    <Heading :img-url="bgImgUrl" bg-position="bottom">
      <template #top>
        <HeadingTitle
          :title="$t('account.stats.title', { name: authStore.currentUser?.firstName })"
          :subtitle="$t('account.stats.subtitle')"
        />
      </template>
      <template #bottom> </template>
    </Heading>
    <div class="px-10">
      <div class="">
        <AccountStatsBarChart />
      </div>
    </div>
  </SectionContainer>
</template>
