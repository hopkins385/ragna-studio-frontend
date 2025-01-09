<script setup lang="ts">
import Heading from '@components/heading/Heading.vue';
import HeadingTitle from '@components/heading/HeadingTitle.vue';
import SectionContainer from '@components/section/SectionContainer.vue';
</script>

<template>
  <SectionContainer>
    <Heading>
      <template #top>
        <HeadingTitle
          :title="$t('templates.title')"
          :subtitle="$t('templates.subtitle')"
        />
      </template>
      <template #bottom> </template>
    </Heading>
  </SectionContainer>
</template>
