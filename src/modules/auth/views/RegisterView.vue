<script setup lang="ts">
import Checkbox from '@/components/ui/checkbox/Checkbox.vue';
import { useAuthStore } from '@/modules/auth/stores/auth.store';
import { RouteName } from '@/router/enums/route-names.enum';
import BrandHeader from '@components/brand/BrandHeader.vue';
import ButtonLoading from '@ui/button/ButtonLoading.vue';
import { FormControl, FormField, FormItem, FormLabel } from '@ui/form';
import FormMessage from '@ui/form/FormMessage.vue';
import { Input } from '@ui/input';
import { isValidJWT, sanitizeToken } from '@utils/token';
import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';

const isLoading = ref(false);

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const { t } = useI18n();

const regError = reactive({
  message: '',
  show: false,
});

const routeCode = computed(() => {
  const queryToken = route.query.code;
  if (typeof queryToken !== 'string') return '';

  const sanitizedToken = sanitizeToken(queryToken);
  return isValidJWT(sanitizedToken) ? sanitizedToken : '';
});

const registerFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(4, t('auth.error.name_min_length', { length: 4 })),
  email: z.string().trim().email(t('auth.error.invalid_email')),
  password: z
    .string()
    .trim()
    .min(6, t('auth.error.password_min_length', { length: 6 })),
  terms: z
    .boolean()
    .default(false)
    .refine(value => value, t('auth.error.terms_required')),
  // invitation code is a jwt token
  invitationCode: z
    .string()
    .trim()
    .min(1, t('auth.error.code_required'))
    .refine(value => isValidJWT(value), t('auth.error.code_invalid')),
});

const form = useForm({
  validationSchema: toTypedSchema(registerFormSchema),
  initialValues: {
    name: '',
    email: '',
    password: '',
    terms: false,
    invitationCode: routeCode.value,
  },
});

const setRegError = (message: string) => {
  regError.message = message;
  regError.show = true;
};

const unsetRegError = () => {
  regError.message = '';
  regError.show = false;
};

const onSubmit = form.handleSubmit(async (values, { resetForm }) => {
  unsetRegError();
  isLoading.value = true;
  try {
    await authStore.register({
      name: values.name,
      email: values.email,
      password: values.password,
      termsAndConditions: values.terms,
      invitationCode: values.invitationCode,
    });
    resetForm();
    // redirect to login page
    await router.push({ name: RouteName.ONBOARDING_INDEX });
  } catch (error: any) {
    console.error(error);
    setRegError(t('auth.error.code_invalid'));
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
          <div v-if="regError.show" class="text-red-700 pb-6 rounded relative" role="alert">
            <span class="block sm:inline text-sm font-semibold">{{ regError.message }}</span>
          </div>
        </div>
        <form @submit.prevent="onSubmit" class="space-y-4">
          <!-- Inivtation Code -->
          <FormField v-slot="{ componentField }" name="invitationCode">
            <FormItem>
              <FormLabel>{{ $t('auth.invitation_code') }}</FormLabel>
              <FormControl>
                <Input type="password" placeholder="" v-bind="componentField" :disabled="true" />
              </FormControl>
              <!--
              <FormLabel v-if="!routeCode" class="text-sm text-gray-500">
                {{ $t('auth.invitation_code_info') }}
                <AuthWaitlistModal />
              </FormLabel>
              -->
              <FormMessage />
            </FormItem>
          </FormField>
          <!-- Name -->
          <FormField v-slot="{ componentField }" name="name">
            <FormItem>
              <FormLabel>{{ $t('form.name') }}</FormLabel>
              <FormControl>
                <Input type="text" placeholder="" v-bind="componentField" autocomplete="name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <!-- Email -->
          <FormField v-slot="{ componentField }" name="email">
            <FormItem>
              <FormLabel>{{ $t('form.email') }}</FormLabel>
              <FormControl>
                <Input type="email" placeholder="" v-bind="componentField" autocomplete="email" />
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
              {{ $t('auth.register') }}
            </ButtonLoading>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>
