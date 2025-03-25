<script setup lang="ts">
import Heading from '@/components/heading/Heading.vue';
import HeadingTitle from '@/components/heading/HeadingTitle.vue';
import SectionContainer from '@/components/section/SectionContainer.vue';
import AppSettingsForm from '@/modules/base/components/AppSettingsForm.vue';
</script>

<template>
  <SectionContainer>
    <Heading>
      <template #top>
        <HeadingTitle :title="$t('settings.title')" :subtitle="$t('settings.subtitle')" />
      </template>
      <template #bottom> </template>
    </Heading>
    <div class="px-10">
      <AppSettingsForm />
    </div>
  </SectionContainer>
</template>
