<script setup lang="ts">
import { useRagnaClient } from '@/composables/useRagnaClient';
import TextToImageAssetsList from '@/modules/text-to-image/components/TextToImageAssetsList.vue';
import TextToImageInput from '@/modules/text-to-image/components/TextToImageInput.vue';
import TextToImageLoading from '@/modules/text-to-image/components/TextToImageLoading.vue';
import { useImgGenSettingsStore } from '@/modules/text-to-image/stores/image-gen-settings.store';
import SectionContainer from '@components/section/SectionContainer.vue';

const isLoading = ref(false);
const refresh = ref(false);
const prompt = ref('');
const loadingPrompt = ref('');
const imageUrls = ref<string[] | null>(null);

const settings = useImgGenSettingsStore();

const client = useRagnaClient();
const { t } = useI18n();

async function generateImage(submitPrompt: string) {
  prompt.value = '';
  loadingPrompt.value = submitPrompt;
  isLoading.value = true;
  try {
    const folderResult = await client.textToImage.fetchFolders();
    if (!folderResult?.folders.length) {
      throw new Error('No folder found');
    }
    switch (settings.getRawProvider) {
      case 'fluxpro':
        const { width, height } = settings.getImageWidthAndHeight;
        const { imageUrls: fluxProImageUrls } = await client.textToImage.generateFluxProImages({
          folderId: folderResult.folders[0].id,
          prompt: submitPrompt,
          imgCount: settings.getImageCount,
          width,
          height,
          guidance: settings.getImageGuidance,
          outputFormat: settings.getImageExtension,
        });
        if (!fluxProImageUrls.length) {
          throw new Error('No image generated');
        }
        return fluxProImageUrls;
        break;

      case 'fluxultra':
        const { imageUrls: fluxUltraImageUrls } = await client.textToImage.generateFluxUltraImages({
          folderId: folderResult.folders[0].id,
          prompt: submitPrompt,
          imgCount: settings.getImageCount,
          aspectRatio: settings.getImageAspectRatio,
          outputFormat: settings.getImageExtension,
        });
        if (!fluxUltraImageUrls.length) {
          throw new Error('No image generated');
        }
        return fluxUltraImageUrls;
        break;

      case 'fluxkontextpro':
        const { imageUrls: fluxKontextImageUrls } =
          await client.textToImage.generateFluxKontextProImages({
            folderId: folderResult.folders[0].id,
            prompt: submitPrompt,
            imgCount: settings.getImageCount,
            aspectRatio: settings.getImageAspectRatio,
            outputFormat: settings.getImageExtension,
          });
        if (!fluxKontextImageUrls.length) {
          throw new Error('No image generated');
        }
        return fluxKontextImageUrls;
        break;

      case 'fluxkontextmax':
        const { imageUrls: fluxKontextMaxImageUrls } =
          await client.textToImage.generateFluxKontextMaxImages({
            folderId: folderResult.folders[0].id,
            prompt: submitPrompt,
            imgCount: settings.getImageCount,
            aspectRatio: settings.getImageAspectRatio,
            outputFormat: settings.getImageExtension,
          });
        if (!fluxKontextMaxImageUrls.length) {
          throw new Error('No image generated');
        }
        return fluxKontextMaxImageUrls;

      case 'googleimagegen':
        const { imageUrls: googleImageUrls } = await client.textToImage.generateGoogleImages({
          folderId: folderResult.folders[0].id,
          prompt: submitPrompt,
          imgCount: settings.getImageCount,
          outputFormat: 'png',
          aspectRatio: settings.getImageAspectRatio,
        });
        if (!googleImageUrls.length) {
          throw new Error('No image generated');
        }
        return googleImageUrls;

      default:
        throw new Error('Invalid provider');
    }
    /*
    if (settings.getRawProvider === 'fluxpro') {
      const { width, height } = settings.getImageWidthAndHeight;
      const { imageUrls } = await client.textToImage.generateFluxProImages({
        folderId: folderResult.folders[0].id,
        prompt: submitPrompt,
        imgCount: settings.getImageCount,
        width,
        height,
        guidance: settings.getImageGuidance,
        outputFormat: settings.getImageExtension,
      });
      if (!imageUrls.length) {
        throw new Error('No image generated');
      }
      return imageUrls;
    } else if (settings.getRawProvider === 'fluxultra') {
      const { imageUrls } = await client.textToImage.generateFluxUltraImages({
        folderId: folderResult.folders[0].id,
        prompt: submitPrompt,
        imgCount: settings.getImageCount,
        aspectRatio: settings.getImageAspectRatio,
        outputFormat: settings.getImageExtension,
      });
      if (!imageUrls.length) {
        throw new Error('No image generated');
      }
      return imageUrls;
    } else {
      throw new Error('Invalid provider');
    }
      */
  } finally {
    isLoading.value = false;
    loadingPrompt.value = '';
  }
}

async function refreshData() {
  // set refreshData to true to force the ImageAssetsList component to refresh
  // set it back to false after the refresh is done
  refresh.value = true;
  await nextTick();
  refresh.value = false;
}

function onSubmit() {
  if (!prompt.value || isLoading.value) {
    return;
  }
  generateImage(prompt.value)
    .then(async res => {
      imageUrls.value = res;
      await refreshData();
    })
    .catch(err => {
      console.error(err);
    });
}

function reRun(prompt: string) {
  usePrompt(prompt);
  onSubmit();
}

function usePrompt(value: string) {
  prompt.value = value;
}

function handleToggleHideRun(runId: string) {
  client.textToImage
    .toggleHideRun({ runId })
    .then(() => {
      refreshData();
    })
    .catch((err: any) => {
      console.error(err);
    });
}

useHead({
  title: t('textToImages.title'),
  meta: [
    {
      name: 'description',
      content: t('textToImages.subtitle'),
    },
  ],
});
</script>

<template>
  <div id="sectionContainer" class="min-h-full bg-white">
    <SectionContainer class="sticky inset-0 z-10 !py-0 px-10">
      <div class="h-8 bg-white/95"></div>
      <div class="w-full">
        <TextToImageInput
          v-model="prompt"
          :is-loading="isLoading"
          :focus-textarea="true"
          @submit="() => onSubmit()"
        />
      </div>
    </SectionContainer>
    <SectionContainer class="px-10 pt-3">
      <TextToImageLoading
        v-if="isLoading && loadingPrompt"
        :prompt="loadingPrompt"
        :image-count="settings.getImageCount"
      />
      <Suspense>
        <TextToImageAssetsList
          :refresh-data="refresh"
          @re-run="reRun"
          @use-prompt="usePrompt"
          @toggle-hide="handleToggleHideRun"
        />
        <template #fallback>
          <p class="animate-pulse text-center text-sm opacity-50">Loading ...</p>
        </template>
      </Suspense>
    </SectionContainer>
  </div>
</template>
