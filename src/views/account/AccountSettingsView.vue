<script setup lang="ts">
import AccountSettingsForm from '@/components/account/AccountSettingsForm.vue';
import Heading from '@/components/heading/Heading.vue';
import HeadingTitle from '@/components/heading/HeadingTitle.vue';
import SectionContainer from '@/components/section/SectionContainer.vue';
</script>

<template>
  <SectionContainer>
    <Heading>
      <template #top>
        <HeadingTitle
          :title="$t('account.settings.title')"
          :subtitle="$t('account.settings.subtitle')"
        />
      </template>
      <template #bottom> </template>
    </Heading>
    <div class="px-10">
      <AccountSettingsForm />
    </div>
  </SectionContainer>
</template>
