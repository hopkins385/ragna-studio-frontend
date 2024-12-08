<script setup lang="ts">
import AccountSettingsForm from '@/components/account/AccountSettingsForm.vue';
import SectionContainer from '@/components/section/SectionContainer.vue';
import SectionHeading from '@/components/section/SectionHeading.vue';
</script>

<template>
  <SectionContainer>
    <SectionHeading
      title="Account Settings"
      subtitle="On this page you can edit your personal settings"
    >
    </SectionHeading>
    <AccountSettingsForm />
  </SectionContainer>
</template>
