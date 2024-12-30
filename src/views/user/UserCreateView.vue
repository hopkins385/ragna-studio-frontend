<script setup lang="ts">
import ButtonLoading from '@/components/button/ButtonLoading.vue';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useUserService } from '@/composables/services/useUserService';
import { useNotification } from '@/composables/useNotification';
import { RouteName } from '@/router/enums/route-names.enum';
import { createUserSchema } from '@/schemas/user.schema';
import { toTypedSchema } from '@vee-validate/zod';

const isLoading = ref(false);
const router = useRouter();

const { createUser } = useUserService();
const { showError, showSuccess } = useNotification();

const { handleSubmit } = useForm({
  validationSchema: toTypedSchema(createUserSchema),
});

const onSubmit = handleSubmit(async (values, { resetForm }) => {
  isLoading.value = true;
  try {
    await createUser(values);
    resetForm();
    showSuccess('User created');
    router.push({ name: RouteName.USER_LIST });
  } catch (error) {
    console.log(error);
    showError('Failed to create user');
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="rounded-2xl p-5 h-full">
    <h1 class="text-xl font-semibold mb-5">Create User</h1>
    <div
      class="rounded-lg bg-white overflow-hidden shadow-md border border-muted/50 p-5"
    >
      <form class="space-y-5 max-w-sm" @submit="onSubmit">
        <FormField v-slot="{ componentField }" name="name">
          <FormItem>
            <FormLabel> Name </FormLabel>
            <FormControl>
              <Input type="text" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="email">
          <FormItem>
            <FormLabel> Email </FormLabel>
            <FormControl>
              <Input type="text" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="password">
          <FormItem>
            <FormLabel> Password </FormLabel>
            <FormControl>
              <Input type="password" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <ButtonLoading :loading="isLoading" type="submit">
          Create User
        </ButtonLoading>
      </form>
    </div>
  </div>
</template>
