<script setup lang="ts">
import TextToImageAssetsList from '@/modules/text-to-image/components/TextToImageAssetsList.vue';
import TextToImageCountPopover from '@/modules/text-to-image/components/TextToImageCountPopover.vue';
import TextToImageMimeTypePopover from '@/modules/text-to-image/components/TextToImageMimeTypePopover.vue';
import TextToImagePricingPopover from '@/modules/text-to-image/components/TextToImagePricingPopover.vue';
import TextToImageProviderPopover from '@/modules/text-to-image/components/TextToImageProviderPopover.vue';
import TextToImageSettings from '@/modules/text-to-image/components/TextToImageSettings.vue';
import TextToImageSizePopover from '@/modules/text-to-image/components/TextToImageSizePopover.vue';
import { textToImageService } from '@/modules/text-to-image/services/text-to-image.service';
import { useImgGenSettingsStore } from '@/modules/text-to-image/stores/image-gen-settings.store';
import SectionContainer from '@components/section/SectionContainer.vue';
import { Button } from '@ui/button';
import { Textarea } from '@ui/textarea';
import { Loader2Icon, SendIcon } from 'lucide-vue-next';

const isLoading = ref(false);
const refresh = ref(false);
const prompt = ref('');
const loadingPrompt = ref('');
const imageUrls = ref<string[] | null>(null);

const promptFormRef = ref<HTMLFormElement | null>(null);

const settings = useImgGenSettingsStore();

const { t } = useI18n();

async function generateImage(submitPrompt: string) {
  prompt.value = '';
  loadingPrompt.value = submitPrompt;
  nextTick(() => {
    adjustTextareaHeight();
  });
  isLoading.value = true;
  try {
    const folderResult = await textToImageService.fetchFolders();
    if (!folderResult?.folders.length) {
      throw new Error('No folder found');
    }
    if (settings.getRawProvider === 'fluxpro') {
      const { width, height } = settings.getImageWidthAndHeight;
      const { imageUrls } = await textToImageService.generateFluxProImages({
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
      const { imageUrls } = await textToImageService.generateFluxUltraImages({
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

function onKeydownEnter(event: KeyboardEvent) {
  if (!prompt.value.trim() || isLoading.value) {
    return;
  }
  if (event.key === 'Enter' && !event.shiftKey && settings.getSubmitOnEnter) {
    event.preventDefault();
    onSubmit();
  }
}

function usePrompt(value: string) {
  prompt.value = value;
  nextTick(() => {
    adjustTextareaHeight();
  });
  promptFormRef.value?.querySelector('textarea')?.focus();
}

function handleToggleHideRun(runId: string) {
  textToImageService
    .toggleHideRun({ runId })
    .then(() => {
      refreshData();
    })
    .catch((err: any) => {
      console.error(err);
    });
}

/**
 * Adjusts the height of the textarea based on its content.
 */
const adjustTextareaHeight = () => {
  const maxHeight = 364;
  const textarea = promptFormRef.value?.querySelector('textarea');
  if (textarea) {
    // Reset height to auto to calculate the new height
    textarea.style.height = 'auto';
    // Set the height to match the scrollHeight
    textarea.style.height = `${Math.min(maxHeight, textarea.scrollHeight)}px`;
  }
};

/**
 * Handles the paste event to clean pasted text by removing excessive empty lines.
 */
const handlePaste = (event: ClipboardEvent) => {
  // Prevent the default paste behavior
  event.preventDefault();

  const clipboardData = event.clipboardData;
  if (clipboardData) {
    // Retrieve the plain text from the clipboard
    let pastedText = clipboardData.getData('text/plain');

    // Process the pasted text:
    // Replace multiple consecutive empty lines with a single empty line
    // This regex replaces 3 or more consecutive newline characters with 2
    pastedText = pastedText.replace(/(\r?\n){3,}/g, '\n\n');

    // Alternatively, to remove all empty lines, use:
    // pastedText = pastedText.replace(/^\s*[\r\n]/gm, '');

    const textarea = promptFormRef.value?.querySelector('textarea');
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const before = prompt.value.substring(0, start);
      const after = prompt.value.substring(end);

      // Insert the cleaned pasted text at the cursor position
      prompt.value = before + pastedText + after;

      // Move the cursor to the end of the inserted text
      nextTick(() => {
        const cursorPosition = start + pastedText.length;
        textarea.selectionStart = textarea.selectionEnd = cursorPosition;
        adjustTextareaHeight();
      });
    }
  }
};

let observer: ResizeObserver | null = null;

onMounted(() => {
  const textarea = promptFormRef.value?.querySelector('textarea');
  if (textarea) {
    textarea.focus();
  }
  adjustTextareaHeight();
  const section = document.getElementById('sectionContainer');
  if (section) {
    observer = new ResizeObserver(() => {
      adjustTextareaHeight();
    });
    observer.observe(section);
  }
});

onUnmounted(() => {
  if (observer) {
    observer.disconnect();
  }
});

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
        <div class="flex flex-col h-fit w-full space-x-4 rounded-b-lg bg-white/95 pb-1">
          <form ref="promptFormRef" class="relative grow space-y-2" @submit.prevent="onSubmit">
            <Textarea
              v-model="prompt"
              type="text"
              placeholder="Describe the image you want to generate"
              rows="1"
              resize="none"
              class="no-scrollbar min-h-[48px] resize-none rounded-2xl bg-white py-4 pl-4 pr-16 shadow-sm focus:shadow-lg"
              @keydown.enter="onKeydownEnter"
              @input="adjustTextareaHeight"
              @paste="handlePaste"
            />
            <div class="absolute bottom-1/2 translate-y-1/2 right-10 p-1">
              <Button
                class="z-10"
                type="submit"
                size="icon"
                variant="ghost"
                :disabled="!prompt || isLoading"
                aria-label="Generate image"
              >
                <Loader2Icon v-if="isLoading" class="!size-5 animate-spin stroke-1.5 opacity-75" />
                <SendIcon v-else class="!size-5 stroke-1.5 opacity-75" />
              </Button>
            </div>
            <div id="settings" class="absolute bottom-1/2 translate-y-1/2 right-2">
              <TextToImageSettings />
            </div>
          </form>
          <div class="bg-white py-2 space-x-2">
            <TextToImageCountPopover />
            <TextToImageSizePopover />
            <TextToImageMimeTypePopover />
            <TextToImageProviderPopover />
            <TextToImagePricingPopover />
          </div>
        </div>
      </div>
    </SectionContainer>
    <SectionContainer class="px-10 pt-3">
      <div v-if="isLoading" class="flex">
        <div class="grid shrink-0 grid-cols-4">
          <div
            v-for="(count, index) in settings.getImageCount"
            :key="index"
            class="mx-1 flex size-56 animate-pulse rounded-lg bg-stone-100"
          ></div>
        </div>
        <div class="group flex grow flex-col border-0 px-5">
          <div class="rounded-lg p-1 hover:bg-slate-100">
            <p
              class="line-clamp-4 max-h-40 min-h-5 break-words text-sm opacity-75 hover:opacity-100"
            >
              {{ loadingPrompt }}
            </p>
          </div>
        </div>
      </div>
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
