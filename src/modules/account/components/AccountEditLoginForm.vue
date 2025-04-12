<script setup lang="ts">
import InfoTip from '@/components/info/InfoTip.vue';
import { Input } from '@/components/ui/input';
import AccountEditPasswordDialog from '@/modules/account/components/AccountEditPasswordDialog.vue';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@ui/form';

defineProps<{
  user: {
    id: string;
    email: string;
  };
}>();

const form = useForm({
  initialValues: {
    email: '',
    password: '',
  },
});

const onSubmit = () => {};
</script>

<template>
  <form class="space-y-8" @submit.prevent="onSubmit">
    <FormField v-slot="{ componentField }" name="email" :model-value="user?.email ?? ''">
      <FormItem>
        <FormLabel>
          <div class="flex items-center">
            Email
            <InfoTip :text="$t('account.tooltip.email_info')" />
          </div>
        </FormLabel>
        <FormControl>
          <div class="flex">
            <Input
              type="text"
              placeholder="email"
              v-bind="componentField"
              autocomplete="off"
              disabled
            />
            <div class="flex w-1/2">
              <div class="w-full"></div>
            </div>
          </div>
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="password" model-value="dummypassword">
      <FormItem>
        <FormLabel>
          <div class="flex items-center">
            {{ $t('account.form.password') }}
          </div>
        </FormLabel>
        <FormControl>
          <div class="flex">
            <div class="relative w-full">
              <Input
                type="password"
                placeholder=""
                v-bind="componentField"
                autocomplete="off"
                disabled
              />
            </div>
            <div class="flex w-1/2">
              <div class="w-full"></div>
              <AccountEditPasswordDialog />
            </div>
          </div>
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
  </form>
</template>
