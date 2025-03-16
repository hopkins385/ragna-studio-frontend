<script setup lang="ts">
import type { ChatImage } from '@/modules/ai-chat/composables/useChatImages';
import { LoaderCircleIcon, XIcon } from 'lucide-vue-next';

interface ChatImageInputProps {
  inputImages: ChatImage[];
}

interface ChatImageInputEmits {
  'update:inputImages': [ChatImage[]];
}

const props = defineProps<ChatImageInputProps>();
const emit = defineEmits<ChatImageInputEmits>();

function removeImage(index: number) {
  emit(
    'update:inputImages',
    props.inputImages.filter((_, i) => i !== index),
  );
}

function addImage(image: ChatImage) {
  emit('update:inputImages', [...props.inputImages, image]);
}
</script>

<template>
  <div
    v-for="(image, index) in inputImages"
    :key="image?.src"
    class="group relative size-14 rounded-lg border"
  >
    <div
      v-if="image?.status !== 'loaded'"
      class="absolute inset-0 flex size-full items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm"
    >
      <LoaderCircleIcon
        v-if="image?.status === 'loading'"
        class="size-6 animate-spin text-black/80"
      />
      <XIcon v-else class="size-6 stroke-2.5 text-red-600" />
    </div>
    <button
      @click="removeImage(index)"
      class="absolute -right-1 -top-1 hidden size-4 items-center justify-center rounded-full bg-red-600 group-hover:flex"
    >
      <XIcon class="size-2 text-white" />
    </button>
    <!-- image -->
    <img
      :src="image?.src"
      alt="image"
      class="size-full overflow-hidden rounded-lg object-cover"
      crossorigin=""
    />
  </div>
</template>
