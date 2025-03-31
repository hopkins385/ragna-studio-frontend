<script setup lang="ts">
// Imports
import ConfirmDialog from '@/components/confirm/ConfirmDialog.vue';
import ErrorAlert from '@/components/error/ErrorAlert.vue';
import PaginateControls from '@/components/pagniate/PaginateControls.vue';
import { Button } from '@/components/ui/button';
import ButtonLink from '@/components/ui/button/ButtonLink.vue';
import { useConfirmDialog } from '@/composables/useConfirmDialog';
import { useErrorAlert } from '@/composables/useErrorAlert';
import { useRagnaClient } from '@/composables/useRagnaClient';
import useToast from '@/composables/useToast';
import { useAuthStore } from '@/modules/auth/stores/auth.store';
import type { UsersPaginated } from '@hopkins385/ragna-sdk';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@ui/table';
import { SettingsIcon, Trash2Icon } from 'lucide-vue-next';

// Props
// Emits

// Refs
const page = ref(1);
const usersData = shallowRef<UsersPaginated>();

// Composables
const client = useRagnaClient();
const toast = useToast();
const auth = useAuthStore();
const { t } = useI18n();
const { errorAlert, setErrorAlert, unsetErrorAlert } = useErrorAlert();
const { confirmDialog, setConfirmDialog } = useConfirmDialog();

// Computed
const users = computed(() => usersData.value?.users || []);
const meta = computed(() => {
  return {
    totalCount: usersData.value?.meta?.totalCount || 0,
    currentPage: usersData.value?.meta?.currentPage || 0,
  };
});

// Functions
const initAllUsers = async (params: { page: number }) => {
  unsetErrorAlert();
  try {
    // TODO: Add pagination params
    usersData.value = await client.user.fetchAllUsers();
  } catch (error: unknown) {
    return setErrorAlert(error);
  }
};

const handleDelete = async (userId: string) => {
  if (auth.user?.id === userId) {
    return setErrorAlert('You cannot delete yourself');
  }

  try {
    await client.user.deleteUser(userId);
    await initAllUsers({ page: page.value });
    toast.success({ description: t('admin.user.delete.success') });
  } catch (error: unknown) {
    console.error(error);
    return setErrorAlert(error);
  }
};

const onDelete = (userId: string) => {
  unsetErrorAlert();
  setConfirmDialog({
    title: t('admin.user.delete.confirm.title'),
    description: t('admin.user.delete.confirm.description'),
    confirmButtonText: t('admin.user.delete.confirm.button'),
    onConfirm: () => handleDelete(userId),
  });
};

const onUpdatePage = async (currentPage: number) => {
  page.value = currentPage;
  await initAllUsers({ page: currentPage });
};

await initAllUsers({ page: page.value });
</script>

<template>
  <div>
    <ErrorAlert v-model="errorAlert.open" :message="errorAlert.message" />
    <ConfirmDialog v-model="confirmDialog.open" v-bind="confirmDialog" />
    <Table>
      <TableCaption>
        Showing from
        {{ meta.totalCount > 10 ? meta.currentPage * 10 - 10 + 1 : 1 }}
        to
        {{ meta.totalCount > 10 ? meta.currentPage * 10 - 10 + users.length : meta.totalCount }}
        of total
        {{ meta.totalCount }}
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead> Avatar </TableHead>
          <TableHead> Name </TableHead>
          <TableHead> ... </TableHead>
          <TableHead> ... </TableHead>
          <TableHead class="text-right"> Actions </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="user in users" :key="user.id">
          <TableCell>
            <div class="size-8 rounded-full bg-slate-200"></div>
          </TableCell>
          <TableCell class="max-w-full truncate">
            {{ user.name }}
          </TableCell>
          <TableCell class="whitespace-nowrap"> ... </TableCell>
          <TableCell class="whitespace-nowrap"> ... </TableCell>
          <TableCell class="flex justify-end space-x-2 whitespace-nowrap text-right">
            <ButtonLink :to="`/admin/user/${user.id}/edit`" variant="outline" size="icon">
              <SettingsIcon class="size-4 stroke-1.5 text-primary" />
            </ButtonLink>
            <Button variant="outline" size="icon" @click="onDelete(user.id)">
              <Trash2Icon class="size-4 stroke-1.5 text-destructive" />
            </Button>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
    <!-- Pagination Controls -->
    <div class="pb-10">
      <PaginateControls
        v-if="meta.totalCount > 10"
        :page="page || 1"
        :meta="meta"
        :limit="10"
        @update:page="onUpdatePage"
      />
    </div>
  </div>
</template>
