<script setup lang="ts">
import ButtonLink from '@/components/button/ButtonLink.vue';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  useUserService,
  type User,
  type UsersPaginated,
} from '@/composables/services/useUserService';
import { useNotification } from '@/composables/useNotification';
import { Settings, Trash2, User2 } from 'lucide-vue-next';

// Composables
const { fetchAllUsers, deleteUser } = useUserService();
const { showError, showSuccess } = useNotification();

// Data
const data = ref<UsersPaginated | null>(null);

// Computed
const users = computed<User[]>(() => data.value?.users || []);
const meta = computed(() => data.value?.meta || {});
const hasUsers = computed(() => users.value && users.value.length > 0);

// Methods
const onDelete = async (id: string) => {
  try {
    await deleteUser(id);
    await initUsers();
    showSuccess('User deleted successfully');
  } catch (err) {
    showError('Failed to delete user');
  }
};

const initUsers = async () => {
  try {
    data.value = await fetchAllUsers();
  } catch (err) {
    //
  } finally {
    //
  }
};

// Lifecycle
await initUsers();
</script>

<template>
  <div
    v-if="hasUsers"
    class="rounded-lg bg-white overflow-hidden shadow-sm border border-muted/50"
  >
    <Table>
      <TableCaption>
        <!--
      Showing from
      {{ meta.totalCount > 10 ? meta.currentPage * 10 - 10 + 1 : 1 }}
      to
      {{
        meta.totalCount > 10
          ? meta.currentPage * 10 - 10 + users.length
          : meta.totalCount
      }}
      of total
      {{ meta.totalCount }}
       -->
      </TableCaption>
      <TableHeader class="bg-muted/50">
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
          <TableCell
            class="flex justify-end space-x-2 whitespace-nowrap text-right"
          >
            <ButtonLink :to="`/user/${user.id}`" variant="outline" size="icon">
              <User2 class="size-4 stroke-1.5 text-primary" />
            </ButtonLink>

            <ButtonLink
              :to="`/user/${user.id}/edit`"
              variant="outline"
              size="icon"
            >
              <Settings class="size-4 stroke-1.5 text-primary" />
            </ButtonLink>
            <Button variant="outline" size="icon" @click="onDelete(user.id)">
              <Trash2 class="size-4 stroke-1.5 text-destructive" />
            </Button>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>
