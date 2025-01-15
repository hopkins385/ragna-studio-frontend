<script setup lang="ts">
import { Button } from '@ui/button';
import { Dialog, DialogContent } from '@ui/dialog';

interface Props {
  title: string;
  description: string;
  free: boolean;
  bgColor: string;
}

defineProps<Props>();
const modelValue = defineModel<boolean>({ required: true });
</script>

<template>
  <Dialog v-model:open="modelValue">
    <DialogContent class="min-w-[1200px] min-h-[800px]">
      <div class="grid grid-cols-2 border-0 bg-white rounded-md">
        <div class="">
          <div class="size-full rounded-md p-10" :class="bgColor">
            <h1 class="text-6xl uppercase font-bold leading-snug">
              {{ title }}
            </h1>
          </div>
        </div>
        <div class="px-10 pt-3">
          <div>
            <div class="space-y-2 mb-10">
              <span
                v-if="!free"
                class="text-xs font-semibold py-1 px-4 bg-gray-500 text-gray-50 rounded-full"
                >Pro</span
              >
              <h1 class="text-3xl font-bold">
                {{ title }}
              </h1>
            </div>
            <p class="">
              {{ description }}
            </p>
            <Button class="mt-10 px-10">Use this template</Button>
          </div>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>
