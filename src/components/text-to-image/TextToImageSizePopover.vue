<script setup lang="ts">
import { Slider } from '@/components/ui/slider';
import { useImgGenSettingsStore } from '@/stores/image-gen-settings.store';
import { Popover, PopoverContent, PopoverTrigger } from '@ui/popover';

const open = ref(true);

const settings = useImgGenSettingsStore();
</script>

<template>
  <Popover>
    <PopoverTrigger
      class="border rounded-full px-4 text-xs py-1 shadow-sm text-slate-600"
    >
      {{ settings.getImageWidth }} x {{ settings.getImageHeight }}
    </PopoverTrigger>
    <PopoverContent class="w-40">
      <div class="mb-5 flex flex-col space-y-4 text-xs">
        <div class="flex w-full justify-between">
          <div>Width: {{ settings.getImageWidth }}</div>
        </div>
        <Slider
          v-model="settings.imageWidth"
          :default-value="[1024]"
          :min="512"
          :max="1440"
          :step="32"
          class="slider"
        />
      </div>
      <div class="mb-5 flex flex-col space-y-4 text-xs">
        <div class="flex w-full justify-between">
          <div>Height: {{ settings.getImageHeight }}</div>
        </div>
        <Slider
          v-model="settings.imageHeight"
          :default-value="[1024]"
          :min="512"
          :max="1440"
          :step="32"
          class="slider"
        />
      </div>
    </PopoverContent>
  </Popover>
</template>
