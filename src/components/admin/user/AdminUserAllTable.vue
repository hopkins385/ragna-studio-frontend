<script setup lang="ts">
import ConfirmDialog from '@/components/confirm/ConfirmDialog.vue';
import ErrorAlert from '@/components/error/ErrorAlert.vue';
import PaginateControls from '@/components/pagniate/PaginateControls.vue';
import { Button } from '@/components/ui/button';
import { useAdminUserService } from '@/composables/services/admin/useAdminUserService';
import { useConfirmDialog } from '@/composables/useConfirmDialog';
import { useErrorAlert } from '@/composables/useErrorAlert';
import useToast from '@/composables/useToast';
import { useAuthStore } from '@/stores/auth.store';
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

const router = useRouter();
const toast = useToast();
const auth = useAuthStore();

const { fetchAllUsers, deleteUser } = useAdminUserService();
const { errorAlert, setErrorAlert, unsetErrorAlert } = useErrorAlert();
const { confirmDialog, setConfirmDialog, unsetConfirmDialog } = useConfirmDialog();

const page = ref(1);
const deleteUserId = ref('');

const data = ref<Record<string, any> | null>(null);

const users = computed(() => data.value?.users || []);
const meta = computed(() => {
  return {
    totalCount: data.value?.meta?.totalCount || 0,
    currentPage: data.value?.meta?.currentPage || 0,
  };
});

const initAllUsers = async (params: { page: number }) => {
  unsetErrorAlert();
  try {
    data.value = await fetchAllUsers(params);
  } catch (error: unknown) {
    setErrorAlert(error);
  }
};

const onDelete = (id: string) => {
  deleteUserId.value = id;
  setConfirmDialog({
    title: 'Delete User',
    message: 'Are you sure you want to delete this user?',
  });
};

const handleDelete = async () => {
  unsetErrorAlert();

  if (auth.currentUser?.id === deleteUserId.value) {
    unsetConfirmDialog();
    setErrorAlert('You cannot delete yourself');
    return;
  }

  try {
    await deleteUser({ userId: deleteUserId.value });
    unsetConfirmDialog();
    toast.success({ description: 'User deleted successfully' });
    await initAllUsers({ page: page.value });
  } catch (error) {
    setErrorAlert(error);
  }
};

const onUpdatePage = async (currentPage: number) => {
  page.value = currentPage;
  await initAllUsers({ page: currentPage });
};

await initAllUsers({ page: page.value });
</script>

<template>
  <div>
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
              <LinkButton :to="`/admin/users/${user.id}/edit`" variant="outline" size="icon">
                <SettingsIcon class="size-4 stroke-1.5 text-primary" />
              </LinkButton>
              <Button variant="outline" size="icon" @click="onDelete(user.id)">
                <Trash2Icon class="size-4 stroke-1.5 text-destructive" />
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
    <!-- Pagination Controls -->
    <div class="pb-10 px-10">
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
