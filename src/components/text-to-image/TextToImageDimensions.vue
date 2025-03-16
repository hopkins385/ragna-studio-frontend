<script setup lang="ts">
import {
  SUPPORTED_ASPECT_RATIOS,
  useImgGenSettingsStore,
} from '@/modules/text-to-image/stores/image-gen-settings.store';
import { Button } from '@ui/button';

const settings = useImgGenSettingsStore();

function getAspectRatioButtonClass(ratio: string) {
  // determine button dimensions based on aspect ratio
  switch (ratio) {
    case '1:1':
      return 'w-16 h-16';
    case '2:3':
      return 'w-16 h-24';
    case '4:3':
      return 'w-16 h-12';
    case '16:9':
      return 'w-16 h-9';
    default:
      return 'w-16 h-16';
  }
}
</script>

<template>
  <div class="flex flex-col space-y-2">
    <div v-for="ratio in SUPPORTED_ASPECT_RATIOS" :key="ratio">
      <Button
        @click="settings.setImageAspectRatio(ratio)"
        class="text-xs shrink-0"
        :class="getAspectRatioButtonClass(ratio)"
        :variant="settings.imageAspectRatio === ratio ? 'default' : 'outline'"
      >
        {{ ratio }}
      </Button>
    </div>
  </div>
</template>
