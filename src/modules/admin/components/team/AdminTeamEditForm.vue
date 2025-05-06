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
import type { Team } from '@hopkins385/ragna-sdk';
import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';

const props = defineProps<{
  teamData: Team;
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

const editTeamSchema = z.object({
  name: z.string().min(4, { message: t('auth.error.name_min_length', { length: 4 }) }),
});

const { handleSubmit } = useForm({
  validationSchema: toTypedSchema(editTeamSchema),
  initialValues: {
    name: props.teamData.name,
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
      await client.admin.team.updateTeam({
        teamId: props.teamData.id,
        data: {
          name: values.name,
        },
      });
      // Show success notification
      toast.success({ description: 'admin.team.update.success' });
    } catch (error) {
      console.error(error);
      setErrorAlert('admin.team.update.failed');
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
    <div class="w-full flex items-center justify-end">
      <ButtonLink to="/admin/team" class="mr-2" variant="secondary">
        {{ $t('form.button.cancel') }}
      </ButtonLink>
      <Button type="submit" v-if="!editable"> {{ $t('form.button.edit') }} </Button>
      <ButtonLoading type="submit" v-if="editable" :loading="isLoading">
        {{ $t('form.button.save') }}
      </ButtonLoading>
    </div>
  </form>
</template>
