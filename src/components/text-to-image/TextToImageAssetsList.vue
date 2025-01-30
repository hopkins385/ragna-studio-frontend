<script setup lang="ts">
import { useTextToImageService } from '@/composables/services/useTextToImageService';
import { useImgGenSettingsStore } from '@/stores/image-gen-settings.store';
import { useInfiniteScroll } from '@vueuse/core';
import { Loader2Icon } from 'lucide-vue-next';
import TextToImageOptionsBar from './TextToImageOptionsBar.vue';
import TextToImagePreviewDialog from './TextToImagePreviewDialog.vue';

const props = defineProps<{
  refreshData: boolean;
}>();

defineEmits<{
  reRun: [prompt: string];
  usePrompt: [prompt: string];
  toggleHide: [runId: string];
}>();

const imgPreview = reactive({
  show: false,
  url: '',
  id: '',
  prompt: '',
});

const mainContainer = ref<HTMLElement | null>(null);

const isLoading = ref(false);
const folderId = ref('');

const runs = ref<any>([]);
const meta = ref<any>(null);
const hasRuns = computed(() => runs.value && runs.value.length > 0);

const settings = useImgGenSettingsStore();

const { fetchFolders, fetchRunsPaginated } = useTextToImageService();

const initFolder = async () => {
  const response = await fetchFolders();
  if (!response?.folders.length) {
    throw new Error('No folder found');
  }
  folderId.value = response.folders[0].id;
};

const fetchRuns = async (payload: { page: number }) => {
  isLoading.value = true;
  const response = await fetchRunsPaginated(
    {
      folderId: folderId.value,
    },
    { page: payload.page, showHidden: settings.getShowHidden },
  );
  runs.value.push(...response.runs);
  meta.value = response.meta;
  isLoading.value = false;
};

function previewImage(payload: { url: string; id: string; prompt?: string }) {
  imgPreview.url = payload.url;
  imgPreview.id = payload.id;
  imgPreview.prompt = payload.prompt || '';
  imgPreview.show = true;
}

const handleNextScroll = async () => {
  if (hasRuns.value !== true || !meta.value?.nextPage) return;
  await fetchRuns({ page: meta.value.nextPage });
};

const { reset: resetInfiniteScroll } = useInfiniteScroll(
  mainContainer,
  handleNextScroll,
  {
    distance: 50,
  },
);

const scrollToTop = (options: { instant: boolean } = { instant: false }) => {
  nextTick(() => {
    mainContainer.value?.scrollTo({
      top: 0,
      behavior: options.instant ? 'instant' : 'smooth',
    });
  });
};

const initRuns = async () => {
  runs.value = [];
  meta.value = null;
  await initFolder();
  await fetchRuns({ page: 1 });
  scrollToTop({ instant: true });
};

async function resetPageData() {
  await initRuns();
  resetInfiniteScroll();
}

watch(
  () => props.refreshData,
  async value => {
    if (value) {
      await resetPageData();
    }
  },
);

watch(
  () => settings.getShowHidden,
  async () => await resetPageData(),
);

onMounted(() => {
  const main = document.getElementById('main');
  mainContainer.value = main;
  initRuns();
});
</script>

<template>
  <div>
    <TextToImagePreviewDialog
      v-model:show="imgPreview.show"
      :img-id="imgPreview.id"
      :img-url="imgPreview.url"
      :prompt="imgPreview.prompt"
    />
    <div v-if="hasRuns" id="runContainer" class="">
      <div v-for="run in runs" :key="run.id" class="my-2 flex">
        <div class="grid shrink-0 grid-cols-4">
          <div
            v-for="image in run.images"
            :key="image.id"
            class="mx-1 flex size-56 overflow-hidden rounded-lg border border-transparent hover:cursor-pointer hover:shadow-xl"
            @click="
              () =>
                previewImage({
                  url: image.path,
                  id: image.id,
                  prompt: run.prompt,
                })
            "
          >
            <img
              v-if="image.path"
              :src="image.path"
              alt="image"
              class="size-full rounded-lg object-contain"
              loading="lazy"
            />
            <div v-else class="group size-full bg-stone-100 p-2">
              <p class="hidden text-xs lowercase opacity-50 group-hover:block">
                {{ image.status }}
              </p>
            </div>
          </div>
        </div>
        <TextToImageOptionsBar
          :provider="settings.getProviderDisplayName(run.settings.provider)"
          :prompt="run.prompt"
          :run-id="run.id"
          :is-hidden="run.deletedAt !== null"
          @re-run="val => $emit('reRun', val)"
          @use-prompt="val => $emit('usePrompt', val)"
          @toggle-hide="val => $emit('toggleHide', val)"
        />
      </div>
    </div>

    <div class="py-10 flex justify-center">
      <Loader2Icon
        v-if="(meta && !meta.isLastPage) || isLoading"
        class="!size-5 animate-spin stroke-1.5 opacity-75"
      />
    </div>
    <div v-if="!hasRuns && !isLoading" class="flex">
      <p class="text-center text-sm opacity-50">Let your creativity flow.</p>
    </div>
  </div>
</template>
