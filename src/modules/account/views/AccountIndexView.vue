<script setup lang="ts">
import { getRoleDisplayName } from '@/common/constants/get-roles-displayname';
import Heading from '@/components/heading/Heading.vue';
import HeadingTitle from '@/components/heading/HeadingTitle.vue';
import { usePromise } from '@/composables/usePromise';
import { useRagnaClient } from '@/composables/useRagnaClient';
import AccountEditLoginForm from '@/modules/account/components/AccountEditLoginForm.vue';
import AccountProfileForm from '@/modules/account/components/AccountProfileForm.vue';
import BoxContainer from '@components/box/BoxContainer.vue';
import SectionContainer from '@components/section/SectionContainer.vue';
import type { AccountData } from '@hopkins385/ragna-sdk';

const client = useRagnaClient();

const accountData = shallowRef<AccountData>();

const teams = computed(() => accountData.value?.teams ?? null);
const roles = computed(() => accountData.value?.roles ?? null);
const organisation = computed(() => accountData.value?.organisation ?? null);

const initAccountData = async () => {
  const { data, error } = await usePromise(() => client.account.fetchAccountData());
  if (error.value) {
    console.error('Error fetching account data:', error.value);
    return;
  }
  accountData.value = data.value?.account;
};

const onManageSubscriptionClick = () => {
  throw new Error('Not implemented');
};

const onRefresh = () => {
  initAccountData();
};

onBeforeMount(async () => {
  await initAccountData();
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
              id: accountData?.id ?? '',
              name: accountData?.name ?? '',
              firstName: accountData?.firstName ?? '',
              lastName: accountData?.lastName ?? '',
            }"
            @refresh="onRefresh"
          />
        </BoxContainer>
        <div class="col-span-1 grid grid-cols-1 space-y-6 text-sm">
          <BoxContainer class="border border-stone-100 bg-stone-50">
            <h2 class="pb-5 font-semibold">Teams</h2>
            <p v-for="team in teams" :key="team.id" class="w-fit text-sm">{{ team.name }}</p>
          </BoxContainer>
          <BoxContainer class="border border-stone-100 bg-stone-50">
            <h2 class="pb-5 font-semibold">Roles</h2>
            <p v-for="role in roles" :key="role.id" class="w-fit text-sm">
              {{ getRoleDisplayName({ name: role.name }) }}
            </p>
          </BoxContainer>
          <BoxContainer class="border border-stone-100 bg-stone-50">
            <h2 class="pb-5 font-semibold">Organisation</h2>
            <p class="w-fit text-sm">{{ organisation?.name }}</p>
            <p class="mt-4 w-fit text-sm opacity-50">ID: org_{{ organisation?.id }}</p>
          </BoxContainer>
          <!--
          <BoxContainer class="border border-stone-100 bg-stone-50">
            <h2 class="pb-5 font-semibold">Account Security</h2>
            Email Verified: {{ accountData?.hasEmailVerified ? 'Yes' : 'No' }}
          </BoxContainer>
          <BoxContainer class="border border-stone-100 bg-stone-50">
            <h2 class="pb-2 font-semibold">Plan</h2>
            <p>Preview</p>
            <h2 class="mt-2 py-2 font-semibold">Credits</h2>
            <p>{{ accountData?.totalCredits }}</p>
          </BoxContainer>
          -->
        </div>
      </div>
      <BoxContainer class="mt-5 border border-stone-100 bg-stone-50">
        <AccountEditLoginForm
          :user="{
            id: accountData?.id ?? '',
            email: accountData?.email ?? '',
          }"
        />
      </BoxContainer>
      <!--
      <BoxContainer class="mt-5 border border-stone-100 bg-stone-50">
        <h2 class="pb-5">Subscription</h2>
        <ButtonLoading :loading="false" variant="outline" @click="onManageSubscriptionClick">
          Manage Subscription
        </ButtonLoading>
      </BoxContainer>
    <BoxContainer class="mt-5">
      <h2 class="pb-5">App Settings</h2>
      <p class="text-sm text-muted-foreground">coming soon</p>
    </BoxContainer>
    <BoxContainer class="mt-5">
      <h2 class="pb-5">API Tokens</h2>
      <p class="text-sm text-muted-foreground">coming soon</p>
    </BoxContainer>

      <BoxContainer class="mt-5 border border-stone-100 bg-stone-50">
        <h2 class="pb-5">Danger Zone</h2>
        <AccountDeleteDialog :user-id="accountData?.id ?? '-1'" />
      </BoxContainer>
          -->
    </div>
  </SectionContainer>
</template>
