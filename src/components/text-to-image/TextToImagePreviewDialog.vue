<script setup lang="ts">
import {
  ClipboardCheckIcon,
  ClipboardIcon,
  CopyCheckIcon,
  CopyIcon,
  DownloadIcon,
  Loader2Icon,
} from 'lucide-vue-next';
import { Button } from '@ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';

const props = defineProps<{
  show: boolean;
  imgUrl: string;
  prompt?: string;
}>();

defineEmits<{
  'update:show': [value: boolean];
}>();

const isLoading = ref(false);

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
} = useClipboard({ source: props.prompt });

const onOpenAutoFocus = (event: Event) => {
  const dialog = event.target as HTMLElement;
  const firstFocusableElement = dialog.querySelector('button');
  if (firstFocusableElement) {
    firstFocusableElement.focus();
  }
};
</script>

<template>
  <Dialog
    :open="show"
    :modal="true"
    @update:open="() => $emit('update:show', false)"
  >
    <DialogContent
      class="flex max-w-6xl flex-col"
      @open-auto-focus="onOpenAutoFocus"
    >
      <DialogHeader
        class="flex w-full flex-row items-center justify-between border-0"
      >
        <div>
          <DialogTitle>Image</DialogTitle>
          <DialogDescription> </DialogDescription>
        </div>
      </DialogHeader>
      <div class="flex space-x-8">
        <div class="flex-grow overflow-hidden shrink-0">
          <div
            class="relative flex items-center justify-center hover:cursor-pointer"
            @click="() => openImage(imgUrl)"
          >
            <img
              :src="imgUrl"
              alt="Generated Image"
              class="w-[700px] rounded-md object-contain"
            />
          </div>
        </div>
        <div class="">
          <p class="text-sm opacity-75">{{ prompt }}</p>
          <div class="pt-4 space-x-2">
            <TooltipProvider :delayDuration="300">
              <Tooltip>
                <TooltipTrigger>
                  <Button
                    variant="default"
                    size="icon"
                    @click="() => copyToClipboard(props.prompt)"
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
                    variant="default"
                    size="icon"
                    @click="() => openImage(imgUrl)"
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

      <DialogFooter></DialogFooter>
    </DialogContent>
  </Dialog>
</template>
