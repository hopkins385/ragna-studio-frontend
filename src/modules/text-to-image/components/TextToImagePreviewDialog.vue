<script setup lang="ts">
import { useRagnaClient } from '@/composables/useRagnaClient';
import type { ImageRun } from '@hopkins385/ragna-sdk';
import { Button } from '@ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@ui/tooltip';
import { ClipboardCheckIcon, ClipboardIcon, DownloadIcon, Loader2Icon } from 'lucide-vue-next';

const props = defineProps<{
  show: boolean;
  run: ImageRun;
  selectedImageId?: string;
}>();

defineEmits<{
  'update:show': [value: boolean];
}>();

const isLoading = ref(false);

const client = useRagnaClient();

const selectedImage = reactive({
  id: '',
  path: '',
  prompt: '',
});

function getFilenameFromUrl(url: string): string {
  // Extract filename from URL or use a default name
  const defaultName = 'image.jpg';
  try {
    const parsedUrl = new URL(url);
    const pathname = parsedUrl.pathname;
    const filename = pathname.split('/').pop();
    return filename || defaultName;
  } catch {
    return defaultName;
  }
}

function openImage(url: string): void {
  // save image as..
  const link = document.createElement('a');
  link.href = url;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.download = getFilenameFromUrl(url);
  link.click();
  document.body.removeChild(link);
}

const {
  copy: copyToClipboard,
  copied: copiedToClipboard,
  isSupported: copyToClipboardSupported,
} = useClipboard({ source: props.run.prompt });

const onOpenAutoFocus = (event: Event) => {
  event.preventDefault();
  const dialog = event.target as HTMLElement;
  return;
  // Focus the download-image button
  const downloadButton = dialog.querySelector('#download-image') as HTMLButtonElement;
  const firstFocusableElement =
    downloadButton || dialog.querySelector('button, [href], [tabindex]:not([tabindex="-1"])');
  if (firstFocusableElement) {
    firstFocusableElement.focus();
  }
};

async function downloadImageFile(): Promise<void> {
  isLoading.value = true;
  try {
    const res = await client.textToImage.downloadImage(selectedImage.id);
    const url = window.URL.createObjectURL(new Blob([res]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', getFilenameFromUrl(selectedImage.path));
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
}

const getImageById = (imageId: string) => {
  return props.run?.images.find(img => img.id === imageId);
};

const onThumbnailClick = (imageId: string) => {
  const image = getImageById(imageId);
  if (!image) return;
  selectedImage.id = image.id;
  selectedImage.path = image.path;
  selectedImage.prompt = props.run?.prompt || '';
};

onMounted(() => {
  if (!props.run) {
    console.warn('No images found in run', props.run);
    return;
  }
  const image = getImageById(props.selectedImageId || props.run.images[0].id);
  if (!image) {
    console.warn('No image found with the given ID', props.selectedImageId);
    return;
  }
  selectedImage.id = image.id;
  selectedImage.path = image.path;
  selectedImage.prompt = props.run.prompt || '';
});

onBeforeUnmount(() => {
  // Reset selected image when dialog is closed
  selectedImage.id = '';
  selectedImage.path = '';
  selectedImage.prompt = '';
});
</script>

<template>
  <Dialog :open="show" :modal="true" @update:open="() => $emit('update:show', false)">
    <DialogContent
      class="flex max-w-6xl flex-col bg-stone-100 max-h-screen overflow-hidden outline-none"
      @open-auto-focus="onOpenAutoFocus"
    >
      <DialogHeader class="flex w-full flex-row items-center justify-between border-0">
        <DialogTitle>{{ $t('Image') }}</DialogTitle>
      </DialogHeader>
      <div v-if="selectedImage.path" class="flex space-x-8">
        <div class="flex-grow overflow-hidden shrink-0">
          <div
            class="relative flex items-center justify-center hover:cursor-pointer"
            @click="() => openImage(selectedImage.path)"
          >
            <img
              :src="selectedImage.path"
              alt="Generated Image"
              class="w-[700px] min-h-[400px] rounded-md object-contain"
              :style="{ 'max-height': 'calc(100vh - 6rem)' }"
            />
          </div>
        </div>
        <div class="w-full">
          <div class="max-h-96 overflow-x-scroll">
            <p class="text-sm opacity-75">{{ selectedImage.prompt }}</p>
          </div>
          <div class="pt-4 space-x-2">
            <TooltipProvider :delayDuration="300">
              <Tooltip>
                <TooltipTrigger>
                  <Button
                    id="copy-prompt"
                    variant="default"
                    size="icon"
                    @click="() => copyToClipboard(selectedImage.prompt)"
                  >
                    <ClipboardIcon v-if="!copiedToClipboard" class="size-5" />
                    <ClipboardCheckIcon v-else class="size-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Copy Prompt</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider :delayDuration="300">
              <Tooltip>
                <TooltipTrigger>
                  <Button
                    id="download-image"
                    variant="default"
                    size="icon"
                    @click="() => downloadImageFile()"
                  >
                    <DownloadIcon v-if="!isLoading" class="size-5" />
                    <Loader2Icon v-else class="size-5 animate-spin" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Download Image</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>

      <DialogFooter class="sm:justify-start">
        <div class="w-fit">
          <!-- small preview of all images -->
          <ul class="flex space-x-2">
            <li
              v-for="image in props.run?.images"
              :key="image.id"
              class="flex-shrink-0"
              @click="() => onThumbnailClick(image.id)"
            >
              <img
                :src="image.thumb?.webp || image.thumb?.avif || image.path"
                alt="Image preview"
                class="h-16 w-16 rounded-md object-cover border border-transparent hover:cursor-pointer"
                :class="{ 'border-blue-500': selectedImage.id === image.id }"
              />
            </li>
          </ul>
        </div>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
