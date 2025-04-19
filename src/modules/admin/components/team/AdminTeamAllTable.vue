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
import type { TeamsPaginated } from '@hopkins385/ragna-sdk';
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
const teamsData = shallowRef<TeamsPaginated>();

// Composables
const client = useRagnaClient();
const toast = useToast();
const route = useRoute();
const router = useRouter();
const { t } = useI18n();
const { errorAlert, setErrorAlert, unsetErrorAlert } = useErrorAlert();
const { confirmDialog, setConfirmDialog } = useConfirmDialog();

// Computed
const teams = computed(() => teamsData.value?.teams || []);
const meta = computed(() => {
  return {
    totalCount: teamsData.value?.meta?.totalCount || 0,
    currentPage: teamsData.value?.meta?.currentPage || 0,
  };
});

// Functions
const initAllTeams = async (params: { page: number; limit?: number }) => {
  unsetErrorAlert();
  try {
    // TODO: Add pagination params
    teamsData.value = await client.admin.team.fetchAllTeams({
      page: params.page,
      limit: params.limit ?? 10,
    });
  } catch (error: unknown) {
    return setErrorAlert(error);
  }
};

const handleDelete = async (userId: string) => {
  throw new Error('Not implemented');
  try {
    // await client.admin.team.deleteTeam({ userId });
    await initAllTeams({ page: page.value });
    toast.success({ description: t('admin.user.delete.success') });
  } catch (error: unknown) {
    console.error(error);
    return setErrorAlert(error);
  }
};

const onDelete = (userId: string) => {
  throw new Error('Not implemented');
  unsetErrorAlert();
  setConfirmDialog({
    title: t('admin.team.delete.confirm.title'),
    description: t('admin.team.delete.confirm.description'),
    confirmButtonText: t('admin.team.delete.confirm.button'),
    onConfirm: () => handleDelete(userId),
  });
};

const onUpdatePage = async (currentPage: number) => {
  page.value = currentPage;
  router.push({ query: { ...route.query, page: currentPage } });
};

onBeforeRouteUpdate(async (to, from) => {
  if (to.query.page !== from.query.page) {
    page.value = Number(to.query.page) || 1;
    await initAllTeams({ page: page.value });
  }
});

onBeforeMount(async () => {
  page.value = Number(route.query.page) || 1;
  await initAllTeams({ page: page.value });
});
</script>

<template>
  <div>
    <ErrorAlert v-model="errorAlert.open" :message="errorAlert.message" />
    <ConfirmDialog v-model="confirmDialog.open" v-bind="confirmDialog" />
    <Table v-if="teams.length" class="w-full">
      <TableCaption>
        Showing from
        {{ meta.totalCount > 10 ? meta.currentPage * 10 - 10 + 1 : 1 }}
        to
        {{ meta.totalCount > 10 ? meta.currentPage * 10 - 10 + teams.length : meta.totalCount }}
        of total
        {{ meta.totalCount }}
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead class="font-semibold"> Avatar </TableHead>
          <TableHead class="font-semibold"> Name </TableHead>
          <TableHead class="font-semibold"></TableHead>
          <TableHead class="font-semibold"></TableHead>
          <TableHead class="text-right font-semibold"> Actions </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="team in teams" :key="team.id">
          <TableCell>
            <div class="size-8 rounded-full bg-slate-200"></div>
          </TableCell>
          <TableCell class="max-w-full truncate">
            {{ team.name }}
          </TableCell>
          <TableCell class="whitespace-nowrap"></TableCell>
          <TableCell class="whitespace-nowrap"></TableCell>
          <TableCell class="flex justify-end space-x-2 whitespace-nowrap text-right">
            <ButtonLink :to="`/admin/team/${team.id}/edit`" variant="outline" size="icon">
              <SettingsIcon class="size-4 stroke-1.5 text-primary" />
            </ButtonLink>
            <Button variant="outline" size="icon" :disabled="true">
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
