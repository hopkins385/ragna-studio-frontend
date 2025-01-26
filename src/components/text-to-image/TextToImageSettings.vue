<script setup lang="ts">
/**
 * Component: ImageGenSettings
 */
import { useImgGenSettingsStore } from '@/stores/image-gen-settings.store';
import QuestionToolTip from '@components/question/QuestionToolTip.vue';
import { Button } from '@ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@ui/select';
import { Separator } from '@ui/separator';
import { Slider } from '@ui/slider';
import { Switch } from '@ui/switch';
import { RotateCcwIcon, SlidersHorizontalIcon } from 'lucide-vue-next';
import TextToImageDimensions from './TextToImageDimensions.vue';

const show = ref(false);
const settings = useImgGenSettingsStore();
</script>

<template>
  <Popover v-model:open="show">
    <PopoverTrigger as-child>
      <Button variant="ghost" size="icon" class="group !size-10">
        <SlidersHorizontalIcon
          class="!size-5 stroke-1.5 text-primary/70 group-hover:stroke-2"
        />
      </Button>
    </PopoverTrigger>
    <PopoverContent align="end" class="mt-1 w-72 text-sm">
      <div class="flex items-center justify-between">
        <span>Settings</span>
        <button @click="settings.resetSettings()">
          <RotateCcwIcon class="size-3 opacity-60" />
        </button>
      </div>
      <Separator class="my-3" />
      <div class="my-5 flex flex-col space-y-4">
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
      <div class="mb-5 flex flex-col space-y-4">
        <div class="flex w-full justify-between">
          <div>Aspect Ratio</div>
          <div>{{ settings.getImageAspectRatio }}</div>
        </div>
        <div>
          <TextToImageDimensions />
        </div>
      </div>
      <div class="mb-5 flex flex-col space-y-4">
        <div class="flex w-full justify-between">
          <div>
            Guidance
            <QuestionToolTip
              title="Guidance scale"
              content="High guidance scale improves prompt adherence at the cost of reduced realism."
            />
          </div>
          <div>{{ settings.getImageGuidance }}</div>
        </div>
        <Slider
          v-model="settings.imageGuidance"
          :default-value="[2.5]"
          :min="1.5"
          :max="5"
          :step="0.5"
          class="slider"
        />
      </div>
      <div class="flex flex-col pb-2">
        <div>Extension</div>
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
      <div class="flex flex-col">
        <div>
          On Enter Submit
          <QuestionToolTip
            title="On Enter Submit"
            content="If active, pressing Enter will submit the prompt."
          />
        </div>
        <Switch
          class="-ml-2 mt-1 scale-75"
          :checked="settings.getSubmitOnEnter"
          @update:checked="settings.setSubmitOnEnter"
        />
      </div>
      <div class="flex flex-col">
        <div>Show Hidden</div>
        <Switch
          class="-ml-2 mt-1 scale-75"
          :checked="settings.getShowHidden"
          @update:checked="settings.setShowHidden"
        />
      </div>
    </PopoverContent>
  </Popover>
</template>

<style>
.slider {
  @apply [&_[role=slider]]:size-4 [&_[role=slider]]:border [&_[role=slider]]:hover:cursor-grab [&_[role=slider]]:active:cursor-grabbing;
}
</style>
