<script setup lang="ts">
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
import { EyeIcon, SettingsIcon, Trash2Icon } from 'lucide-vue-next';

// Props
// Emits

// Refs
const page = ref(1);
const usersData = shallowRef<UsersPaginated>();

// Composables
const client = useRagnaClient();
const toast = useToast();
const auth = useAuthStore();
const route = useRoute();
const router = useRouter();
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
const initAllUsers = async (params: { page: number; limit?: number }) => {
  unsetErrorAlert();
  try {
    // TODO: Add pagination params
    usersData.value = await client.admin.user.fetchAllUsers({
      page: params.page,
      limit: params.limit ?? 10,
    });
  } catch (error: unknown) {
    return setErrorAlert(error);
  }
};

const handleDelete = async (userId: string) => {
  if (auth.user?.id === userId) {
    return setErrorAlert('You cannot delete yourself');
  }

  try {
    await client.admin.user.deleteUser({ userId });
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

const roleDisplayNames = {
  admin: 'Administrator',
  user: 'User',
};

const getRoleDisplayName = (role: { name: string }) => {
  return roleDisplayNames[role.name as keyof typeof roleDisplayNames] || '-';
};

const onUpdatePage = async (currentPage: number) => {
  page.value = currentPage;
  router.push({ query: { ...route.query, page: currentPage } });
};

onBeforeRouteUpdate(async (to, from) => {
  if (to.query.page !== from.query.page) {
    page.value = Number(to.query.page) || 1;
    await initAllUsers({ page: page.value });
  }
});

onBeforeMount(async () => {
  page.value = Number(route.query.page) || 1;
  await initAllUsers({ page: page.value });
});
</script>

<template>
  <div>
    <ErrorAlert v-model="errorAlert.open" :message="errorAlert.message" />
    <ConfirmDialog v-model="confirmDialog.open" v-bind="confirmDialog" />
    <Table v-if="users.length" class="w-full">
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
          <TableHead class="font-semibold"> Avatar </TableHead>
          <TableHead class="font-semibold"> Name </TableHead>
          <TableHead class="font-semibold"> Roles </TableHead>
          <TableHead class="font-semibold"> Teams </TableHead>
          <TableHead class="text-right font-semibold"> Actions </TableHead>
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
          <TableCell class="whitespace-nowrap">
            <p v-if="!user.roles.length">-</p>
            <p v-for="role in user.roles" :key="role.id">
              {{ getRoleDisplayName({ name: role.name }) }}
            </p>
          </TableCell>
          <TableCell class="whitespace-nowrap">
            <p v-for="team in user.teams" :key="team.id">{{ team.name }}</p>
          </TableCell>
          <TableCell class="flex justify-end space-x-2 whitespace-nowrap text-right">
            <ButtonLink :to="`/admin/user/${user.id}`" variant="outline" size="icon">
              <EyeIcon class="size-4 stroke-1.5 text-primary" />
            </ButtonLink>
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
      <PaginateControls :page="page" :meta="meta" @update:page="onUpdatePage" />
    </div>
  </div>
</template>
