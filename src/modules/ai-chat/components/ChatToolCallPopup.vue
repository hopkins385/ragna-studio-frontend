<script setup lang="ts">
import ChatToolCallHeader from '@/modules/ai-chat/components/ChatToolCallHeader.vue';
import type { ToolInfoData } from '@/modules/ai-chat/composables/useChatTools';

defineProps<{
  displayName: string;
  activeTools: ToolInfoData[];
}>();
</script>

<template>
  <!-- tool -->
  <div
    class="space-y-4 text-sm fixed top-32 right-10 z-20 w-96 drop-shadow-md pb-2 overflow-hidden"
  >
    <div v-for="(tool, index) in activeTools" :key="index" class="flex items-center space-x-2">
      <ChatToolCallHeader :tool-name="tool.toolName" :tool-result="tool.toolInfo" />
    </div>
  </div>
</template>
