<script setup lang="ts">
// src/modules/ai-chat/components/ChatToolCallResult.vue
import ChatMessageBoxWrapper from '@/modules/ai-chat/components/ChatMessageBoxWrapper.vue';
import ChatToolCallHeader from '@/modules/ai-chat/components/ChatToolCallHeader.vue';

// Props
const props = defineProps<{
  displayName?: string;
  content: any;
}>();

// Emits
// Refs
const showDetails = ref(false);

// Composables

// Computed
const toolCallDisplayName = computed(() => {
  return `${props.displayName ?? 'Agent'}`;
});
const toolCalls = computed(() => {
  return (
    props.content
      // map the tool calls to a new object
      .map((toolCall: any) => {
        return {
          toolCallId: toolCall?.toolCallId ?? '',
          toolName: toolCall?.toolName ?? 'Unknown Tool',
          toolArgs: toolCall?.args ? getKeyValue(toolCall?.args) : [],
          toolResults: toolCall?.result ? getKeyValue(toolCall?.result) : [],
        };
      })
  );
});

// Functions
function getKeyValue(obj: any): string[] {
  if (!obj) {
    return [];
  }
  if (Array.isArray(obj)) {
    return obj.map(item => {
      return item;
    });
  }
  if (typeof obj === 'string') {
    // try to parse the string as JSON
    try {
      const parsedObj = JSON.parse(obj);
      return getKeyValue(parsedObj);
    } catch (e) {
      // if parsing fails, return the string as is
      return [obj];
    }
  }
  const objEntries = Object.entries(obj)
    // filter keys "to" and "from"
    .filter(([key]) => key !== 'to' && key !== 'from')
    .map(([key, value]) => {
      // check if value is an object
      if (typeof value === 'object' && value !== null) {
        // if it is an object, return the key and the stringified value
        return `${key}: ${JSON.stringify(value)}`;
      }
      return `${value}`;
    });
  return objEntries;
}

const toggleDetails = (e: MouseEvent) => {
  e.preventDefault();
  showDetails.value = !showDetails.value;
};

// Hooks
</script>

<template>
  <ChatMessageBoxWrapper
    :display-name="toolCallDisplayName"
    role="assistant"
    class="!pb-0 overflow-x-scroll"
  >
    <div v-for="(call, index) in toolCalls" :key="index">
      <ChatToolCallHeader
        :tool-name="call.toolName"
        :tool-result="call.toolArgs[0]"
        v-model="showDetails"
        @click="toggleDetails"
      />
      <ul class="pr-14 !ml-5" v-if="showDetails">
        <li class="flex">
          <div class="whitespace-nowrap min-w-14"><strong>Agent:</strong></div>
          <div class="">
            <div v-for="(args, index) in call.toolArgs" :key="index" class="">
              <p class="whitespace-pre-line">{{ args }}</p>
            </div>
          </div>
        </li>

        <li
          class="flex"
          v-if="
            call.toolName !== 'think' &&
            call.toolName !== 'comment' &&
            call.toolName !== 'knowledge'
          "
        >
          <div class="whitespace-nowrap min-w-14"><strong>Tool:</strong></div>
          <div class="">
            <div class="" v-for="(result, index) in call.toolResults" :key="index">
              <p class="whitespace-pre-line">{{ result }}</p>
            </div>
          </div>
        </li>
        <li class="flex" v-if="call.toolName === 'knowledge'">
          <div class="whitespace-nowrap min-w-14"><strong>Tool:</strong></div>
          <div>
            <p v-for="(result, index) in call.toolResults" :key="index">
              ({{ index + 1 }}) {{ result?.metadata?.media?.name }}
            </p>
          </div>
        </li>
      </ul>
    </div>
  </ChatMessageBoxWrapper>
</template>
