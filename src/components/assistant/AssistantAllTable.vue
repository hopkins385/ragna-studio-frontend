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
import useAssistantService from '@/composables/services/useAssistantService';
import { useChatService } from '@/composables/services/useChatService';
import useToast from '@/composables/useToast';
import { useAuthStore } from '@/stores/auth.store';
import { SettingsIcon, Trash2Icon, MessageSquareIcon } from 'lucide-vue-next';
import ErrorAlert from '@/components/error/ErrorAlert.vue';
import ConfirmDialog from '@/components/confirm/ConfirmDialog.vue';
import PaginateControls from '../pagniate/PaginateControls.vue';
import { useProviderIcons } from '@/composables/useProviderIcons';

const props = defineProps<{
  page: number;
  limit?: number;
  search?: string;
}>();

const emit = defineEmits<{
  newChat: [string];
  'update:page': [number];
}>();

const router = useRouter();

const toast = useToast();
const authStore = useAuthStore();

const data = ref();

const { createChat } = useChatService();

const showConfirmDialog = ref(false);
const errorAlert = reactive({
  show: false,
  message: '',
});
const deleteAssistantId = ref('');

const assistants = computed(() => data.value?.assistants || []);
const meta = computed(() => {
  return {
    totalCount: data.value?.meta?.totalCount || 0,
    currentPage: data.value?.meta?.currentPage || 0,
  };
});

const { fetchAllAssistants, deleteAssistant } = useAssistantService();
const { getProviderIcon } = useProviderIcons();

const initAllAssistants = async ({ page }: { page: number }) => {
  data.value = await fetchAllAssistants({ page });
};

const handleDelete = async () => {
  const assistantId = deleteAssistantId.value;
  const teamId = authStore.user?.teams?.[0].id;
  if (!assistantId || !teamId) {
    throw new Error('Assistant ID or Team ID is missing');
  }
  try {
    await deleteAssistant(assistantId, teamId);
    deleteAssistantId.value = '';
    toast.success({
      description: 'Assistant has been deleted successfully.',
    });
    await initAllAssistants({ page: props.page });
  } catch (error: any) {
    errorAlert.show = true;
    errorAlert.message = error?.message;
  }
};

const onStart = async (assistantId: string) => {
  console.log('Starting chat with assistant:', assistantId);
  const { chat } = await createChat(assistantId);
  if (!chat) {
    errorAlert.message = 'Failed to create chat';
    errorAlert.show = true;
    return;
  }
  emit('newChat', chat.id);
  router.push({ name: 'chat.show', params: { id: chat.id } });
};

const onDelete = (id: string) => {
  deleteAssistantId.value = id;
  showConfirmDialog.value = true;
};

const onUpdatePage = async (page: number) => {
  emit('update:page', page);
  await initAllAssistants({ page });
};

watch(
  () => props.search,
  async value => {
    // setSearchQuery(value);
    throw new Error('Not implemented');
  },
);

await initAllAssistants({ page: props.page });
</script>

<template>
  <div v-if="assistants && assistants.length > 0">
    <ErrorAlert v-model="errorAlert.show" :message="errorAlert.message" />
    <ConfirmDialog v-model="showConfirmDialog" @confirm="handleDelete" />

    <Table>
      <TableCaption>
        Showing from
        {{ meta.totalCount > 10 ? meta.currentPage * 10 - 10 + 1 : 1 }}
        to
        {{
          meta.totalCount > 10
            ? meta.currentPage * 10 - 10 + assistants.length
            : meta.totalCount
        }}
        of total
        {{ meta.totalCount }}
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead> Avatar </TableHead>
          <TableHead> Title </TableHead>
          <TableHead class="whitespace-nowrap"> Ai Model </TableHead>
          <TableHead class="text-right"> Actions </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow
          v-for="assistant in data?.assistants || []"
          :key="assistant.id"
        >
          <TableCell>
            <div class="size-8 rounded-full bg-slate-200"></div>
          </TableCell>
          <TableCell class="">
            <div class="">
              {{ assistant.title }}
            </div>
          </TableCell>
          <TableCell class="whitespace-nowrap">
            <div class="flex space-x-2 items-center">
              <component
                :is="getProviderIcon(assistant.llm.provider)"
                class="stroke-1.5 size-4"
              />
              <span>{{ assistant.llm.displayName }}</span>
            </div>
          </TableCell>
          <TableCell
            class="flex justify-end space-x-2 whitespace-nowrap text-right"
          >
            <Button variant="outline" @click="() => onStart(assistant.id)">
              Chat
              <MessageSquareIcon
                class="ml-2 size-4 shrink-0 stroke-1.5 text-primary"
              />
            </Button>
            <ButtonLink
              v-if="$ability.can('edit', 'Assistant')"
              :to="`/assistant/${assistant.id}/edit`"
              variant="outline"
              size="icon"
            >
              <SettingsIcon class="size-4 stroke-1.5 text-primary" />
            </ButtonLink>
            <Button
              v-if="$ability.can('delete', 'Assistant')"
              variant="outline"
              size="icon"
              @click="onDelete(assistant.id)"
            >
              <Trash2Icon class="size-4 stroke-1.5 text-destructive" />
            </Button>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>

    <PaginateControls
      v-if="meta.totalCount > 10"
      :page="page"
      :meta="meta"
      :limit="10"
      @update:page="onUpdatePage"
    />
  </div>
</template>
