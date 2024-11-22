<script setup lang="ts">
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { useAuthStore } from '@/stores/auth.store';
import { AxiosError } from 'axios';
import { loginFormSchema } from '@/schemas/loginForm.schema';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import ButtonLoading from '@/components/button/ButtonLoading.vue';

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
</script>

<template>
  <section class="h-full">
    <div class="grid grid-cols-2 h-full">
      <div class="bg-foreground">left</div>
      <div
        class="flex flex-col justify-center items-center h-full space-y-2 w-full max-w-sm mx-auto"
      >
        <div>
          <h1 class="text-2xl font-bold text-center text-gray-800">Login</h1>
        </div>
        <div v-if="authError" class="text-red-500 text-sm">{{ authError }}</div>
        <form @submit="onSubmit" class="space-y-2 w-full">
          <FormField v-slot="{ componentField }" name="email">
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  autocomplete="email"
                  placeholder="Email"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="password">
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  autocomplete="current-password"
                  placeholder="Password"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <ButtonLoading :loading="formLoading" type="submit">
            Submit
          </ButtonLoading>
        </form>
      </div>
    </div>
  </section>
</template>
