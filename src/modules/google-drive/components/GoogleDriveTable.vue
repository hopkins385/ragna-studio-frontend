<script setup lang="ts">
import TableSkeleton from '@/components/table/TableSkeleton.vue';
import { useDateTime } from '@/composables/useDateTime';
import { useRagnaClient } from '@/composables/useRagnaClient';
import useGoogleDriveIcons from '@/modules/google-drive/composables/useGoogleDriveIcons';
import { getFileSizeForHumans } from '@/utils/file-size.util';
import { Button } from '@ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@ui/tooltip';
import { ArrowLeftIcon, ArrowRightIcon, CopyPlusIcon, LoaderIcon } from 'lucide-vue-next';
import GoogleSearchFileBar from './GoogleSearchFileBar.vue';

interface File {
  id: string;
  name: string;
  mimeType: string;
  owner: string;
  modifiedTime: string;
  size: number;
}

interface Data {
  files: File[];
  nextPageToken: string | null;
}

const GOOGLE_DRIVE_FOLDER_MIME_TYPE = 'application/vnd.google-apps.folder';

const RAGMimeTypes = [
  'text/plain',
  'application/pdf',
  'application/vnd.google-apps.document',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
];

const router = useRouter();
const route = useRoute();
const client = useRagnaClient();

const searchFileName = ref('');
const pageTokenHistory = ref<string[]>([]);
const fileDonwloadPending = ref<string | null>(null);
const nextPageToken = ref<string | null>(null);

const folderId = computed(() => route.params.id?.toString() ?? null);
const showPageControls = computed(
  () => pageTokenHistory.value.length > 0 || nextPageToken.value !== null || data.nextPageToken,
);

const dataIsLoading = ref(true);
const data = reactive<Data>({
  files: [],
  nextPageToken: null,
});

const init = async () => {
  dataIsLoading.value = true;
  try {
    const result = await client.googleDrive.fetchDriveData({
      fileName: searchFileName.value,
      folderId: folderId.value,
      pageToken: nextPageToken.value,
    });
    if (result) {
      data.files = result.files;
      data.nextPageToken = result.nextPageToken;
    }
  } catch (error) {
    // TODO: show error?
  } finally {
    dataIsLoading.value = false;
  }
};

watch(
  [folderId, nextPageToken],
  () => {
    if (dataIsLoading.value) return;
    init();
  },
  { immediate: true },
);

watch(searchFileName, value => {
  if (value !== '') return;
  init();
});

const submitDisabled = computed(() => searchFileName.value === '' || dataIsLoading.value);

const onRowClick = (file: any) => {
  if (file.mimeType === 'application/vnd.google-apps.folder') {
    router.push(`/media/google-drive/${file.id}`);
  }
};

const onNextClick = (nextToken?: string | null) => {
  if (!nextToken) return;
  pageTokenHistory.value.push(nextPageToken.value ?? '');
  nextPageToken.value = nextToken;
};

const onPrevClick = () => {
  const prevToken = pageTokenHistory.value.pop();
  nextPageToken.value = prevToken || null;
};

async function downloadFile(id: string | undefined | null) {
  if (!id) return;
  const file = data?.files?.find(f => f.id === id);
  if (!file) return;
  if (fileDonwloadPending.value === id) return;
  fileDonwloadPending.value = id;
  /*const { data, error, pending } = await useFetch('/api/google/download', {
      method: 'GET',
      params: {
        fileId: id,
      },
    });*/

  // console.log(data, error.value);
  fileDonwloadPending.value = null;
}

const onSubmitSearch = async () => {
  if (submitDisabled.value) return;
  await init();
};

const { fileIcon } = useGoogleDriveIcons();
const { getDateTimeForHumans } = useDateTime();

onMounted(init);
</script>

<template>
  <div v-if="dataIsLoading">
    <TableSkeleton />
  </div>
  <div v-else>
    <div v-if="!folderId">
      <!-- TODO:  && pageTokenHistory.length === 0" -->
      <GoogleSearchFileBar
        v-model="searchFileName"
        :pending="dataIsLoading"
        :submit-disabled="submitDisabled"
        @submit="onSubmitSearch"
      />
    </div>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Owner</TableHead>
          <TableHead>Last Modified</TableHead>
          <TableHead>Size</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-if="data?.files?.length === 0">
          <TableCell colspan="4"> No files found </TableCell>
        </TableRow>
        <TableRow>
          <TableCell
            v-if="folderId && !nextPageToken && !dataIsLoading"
            id="back"
            colspan="4"
            class="cursor-pointer"
            @click="$router.back()"
          >
            ...
          </TableCell>
          <TableCell
            v-if="nextPageToken && !dataIsLoading"
            id="back"
            colspan="4"
            class="cursor-pointer"
            @click="nextPageToken = null"
          >
            ...
          </TableCell>
        </TableRow>
        <TableRow
          v-for="(file, index) in data?.files"
          :key="index"
          :class="file?.mimeType === GOOGLE_DRIVE_FOLDER_MIME_TYPE ? 'cursor-pointer' : ''"
          @click="onRowClick(file)"
        >
          <TableCell class="truncate">
            <component
              :is="fileIcon(file?.mimeType)"
              class="mr-2 inline-block size-5 fill-slate-100 stroke-slate-600 stroke-1.5"
            />
            {{ file?.name }}
          </TableCell>
          <TableCell>{{ file?.owner }}</TableCell>
          <TableCell>{{ getDateTimeForHumans(file?.modifiedTime) }}</TableCell>
          <TableCell>
            {{ file?.size ? getFileSizeForHumans(file?.size) : '-' }}
          </TableCell>
          <TableCell>
            <div v-if="file?.size && RAGMimeTypes.includes(file?.mimeType)">
              <TooltipProvider :delay-duration="300">
                <Tooltip>
                  <TooltipTrigger as-child>
                    <Button
                      variant="outline"
                      size="icon"
                      class="group"
                      @click="downloadFile(file?.id)"
                    >
                      <LoaderIcon
                        v-if="fileDonwloadPending === file?.id"
                        class="size-4 animate-spin stroke-1.5"
                      />
                      <CopyPlusIcon v-else class="size-4 stroke-1.5 group-hover:stroke-2" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Copy to collection</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div v-else>-</div>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
    <div class="flex space-x-4 ml-4" v-if="showPageControls">
      <div class="mt-4 flex flex-col">
        <Button
          variant="outline"
          size="icon"
          class="size-8"
          :disabled="pageTokenHistory.length === 0"
          @click="() => onPrevClick()"
        >
          <ArrowLeftIcon class="size-4" />
        </Button>
        <span class="hidden pt-2 text-xs">Next Page</span>
      </div>
      <div class="mt-4 flex flex-col">
        <Button
          variant="outline"
          size="icon"
          class="size-8"
          :disabled="!data?.nextPageToken"
          @click="() => onNextClick(data?.nextPageToken)"
        >
          <ArrowRightIcon class="size-4" />
        </Button>
        <span class="hidden pt-2 text-xs">Next Page</span>
      </div>
    </div>
  </div>
</template>
