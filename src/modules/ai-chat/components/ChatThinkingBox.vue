<script setup lang="ts">
import { Loader2Icon } from 'lucide-vue-next';
import ChatMessageBoxWrapper from './ChatMessageBoxWrapper.vue';

defineProps<{
  displayName?: string;
}>();
</script>

<template>
  <ChatMessageBoxWrapper :display-name="displayName || ''" role="assistant">
    <div class="w-full pr-10">
      <span class="opacity-75">
        <Loader2Icon class="animate-spin size-5" />
      </span>
    </div>
  </ChatMessageBoxWrapper>
</template>
