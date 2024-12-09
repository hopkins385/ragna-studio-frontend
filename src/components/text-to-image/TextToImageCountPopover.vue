<script setup lang="ts">
import { Slider } from '@/components/ui/slider';
import { useImgGenSettingsStore } from '@/stores/image-gen-settings.store';
import { Popover, PopoverContent, PopoverTrigger } from '@ui/popover';

const settings = useImgGenSettingsStore();
</script>

<template>
  <Popover>
    <PopoverTrigger
      class="border rounded-full px-4 text-xs py-1 shadow-sm text-slate-600"
    >
      {{ settings.getImageCount }}
    </PopoverTrigger>
    <PopoverContent class="w-40">
      <div class="my-0 flex flex-col space-y-4 text-xs">
        <div class="flex w-full justify-between">
          <div>Images</div>
          <div>{{ settings.getImageCount }}</div>
        </div>
        <Slider
          v-model="settings.imageCount"
          :default-value="[4]"
          :min="1"
          :max="4"
          :step="1"
          class="slider"
        />
      </div>
    </PopoverContent>
  </Popover>
</template>
