<script setup lang="ts">
import ErrorAlert from '@/components/error/ErrorAlert.vue';
import Button from '@/components/ui/button/Button.vue';
import { useErrorAlert } from '@/composables/useErrorAlert';
import { useRagnaClient } from '@/composables/useRagnaClient';
import TextToImageAssetsList from '@/modules/text-to-image/components/TextToImageAssetsList.vue';
import TextToImageDropzone from '@/modules/text-to-image/components/TextToImageDropzone.vue';
import TextToImageInput from '@/modules/text-to-image/components/TextToImageInput.vue';
import TextToImageLoading from '@/modules/text-to-image/components/TextToImageLoading.vue';
import { useImgGenSettingsStore } from '@/modules/text-to-image/stores/image-gen-settings.store';
import { RouteName } from '@/router/enums/route-names.enum';
import { XIcon } from 'lucide-vue-next';

const allowedFileTypes = [
  'image/png',
  'image/jpg',
  'image/jpeg',
  'image/gif',
  'image/webp',
  'image/svg+xml',
];

// Props
// Emits

// Refs
const dropzoneImage = ref<File | null>(null);
const uploadImageIsLoading = ref<boolean>(false);
const imageGenIsLoading = ref<boolean>(false);
const prompt = ref<string>('');
const folderId = ref<string | null>(null);
const referenceImageId = ref<string | null>(null);
const referenceImageIsUpload = ref(false);
const referenceImageUrl = ref<string | null>(null);

const refreshAssetList = ref(false);
const dropzoneFullHeight = ref(true);

// Composables
const route = useRoute();
const router = useRouter();
const client = useRagnaClient();
const settings = useImgGenSettingsStore();
const { setErrorAlert, unsetErrorAlert, errorAlert } = useErrorAlert();

// Computed
const firstSectionStyles = computed(() => {
  return {
    height: `calc(100vh - ${dropzoneFullHeight.value ? '3.7rem' : '23.7rem'})`, // Adjusted to account for padding and header height
  };
});

const submitLocked = computed(() => {
  return !prompt.value || imageGenIsLoading.value || uploadImageIsLoading.value;
});

// Functions
const initState = () => {
  dropzoneImage.value = null;
  uploadImageIsLoading.value = false;
  imageGenIsLoading.value = false;
  prompt.value = '';
  dropzoneFullHeight.value = true;
  // folderId.value = null;
  referenceImageId.value = null;
  referenceImageUrl.value = null;
  referenceImageIsUpload.value = false;
  refreshAssetList.value = false;
  unsetErrorAlert();
};

const refreshData = async () => {
  refreshAssetList.value = true;
  await nextTick();
  refreshAssetList.value = false;
};

const handleError = (payload?: { error?: Error | unknown; title?: string; message?: string }) => {
  if (payload?.error) {
    console.error('[tti edit] ', payload.error);
  }
  imageGenIsLoading.value = false;
  setErrorAlert({
    title: payload?.title ?? 'Ups, something went wrong',
    description: payload?.message ?? 'Please reload the page and try again',
  });
};

const setFolderId = async () => {
  try {
    const response = await client.textToImage.fetchFolders();
    if (!response?.folders.length) {
      throw new Error('No folder found');
    }
    folderId.value = response.folders[0].id;
  } catch (error: unknown) {
    handleError({ error });
  }
};

const handleUploadImage = async (file: File) => {
  uploadImageIsLoading.value = true;
  dropzoneFullHeight.value = false;
  try {
    const { medias } = await client.media.uploadFiles([file]);
    return medias[0];
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  } finally {
    uploadImageIsLoading.value = false;
  }
};

const handleReferenceImageIdUpdate = async ({
  runId,
  imageId,
}: {
  runId: string;
  imageId: string;
}) => {
  try {
    const { image } = await client.textToImage.fetchImageDetails(imageId);
    referenceImageIsUpload.value = false;
    referenceImageId.value = image.id;
    referenceImageUrl.value = image.path;
    dropzoneFullHeight.value = true;
    // scroll window to top
    await nextTick();
    const mainContainer = document.getElementById('main');
    if (mainContainer) {
      mainContainer.scrollTo({ top: 0, behavior: 'instant' });
    }
  } catch (error: unknown) {
    console.error('Error fetching image details:', error);
    handleError({
      error,
      title: 'Failed to fetch image details',
      message: 'Could not retrieve the image details. Please try again.',
    });
    referenceImageId.value = null;
    referenceImageUrl.value = null;
  }
};

const onResetClick = async (e: MouseEvent) => {
  e.stopPropagation();
  initState();
  router.push({
    name: RouteName.TEXT_TO_IMAGE_EDIT_INDEX,
  });
};

