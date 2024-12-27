<script setup lang="ts">
import BrandHeader from '@/components/brand/BrandHeader.vue';
import ButtonLoading from '@/components/button/ButtonLoading.vue';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAuthService } from '@/composables/services/useAuthService';
import { loginFormSchema } from '@/schemas/loginForm.schema';
import { useAuthStore } from '@/stores/auth.store';
import { toTypedSchema } from '@vee-validate/zod';
import { AxiosError } from 'axios';
import { useForm } from 'vee-validate';
import LogosGoogleIcon from '~icons/logos/google-icon';

const authStore = useAuthStore();
const router = useRouter();
const formLoading = ref(false);

const authError = ref<string | null>(null);

const form = useForm({
  validationSchema: toTypedSchema(loginFormSchema),
  initialValues: {
    email: '',
    password: '',
  },
});

const onSubmit = form.handleSubmit(async (values, { resetForm }) => {
  const { email, password } = values;
  authError.value = null;
  formLoading.value = true;
  try {
    await authStore.login({ email, password });
    await router.push({ name: 'home' });
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 401) {
        authError.value = 'Invalid email or password';
        resetForm();
        return;
      }
    }
    console.error(error);
  } finally {
    formLoading.value = false;
  }
});

const showForm = true;
const toggleShowForm = () => {
  // showForm.value = !showForm.value;
};

const { fetchSocialAuthUrl } = useAuthService();

const google = ref(false);
const onGoogleLogin = async () => {
  // get the google login url and redirect to it
  const { url } = await fetchSocialAuthUrl('google');
  window.location.href = url;
};

const showRegister = true;
</script>

<template>
  <section class="h-full">
    <div class="flex flex-col justify-center items-center h-full">
      <BrandHeader />
      <div class="max-w-sm w-full p-10 border-0 rounded-lg">
        <div v-if="authError" class="text-red-500 text-sm text-center pb-8">
          {{ authError }}
        </div>
        <div v-if="google" class="w-full">
          <button
            class="mx-auto flex w-full items-center justify-center rounded-md bg-[#4285f4] text-center text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-0 lg:max-w-sm"
            role="button"
            @click="onGoogleLogin"
          >
            <div class="bg-white m-1 p-2">
              <LogosGoogleIcon class="size-5" />
            </div>
            <div class="flex-1 font-semibold -ml-6">
              {{ $t('auth.social.google') }}
            </div>
          </button>
          <div class="h-2"></div>
          <div class="flex w-full items-center justify-center px-10 py-2">
            <hr class="w-full" />
            <span class="px-5 text-sm text-slate-500 uppercase">{{
              $t('auth.or')
            }}</span>
            <hr class="w-full" />
          </div>
        </div>
        <div v-show="showForm">
          <form @submit="onSubmit" class="space-y-2 w-full">
            <FormField v-slot="{ componentField }" name="email">
              <FormItem>
                <FormLabel>{{ $t('auth.email') }}</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    autocomplete="email"
                    :placeholder="$t('auth.email')"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="password">
              <FormItem>
                <FormLabel>{{ $t('auth.password') }}</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    autocomplete="current-password"
                    :placeholder="$t('auth.password')"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <div class="pt-4">
              <ButtonLoading
                :loading="formLoading"
                type="submit"
                class="w-full"
              >
                {{ $t('auth.login') }}
              </ButtonLoading>
            </div>
          </form>
        </div>
        <div v-if="!showForm" @click="toggleShowForm">
          <div class="border p-4">Email and Password</div>
        </div>
      </div>
      <div v-if="showRegister">
        <div class="text-sm text-gray-500">
          {{ $t('auth.no_account') }}
          <RouterLink to="/register" class="text-blue-500 hover:underline">
            {{ $t('auth.register') }}
          </RouterLink>
        </div>
      </div>
    </div>
  </section>
</template>
