<script setup lang="ts">
import { useTextToImageService } from '@/composables/services/useTextToImageService';
import { useImgGenSettingsStore } from '@/stores/image-gen-settings.store';
import { useInfiniteScroll } from '@vueuse/core';
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

const showImagePreview = ref(false);
const imgPreviewUrl = ref('');
const imgPreviewPrompt = ref<string | undefined>(undefined);

const page = ref(1);
const data = ref<any | null>(null);

const runs = computed(() => data.value?.runs || []);
const meta = computed(() => data.value?.meta || {});
const hasRuns = computed(() => runs.value && runs.value.length > 0);

const settings = useImgGenSettingsStore();

const { fetchFolders, fetchRunsPaginated } = useTextToImageService();

const initRuns = async () => {
  const response = await fetchFolders();
  if (!response?.folders.length) {
    throw new Error('No folder found');
  }

  data.value = await fetchRunsPaginated(
    {
      folderId: response.folders[0].id,
    },
    { page: page.value, showHidden: settings.getShowHidden },
  );
};

const setPage = (value: number) => {
  page.value = value;
};

function previewImage(url: string, prompt?: string) {
  if (!url) {
    return;
  }
  imgPreviewPrompt.value = prompt;
  imgPreviewUrl.value = url;
  showImagePreview.value = true;
}

async function resetPageData() {
  // setPage(1);
  // await refresh();
  // runs.value = data.value?.runs || [];
  await initRuns();
}

function handleNextScroll() {
  if (hasRuns.value !== true || !meta.value?.nextPage) return;
  setPage(meta.value.nextPage);
}

function initInfiniteScroll() {
  const mainContainer = document.getElementById('main');
  if (!mainContainer) return;
  const { reset } = useInfiniteScroll(mainContainer, handleNextScroll, {
    distance: 100,
  });
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
  () => page.value,
  async () => {
    // TODO: fix infinite scroll
  },
);

watch(
  () => settings.getShowHidden,
  async () => await resetPageData(),
);

onMounted(() => {
  initRuns();
  initInfiniteScroll();
});
</script>

<template>
  <div class="">
    <TextToImagePreviewDialog
      v-model:show="showImagePreview"
      :img-url="imgPreviewUrl"
      :prompt="imgPreviewPrompt"
    />
    <div v-if="hasRuns" id="runContainer" class="">
      <div v-for="run in runs" :key="run.id" class="my-2 flex">
        <div class="grid shrink-0 grid-cols-4">
          <div
            v-for="image in run.images"
            :key="image.id"
            class="mx-1 flex size-56 overflow-hidden rounded-lg border border-transparent hover:cursor-pointer hover:shadow-xl"
            @click="previewImage(image.path, run.prompt)"
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
          :prompt="run.prompt"
          :run-id="run.id"
          :is-hidden="run.deletedAt !== null"
          @re-run="val => $emit('reRun', val)"
          @use-prompt="val => $emit('usePrompt', val)"
          @toggle-hide="val => $emit('toggleHide', val)"
        />
      </div>
    </div>
    <div v-else>
      <p class="text-center text-sm opacity-50">Let your creativity flow.</p>
    </div>
  </div>
</template>
