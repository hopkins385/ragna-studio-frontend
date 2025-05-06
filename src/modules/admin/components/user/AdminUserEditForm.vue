<script setup lang="ts">
import ErrorAlert from '@/components/error/ErrorAlert.vue';
import { Button } from '@/components/ui/button';
import ButtonLink from '@/components/ui/button/ButtonLink.vue';
import ButtonLoading from '@/components/ui/button/ButtonLoading.vue';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useErrorAlert } from '@/composables/useErrorAlert';
import { useRagnaClient } from '@/composables/useRagnaClient';
import useToast from '@/composables/useToast';
import { AdminRouteName } from '@/modules/admin/enums/admin-route-names.enum';
import type { Role } from '@hopkins385/ragna-sdk';
import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';

const roles = [
  {
    label: 'Admin',
    value: 'admin',
  },
  {
    label: 'User',
    value: 'user',
  },
];

// Props
const props = defineProps<{
  userData: {
    id: string;
    name: string;
    email: string;
    roles: Role[];
  };
  editable: boolean;
}>();
// Emits

// Refs
const isLoading = ref(false);

// Composables
const router = useRouter();
const route = useRoute();
const client = useRagnaClient();
const toast = useToast();
const { t } = useI18n();
const { errorAlert, setErrorAlert, unsetErrorAlert } = useErrorAlert();

const roleSchema = z.enum(['admin', 'user'], {
  errorMap: () => ({ message: t('auth.error.invalid_role') }),
});

const editUserSchema = z.object({
  name: z.string().min(4, { message: t('auth.error.name_min_length', { length: 4 }) }),
  email: z.string().email({ message: t('auth.error.invalid_email') }),
  // roles: z.array(roleSchema).min(1, { message: t('auth.error.role_required') }),
});

const { handleSubmit } = useForm({
  validationSchema: toTypedSchema(editUserSchema),
  initialValues: {
    name: props.userData.name,
    email: props.userData.email,
    // roles: (props.userData.roles as any[]) || [],
  },
});

// Computed
// Functions
const onSubmit = () => {
  unsetErrorAlert();
  if (!props.editable) {
    router.push({ name: AdminRouteName.ADMIN_USER_EDIT, params: { id: route.params.id } });
    return;
  }
  handleSubmit(async values => {
    isLoading.value = true;
    try {
      // Call the API to update the user
      await client.admin.user.updateUser({
        userId: props.userData.id,
        data: {
          name: values.name,
          email: values.email,
        },
      });
      // Show success notification
      toast.success({ description: t('admin.user.update.success') });
    } catch (error) {
      console.error(error);
      setErrorAlert(t('admin.user.update.failed'));
    } finally {
      isLoading.value = false;
    }
  })();
};

// Hooks
</script>

<template>
  <ErrorAlert v-model="errorAlert.open" v-bind="errorAlert" />
  <form class="space-y-5" @submit.prevent="onSubmit">
    <FormField v-slot="{ componentField }" name="name">
      <FormItem>
        <FormLabel> Name </FormLabel>
        <FormControl>
          <Input type="text" v-bind="componentField" autocomplete="off" :disabled="!editable" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="email">
      <FormItem>
        <FormLabel> Email </FormLabel>
        <FormControl>
          <Input type="text" v-bind="componentField" autocomplete="off" :disabled="!editable" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
    <!--
    <FormField v-slot="{ value, handleChange }" name="roleName">
      <FormItem>
        <FormLabel> Role </FormLabel>
        <FormControl>
          <FormRoleSelector
            :roles="roles"
            :modelValue="value"
            @change="handleChange"
            :disabled="!editable"
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
    -->
    <div class="w-full flex items-center justify-end">
      <ButtonLink to="/admin/user" class="mr-2" variant="secondary">
        {{ $t('form.button.cancel') }}
      </ButtonLink>
      <Button type="submit" v-if="!editable"> {{ $t('form.button.edit') }} </Button>
      <ButtonLoading type="submit" v-if="editable" :loading="isLoading">
        {{ $t('form.button.save') }}
      </ButtonLoading>
    </div>
  </form>
</template>
