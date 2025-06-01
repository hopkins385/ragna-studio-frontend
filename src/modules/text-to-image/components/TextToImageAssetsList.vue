<script setup lang="ts">
import { useRagnaClient } from '@/composables/useRagnaClient';
import { useImgGenSettingsStore } from '@/modules/text-to-image/stores/image-gen-settings.store';
import type { ImageRun } from '@hopkins385/ragna-sdk';
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

const imgPreview = reactive<{
  show: boolean;
  run: ImageRun | undefined;
  selectedImageId?: string;
}>({
  show: false,
  run: undefined,
  selectedImageId: undefined,
});

const mainContainer = ref<HTMLElement | null>(null);

const isLoading = ref(false);
const folderId = ref('');

const runs = ref<ImageRun[]>([]);
const meta = ref<any>(null);
const hasRuns = computed(() => runs.value && runs.value.length > 0);

const client = useRagnaClient();
const settings = useImgGenSettingsStore();

const initFolder = async () => {
  const response = await client.textToImage.fetchFolders();
  if (!response?.folders.length) {
    throw new Error('No folder found');
  }
  folderId.value = response.folders[0].id;
};

const fetchRuns = async (payload: { page: number }) => {
  isLoading.value = true;
  const response = await client.textToImage.fetchRunsPaginated(
    {
      folderId: folderId.value,
    },
    { page: payload.page, showHidden: settings.getShowHidden },
  );
  runs.value.push(...response.runs);
  meta.value = response.meta;
  isLoading.value = false;
};

const previewImage = (payload: { runId: string; imageId: string }) => {
  const selectedRun = runs.value.find(run => run.id === payload.runId);
  if (!selectedRun) {
    console.error('Run not found:', payload.runId);
    return;
  }
  const selectedImage = selectedRun.images.find(img => img.id === payload.imageId);
  if (!selectedImage) {
    console.error('Image not found:', payload.imageId);
    return;
  }
  imgPreview.run = selectedRun;
  imgPreview.selectedImageId = selectedImage.id;
  imgPreview.show = true;
};

const handleNextScroll = async () => {
  if (hasRuns.value !== true || !meta.value?.nextPage) return;
  await fetchRuns({ page: meta.value.nextPage });
};

const { reset: resetInfiniteScroll } = useInfiniteScroll(mainContainer, handleNextScroll, {
  distance: 50,
});

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
      v-if="imgPreview.run"
      v-model:show="imgPreview.show"
      :run="imgPreview.run"
      :selected-image-id="imgPreview.selectedImageId"
      :key="imgPreview.selectedImageId"
    />
    <div v-if="hasRuns" id="runContainer" class="">
      <div v-for="run in runs" :key="run.id" class="my-2 flex">
        <div class="grid shrink-0 grid-cols-4">
          <div
            v-for="image in run.images"
            :key="image.id"
            class="mx-1 flex size-56 overflow-hidden rounded-lg border border-transparent hover:cursor-pointer hover:shadow-xl"
            @click="() => previewImage({ runId: run.id, imageId: image.id })"
          >
            <picture v-if="image.path">
              <source v-if="image.thumb?.avif" :srcset="image.thumb.avif" type="image/avif" />
              <source v-if="image.thumb?.webp" :srcset="image.thumb.webp" type="image/webp" />
              <img
                :src="image.path"
                alt="image"
                class="size-full rounded-lg object-contain"
                loading="lazy"
              />
            </picture>
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
    <div v-if="!hasRuns && !isLoading">
      <p class="text-center text-sm opacity-50">Let your creativity flow.</p>
    </div>
  </div>
</template>
