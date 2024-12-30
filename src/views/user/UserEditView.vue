<script setup lang="ts">
import { Button } from '@/components/ui/button';
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
import { updateUserSchema } from '@/schemas/user.schema';
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import { ref } from 'vue';

const isLoading = ref(false);

const route = useRoute();
const router = useRouter();

// userId
const userId = route.params.id.toString();

const { fetchUserById, updateUser } = useUserService();
const { showError, showSuccess } = useNotification();

const { handleSubmit, errors, resetForm } = useForm({
  validationSchema: toTypedSchema(updateUserSchema),
});

// Validate userId early
if (!userId) {
  showError('Invalid user ID');
}

const handleError = (error: unknown, message: string) => {
  console.error(error);
  showError(message);
};

const onSubmit = handleSubmit(async values => {
  try {
    isLoading.value = true;
    await updateUser(userId, values);
    await initUser();
    showSuccess('User updated successfully');
    resetForm();
  } catch (error) {
    handleError(error, 'Failed to update user');
  } finally {
    isLoading.value = false;
  }
});

const initUser = async () => {
  try {
    isLoading.value = true;
    const user = await fetchUserById(userId);
    if (!user) throw new Error('User not found');
    resetForm({
      values: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    handleError(error, 'Failed to load user');
    router.push({
      name: RouteName.USER_LIST,
    });
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  await initUser();
});
</script>

<template>
  <div class="rounded-2xl p-5 h-full">
    <h1 class="text-xl font-semibold mb-5">Create User</h1>
    <div
      class="rounded-lg bg-white overflow-hidden shadow-md border border-muted/50 p-5"
    >
      <form class="space-y-5 max-w-sm" @submit.prevent="onSubmit">
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

        <Button type="submit"> Update </Button>
      </form>
    </div>
  </div>
</template>
