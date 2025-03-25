<script setup lang="ts">
import ChatMessageBoxWrapper from '@/modules/ai-chat/components/ChatMessageBoxWrapper.vue';
import { ChevronDownIcon } from 'lucide-vue-next';

// Imports

// Props
interface ChatToolCallProps {
  displayName?: string;
  content: any;
}
const props = defineProps<ChatToolCallProps>();
// Emits

// Refs
const showDetails = ref(false);

// Composables

// Computed
const toolCallDisplayName = computed(() => {
  return `Tool Call - ${props.displayName ?? 'Agent'}`;
});
const toolCalls = computed(() => {
  return props.content.map((toolCall: any) => {
    return {
      toolCallId: toolCall?.toolCallId ?? 'Unknown',
      toolName: toolCall?.toolName ?? 'Unknown',
      toolArgs: toolCall?.args ?? 'Unknown',
      toolResult: toolCall?.result ?? 'Unknown',
    };
  });
});
// Functions
const toggleDetails = () => {
  showDetails.value = !showDetails.value;
};

// Hooks
</script>

<template>
  <ChatMessageBoxWrapper
    :display-name="toolCallDisplayName"
    role="assistant"
    class="pb-0 overflow-x-scroll"
  >
    <div v-for="(call, index) in toolCalls" :key="index" class="">
      <div
        class="border border-sky-100 shadow-sm mb-2 p-2 rounded-lg px-4 flex items-center space-x-2 cursor-pointer bg-sky-100"
        @click="toggleDetails"
      >
        <div>Tool: {{ call.toolName }}</div>
        <div>
          <ChevronDownIcon class="size-4 stroke-1.5" :class="{ 'rotate-180': showDetails }" />
        </div>
      </div>
      <ul class="pr-10" v-if="showDetails">
        <li v-if="call.toolArgs !== call.toolResult">
          <div class=""><strong>Input:</strong> {{ call.toolArgs }}</div>
        </li>
        <li><strong>Result:</strong> {{ call.toolResult }}</li>
      </ul>
    </div>
  </ChatMessageBoxWrapper>
</template>
