<script setup lang="ts">
import { useRagnaClient } from '@/composables/useRagnaClient';
import TextToImagePreviewControls from '@/modules/text-to-image/components/TextToImagePreviewControls.vue';
import { RouteName } from '@/router/enums/route-names.enum';
import type { ImageRun } from '@hopkins385/ragna-sdk';
import { Button } from '@ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@ui/tooltip';
import {
  ClipboardCheckIcon,
  ClipboardIcon,
  DownloadIcon,
  ImagePlusIcon,
  Loader2Icon,
} from 'lucide-vue-next';

const props = defineProps<{
  show: boolean;
  run: ImageRun;
  selectedImageId?: string;
}>();

const emit = defineEmits<{
  'update:show': [value: boolean];
}>();

const isLoading = ref(false);

const router = useRouter();
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

const navigatePreviewTo = ({
  direction,
  selectedImage,
}: {
  direction: 'back' | 'center' | 'next';
  selectedImage: any;
}) => {
  if (direction === 'center') {
    // openImage(selectedImage.path);
    openImage(selectedImage.path);
    return;
  }
  const currentIndex = props.run.images.findIndex(img => img.id === selectedImage.id);
  if (currentIndex === -1) return;

  let newIndex = currentIndex;
  if (direction === 'back') {
    newIndex = currentIndex > 0 ? currentIndex - 1 : props.run.images.length - 1;
  } else if (direction === 'next') {
    newIndex = currentIndex < props.run.images.length - 1 ? currentIndex + 1 : 0;
  }

  const newImage = props.run.images[newIndex];
  selectedImage.id = newImage.id;
  selectedImage.path = newImage.path;
  selectedImage.prompt = props.run.prompt || '';
};

const onEditImageClick = () => {
  // navigate to the edit view for the selected image with /:runId/:imageId
  if (!selectedImage.id) {
    console.warn('No image selected for editing');
    return;
  }
  emit('update:show', false); // Close the dialog
  router.push({
    name: RouteName.TEXT_TO_IMAGE_EDIT_RUN_IMAGE,
    params: {
      runId: props.run.id,
      imageId: selectedImage.id,
    },
  });
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
      <DialogHeader class="flex w-full flex-row items-center justify-between">
        <DialogTitle>{{ $t('Image') }}</DialogTitle>
      </DialogHeader>
      <div v-if="selectedImage.path" class="flex space-x-8">
        <div class="flex-grow overflow-hidden shrink-0">
          <div class="relative flex items-center justify-center hover:cursor-pointer">
            <div class="absolute inset-0 size-full">
              <TextToImagePreviewControls
                @navigate="direction => navigatePreviewTo({ direction, selectedImage })"
              />
            </div>
            <img
              :src="selectedImage.path"
              alt="Generated Image"
              class="w-[700px] min-h-[400px] max-h-[calc(100vh-10rem)] rounded-md object-contain"
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
                    id="edit-image"
                    variant="default"
                    size="icon"
                    @click="() => onEditImageClick()"
                  >
                    <ImagePlusIcon class="size-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Edit Image</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
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
                :class="{ '!border-blue-500': selectedImage.id === image.id }"
              />
            </li>
          </ul>
        </div>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
