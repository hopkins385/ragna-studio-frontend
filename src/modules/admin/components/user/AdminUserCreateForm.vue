<script setup lang="ts">
import ErrorAlert from '@/components/error/ErrorAlert.vue';
import ButtonLink from '@/components/ui/button/ButtonLink.vue';
import ButtonLoading from '@/components/ui/button/ButtonLoading.vue';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useErrorAlert } from '@/composables/useErrorAlert';
import { useRagnaClient } from '@/composables/useRagnaClient';
import AdminUserInviteDialog from '@/modules/admin/components/user/AdminUserInviteDialog.vue';
import { ConflictError } from '@hopkins385/ragna-sdk';
import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';

const createUserSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  email: z.string().trim().email('Invalid email address'),
});

const createUserFormSchema = toTypedSchema(createUserSchema);

// Props
// Emits

// Refs
const isLoading = ref(false);
const showDialog = ref(false);
const inviteLink = ref<string>('');

// Composables
const { errorAlert, setErrorAlert, unsetErrorAlert } = useErrorAlert();
const { t } = useI18n();
const client = useRagnaClient();
const router = useRouter();
const {
  errors: formErrors,
  handleSubmit,
  resetForm,
} = useForm({
  validationSchema: createUserFormSchema,
});

// Computed
// Functions
const onSubmit = handleSubmit(async values => {
  unsetErrorAlert();
  isLoading.value = true;
  try {
    const { inviteToken } = await client.admin.user.inviteUser({
      name: values.name,
      email: values.email,
    });
    if (inviteToken) {
      const link = `${window.location.origin}/auth/reset-password/${inviteToken}`;
      inviteLink.value = link;
      showDialog.value = true;
    }
  } catch (error: unknown) {
    if (error instanceof ConflictError) {
      setErrorAlert(t('admin.user.error.email_exists'));
    } else {
      console.error('Error inviting user:', error);
      setErrorAlert('An error occurred while inviting the user. Please try again.');
    }
  } finally {
    isLoading.value = false;
  }
});

const onDialogSuccess = () => {
  resetForm();
  router.back();
};

// Hooks
</script>

<template>
  <ErrorAlert v-model="errorAlert.open" v-bind="errorAlert" />
  <AdminUserInviteDialog v-model="showDialog" :link="inviteLink" @success="onDialogSuccess" />
  <form @submit="onSubmit" class="space-y-6">
    <FormField v-slot="{ componentField }" name="name">
      <FormItem>
        <FormLabel>{{ $t('admin.user.form.name') }}</FormLabel>
        <FormDescription> {{ $t('admin.user.form.name_description') }} </FormDescription>
        <FormControl>
          <Input type="text" placeholder="" autocomplete="off" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
    <FormField v-slot="{ componentField }" name="email">
      <FormItem>
        <FormLabel>{{ $t('admin.user.form.email') }}</FormLabel>
        <FormDescription>
          {{ $t('admin.user.form.email_description') }}
        </FormDescription>
        <FormControl>
          <Input type="email" placeholder="" autocomplete="off" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
    <div class="flex w-full justify-end space-x-4">
      <ButtonLink to="/admin/user" variant="secondary">
        {{ $t('form.button.cancel') }}
      </ButtonLink>
      <ButtonLoading :loading="isLoading">
        {{ $t('admin.user.create.title') }}
      </ButtonLoading>
    </div>
  </form>
</template>
