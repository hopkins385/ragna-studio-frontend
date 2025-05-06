<script setup lang="ts">
import Checkbox from '@/components/ui/checkbox/Checkbox.vue';
import { useErrorAlert } from '@/composables/useErrorAlert';
import { useAuthStore } from '@/modules/auth/stores/auth.store';
import { RouteName } from '@/router/enums/route-names.enum';
import { isValidJWT } from '@/utils/token';
import BrandHeader from '@components/brand/BrandHeader.vue';
import ButtonLoading from '@ui/button/ButtonLoading.vue';
import { FormControl, FormField, FormItem, FormLabel } from '@ui/form';
import FormMessage from '@ui/form/FormMessage.vue';
import { Input } from '@ui/input';
import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';

const isLoading = ref(false);
const success = ref(false);

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const { t } = useI18n();
const { errorAlert, setErrorAlert, unsetErrorAlert } = useErrorAlert();

const registerFormSchema = z
  .object({
    password: z
      .string()
      .trim()
      .min(6, t('auth.error.password_min_length', { length: 6 })),
    passwordConfirm: z
      .string()
      .trim()
      .min(6, t('auth.error.password_min_length', { length: 6 })),
    terms: z
      .boolean()
      .default(false)
      .refine(value => value, t('auth.error.terms_required')),
    token: z
      .string()
      .trim()
      .min(1, t('auth.error.token_required'))
      .refine(value => isValidJWT(value), t('auth.error.token_invalid')),
  })
  .refine(data => data.password === data.passwordConfirm, {
    message: t('auth.error.passwords_not_match'),
    path: ['passwordConfirm'], // path of error
  });

const form = useForm({
  validationSchema: toTypedSchema(registerFormSchema),
  initialValues: {
    password: '',
    passwordConfirm: '',
    terms: false,
    token: route.params.token?.toString().trim() || '',
  },
});

const onSubmit = form.handleSubmit(async (values, { resetForm }) => {
  unsetErrorAlert();
  isLoading.value = true;
  try {
    await authStore.resetPassword({
      token: values.token,
      password: values.password,
    });
    resetForm();
    success.value = true;
  } catch (error: unknown) {
    console.error(error);
    if (error instanceof Error) {
      setErrorAlert(error);
    } else {
      setErrorAlert('An unknown error occurred');
    }
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <section class="h-full">
    <div class="flex flex-col justify-center items-center h-full">
      <BrandHeader />
      <div class="max-w-md w-full p-10 border-0 rounded-lg">
        <div>
          <!-- Error -->
          <div v-if="errorAlert.open" class="text-red-700 pb-6 rounded relative" role="alert">
            <span class="block sm:inline text-sm font-semibold">
              {{ $t(errorAlert.description ?? 'Unknown Error') }}
            </span>
          </div>
        </div>
        <form v-if="!success" @submit.prevent="onSubmit" class="space-y-4">
          <!-- Token -->
          <FormField v-slot="{ componentField }" name="token">
            <FormItem>
              <FormControl>
                <Input type="password" placeholder="" v-bind="componentField" :disabled="true" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <!-- Password -->
          <FormField v-slot="{ componentField }" name="password">
            <FormItem>
              <FormLabel>{{ $t('form.password') }}</FormLabel>
              <FormControl>
                <Input type="password" placeholder="" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <!-- Confirm Password -->
          <FormField v-slot="{ componentField }" name="passwordConfirm">
            <FormItem>
              <FormLabel>{{ $t('form.password_confirm') }}</FormLabel>
              <FormControl>
                <Input type="password" placeholder="" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <!-- Terms -->
          <FormField v-slot="{ handleChange, value }" type="checkbox" name="terms">
            <FormItem>
              <FormControl>
                <Checkbox
                  :checked="value"
                  :unchecked-value="false"
                  @update:checked="handleChange"
                />
                <FormLabel>
                  <span class="pl-2">
                    {{ $t('auth.accept_terms_p1') }}
                    <a
                      href="https://ragna.io/privacy-platform"
                      class="text-primary-500 underline"
                      target="_blank"
                    >
                      {{ $t('auth.accept_terms_p2') }}
                    </a>
                    {{ $t('auth.accept_terms_p3') }}
                    <a
                      href="https://ragna.io/terms-platform"
                      class="text-primary-500 underline"
                      target="_blank"
                    >
                      {{ $t('auth.accept_terms_p4') }}
                    </a>
                  </span>
                </FormLabel>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <!-- Submit -->
          <div class="w-full">
            <ButtonLoading :loading="isLoading" type="submit" class="w-full">
              {{ $t('auth.reset_password') }}
            </ButtonLoading>
          </div>
        </form>
        <div v-else>
          <div class="text-green-700 pb-6 rounded relative" role="alert">
            <span class="block sm:inline text-sm font-semibold">
              {{ $t('auth.success.password_reset') }}
            </span>
          </div>
          <ButtonLoading
            :loading="isLoading"
            @click="router.push({ name: RouteName.LOGIN })"
            class="w-full"
          >
            {{ $t('auth.login') }}
          </ButtonLoading>
        </div>
      </div>
    </div>
  </section>
</template>
