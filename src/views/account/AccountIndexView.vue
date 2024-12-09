<script setup lang="ts">
import ButtonLoading from '@/components/button/ButtonLoading.vue';
import AccountProfileForm from '@components/account/AccountProfileForm.vue';
import BoxContainer from '@components/box/BoxContainer.vue';
import ButtonLink from '@components/button/ButtonLink.vue';
import SectionContainer from '@components/section/SectionContainer.vue';
import SectionHeading from '@components/section/SectionHeading.vue';
import {
  useAccountService,
  type AccountData,
} from '@composables/services/useAccountService';

const isLoading = ref(false);
const account = ref<AccountData | null>(null);
const { fetchAccountData } = useAccountService();

const org = computed(() => account.value?.organisation ?? null);
const team = computed(() => account.value?.team ?? null);

const initAccountData = async () => {
  const data = await fetchAccountData();
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
    <SectionHeading
      :title="$t('account.title')"
      :subtitle="$t('account.subtitle')"
    >
      <template #button>
        <ButtonLink to="/logout" variant="outline">Logout</ButtonLink>
      </template>
    </SectionHeading>
    <div class="grid grid-cols-4 gap-5">
      <BoxContainer class="col-span-3">
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
        <BoxContainer>
          <h2 class="pb-5 font-semibold">Account Security</h2>
          <UserEmailVerified :verified-at="account?.emailVerified ?? null" />
        </BoxContainer>
        <BoxContainer>
          <h2 class="pb-2 font-semibold">Plan</h2>
          <p>Preview</p>
          <h2 class="mt-2 py-2 font-semibold">Credits</h2>
          <p>{{ account?.credit[0]?.amount }}</p>
        </BoxContainer>
      </div>
    </div>
    <BoxContainer class="mt-5">
      <UserEditLoginForm
        :user="{
          id: account?.id ?? '',
          email: account?.email ?? '',
        }"
      />
    </BoxContainer>
    <div class="grid grid-cols-2 gap-5">
      <BoxContainer class="mt-5">
        <h2 class="pb-5">Organization</h2>
        <p class="w-fit text-sm">{{ org?.name }}</p>
        <p class="mt-4 w-fit text-sm opacity-50">ID: org_{{ org?.id }}</p>
      </BoxContainer>
      <BoxContainer class="mt-5">
        <h2 class="pb-5">Team</h2>
        <p class="w-fit text-sm">{{ team?.name }}</p>
      </BoxContainer>
    </div>
    <BoxContainer class="mt-5">
      <h2 class="pb-5">Subscription</h2>
      <ButtonLoading
        :loading="isLoading"
        variant="outline"
        @click="onManageSubscriptionClick"
      >
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
    <BoxContainer class="mt-5">
      <h2 class="pb-5">Danger Zone</h2>
      <UserDeleteAccount :user-id="account?.id" />
    </BoxContainer>
  </SectionContainer>
</template>
