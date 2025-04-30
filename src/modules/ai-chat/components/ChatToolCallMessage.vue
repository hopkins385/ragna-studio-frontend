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
  <div class="space-y-4 text-sm ml-24">
    <div v-for="(tool, index) in activeTools" :key="index" class="flex items-center space-x-2">
      <ChatToolCallHeader :tool-name="tool.toolName" :tool-result="tool.toolInfo" />
    </div>
  </div>
</template>
