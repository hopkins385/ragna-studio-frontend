<script setup lang="ts">
import { useImgGenSettingsStore } from '@/modules/text-to-image/stores/image-gen-settings.store';
import { Popover, PopoverContent, PopoverTrigger } from '@ui/popover';
import { Coins, HelpCircle } from 'lucide-vue-next';

const settings = useImgGenSettingsStore();
</script>

<template>
  <Popover>
    <PopoverTrigger class="border rounded-full px-4 text-xs py-1 shadow-sm text-slate-600">
      <div class="flex items-center space-x-1">
        <span><HelpCircle class="stroke-1.5 size-3" /></span>
        <span>Infos</span>
      </div>
    </PopoverTrigger>
    <PopoverContent class="w-44">
      <div class="my-0 flex flex-col space-y-4 text-xs">
        <div class="flex w-full justify-between">
          <div class="flex items-center space-x-1">
            <span><Coins class="stroke-1.5 size-3" /></span>
            <span>Credits per Image</span>
          </div>
          <div>{{ settings.getImagePricing }}</div>
        </div>
      </div>
    </PopoverContent>
  </Popover>
</template>
