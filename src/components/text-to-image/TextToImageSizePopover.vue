<script setup lang="ts">
import { useImgGenSettingsStore } from '@/stores/image-gen-settings.store';
import { Popover, PopoverContent, PopoverTrigger } from '@ui/popover';
import { Ratio } from 'lucide-vue-next';
import TextToImageDimensions from './TextToImageDimensions.vue';

const open = ref(true);

const settings = useImgGenSettingsStore();
</script>

<template>
  <Popover>
    <PopoverTrigger
      class="border rounded-full px-4 text-xs py-1 shadow-sm text-slate-600"
    >
      <div class="flex items-center space-x-1">
        <span><Ratio class="stroke-1.5 size-3" /></span>
        <span>
          {{ settings.getImageAspectRatio }}
        </span>
      </div>
    </PopoverTrigger>
    <PopoverContent class="w-40">
      <div class="mb-5 flex flex-col space-y-4 text-xs">
        <div class="pb-0">
          <div class="flex items-center space-x-1">
            <span><Ratio class="stroke-1.5 size-3" /></span>
            <span>Dimensions</span>
          </div>
        </div>
        <div>
          <TextToImageDimensions />
        </div>
      </div>
    </PopoverContent>
  </Popover>
</template>
