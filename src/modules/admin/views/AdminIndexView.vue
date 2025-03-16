<script setup lang="ts">
import BoxContainer from '@/components/box/BoxContainer.vue';
import Heading from '@/components/heading/Heading.vue';
import HeadingTitle from '@/components/heading/HeadingTitle.vue';
import SectionContainer from '@/components/section/SectionContainer.vue';
import bgImgUrl from '@images/bg_workflow.png?q=100&format=webp&imagetools';
</script>

<template>
  <SectionContainer>
    <Heading :img-url="bgImgUrl" bg-position="bottom">
      <template #top>
        <HeadingTitle
          :title="$t('admin.dashboard.title')"
          :subtitle="$t('admin.dashboard.subtitle')"
        />
      </template>
      <template #bottom> </template>
    </Heading>
    <div class="rounded-lg px-10">
      <div class="flex space-x-4">
        <NuxtLinkLocale to="/admin/users">
          <BoxContainer class="hover:shadow-md border">
            <div class="h-20 w-60 rounded-lg border-0">Manage Users</div>
          </BoxContainer>
        </NuxtLinkLocale>
        <NuxtLinkLocale to="/admin/teams">
          <BoxContainer class="hover:shadow-md border">
            <div class="h-20 w-60 rounded-lg border-0">Manage Teams</div>
          </BoxContainer>
        </NuxtLinkLocale>
        <NuxtLinkLocale to="/projects">
          <BoxContainer class="hover:shadow-md border">
            <div class="h-20 w-60 rounded-lg border-0">Manage Projects</div>
          </BoxContainer>
        </NuxtLinkLocale>
      </div>
    </div>
  </SectionContainer>
</template>
