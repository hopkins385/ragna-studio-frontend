<script setup lang="ts">
import { useImgGenSettingsStore } from '@/stores/image-gen-settings.store';
import { Popover, PopoverContent, PopoverTrigger } from '@ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@ui/select';
import { File } from 'lucide-vue-next';

const open = ref(true);

const settings = useImgGenSettingsStore();
</script>

<template>
  <Popover>
    <PopoverTrigger
      class="border rounded-full px-4 text-xs py-1 shadow-sm text-slate-600"
    >
      <div class="flex items-center space-x-1">
        <span><File class="stroke-1.5 size-3" /></span>
        <span>{{ settings.getImageExtension }}</span>
      </div>
    </PopoverTrigger>
    <PopoverContent class="w-40">
      <div class="flex flex-col pb-2 text-xs">
        <div class="pb-3">
          <div class="flex items-center space-x-1">
            <span><File class="stroke-1.5 size-3" /></span>
            <span>Extension</span>
          </div>
        </div>

        <!-- File Extension [jpeg, png]-->
        <Select v-model="settings.imageExtension">
          <SelectTrigger>
            <SelectValue placeholder="Select an extension" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="jpeg"> JPEG </SelectItem>
            <SelectItem value="png"> PNG </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </PopoverContent>
  </Popover>
</template>
