<script setup lang="ts">
import AccountSettingsForm from '@/components/account/AccountSettingsForm.vue';
import SectionContainer from '@/components/section/SectionContainer.vue';
import SectionHeading from '@/components/section/SectionHeading.vue';
</script>

<template>
  <SectionContainer>
    <SectionHeading
      :title="$t('account.settings.title')"
      :subtitle="$t('account.settings.subtitle')"
    >
    </SectionHeading>
    <AccountSettingsForm />
  </SectionContainer>
</template>
