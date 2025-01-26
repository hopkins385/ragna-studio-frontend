<script setup lang="ts">
import {
  SUPPORTED_IMAGE_GENERATION_PROVIDERS,
  useImgGenSettingsStore,
} from '@/stores/image-gen-settings.store';
import { Button } from '@ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@ui/popover';
import { Image } from 'lucide-vue-next';

const settings = useImgGenSettingsStore();
</script>

<template>
  <Popover>
    <PopoverTrigger
      class="border rounded-full px-4 text-xs py-1 shadow-sm text-slate-600"
    >
      <div class="flex items-center space-x-1">
        <span><Image class="stroke-1.5 size-3" /></span>
        <span>{{ settings.getProvider }}</span>
      </div>
    </PopoverTrigger>
    <PopoverContent class="w-40">
      <div class="my-0 flex flex-col space-y-4 text-xs">
        <div
          v-for="(provider, index) in SUPPORTED_IMAGE_GENERATION_PROVIDERS"
          :key="index"
        >
          <Button
            :variant="
              settings.getRawProvider === provider ? 'default' : 'outline'
            "
            @click="settings.setProvider(provider)"
          >
            {{ settings.getProviderDisplayName(provider) }}
          </Button>
        </div>
      </div>
    </PopoverContent>
  </Popover>
</template>
