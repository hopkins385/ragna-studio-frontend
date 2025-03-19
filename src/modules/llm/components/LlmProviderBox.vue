<script setup lang="ts">
import { useProviderIcons } from '@/composables/useProviderIcons';
import { CheckCircle } from 'lucide-vue-next';
import type { LargeLangModelInfos } from 'ragna-sdk';
import CircleFlagEu from '~icons/circle-flags/eu?width=512px&height=512px';
import CircleFlagUs from '~icons/circle-flags/us?width=512px&height=512px';
import LlmRatingBar from './LlmRatingBar.vue';

const props = defineProps<{
  providerName: string;
  hostRegion: string;
  infos: LargeLangModelInfos;
  selected: boolean;
}>();

const { getProviderIcon } = useProviderIcons();

const showDatacenter = true;
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
      <h2 class="font-semibold flex items-center space-x-2">
        <span>
          <component :is="getProviderIcon(providerName)" class="stroke-1.5 size-5" />
        </span>
        <span>{{ providerName }}</span>
      </h2>
    </div>
    <div class="space-y-2 py-4">
      <div>
        <div class="pb-1">Quality</div>
        <LlmRatingBar :percentage="infos.qualityIndex" />
      </div>
    </div>
    <div v-if="showDatacenter" class="flex items-center space-x-2">
      <span>Location:</span>
      <div class="flex items-center space-x-2">
        <span> {{ hostRegion }}</span>
        <span>
          <component
            :is="hostRegion === 'EU' ? CircleFlagEu : CircleFlagUs"
            class="stroke-1.5 size-4"
          />
        </span>
      </div>
    </div>
  </div>
</template>