const onSubmit = async (inputPrompt: string) => {
  if (submitLocked.value) {
    console.warn('Submit is not released yet');
    return;
  }

  if (!folderId.value) {
    handleError();
    return;
  }

  unsetErrorAlert();
  imageGenIsLoading.value = true;
  const droppedImageFile = dropzoneImage.value;

  if (!referenceImageId.value && droppedImageFile) {
    try {
      const media = await handleUploadImage(droppedImageFile);
      if (!media) throw Error('failed to upload image');
      referenceImageId.value = media.id;
      referenceImageIsUpload.value = true;
    } catch (error: unknown) {
      handleError({
        error,
        title: 'Image upload failed',
        message: 'Failed to upload the reference image. Please try again.',
      });
      return;
    }
  }

  if (!referenceImageId.value) {
    handleError({
      title: 'Reference image missing',
      message: 'Please upload a reference image or select one from your assets below.',
    });
    return;
  }

  dropzoneFullHeight.value = false; // Set dropzone to not full height

  try {
    const { imageUrls } = await client.textToImage.generateFluxKontextProImages({
      folderId: folderId.value,
      prompt: inputPrompt,
      imgCount: settings.getImageCount,
      aspectRatio: settings.getImageAspectRatio,
      outputFormat: settings.getImageExtension,
      referenceImageId: referenceImageId.value,
      referenceImageIsUpload: referenceImageIsUpload.value,
    });
    if (!imageUrls || !imageUrls.length) {
      throw new Error('No image generated');
    }
    await refreshData();
  } catch (error: unknown) {
    handleError({
      error,
      title: 'Image generation failed',
      message: 'Failed to process image. Please try again',
    });
    return;
  } finally {
    imageGenIsLoading.value = false;
  }
};

// Hooks
watch(dropzoneImage, imageFile => {
  referenceImageUrl.value = imageFile ? URL.createObjectURL(imageFile) : null;
});

watch(
  () => [route.params.runId, route.params.imageId],
  async ([runId, imageId]) => {
    //
    if (!runId || !imageId) {
      initState();
      return;
    }
    await handleReferenceImageIdUpdate({ runId: runId.toString(), imageId: imageId.toString() });
  },
  { immediate: true },
);

onBeforeMount(() => {
  setFolderId();
});
</script>

<template>
  <section class="overflow-hidden px-10 pt-8 bg-white" :style="firstSectionStyles">
    <div class="h-full w-full flex flex-col justify-between gap-20 pb-10">
      <!-- Error -->
      <ErrorAlert
        v-model="errorAlert.open"
        :title="errorAlert.title"
        :description="errorAlert.description"
        class="absolute top-10 left-1/2 -translate-x-1/2 z-10 w-full max-w-4xl"
      />

      <div class="flex-1 min-h-0 bg-checker">
        <!-- Image Preview -->
        <div
          v-if="referenceImageUrl"
          class="w-full mx-auto h-full flex items-center justify-center relative group"
        >
          <div class="absolute hidden group-hover:block top-0 right-0">
            <Button
              @click.prevent="onResetClick"
              :disabled="imageGenIsLoading"
              variant="default"
              size="icon"
              title="Remove Image"
              class="border border-stone-200 hover:text-red-400"
            >
              <XIcon class="size-5" />
            </Button>
          </div>
          <img :src="referenceImageUrl" class="max-w-full max-h-full object-contain" />
        </div>
        <!-- Dropzone for image upload -->
        <div v-else class="size-full flex items-center justify-center">
          <TextToImageDropzone
            v-model="dropzoneImage"
            :allowed-file-types="allowedFileTypes"
            class="bg-white h-[15rem] w-[20rem] rounded-2xl"
          />
        </div>
      </div>
      <!-- Input for text prompt -->
      <div class="max-w-2xl mx-auto w-full h-fit shrink-0">
        <TextToImageInput
          v-model="prompt"
          :is-loading="imageGenIsLoading"
          :focus-textarea="false"
          :placeholder="'textToImage.edit_placeholder'"
          @submit="onSubmit"
        />
      </div>
    </div>
  </section>
  <section class="px-10 pt-5 bg-white">
    <TextToImageLoading
      v-if="imageGenIsLoading"
      :prompt="prompt"
      :image-count="settings.getImageCount"
    />
    <Suspense>
      <TextToImageAssetsList :hide-options="true" :refresh-data="refreshAssetList" />
      <template #fallback>
        <p class="animate-pulse text-center text-sm opacity-50">Loading ...</p>
      </template>
    </Suspense>
  </section>
</template>

<style scoped>
.bg-checker {
  background-image:
    linear-gradient(45deg, #f0f0f0 25%, transparent 25%),
    linear-gradient(-45deg, #f0f0f0 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #f0f0f0 75%),
    linear-gradient(-45deg, transparent 75%, #f0f0f0 75%);
  background-size: 20px 20px;
  background-position:
    0 0,
    0 10px,
    10px -10px,
    -10px 0px;
}
</style>
