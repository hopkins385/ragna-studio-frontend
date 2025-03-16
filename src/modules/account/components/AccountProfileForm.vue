<script setup lang="ts">
import { accountService } from '@/modules/account/services/account.service';
import ButtonLoading from '@components/button/ButtonLoading.vue';
import useToast from '@composables/useToast';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@ui/form';
import { Input } from '@ui/input';
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import * as z from 'zod';

defineProps<{
  user: {
    id: string;
    name: string;
    firstName: string;
    lastName: string;
  };
}>();

const emits = defineEmits<{
  refresh: [void];
}>();

const toast = useToast();
const { t } = useI18n();

const userFormSchema = toTypedSchema(
  z.object({
    // name: z.string().min(3).max(255),
    firstName: z.string().trim().min(2).max(100),
    lastName: z.string().trim().min(2).max(100),
  }),
);

const { handleSubmit } = useForm({
  validationSchema: userFormSchema,
});

const isLoading = ref(false);

const onSubmit = handleSubmit(async ({ firstName, lastName }) => {
  isLoading.value = true;
  try {
    await accountService.updateName({
      firstName,
      lastName,
    });
    toast.success({
      description: t('account.toast.name_updated'),
    });
    emits('refresh');
  } catch (error) {
    toast.error({
      description: t('account.toast.error'),
    });
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <form class="space-y-8" @submit="onSubmit">
    <FormField v-slot="{ componentField }" name="name" :model-value="user?.name ?? ''">
      <FormItem>
        <FormLabel>
          {{ $t('account.form.name') }}
        </FormLabel>
        <FormControl>
          <Input type="text" placeholder="" v-bind="componentField" disabled />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="firstName" :model-value="user?.firstName ?? ''">
      <FormItem>
        <FormLabel>
          {{ $t('account.form.firstName') }}
        </FormLabel>
        <FormControl>
          <Input type="text" placeholder="" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="lastName" :model-value="user?.lastName ?? ''">
      <FormItem>
        <FormLabel>
          {{ $t('account.form.lastName') }}
        </FormLabel>
        <FormControl>
          <Input type="text" placeholder="" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
    <div class="flex w-full justify-end">
      <ButtonLoading variant="outline" :loading="isLoading" type="submit">
        {{ $t('form.button.save') }}
      </ButtonLoading>
    </div>
  </form>
</template>
