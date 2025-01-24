<script setup lang="ts">
import type { LargeLangModelInfos } from '@/composables/services/interfaces/large-lang-model.interface';
import { useProviderIcons } from '@/composables/useProviderIcons';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@ui/tooltip';
import { CheckCircle, Hammer, Image, MessageSquareText } from 'lucide-vue-next';
import CircleFlagEu from '~icons/circle-flags/eu?width=512px&height=512px';
import CircleFlagUs from '~icons/circle-flags/us?width=512px&height=512px';
import Button from '../ui/button/Button.vue';
import LlmRatingBar from './LlmRatingBar.vue';

const props = defineProps<{
  displayName: string;
  providerName: string;
  hostRegion: string;
  infos: LargeLangModelInfos;
  capability: Record<string, unknown>;
  selected: boolean;
}>();

const { getProviderIcon } = useProviderIcons();

const textStreamingSupported = props.capability?.streamText === true || false;
const imageInputSupported = props.capability?.imageInput === true || false;
const toolUseSupported = props.capability?.useTool === true || false;

const showDatacenter = false;
</script>

<template>
  <div
    class="p-4 border rounded-lg text-sm hover:shadow-md cursor-pointer relative group w-64"
    :class="{ 'border-green-500': selected }"
  >
    <div class="w-full relative">
      <div
        v-if="selected"
        class="absolute -top-1 -right-1 rounded-full flex items-center justify-center bg-green-100 p-1"
      >
        <CheckCircle class="stroke-2 size-4 text-green-700 group-hover:block" />
      </div>
      <h2 class="font-semibold">
        <component
          :is="getProviderIcon(providerName)"
          class="stroke-1.5 size-5 mb-1"
        />
        {{ providerName }} /
        {{ displayName }}
      </h2>
    </div>
    <div class="space-y-2 py-4">
      <div>
        <div class="pb-1">Quality</div>
        <LlmRatingBar :percentage="infos.qualityIndex" />
      </div>
      <div>
        <div class="pb-1">Speed</div>
        <LlmRatingBar :percentage="infos.speedIndex" />
      </div>
    </div>
    <div class="py-2">
      <h3 class="font-medium pb-2">Capabilities</h3>
      <div
        v-if="textStreamingSupported"
        class="flex items-center space-x-2 pb-1 opacity-75"
      >
        <span><MessageSquareText class="stroke-1.5 size-4" /></span>
        <span>Text Streaming</span>
      </div>
      <div
        v-if="imageInputSupported"
        class="flex items-center space-x-2 pb-1 opacity-75"
      >
        <span><Image class="stroke-1.5 size-4" /></span>
        <span>Image Analysis</span>
      </div>
      <div
        v-if="toolUseSupported"
        class="flex items-center space-x-2 opacity-75"
      >
        <span><Hammer class="stroke-1.5 size-4" /></span>
        <span>Tool Use</span>
      </div>
    </div>
    <div class="hidden">
      <span class="text-xs">
        Context Size: {{ infos?.contextSize }}K Tokens</span
      >
    </div>
    <div v-if="showDatacenter" class="flex items-center space-x-3">
      <span>Datacenter:</span>
      <TooltipProvider :delay-duration="200">
        <Tooltip>
          <TooltipTrigger as-child>
            <span>
              <component
                :is="hostRegion === 'EU' ? CircleFlagEu : CircleFlagUs"
                class="stroke-1.5 size-4"
              />
            </span>
          </TooltipTrigger>
          <TooltipContent class="!text-xs">
            <p>{{ hostRegion }}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
    <Button
      variant="outline"
      class="hidden absolute bottom-3 right-3 group-hover:block text-xs h-8"
    >
      Select
    </Button>
  </div>
</template>
