<script setup lang="ts">
import ButtonLoading from '@/common/components/button/ButtonLoading.vue';
import Heading from '@/components/heading/Heading.vue';
import HeadingTitle from '@/components/heading/HeadingTitle.vue';
import AccountDeleteDialog from '@/modules/account/components/AccountDeleteDialog.vue';
import AccountProfileForm from '@/modules/account/components/AccountProfileForm.vue';
import type { AccountData } from '@/modules/account/interfaces';
import { accountService } from '@/modules/account/services/account.service';
import BoxContainer from '@components/box/BoxContainer.vue';
import SectionContainer from '@components/section/SectionContainer.vue';
import AccountEditLoginForm from './AccountEditLoginForm.vue';

const isLoading = ref(false);
const account = ref<AccountData | null>(null);

const org = computed(() => account.value?.organisation ?? null);
const teams = computed(() => account.value?.teams ?? null);

const initAccountData = async () => {
  const data = await accountService.fetchAccountData();
  account.value = data;
};

const onManageSubscriptionClick = () => {
  // isLoading.value = true;
  throw new Error('Not implemented');
};

const onRefresh = () => {
  initAccountData();
};

onBeforeMount(() => {
  initAccountData();
});
</script>

<template>
  <SectionContainer>
    <Heading>
      <template #top>
        <HeadingTitle :title="$t('account.title')" :subtitle="$t('account.subtitle')" />
      </template>
      <template #bottom> </template>
    </Heading>
    <div class="px-6 pb-5">
      <div class="grid grid-cols-4 gap-5">
        <BoxContainer class="col-span-3 border border-stone-100 bg-stone-50">
          <AccountProfileForm
            :user="{
              id: account?.id ?? '',
              name: account?.name ?? '',
              firstName: account?.firstName ?? '',
              lastName: account?.lastName ?? '',
            }"
            @refresh="onRefresh"
          />
        </BoxContainer>
        <div class="col-span-1 grid grid-cols-1 space-y-6 text-sm">
          <BoxContainer class="border border-stone-100 bg-stone-50">
            <h2 class="pb-5 font-semibold">Account Security</h2>
            Email Verified: {{ account?.hasEmailVerified ? 'Yes' : 'No' }}
          </BoxContainer>
          <BoxContainer class="border border-stone-100 bg-stone-50">
            <h2 class="pb-2 font-semibold">Plan</h2>
            <p>Preview</p>
            <h2 class="mt-2 py-2 font-semibold">Credits</h2>
            <p>{{ account?.totalCredits }}</p>
          </BoxContainer>
        </div>
      </div>
      <BoxContainer class="mt-5 border border-stone-100 bg-stone-50">
        <AccountEditLoginForm
          :user="{
            id: account?.id ?? '',
            email: account?.email ?? '',
          }"
        />
      </BoxContainer>
      <div class="grid grid-cols-2 gap-5">
        <BoxContainer class="mt-5 border border-stone-100 bg-stone-50">
          <h2 class="pb-5">Organisation</h2>
          <p class="w-fit text-sm">{{ org?.name }}</p>
          <p class="mt-4 w-fit text-sm opacity-50">ID: org_{{ account?.organisationId }}</p>
        </BoxContainer>
        <BoxContainer class="mt-5 border border-stone-100 bg-stone-50">
          <h2 class="pb-5">Team</h2>
          <p class="w-fit text-sm">{{ teams?.[0]?.team.name }}</p>
        </BoxContainer>
      </div>
      <BoxContainer class="mt-5 border border-stone-100 bg-stone-50">
        <h2 class="pb-5">Subscription</h2>
        <ButtonLoading :loading="isLoading" variant="outline" @click="onManageSubscriptionClick">
          Manage Subscription
        </ButtonLoading>
      </BoxContainer>
      <!--
    <BoxContainer class="mt-5">
      <h2 class="pb-5">App Settings</h2>
      <p class="text-sm text-muted-foreground">coming soon</p>
    </BoxContainer>
    <BoxContainer class="mt-5">
      <h2 class="pb-5">API Tokens</h2>
      <p class="text-sm text-muted-foreground">coming soon</p>
    </BoxContainer>
    -->
      <BoxContainer class="mt-5 border border-stone-100 bg-stone-50">
        <h2 class="pb-5">Danger Zone</h2>
        <AccountDeleteDialog :user-id="account?.id ?? '-1'" />
      </BoxContainer>
    </div>
  </SectionContainer>
</template>
