<script setup lang="ts">
import { accountService } from '@/modules/account/account.service';
import useToast from '@composables/useToast';
import { Button } from '@ui/button';
import { FormControl, FormField, FormLabel, FormMessage } from '@ui/form';
import FormItem from '@ui/form/FormItem.vue';
import { Input } from '@ui/input';
import { toTypedSchema } from '@vee-validate/zod';
import { LoaderCircleIcon } from 'lucide-vue-next';
import { useForm } from 'vee-validate';
import * as z from 'zod';

const emit = defineEmits<{
  closeModal: [void];
}>();

const isLoading = ref(false);
const error = ref<string>('');

const passwordFormSchema = toTypedSchema(
  z
    .object({
      password: z.string().min(6).max(100),
      newPassword: z.string().min(6).max(100),
      newPasswordConfirm: z.string().min(6).max(100),
    })
    .refine(data => data.newPassword === data.newPasswordConfirm, {
      message: 'Passwords do not match',
      path: ['newPasswordConfirm'],
    }),
);

const toast = useToast();
const { t } = useI18n();

const { handleSubmit } = useForm({
  validationSchema: passwordFormSchema,
});

const onSubmit = handleSubmit(async (values, { resetForm }) => {
  isLoading.value = true;
  error.value = '';

  try {
    await accountService.updatePassword({
      oldPassword: values.password,
      newPassword: values.newPassword,
    });

    emit('closeModal');
    toast.success({
      description: t('account.toast.password_updated'),
    });
  } catch (err: any) {
    error.value = err?.message;
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <form class="mt-3 space-y-5" @submit="onSubmit">
    <div v-if="error !== ''" class="text-sm text-destructive">Error: {{ error }}</div>
    <FormField v-slot="{ componentField }" name="password">
      <FormItem>
        <FormLabel>
          {{ t('account.new_password.current') }}
        </FormLabel>
        <FormControl>
          <Input type="password" autocomplete="current-password" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
    <FormField v-slot="{ componentField }" name="newPassword">
      <FormItem>
        <FormLabel>
          {{ t('account.new_password.new') }}
        </FormLabel>
        <FormControl>
          <Input type="password" autocomplete="new-password" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
    <FormField v-slot="{ componentField }" name="newPasswordConfirm">
      <FormItem>
        <FormLabel>
          {{ t('account.new_password.confirm') }}
        </FormLabel>
        <FormControl>
          <Input type="password" autocomplete="new-password" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
    <div class="flex space-x-4 pt-3">
      <div class="w-full"></div>
      <Button
        class="whitespace-nowrap"
        variant="ghost"
        :disabled="isLoading"
        @click="emit('closeModal')"
      >
        {{ t('account.form.cancel') }}
      </Button>
      <Button class="whitespace-nowrap" variant="outline" :disabled="isLoading">
        <LoaderCircleIcon v-if="isLoading" class="mr-2 size-4 animate-spin opacity-80" />
        {{ t('account.new_password.submit') }}
      </Button>
    </div>
  </form>
</template>
